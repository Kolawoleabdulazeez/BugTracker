"use client";
import {  useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { RootState } from "@/store";



export default function TicketModal(){

    const { isOpen,  } = useSelector((state: RootState) => state.modal);

    if(!isOpen) return null

    return createPortal(
          <div className="fixed top-0 left-0 z-20 h-full w-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            {/* <CreateTicketModal
              mode={mode}
              ticketToEdit={ticketToEdit}
              onClose={() => dispatch(closeModal())}
            /> */}
          </div>
         ,
        document.body
      )

}