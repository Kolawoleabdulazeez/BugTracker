import { configureStore } from '@reduxjs/toolkit';
import bugsSliceReducer from './features/bugSlice';
import modalReducer from "./features/modalSlice";
import sectionReducer from "./features/Sectionslice"

 const store = configureStore({
    reducer:{
      bugs: bugsSliceReducer,
      modal:modalReducer,
      section: sectionReducer,
    }
 })

 export default store;

  export type RootState = ReturnType<typeof store.getState>
