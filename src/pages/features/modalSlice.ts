import { createSlice } from "@reduxjs/toolkit";


interface ModalState {
    isOpen: boolean,
    mode: "edit"  | "create",
    ticketToEdit: Bug | null
}

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

  const initialState: ModalState={
    isOpen: false,
    mode:"create",
    ticketToEdit: null

  }

  const ModalState = createSlice({
    name: "modal",
    initialState,
    reducers:{
        openCreateModal(state) {
            state.isOpen = true;
            state.mode = "create";
          },
          openEditModal(state, action) {
            state.isOpen = true;
            state.mode = "edit";
            state.ticketToEdit = action.payload;
          },
          closeModal(state) {
            state.isOpen = false;
            state.ticketToEdit = null;
          },
    }

  })


export const { openCreateModal, openEditModal, closeModal } = ModalState.actions;
export default ModalState.reducer;