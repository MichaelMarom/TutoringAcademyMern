import p1 from '../../images/pencil-tip-svgrepo-com (1).svg';

import sl from '../../images/line-straight-svgrepo-com.svg';

import shapesImage from '../../images/shapes-svgrepo-com (1).svg';
import circelImage from '../../images/circle-thin-svgrepo-com.svg';
import paintImage from '../../images/fill-svgrepo-com.svg';
import SqImage from '../../images/square-svgrepo-com (1).svg';
import eraserImage from '../../images/eraser-svgrepo-com.svg';
import triangleImage from '../../images/triangle-svgrepo-com (1).svg';
import rectImage from '../../images/rectangle-svgrepo-com.svg'

import {useEffect, useRef, useState} from 'react'
import {Peer} from 'peerjs';
import uniqid from 'uniqid';
import { setToolTo } from '../../redux/student_store/Tool';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import SHeader from '../../commponents/class/THeader';
import SVid from '../../commponents/class/TVid';
import SMssg from '../../commponents/class/TMssg';
import SPanel from '../../commponents/class/TPanel';
import { socket } from '../../socket';
import { setToolReqTo } from '../../redux/student_store/toolReq';
import { setAsideReqTo } from '../../redux/student_store/asideReq.js.js';
import { setEraserWidthTo } from '../../redux/tutor_store/Eraser';
import { setBoardAccessTo } from '../../redux/tutor_store/BoardAccess';

const Class = () => {

    let dispatch = useDispatch();

    let location = useLocation();

    let drawStartMode  = useRef('')
    let drawMoveMode  = useRef('')
    let drawEndMode  = useRef('')

    let {ModeValue} = useSelector(s => s.mode)

    let {BoardAccess} = useSelector(state => state.BoardUser);

    

    let {colorLine} = useSelector(state => state.color);
    let {paintValue} = useSelector(state => state.paint);
    let {lineWidthValue} = useSelector(state => state.lineWidth);

    let {ToolValue} = useSelector(state => state.tool);
    let {eraserWidthValue} = useSelector(state => state.eraserWidth);

    let {asideReqValue} = useSelector((state) => state.asideReq);
    let {toolReqValue} = useSelector((state) => state.toolReq);

    let [requestBox, setRequestBox] = useState('');
    let answer = useRef('Ignor')
    let phrase = useRef('Do Not')


    //let [thickness, setthickness] = useState('');
    
    let [border, setBorder] = useState(1);
    let [rangeVal, setRangeVal] = useState(1);
    let [checkbox, setCheckbox] = useState(false);
    let [state, setState] = useState('tutor');

    let [tutorReq, setTutorReq] = useState(false);

    let [penColor, setPenColor] = useState('#000')
    let [shapesCnt, setShapesCnt] = useState('')
    let [penStyle, setPenStyle] = useState('')
    let [thickness, setthickness] = useState('');
    let [board, setBoard] = useState('');
    let [floatingFile, setFloatingFile] = useState([]);

    var floatId = useRef('');
    var checked = useRef(false);
    var color = useRef('black');
    var fillColor = useRef('#000');
    var thick = useRef(2);
    let selectedTool = useRef('pen');
    var EraserWidth = useRef(2);
    
    
   
    
    useEffect(() => {

        setState(BoardAccess )

    }, [BoardAccess])

    useEffect(() => {
        selectedTool.current = ToolValue;
        socket.emit('tool', ToolValue)
    }, [ToolValue])

    useEffect(() => {
        socket.emit('fill', checkbox)
    }, [checkbox])

    useEffect(() => {
        EraserWidth.current = eraserWidthValue;
    }, [eraserWidthValue]) 

    useEffect(() => {
        color.current = penColor;
    }, [penColor])

    useEffect(() => {
        fillColor.current = paintValue;
    }, [paintValue])


    useEffect(() => {
        thick.current = border;
    }, [border])

    let handleTool = e => {
        let elem = e.currentTarget;
        dispatch(setToolTo(elem.dataset.tool))
    }

    useEffect(() => {

        function drawLine(e) {
            // Clear the screen, redraw the buffer into it
            ctx.clearRect( 0, 0, canvas.width, canvas.height );
            ctx.drawImage( buffer, 0, 0 );

            // Draw your path
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }

        function brush(e) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }

        function erase(e) { 
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = EraserWidth.current
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }

        function drawRect(e) {
            ctx.clearRect( 0, 0, canvas.width, canvas.height );
            ctx.drawImage( buffer, 0, 0 );
            checked.current ? ctx.fillRect(e.offsetX, e.offsetY, prevX - e.offsetX, prevY - e.offsetY) :
            ctx.strokeRect(e.offsetX, e.offsetY, prevX - e.offsetX, prevY - e.offsetY);
            
        }

        function drawSq(e) {
            
            ctx.clearRect( 0, 0, canvas.width, canvas.height );
            ctx.drawImage( buffer, 0, 0 );
            const size = Math.min(Math.abs(e.offsetX - prevX), Math.abs(e.offsetY - prevY));
            const startX = prevX < e.offsetX ? prevX : prevX - size;
            const startY = prevY < e.offsetY ? prevY : prevY - size;

            checked.current ? ctx.fillRect(startX, startY, size, size) : ctx.strokeRect(startX, startY, size, size)

        }

        function drawCircle(e) {
            ctx.clearRect( 0, 0, canvas.width, canvas.height );
            ctx.drawImage( buffer, 0, 0 );

            ctx.beginPath(); // creating new path to draw circle
            // getting radius for circle according to the mouse pointer
            let radius = Math.sqrt(Math.pow((prevX - e.offsetX), 2) + Math.pow((prevY - e.offsetY), 2));
            ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
            checked.current ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
        }

        function drawTriangle(e) {
            ctx.clearRect( 0, 0, canvas.width, canvas.height );
            ctx.drawImage( buffer, 0, 0 );

            ctx.beginPath(); // creating new path to draw circle
            ctx.moveTo(prevX, prevY); // moving triangle to the  pointer
            ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the  pointer
            ctx.lineTo(prevX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
            ctx.closePath(); // closing path of a triangle so the third line draw automatically
            checked.current ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
        }

        function onResize(){

            canvas.height = window.innerHeight;  
            canvas.width = window.innerWidth - 5;
            //canvas.style.pointerEvents.right = `${400}`
            ctx.strokeStyle = color.current;
            ctx.fillStyle = fillColor.current;
        }

        function onPointerStart( e ){
            // Write the current state into the buffer when we start
            ctx.strokeStyle  = color.current;
            ctx.lineWidth = thick.current;
            ctx.fillStyle = fillColor.current;
            
            buffer.width = canvas.width
            buffer.height = canvas.height;
            bufferCtx.drawImage( canvas, 0, 0 );
            isDrawing = true

            
            prevX = e.offsetX;
            prevY = e.offsetY;
            ctx.beginPath();

            socket.emit('canvas-start', prevX, prevY, color.current, thick.current, fillColor.current);
        }
        function onPointerMove( e ){
            

            if( isDrawing === false ) return;

            if(selectedTool.current === 'line'){
                drawLine(e)
                socket.emit('canvas-move',  'line', e.clientX, e.clientY, e.offsetX, e.offsetY, e.pageX, e.pageY )
            }else if(selectedTool.current === 'pen'){
                brush(e)
                socket.emit('canvas-move',  'pen', e.clientX, e.clientY, e.offsetX, e.offsetY, e.pageX, e.pageY )
            }else if(selectedTool.current === 'rectangle'){
                drawRect(e)
                socket.emit('canvas-move',  'rectangle', e.clientX, e.clientY, e.offsetX, e.offsetY, e.pageX, e.pageY )
            }else if(selectedTool.current === 'circle'){
                drawCircle(e)
                socket.emit('canvas-move', 'circle', e.clientX, e.clientY, e.offsetX, e.offsetY, e.pageX, e.pageY )
            }else if(selectedTool.current === 'triangle'){
                drawTriangle(e)
                socket.emit('canvas-move', 'triangle', e.clientX, e.clientY, e.offsetX, e.offsetY, e.pageX, e.pageY )
            }else if(selectedTool.current === 'square'){
                drawSq(e)
                socket.emit('canvas-move', 'square', e.clientX, e.clientY, e.offsetX, e.offsetY, e.pageX, e.pageY )
            }else if(selectedTool.current === 'eraser'){
                erase(e)
                socket.emit('canvas-move', 'eraser', e.clientX, e.clientY, e.offsetX, e.offsetY, e.pageX, e.pageY )
            }

            
            

        }
        function onPointerEnd( e ){
            isDrawing = false;
            socket.emit('canvas-end', {})
        }

        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');

        // This will be our buffer
        const buffer = document.createElement('canvas');
        const bufferCtx = buffer.getContext('2d');
        let prevX = 0;
        let prevY = 0;
        let isDrawing = false;

        canvas.addEventListener('mousedown', onPointerStart);
        canvas.addEventListener('mousemove', onPointerMove);
        canvas.addEventListener('mouseup', onPointerEnd);
        canvas.addEventListener( 'resize', onResize);
        document.querySelector('.delete').onclick = e => {
            clearCanvas()
        }
        onResize();

        socket.on('tool', (tool)=> {
            selectedTool.current = tool;
            console.log(selectedTool.current)
            
        });
        socket.on('fill', (checkbox)=> {
            setCheckbox(checkbox)
            checked.current = checkbox;
        });
        socket.on('eraser-width', (value)=> {
            dispatch(setEraserWidthTo(value));
        });

        //Remote Canvas Functionalties
        socket.on('canvas-start', (pX, pY, color, thickness, fill)=> {

            ctx.strokeStyle  = color;
            ctx.lineWidth = thickness;
            ctx.fillStyle = fill;
            
            buffer.width = canvas.width
            buffer.height = canvas.height;
            bufferCtx.drawImage( canvas, 0, 0 );

            
            isDrawing = true;

            prevX = pX;
            prevY = pY;
            ctx.beginPath();
            //isDrawing = true;
        })

        socket.on('canvas-move', (cX, cY, oX, oY, pX, pY)=> {
            let e = {offsetX: oX, offsetY: oY}
            if( isDrawing === false ) return;

            if(selectedTool.current === 'line'){
                drawLine(e)
            }else if(selectedTool.current === 'pen'){
                brush(e)
            }else if(selectedTool.current === 'rectangle'){
                drawRect(e)
            }else if(selectedTool.current === 'circle'){
                drawCircle(e)
            }else if(selectedTool.current === 'triangle'){
                drawTriangle(e)
            }else if(selectedTool.current === 'square'){
                drawSq(e)
            }else if(selectedTool.current === 'eraser'){
                erase(e)
            }
        })

        socket.on('canvas-end', (e)=> {
            isDrawing = false;
        }) 

        

        function clearCanvas(e) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }

    }, [dispatch]);

  
    let handleFileChange = e => {

        if(e.target.name === 'photo'){

            let file = e.target.files;

            let r = new FileReader()

            r.onload = res => {

                let src = r.result 
                document.querySelector(`#${floatId.current}`).src = src;
            }

            r.readAsDataURL(file[0]);

        }else if(e.target.name === 'video'){

            let file = e.target.files;

            let r = new FileReader()

            r.onload = res => {
                let src;

                src = r.result
                
                document.querySelector(`#${floatId.current}`).src = src;
            }

            r.readAsDataURL(file[0]);

        }else{
            
        }
    }

    let handleFillColor = e => {
        let c = e.target.dataset.color;
        fillColor.current = c
    }

    useEffect(() => {
        document.querySelector('.reqBtn').onclick = e => {
            socket.emit('permissiontoUseBoardTools', location.pathname.split('/').splice(-1)[0]);
        }
        
    },[location])

    useEffect(() => {

        let r = 
        <div className="tutor-requests">
            <div className="request-bx">
                <div className="text">
                    <h6>
                        Emeka {phrase.current} Have Access To The White Board Tools
                    </h6>
                </div>

                <div className="btns">
                    <button>Grant Access</button>
                </div>
            </div>
        </div>

        if(location.pathname.split('/').splice(-2)[0] === 'tutor'){
            setTutorReq(r)
        }else{
            setTutorReq('')
        }
        
    },[location])

     //TUTORS PANEL...
    useEffect(() => {
        //TUTORS PANEL...
        socket.on('permissiontoUseBoardTools', id => {

            let div = document.createElement('div');
            div.className = 'popin';

            let h5 = document.createElement('h5');
            h5.innerHTML = `User "${id}" Requested To Use The White Board Tools.`

            

            div.appendChild(h5)
         
            let _$ = value => {
                if(value === 'approve'){
                    dispatch(setAsideReqTo('approve'))
                    dispatch(setToolReqTo('approve'))
                }else if(value === 'reject'){
                    dispatch(setAsideReqTo('reject'))
                    dispatch(setToolReqTo('reject'))
                }else{
                    dispatch(setAsideReqTo('ignore'))
                    dispatch(setToolReqTo('ignore'))
                }
            }

            document.body.appendChild(div)

           
            setTimeout(() => {
                _$(answer.current)
                div.remove();
                //socket.emit('PermissionResponse', answer.current);
            }, 2000);
            

            
        })

    },[answer,dispatch])


    useEffect(() => {
        socket.on('accessGranted', () => {
            dispatch(setBoardAccessTo('student'))
            let div = document.createElement('div');
            div.className = 'popin';

            let small = document.createElement('small');
            small.innerHTML = `You Now Have Access To The White Board.`;

            div.appendChild(small)

            document.body.appendChild(div);

            setTimeout(() => {
                div.remove();
            }, 2000);
        });
    
        socket.on('accessRestricted', () => {
            dispatch(setBoardAccessTo('tutor'))

            let div = document.createElement('div');
            div.className = 'popin';

            let small = document.createElement('small');
            small.innerHTML = `You have Been Restricted From Using The White Board.`;

            div.appendChild(small)

            document.body.appendChild(div);

            setTimeout(() => {
                div.remove();
            }, 2000);
        });
    }, [dispatch])

    useEffect(() => {
        if(location.pathname.split('/').splice(-2)[0] === 'tutor'){
            toolReqValue !== 'approve' ? phrase.current = 'Wants To' : phrase.current = 'Do Not'
        }
        
    }, [toolReqValue, location])

    let handleShapeOptions = e => {

        if(!document.querySelector('.shapes-option-cnt')){

            let elem = e.currentTarget.parentElement;

            
            let positon = elem.getBoundingClientRect();

            let cnt = <div className="shapes-option-cnt shadow-sm" style={{top: `${positon.top + 70}px`, left: `${positon.left - 50}px`}}>

                    <div className="shapes">
                        <h6>Shapes</h6>
                
                        <div className='shape-option' data-shape='circle' onClick={e => {
                                dispatch(setToolTo(e.currentTarget.dataset.shape));
                                setShapesCnt('');
                            }}>
                                <img src={circelImage} style={{height: '50px', width: '50px'}} alt="..." />
                            </div>
                        <div className='shape-option' data-shape='square' onClick={e => {
                                dispatch(setToolTo(e.currentTarget.dataset.shape));
                                setShapesCnt('');
                            }}>
                                <img src={SqImage} style={{height: '50px', width: '50px'}} alt="..." />
                            </div>
                        <div className='shape-option' data-shape='rectangle' onClick={e => {
                                dispatch(setToolTo(e.currentTarget.dataset.shape));
                                setShapesCnt('');
                            }}>
                                <img src={rectImage} style={{height: '50px', width: '50px'}} alt="..." />
                            </div>
                        <div className='shape-option' data-shape='triangle' onClick={e => {
                                dispatch(setToolTo(e.currentTarget.dataset.shape));
                                setShapesCnt('');
                            }}>
                                <img src={triangleImage} style={{height: '50px', width: '50px'}} alt="..." />
                            </div>

                    </div>

                    <div className="shape-styles" style={{float: 'unset'}}>
                        <div className="shape-stroke-color" style={{float: 'unset', width: '100%'}}>

                            <h6>Stroke Color</h6>
                            
                            <div style={{background: '#000000'}} data-color='#000000' onClick={handlepenColor}></div>
                            
                            <div style={{background: '#ff0000'}} data-color='#ff0000' onClick={handlepenColor}></div>
                            
                            <div style={{background: '#ff8400'}} data-color='#ff8400' onClick={handlepenColor}></div>
                            
                            <div style={{background: '#0096ff'}} data-color='#0096ff' onClick={handlepenColor}></div>
                            

                        </div>
                        <div className="shape-fill-color" style={{float: 'unset', width: '100%'}}>
                            
                            <div  data-tool='fill shadow' style={{padding: '5px 0 8px 5px', display: 'flex', width: '100%'}} > 
                                <img src={paintImage} style={{height: '30px', width: '30px', marginTop: '5px'}} alt="..." /> &nbsp; &nbsp;

                                {
                                    checkbox 
                                    
                                    ? 
                                    
                                    <input onClick={handleFillColor} style={{margin: '13px 10px 0px 0', cursor: 'pointer', background: 'blue', height: '20px', width: '20px'}} type="checkbox" defaultChecked name="fill" onChange={e => {checked.current = e.target.checked; setCheckbox(false)}} id="fillColor" />

                                    :

                                    <input onClick={handleFillColor} style={{margin: '13px 10px 0px 0', cursor: 'pointer', background: 'blue', height: '20px', width: '20px'}} type="checkbox" name="fill" onChange={e => {checked.current = e.target.checked; setCheckbox(true)}} id="fillColor" />
                                }

                                
                            </div>
                            <div style={{background: '#000000'}} data-color='#000000' onClick={handleFillColor}></div>

                            <div style={{background: '#ff0000'}} data-color='#ff0000' onClick={handleFillColor}></div>
                            
                            <div style={{background: '#ff8400'}} data-color='#ff8400' onClick={handleFillColor}></div>
                            
                            <div style={{background: '#0096ff'}} data-color='#0096ff' onClick={handleFillColor}></div>
                            

                        </div>
                    </div>
                </div>

            setShapesCnt(cnt);

        }else{
            setShapesCnt('');
        }
    }

    let handleEraserWidth = e => {

        dispatch(setToolTo('eraser'))
        let value = e.target.value;
        socket.emit('eraser-width', value)
        dispatch(setEraserWidthTo(value))
    }

    let handleEraserThickness = e => {

        handleTool(e)

        let elem = e.currentTarget.parentElement

        let left = elem.getBoundingClientRect().left
        let top = elem.getBoundingClientRect().top
        console.log(left, top)

        let thicknessPanel = 
        <div className='thickness-panel shadow' style={{left: `${left + 150}px`, top: `${top + 70}px`}}>

            <h6 style={{marginBottom: '20px'}}>Eraser Thickness</h6>
            <input className='slider' type="range" defaultValue={1} min={0} max={100}  name="" onInput={handleEraserWidth} />
        </div>;

        if(document.querySelector('.thickness-panel')){
            setthickness('')
        }else{
            setthickness(thicknessPanel)

        }
    }

    let handlepenColor = e => {
        let elem = e.target;

        setPenColor(elem.dataset.color)

        console.log(elem.dataset.color)
    }

    let handleLineThickness = e => {
        setBorder(e.target.value / 4)
        setRangeVal(e.target.value)
        console.log(e.target.value)
    }

    useEffect(() => {
        let l = document.getElementById('line-ill');
        console.log(l)
        if(l){
            l.style.border = `${border}px solid ${penColor}`
        }
        //

    },[border, penColor])

    let handlePenStyle = e => {
        handleTool(e);

        let elem = e.currentTarget.parentElement

        let left = elem.getBoundingClientRect().left
        let top = elem.getBoundingClientRect().top

        let penStyles = 
        <div>
            <div className='color-pallete shadow' style={{left: `${left - 50}px`, top: `${top + 60}px`}}>


                <div className='pen-color'>
                    <h5>Colors</h5>

                    <div style={{background: '#eeeeee'}} data-color='#eeeeee' onClick={handlepenColor}></div>
                    <div style={{background: '#dddddd'}} data-color='#dddddd' onClick={handlepenColor}></div>
                    <div style={{background: '#b2b2b2'}} data-color='#b2b2b2' onClick={handlepenColor}></div>
                    <div style={{background: '#000000'}} data-color='#000000' onClick={handlepenColor}></div>

                    <div style={{background: '#f9d5e5'}} data-color='#f9d5e5' onClick={handlepenColor}></div>
                    <div style={{background: '#eeac99'}} data-color='#eeac99' onClick={handlepenColor}></div>
                    <div style={{background: '#e06377'}} data-color='#e06377' onClick={handlepenColor}></div>
                    <div style={{background: '#ff0000'}} data-color='#ff0000' onClick={handlepenColor}></div>

                    <div style={{background: '#f6f1e9'}} data-color='#f6f1e9' onClick={handlepenColor}></div>
                    <div style={{background: '#faf4b7'}} data-color='#faf4b7' onClick={handlepenColor}></div>
                    <div style={{background: '#ffd93d'}} data-color='#ffd93d' onClick={handlepenColor}></div>
                    <div style={{background: '#ff8400'}} data-color='#ff8400' onClick={handlepenColor}></div>

                    <div style={{background: '#c9eeff'}} data-color='#c9eeff' onClick={handlepenColor}></div>
                    <div style={{background: '#97deff'}} data-color='#97deff' onClick={handlepenColor}></div>
                    <div style={{background: '#62cdff'}} data-color='#62cdff' onClick={handlepenColor}></div>
                    <div style={{background: '#0096ff'}} data-color='#0096ff' onClick={handlepenColor}></div>

                    <div style={{background: '#f4ff61'}} data-color='#f4ff61' onClick={handlepenColor}></div>
                    <div style={{background: '#a8ff3e'}} data-color='#a8ff3e' onClick={handlepenColor}></div>
                    <div style={{background: '#32ff6a'}} data-color='#32ff6a' onClick={handlepenColor}></div>
                    <div style={{background: '#27aa80'}} data-color='#27aa80' onClick={handlepenColor}></div>
                </div>

                <div className='pen-thickness'>

                    <div className="line-illustration">
                        <div id='line-ill' style={{height: '0px', width: '200px', border: `${border}px solid ${penColor}`, rotate: '-10deg', borderRadius: '20px'}}></div>
                    </div>

                    <div className='line-thickness-cnt'>
                        <h5>Thickness</h5>

                        <div className="line-thickness-range">
                            <input type="range" defaultValue={rangeVal} min="1" max="100" className="slider" id="myRange" onInput={handleLineThickness} /> 
                        </div>
                    </div>
                    
                    

                </div>



            </div>

        </div>
        if(!document.querySelector('.color-pallete')){
            setPenStyle(penStyles)
        }else{
            setPenStyle('')
        }
        

    }

    return ( 
        <>

            

            <div className="class-room" >

                
                {shapesCnt}
                {thickness}
                {penStyle}


                <SHeader />
                
                <div className="writing-set shadow" data-set='pens' id='set' style={{display: state === 'tutor' && location.pathname.split('/').splice(-2)[0] === 'tutor' ? 'block' : state === 'student' && location.pathname.split('/').splice(-2)[0] === 'student' ? 'block' : 'none'}} > 

                    <div onClick={handlePenStyle} data-tool='pen' style={{padding: '5px'}}>
                        <img src={p1} style={{height: '100%', width: '100%'}} alt="..." />
                    </div>

                    <div onClick={handlePenStyle} data-tool='line' style={{padding: '5px'}}>
                        <img src={sl} style={{height: '100%', width: '100%'}} alt="..." />
                    </div>

                    <div onClick={handleShapeOptions} data-tool='shapes' style={{padding: '5px'}}>
                        <img src={shapesImage} style={{height: '100%', width: '100%'}} alt="..." /> 
                    </div>

                    <div onClick={handleEraserThickness} data-tool='eraser' style={{padding: '5px'}} >
                        <img src={eraserImage} style={{height: '100%', width: '100%'}} alt="..." />
                    </div>

                </div>

               
                <>
                    <input style={{display: 'none'}} accept='video/*' type="file" name="video" id="video" onChange={handleFileChange} />

                    <input style={{display: 'none'}} type="file" name="doc" id="doc" />

                    <input style={{display: 'none'}} accept='image/*' onChange={handleFileChange} type="file" name="photo" id="photo" />
                </>

                
                <canvas id="drawPlace" style={{border:'1px solid #eee'}}>
            
                </canvas>
                

                {
                    <div dangerouslySetInnerHTML={{__html:
                        floatingFile.map((item) => {
                            return item
                        })
                    }} />
                }

                
                <div className="conference-box">

                    <SVid />

                    <div className="info-panel">
                        
                    </div>

                    <SMssg />

                    <SPanel />
                    
                </div>


                <div className="board-panel shadow-sm">

                </div>



            </div>

            

            

           
        </>
     );
}
 
export default Class;
