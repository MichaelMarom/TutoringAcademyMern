import React, { useEffect, useState } from 'react';
import { Toast, Button } from 'react-bootstrap';
import { BsFillPlayFill } from 'react-icons/bs';
import Modal from './Modal'


const TabInfoVideoToast = ({ video }) => {
    const [showToast, setShowToast] = useState(false);

    const closeModal = () => {
        const video = document.getElementById('tabvideo');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        setShowToast(false);
    };
    useEffect(() => {
        return () => {
            closeModal()
        }
    }, [])

    return (
        <>
            <Button
                variant="danger"
                style={{ position: "fixed", top: '0', right: "2%", zIndex: "999" }}
                onClick={() => setShowToast(true)}
            >
                <BsFillPlayFill size={20} />
            </Button>
            {video &&
                <Modal show={showToast}
                    handleClose={closeModal} title={'Video'}>
                    <div >
                        <video id="tabvideo" controls style={{ width: "-webkit-fill-available" }}>
                            <source src={video} type="video/mp4"></source>
                        </video>
                    </div>
                </Modal>
            }
            {/* <Toast
                variant='secondary'
                show={showToast}
                onClose={() => setShowToast(false)}
                style={{ position: "fixed", top: '5%', left: "10px", zIndex: "9999" }}
                delay={5000}
                autohide
            >
                <Toast.Body>
                    <BsFillPlayFill size={20} style={{ marginRight: '5px' }} />
                    <strong className="mr-auto" >How to Motivate Students To take your lessons</strong>
                </Toast.Body>
            </Toast> */}
        </>
    );
};

export default TabInfoVideoToast;
