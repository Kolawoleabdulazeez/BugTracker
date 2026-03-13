import { createSlice } from "@reduxjs/toolkit";
import store from "./store";

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
    resolved:boolean;
  };
  const initialState: Bug[] = [];


  
  // Action types
  type Action =
    | { type: "bugAdded"; payload: { description: string, assignee:string, status:string, priority: string} }
    | { type: "bugDeleted"; payload: { id: number } }
    | { type: "bugEdited"; payload: { id: number; description: string } };
  
  // Starting ID counter
  let lastId = 0;
  
  // Reducer function
  function reducer(state: Bug[]=initialState, action: Action): Bug[] {
    switch (action.type) {
      case "bugAdded":
        return [
          ...state,
          {
            id: ++lastId,
            description: action.payload.description,
            resolved: false,
            assignee: action.payload.assignee,
            status: action.payload.status,
            priority: action.payload.priority,
          },
        ];
  
      case "bugDeleted":
        return state.filter(bug => bug.id !== action.payload.id);
  
      case "bugEdited":
        return state.map(bug =>
          bug.id === action.payload.id
            ? { ...bug, description: action.payload.description }
            : bug
        );
  
      default:
        return state;
    }
  }

