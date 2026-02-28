// // import { useState, useContext,createContext } from "react";
// import {compose, pipe} from 'lodash/fp'
// // export const themeChanger = createContext(20)

// // export default function NewApp(){
// //   const [change, setChange] =useState(false)
// //   const theme = change? "dark": "light"

// //   function handleChange(e: React.MouseEvent<HTMLButtonElement>){
// //     e.preventDefault();
// //     setChange(!change)
// //   }

// //   return(
// //     <>
// //     <button onClick={handleChange}>Theme</button>
// //       {theme && <div>Hello World</d iv>}
// //     </>

// //   )
// // }

// // functional programming
// let input = "   Jav ascript"

// const trim = (str: string)=> str.trim()
// const wrapInDiv =(str : string) => `<div>${str}</div>`
// const toLowerCase = (str:string) => str.toLowerCase()

// const transform =pipe(wrapInDiv, toLowerCase, trim)

// console.log(transform(input))


// const add = (a: number) => (b:number)=> a+b


