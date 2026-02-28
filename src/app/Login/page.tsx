"use client";


import React from 'react'
import { useForm } from 'react-hook-form'
import Input from '../Component/Input/Input';
import Button from '../Component/Button/Button';
import { EMAIL_VALIDATION } from '../utils';

export type loginFormData = {
  emailAddress:string,
  password:string
}

const pages = () => {

  const loginForm = useForm<loginFormData>({
    mode:"onChange",
    reValidateMode:"onChange",
    defaultValues:{
      emailAddress:"",
      password:""
    }
  })

  const onSubmit = ()=>{
    console.log()
  }
  return (
    <div className='flex h-screen w-full'>
      <div className='basis-2/5 bg-white flex items-center justify-center'>
      
    <form onSubmit={loginForm?.handleSubmit(onSubmit)} className='border w-[60%]'>
      <Input
        {...loginForm?.register("emailAddress", {
          validate: EMAIL_VALIDATION,
        })}
        type="email"
        label="Email"
        inputClassName="text-sm"
        placeholder="user@email.com"
        labelClassName="mb-2 font-medium !text-sm py-3 "
        parentClassName="mt-4"
        className="!h-[36px] mb-2 border-black  border-2 transition-all shadow-sm text-[#00143D] font-normal text-base sm:text-lg w-full"
        errortxt={loginForm?.formState?.errors?.emailAddress?.message}
      />

      <Input
        {...loginForm?.register("password", {
          required: "Password is required",
        })}
        type="password"
        hidePasswordIcon
        label="Password"
        placeholder="Enter Password"
        labelClassName="mb-2 font-medium !text-sm text-darkPrimary"
        inputClassName="text-sm"
        parentClassName="my-1"
        className="!h-[36px] mb-2 transition-all shadow-sm !bg-disabledBg dark:!bg-disabledBg text-[#00143D] font-normal text-base sm:text-lg w-full"
        errortxt={loginForm?.formState?.errors?.password?.message}
      />

    

      <div className="mt-3">
        <Button title="Continue" type="submit" className="w-full !bg-[#e7305a] !h-12" />
      </div>
    </form>
      
      </div>
      <div className='basis-3/5 bg-red-50'></div>
    </div>
  )
}

export default pages
