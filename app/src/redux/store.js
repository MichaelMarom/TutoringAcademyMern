import { configureStore } from '@reduxjs/toolkit';
import thicknessReducer from './student_store/Thickness';
import colorLineReducer from './student_store/Color';
import eraserReducer from './student_store/Eraser';
import paintReducer from './student_store/Paint';
import toolReducer from './student_store/Tool';
import toolReq from './student_store/toolReq';
import asideReq from './student_store/asideReq.js';
import modeReducer from './tutor_store/Mode';
import userReducer from './auth_state/auth';
import subjectReducer from './subject_store/subjectStore';
import BoardAccessReducer from './tutor_store/BoardAccess';
import save from './tutor_store/save';
import ScreenName from './tutor_store/ScreenName';
import EventReducer from './tutor_store/EventSlice';
import selectedTutorReducer from './student_store/selectedTutor';

let store = configureStore({
  reducer: {
    user: userReducer,
    subject: subjectReducer,
    selectedTutor: selectedTutorReducer,
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