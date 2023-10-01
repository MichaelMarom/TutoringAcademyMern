import undoImage from '../../images/undo-svgrepo-com (2).svg'
import redoImage from '../../images/redo-svgrepo-com (2).svg'
import deleteImage from '../../images/delete-svgrepo-com.svg';
import n from '../../images/note-text-svgrepo-com.svg';
import image from '../../images/document-svgrepo-com.svg'
import edit from '../../images/format-text-size-svgrepo-com.svg';
import del2 from '../../images/delete-svgrepo-com (1).svg';
import lock from '../../images/lock-svgrepo-com.svg';
import gui from '../../images/gui-palette-svgrepo-com.svg';
import bf from '../../images/bring-to-front-svgrepo-com (1).svg';
import bb from '../../images/send-to-back-svgrepo-com.svg';
import homeImage from '../../images/home-vector-svgrepo-com.svg';
import brushThicknessImage from '../../images/line-thickness-svgrepo-com.svg';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { setColorTo } from '../../redux/tutor_store/Color';
import { setPaintTo } from '../../redux/tutor_store/Paint';
import { useDispatch, useSelector } from 'react-redux';
import { setLineWidthTo } from '../../redux/tutor_store/Thickness';
import { setToolTo } from '../../redux/tutor_store/Tool';
import { setEraserWidthTo } from '../../redux/tutor_store/Eraser';
import { useLocation, useNavigate } from 'react-router-dom'; 
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { Document, Page } from 'react-pdf';
import js_ago from "js-ago";
import { socket } from '../../socket';

const THeader = () => {
    let dispatch = useDispatch();
    let navigate = useNavigate();
    let {colorLine} = useSelector(state => state.color);
    let {paintValue} = useSelector(state => state.paint);
    let {lineWidthValue} = useSelector(state => state.lineWidth);
    let {toolReqValue} = useSelector((state) => state.toolReq);
    let location = useLocation();

    let [thickness, setthickness] = useState('');
    let [pallet, setpallet] = useState('');
    let [formula, setformula] = useState('')
    let [conferenceHidden, setConferenceHidden] = useState('Hide Conference Panel');
    let [fill, setfill] = useState('');
    let [blur, setBlur] = useState(1);
    let [note, setNote] = useState([]);
    let [img, setImg] = useState([]);
    let fillImg= useRef();

    let [Hours, setHours] = useState(0);
    let [Mins, setMins] = useState(0);
    let [Secs, setSecs] = useState(0);
    let Seconds = useRef(0);
    //let [pointerEvent, setPointerEvent] = useState('events')
    let pointerEvent = useRef('none')
    let [studentApp, setstudentApp] = useState('')
    let [visbilty, setVisibility] = useState('0');

   
    useEffect(() => {

        if(location.pathname.split('/').splice(-2)[0] === '0'){
            setBlur(.5);
            pointerEvent.current = 'none'
        }else{
            setBlur(1);
            pointerEvent.current = 'all'
        }
        
    }, [location])

    useEffect(() => {

        let sec = 0;
        let min = 0;
        let hr = 0;
        
        setInterval(() => {
            sec++
            if(sec > 59){
                sec=0;
                min++;
                setSecs(sec);
                setMins(min);
                if(min>59){
                    min=0;
                    hr++
                    setHours(hr);
                    setMins(min)
                }
                
            }else{
                setSecs(sec)
            }
            
        }, 1000);

        
        
    }, [])

    let processFillImg = e => {
        let f = e.target.files[0] ;

        let reader = new FileReader();

        const formData = new FormData();
        formData.append('pdfFile', e.target.files[0])
        fetch('http://localhost:9876/pdf', {
            method: 'post',
            body: formData
        })
        .then((response) => response.text())

        .then((extractedText) => {

            const canvas = document.querySelector('canvas');
            const ctx = canvas.getContext('2d');
            ctx.font = '500 25px Helvetica';
            ctx.fillStyle = '#000';
            let wrappedText = wrapText(ctx, extractedText, 70, 120, canvas.offsetWidth, 30);
            wrappedText.forEach(function(item) {
                ctx.fillText(item[0], item[1], item[2]); 
            })

        })
        .catch((err) => console.log(err))

        reader.onload = () => {
            let src = reader.result;
            
            fillImg.current = reader.result;
            document.querySelector('.fillimg-cnt').children[0].src = src; 
        }
 
        reader.readAsArrayBuffer(f);
        
    }

    let notePositionY = useRef('')
    let notePositionX = useRef('')
    let handleNoteBlur = e => {
        console.log(e.target.getBoundingClientRect())

        notePositionY.current =  e.target.getBoundingClientRect().top;
        notePositionX.current = e.target.getBoundingClientRect().left;
        let value = e.target.value;
        let elm = e.target;

        new Promise(async(resolve, reject) => {
            
            handleBlur(value, notePositionX.current, notePositionY.current + 30, elm);

            let data = {txt: value, y: notePositionY.current, x: notePositionX.current + 30}
            resolve(data)
            

        })
        .then((data) => {
            socket.emit('note', data)

        })
        .catch(err => console.log(err))
    }

    let imgPositionY = useRef('')
    let imgPositionX = useRef('')
    let handleImgBlur = e => {

        imgPositionY.current =  e.target.getBoundingClientRect().top;
        imgPositionX.current = e.target.getBoundingClientRect().left;

        let elm = e.target;

        new Promise(async(resolve, reject) => {
            
            handleFillImgBlur(elm, imgPositionY.current, imgPositionX.current + 30, elm);

            let data = {img: fillImg.current, y: imgPositionY.current, x: imgPositionX.current + 30}
            resolve(data)
            

        })
        .then((data) => {

            socket.emit('img', data)

        })
        .catch(err => console.log(err))
    }

    let handleText = e => {
        let elem = e.currentTarget;
        if(elem.dataset.name === 'note'){
            

            let l = Math.floor(Math.random() * 21) + 90
            let t = Math.floor(Math.random() * 21) + 90 

            
            let noteCnt = 
            `<textarea class="fillText-cnt" placeholder="Write Something Here..." style="left: ${l}px; top: ${t}px;" ></textarea>`   

            document.querySelector('.class-room').insertAdjacentHTML('beforeend', noteCnt)

            let elm = document.querySelector('.fillText-cnt');
            elm.focus()
            elm.onblur = e => handleNoteBlur(e)
            elm.onmousedown = e => dragDrop(e)
           
        }else if(elem.dataset.name === 'image'){
            let l = Math.floor(Math.random() * 21) + 90
            let t = Math.floor(Math.random() * 21) + 90 

            let imgCnt = 
            `<div class="fillimg-cnt" style="left: ${l}px; top: ${t}px;" contentEditable> 
                <img src='' alt="" style="height: 100%; width: 100%;" />

            </div>  ` 
            document.querySelector('.class-room').insertAdjacentHTML('beforeend', imgCnt)

            let elm = document.querySelector('.fillimg-cnt');
            elm.onclick = e => e.target.focus()
            elm.onblur = e => handleImgBlur(e)
            elm.onmousedown = e => dragDrop(e)
        }  
    }

    
    useEffect(() => {
        if(toolReqValue === 'approve'){
            setBlur(1)
            pointerEvent.current = 'all';
        }else{

        }
    }, [toolReqValue])

    let handleConferenceSwitch = e => {
        let cb = document.querySelector('.conference-box')
        let bp = document.querySelector('.board-panel')
        if(conferenceHidden === 'Hide Conference Panel'){
            setConferenceHidden('Show Conference Panel');
            cb.style.right = '-100vw';
            bp.style.width = 'calc(100vw - 65px)'
        }else{
            setConferenceHidden('Hide Conference Panel');
            cb.removeAttribute('style');
            bp.removeAttribute('style');
        }
    }


    let dragDrop = e => {

        e.preventDefault();
        let el = e.target;
        let newPosX = 0, newPosY = 0, startPosX = 0, startPosY = 0;

        // when the user clicks down on the element

        // get the starting position of the cursor
        startPosX = e.clientX;
        startPosY = e.clientY;
        
        document.addEventListener('mousemove', mouseMove);
        
        document.addEventListener('mouseup', function(){
            document.removeEventListener('mousemove', mouseMove);
        });

        function mouseMove(e) {
            // calculate the new position
            newPosX = startPosX - e.clientX;
            newPosY = startPosY - e.clientY;

            // with each move we also want to update the start X and Y
            startPosX = e.clientX;
            startPosY = e.clientY;

            // set the element's new position:
            el.style.top = (el.offsetTop - newPosY) + "px";
            el.style.left = (el.offsetLeft - newPosX) + "px";
        }

    }

        

    // @description: wrapText wraps HTML canvas text onto a canvas of fixed width
    // @param ctx - the context for the canvas we want to wrap text on
    // @param text - the text we want to wrap.
    // @param x - the X starting point of the text on the canvas.
    // @param y - the Y starting point of the text on the canvas.
    // @param maxWidth - the width at which we want line breaks to begin - i.e. the maximum width of the canvas.
    // @param lineHeight - the height of each line, so we can space them below each other.
    // @returns an array of [ lineText, x, y ] for all lines
    const wrapText = function(ctx, text, x, y, maxWidth, lineHeight) {
        // First, start by splitting all of our text into words, but splitting it into an array split by spaces
        let words = text.split(' ');
        let line = ''; // This will store the text of the current line
        let testLine = ''; // This will store the text when we add a word, to test if it's too long
        let lineArray = []; // This is an array of lines, which the function will return

        // Lets iterate over each word
        for(var n = 0; n < words.length; n++) {
            // Create a test line, and measure it..
            testLine += `${words[n]} `;
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            // If the width of this test line is more than the max width
            if (testWidth > maxWidth && n > 0) {
                // Then the line is finished, push the current line into "lineArray"
                lineArray.push([line, x, y]);
                // Increase the line height, so a new line is started
                y += lineHeight;
                // Update line and test line to use this word as the first word on the next line
                line = `${words[n]} `;
                testLine = `${words[n]} `;
            }
            else {
                // If the test line is still less than the max width, then add the word to the current line
                line += `${words[n]} `;
            }
            // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
            if(n === words.length - 1) {
                lineArray.push([line, x, y]);
            }
        }
        // Return the line array
        return lineArray;
    }
    
    let handleBlur = (text, l, t, elem) => {
        elem.remove();
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');


        ctx.font = '500 25px Helvetica';
        ctx.fillStyle = '#000';
        let wrappedText = wrapText(ctx, text, l, t, 600, 30);
        wrappedText.forEach(function(item) {
            ctx.fillText(item[0], item[1], item[2]); 
        })

    }

    useEffect(() => {
        socket.on('note', (txt, y, x)=> {
            const canvas = document.querySelector('canvas');
            const ctx = canvas.getContext('2d');
            ctx.font = '500 25px Helvetica';
            ctx.fillStyle = '#000';
            let wrappedText = wrapText(ctx, txt, y, x, 600, 30);
            wrappedText.forEach(function(item) {
                ctx.fillText(item[0], item[1], item[2]); 
            })
        });
    })

    useEffect(() => {
        socket.on('img', (img, y, x)=> {
            const canvas = document.querySelector('canvas');
            const ctx = canvas.getContext('2d');
            let newImg = new Image();
            newImg.src = img;
    
            ctx.drawImage(newImg, x, y, 200, 200);
        });
    })

    let handleFillImgBlur = (text, y, x, elem) => { 
        elem.remove() 
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        let newImg = new Image();
        newImg.src = fillImg.current ;
 
        ctx.drawImage(newImg, x, y, 200, 200);
        
        
    }

    

    return ( 

        <>
            {note}

            {img}

            <div className="popin" style={{opacity: visbilty}}>
                Your Request to Use The board Was {studentApp}
            </div>

            <div className="tools-bar">
                <div className="tutor-tools">
                    <div className="logo">
                        <div onClick={e => {
                            //confirm('You about to leave this lecture ?')
                            let txt = "You are about to leave this lecture ?"; 
                            window.confirm(txt) === true ? 
                            navigate(`/${location.pathname.split('/').splice(-2)[0] === '0' ? 'student' : 'tutor'}-lecture-pane`) : 
                            console.log('done');
                            /**/

                            }} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <img src={homeImage} style={{height: '50%', width: '80%'}} alt="..." />
                        </div>

                        
                    </div>
                    {/* js_ago(new Date(item.date)) */
                        <>
                           
                            <div className="tool-items" style={{opacity: blur, pointerEvents: pointerEvent.current}}>
                                <div data-tool='delete' className='delete'>
                                    <img src={deleteImage} style={{height: '50%', width: '50%'}} alt="..." />
                                </div>

                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} data-name='note' onClick={handleText}>
                                    <img src={n} style={{height: '80%', width: '80%'}} alt="..." />
                                </div>

                                <label htmlFor='fillImg' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', width: '50px'}} data-name='image' onClick={handleText}>
                                    <img src={image} style={{height: '80%', width: '80%'}} alt="..." />
                                </label>

                                <input type="file" name="" id="fillImg" onChange={processFillImg} style={{display: 'none'}} />
                            
                            </div>

                            <div className="timer-cnt shadow-sm">
                                {Hours} Hours : {Mins} Minutes : {Secs} Seconds
                            </div>

                            <div onClick={handleConferenceSwitch} className="conference-switch shadow-sm">
                                {conferenceHidden}
                            </div>
                        </>
                    }

                </div>
            </div>

            
        </>
        
     );
}
 
export default THeader;