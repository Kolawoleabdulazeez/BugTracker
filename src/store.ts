import { configureStore } from '@reduxjs/toolkit';
import bugsSliceReducer from './pages/features/bugSlice';
import modalReducer from "./pages/features/modalSlice";
import sectionReducer from "./pages/features/Sectionslice"

 const store = configureStore({
    reducer:{
      bugs: bugsSliceReducer,
      modal:modalReducer,
      section: sectionReducer,
    }
 })

 export default store;

  export type RootState = ReturnType<typeof store.getState>
