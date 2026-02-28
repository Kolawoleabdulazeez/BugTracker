"use client";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import CreateTicketModal from "./CreateTicketModal";
import { closeModal } from "../features/modalSlice";
import { createPortal } from "react-dom";



export default function TicketModal(){
    const dispatch =useDispatch();

    const { isOpen, mode, ticketToEdit } = useSelector((state: RootState) => state.modal);

    if(!isOpen) return null

    return createPortal(
          <div className="fixed top-0 left-0 z-20 h-full w-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <CreateTicketModal
              mode={mode}
              ticketToEdit={ticketToEdit}
              onClose={() => dispatch(closeModal())}
            />
          </div>
         ,
        document.body
      )

}