import Functions from "../Component/functions"
import Table from "../Component/table"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { useState } from "react"

export default function TableFunction(){
    const [searchTerm, setSearchTerm] =useState("")
        const bugs = useSelector((state:RootState)=>state.bugs)
    

    return(
        
        <div className="">
        <Functions searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <Table bugs={bugs} searchTerm={searchTerm}/>
        </div>
    )
}