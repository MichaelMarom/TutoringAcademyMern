/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import './record.css'
import { toast } from "react-toastify"
import { fileUploadClient } from "../../../axios/config"


const WebcamCapture = ({ user_id, record_duration }) => {
  const webcamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const previewRef = useRef(null)
  const [isPlayingPreview, setIsPlayingPreview] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [deviceId, setDeviceId] = useState({})
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const [recordingSupported, setRecordingSupported] = useState(false)
  const [blob, setBlob] = useState(null)

  const chooseVideoDevice = (e) => {
    setLoading(true)
    setDeviceId(e.target.value)
  }

  const logError = (e) => {
    setError(e.message)
    toast.error(e.message)
    console.log(e)
  }


  const initRecorder = () => {
    setRecordingSupported(true)
    setError(null)
    setTimeout(() => setLoading(false), 200) // little delay to allow webcam to be stable
    // get video devices to allow user to choose
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'))
    })
  }
  // handles countdown
  useEffect(() => {
    if (capturing) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1000)
      }, 1000)
      if (countdown <= 0) {
        clearInterval(timer)
      }
      return () => clearInterval(timer)
    }
  }, [capturing, countdown])

  useEffect(() => {
    try {
      const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      if (!hasGetUserMedia) {
        throw new Error('getUserMedia is not supported in your browser')
      }
      // start stream briefly to check if recording is supported alsoto activate webcam for slow devices/browsers/webcams
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          //stop the test stream and enable the webcam
          stream.getTracks().forEach((track) => track.stop())
          initRecorder()
        })
        .catch((e) => {
          console.error(e)
          setRecordingSupported(false)

          setTimeout(() => {
            console.log('giving the webcam another try...')
            setRecordingSupported(true)
          }, 1500) // this is a hack to try the webcam again after some time for slow devices what it does is activate the Webcam component which has it's own getUserMedia call
        })
    } catch (e) {
      logError(e)
    }
  }, [])

  const handleStop = useCallback(() => {
    if (!mediaRecorderRef.current) return
    mediaRecorderRef.current.stop()
    setCapturing(false)
    setCountdown(0)
  }, [])

  const onRecordingDataAvailable = useCallback(({ data }) => {
    console.log(data)
    try {
      if (data.size > 0) {
        const processBlob = new Blob([data], { type: 'video/webm' })
        setBlob(processBlob)

        const videoUrl = URL.createObjectURL(processBlob)

        previewRef.current.muted = false
        previewRef.current.loop = true
        previewRef.current.src = videoUrl

        previewRef.current.onloadedmetadata = () => {
          previewRef.current.play()
          setIsPlayingPreview(true)

          previewRef.current.addEventListener('pause', () => setIsPlayingPreview(false))
          previewRef.current.addEventListener('play', () => setIsPlayingPreview(true))
        }

        return () => {
          previewRef.current.src = ''
          previewRef.current.onloadedmetadata = null
          previewRef.current.removeEventListener('pause', () => setIsPlayingPreview(false))
          previewRef.current.removeEventListener('play', () => setIsPlayingPreview(true))
        }
      }else{console.log('empty data...')}
    } catch (e) {
      logError(e)
    }
  }, [])

  const handlePreviewPlayPause = () => {
    if (!previewRef.current) return
    if (isPlayingPreview) {
      previewRef.current.pause()
    } else {
      previewRef.current.play()
    }
  }

  const handleStart = useCallback(() => {
    if (capturing || !deviceId) return
    setCountdown(record_duration)
    setCapturing(true)

    // check if navigator.mediaDevices is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Unable to access media devices. Please check your browser settings.')
    }

    navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: deviceId },
        audio: {
          noiseSuppression: { exact: true },
          autoGainControl: { exact: true },
        },
      })
      .then((stream) => {
        webcamRef.current.srcObject = stream
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: 'video/webm',
        })
        mediaRecorderRef.current.addEventListener('dataavailable', (data) => {
          console.log('data available', data)
          onRecordingDataAvailable(data)
        })
        mediaRecorderRef.current.start()
      })
      .catch((e) => {
        logError(e)
      })

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
        mediaRecorderRef.current = null
      }
    }
  }, [deviceId, capturing, record_duration, onRecordingDataAvailable])

  const handleUpload = async () => {
    try {
      setLoading(true)
      if (blob) {
        const video = new File([blob], 'video.webm', {
          type: 'video/webm',
        })

        const formData = new FormData()
        const userId = user_id.replace(/[\s\.\-]/g, '')
        formData.append('file', video)
        formData.append('user_id', userId)

        const res = await fileUploadClient.post('/tutor/setup/record', formData)
        console.log(res)

        handleCleanup()
      } else {
        throw new Error('No video to upload')
      }
    } catch (e) {
      logError(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCleanup = () => {
    setBlob(null)
    setCapturing(false)
    setCountdown(0)

    if (previewRef.current) {
      previewRef.current.pause()
      previewRef.current.src = ''
    }
  }

  const Loader = () => (
    <div className="loaderWrapper">
      <div className="loader" />
    </div>
  )

  return (
    <div className="videoCaptureContainer">
      {loading && !error && <Loader />}
      {error && <div className="error">{error}</div>}
      {countdown > 0 && <div className="countdown">{countdown / 1000}</div>}

      {recordingSupported && !blob && (
        <Webcam
          audio={false}
          ref={webcamRef}
          mirrored={true}
          onUserMedia={initRecorder}
          onUserMediaError={() =>
            logError(
              new Error('Failed to access a camera, please check your device and browser settings')
            )
          }
          videoConstraints={{ deviceId: deviceId }}
        />
      )}

      {devices.length && !capturing && !blob ? (
        <select onChange={chooseVideoDevice} className="chooseDevice">
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      ) : null}

      {!loading && recordingSupported && !blob && (
        <div className="buttonWrapper">
          {!capturing && <button onClick={handleStart}>Start</button>}
          {capturing && <button onClick={handleStop}>Stop</button>}
        </div>
      )}

      {!loading && blob && (
        <div className="buttonWrapper">
          <button onClick={handleCleanup}>Delete</button>
          {previewRef.current && (
            <button onClick={handlePreviewPlayPause}>{isPlayingPreview ? 'Pause' : 'Play'}</button>
          )}
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}

      <div className={`preview ${blob ? 'show' : 'hide'}`}>
        <video ref={previewRef} playsInline onClick={handlePreviewPlayPause} />
      </div>
    </div>
  )
}

export default WebcamCapture