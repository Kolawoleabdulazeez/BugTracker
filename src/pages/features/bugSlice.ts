import { createSlice } from "@reduxjs/toolkit";

// Define a Bug type
type Bug = {
    id: number;
    description: string;
    assignee: string;
    status: string;
    component?: string;
    priority: string;
    stage?:string;
    image?: File;
    module:string
  };
  const initialState: Bug[] = [];
  // Starting ID counter
  let lastId = 0;

const bugsSlice = createSlice({
    name: "bugsSlice",
    initialState,
    reducers: {
        bugAdded: (state, action) => {
            return [
                ...state,
                {
                  id: ++lastId,
                  description: action.payload.description,
                  module:action.payload.module,
                  assignee: action.payload.assignee,
                  status: action.payload.status,
                  priority: action.payload.priority,
                  attachment:action.payload.attachment
                },
            ];
        },

        bugEdited :(state, action)=>{
            return state.map(bug=>bug.id===action.payload.id?
                    {...bug, description:action.payload.description, assignee:action.payload.assignee, priority:action.payload.priority, module:action.payload.module}:bug
                )
        },

        deletedBug: (state, action)=>{
            return state.filter(bug => bug.id !== action.payload.id)
            }
    }
  });

export const { bugAdded, bugEdited,deletedBug } = bugsSlice.actions;

export default bugsSlice.reducer;
  