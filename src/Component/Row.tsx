import PriorityLabel from "./PriorityLabel"
import Image from "next/image"
import { useDispatch } from "react-redux";
import { PriorityType } from "./PriorityLabel";
import { useEffect, useState } from "react";
import { deletedBug } from "@/pages/features/bugSlice";
import { openEditModal } from "@/pages/features/modalSlice";


export type Bug = {
    id: number;
    description: string;
    module: string;
    assignee: string;
    status: string;
    priority: string;
    attachment?:File | null
  };
  
  const statusColor:  Record<StatusType, string> ={
    Open: "text-red-500",
    "In-Progress": "text-green-500",
    Resolved: "text-green-500",
    Closed: "text-gray -500"
  }
  type StatusType = "Open" | "In-Progress" | "Resolved" | "Closed";

export default function Row({bug}:{bug:Bug}){
    const dispatch =useDispatch();

    function handleDelete(id: number) {
        dispatch(deletedBug({ id }));
      }
    
      function handleEdit(ticket: Bug) {
            dispatch(openEditModal(ticket));
      }





    return(
      <tr key={bug.id}  className="bg-white rounded-xl shadow">
                          <td className="px-4 py-2 ">{bug.id}</td>
                          <td className="px-4 py-2 ">{bug.module}</td>
                          <td className="px-4 py-2  max-w-xs truncate">{bug.description}</td>
                          <td className={`px-4 py-2 ${statusColor[bug.status as StatusType]}`}>{bug.status}</td>
                
                          <td className="px-4 py-2">
                          <PriorityLabel level={bug.priority as PriorityType} />
                        </td>
  
                          <td className="px-4 py-2 ">
                          <span>{bug.assignee}</span>
                          </td>
                          <td className="px-4 py-2 ">
                            {bug.attachment && (
                              <img
                                src={bug.attachment}
                                alt="attachment"
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                          </td>
                      <td><button onClick={()=> handleEdit(bug)}  className=" transition-transform duration-150 active:scale-95 flex mx-auto items-left">
                          <span> <Image src="/edit.svg" height={20} width={20} alt="edit button"/> </span>
                      </button></td>
  
  
                      <td><button  onClick={() => handleDelete(bug.id)}  className=" transition-transform duration-150 active:scale-95 flex mx-auto items-left">
                          <span> <Image src="/delete-com.svg" height={20} width={20} alt="delete button"/> </span>
                      </button></td>
                      </tr>
    )
  }