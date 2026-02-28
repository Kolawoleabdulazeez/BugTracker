  import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
    id: number;
    name: string;
  };
  
  type bugsState = {
    loading: boolean;
    users: User[];
    error: string; 
  };
  


const initialState: bugsState ={
    loading: false,
    users:[],
    error:""
}


const requestSlice = createSlice({
    name: "fetching_request",
    initialState,
    reducers: {
        fetchUsersRequest:(state)=>{
            state.loading =true;
            state.error="";
        },
        fetchUsersSuccess:(state, action: PayloadAction<User[]>)=>{
                state.loading= false,
                state.users= action.payload    
        },
        fetchUsersFailure:(state,action:PayloadAction<string>)=>{
               state.loading =false,
               state.users= [],
               state.error= action.payload 
        }
    }
})

export const {fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure} = requestSlice.actions
export default requestSlice.reducer