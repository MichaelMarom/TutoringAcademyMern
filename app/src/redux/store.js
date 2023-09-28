import { configureStore } from '@reduxjs/toolkit';
import thicknessReducer from './student_store/Thickness';
import colorLineReducer from './student_store/Color';
import eraserReducer from './student_store/Eraser';
import paintReducer from './student_store/Paint';
import toolReducer from './student_store/Tool';
import toolReq from './student_store/toolReq';
import asideReq from './student_store/asideReq.js';
import modeReducer from './tutor_store/Mode';
import BoardAccessReducer from './tutor_store/BoardAccess';
import save from './tutor_store/save';
import ScreenName from './tutor_store/ScreenName';
import EventReducer from './tutor_store/EventSlice';

let store = configureStore({
  reducer: {
    
    lineWidth: thicknessReducer,
    color: colorLineReducer,
    eraserWidth: eraserReducer,
    paint: paintReducer,
    tool: toolReducer, 
    mode: modeReducer,
    BoardUser: BoardAccessReducer,
    save: save,

    screenName: ScreenName,

    toolReq: toolReq,
    asideReq: asideReq,
    event: EventReducer

  }

})


export default store;