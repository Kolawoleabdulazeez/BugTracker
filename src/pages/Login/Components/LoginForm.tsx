
import React from 'react'
import { useForm } from 'react-hook-form'
import { AuthPage } from '..'
import { EMAIL_VALIDATION } from '@/pages/utils'
import Input from '@/Component/Input/Input'
import Button from '@/Component/Button/Button'
import { useLogin } from '@/pages/utils/services/auth/useAuths'
import { ArrowRightFromLine, ChevronRight, Loader2 } from 'lucide-react'



export type loginFormData = {
  email:string,
  password:string
}

interface LoginFormProp {
    setAuthPage:React.Dispatch<React.SetStateAction<AuthPage>>
}

const LoginForm = ({setAuthPage}:LoginFormProp) => {
      const {mutateAsync, isPending} = useLogin()
      const loginForm = useForm<loginFormData>({
        mode:"onChange",
        reValidateMode:"onChange",
        defaultValues:{
          email:"",
          password:""
        }
      })

    
      const onSubmit = async(data: loginFormData)=>{
        await mutateAsync(data)
      }
  return (
<div className="z-10 flex w-full flex-col items-center rounded-2xl border border-white/10 bg-[#191B33]/40 p-5 sm:p-6 backdrop-blur-md">
              <p className='text-xl font-bold text-white text-left'>Welcome Back</p>
              <p className='text-gray-50 text-base'>Log in to your account</p>

          <form onSubmit={loginForm?.handleSubmit(onSubmit)} className=' w-full   '>
      <Input
        {...loginForm?.register("email", {
          validate: EMAIL_VALIDATION,
        })}
        type="email"
        label="Email"
        inputClassName="text-sm"
        placeholder="user@email.com"
        labelClassName=" font-medium !text-sm py-3 text-white "
        parentClassName="my-4 text-"
        className="!h-[40px] mb-2 transition-all shadow-sm text-[#00143D] font-normal text-base sm:text-lg w-full"
        errortxt={loginForm?.formState?.errors?.email?.message}
      />

      <Input
        {...loginForm?.register("password", {
          required: "Password is required",
        })}
        type="password"
        label="Password"
        placeholder="Enter Password"
        labelClassName="mb-2 font-medium !text-sm text-white"
        inputClassName="text-sm"
        parentClassName="my-1"
        className="!h-[40px] mb-2 transition-all shadow-sm !bg-disabledBg dark:!bg-disabledBg text-[#00143D] font-normal text-base sm:text-lg w-full"
        errortxt={loginForm?.formState?.errors?.password?.message}
      />

    

      <div className="mt-5">
      <Button
  disabled={isPending}
  title={
    isPending ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (<>
        Launch Console <ArrowRightFromLine className="inline w-4 h-4 ml-1" /> </>
    )
  }
  type="submit"
  className="w-full !bg-[#1121D4] !h-12 !text-base text-white"
/>
        
      </div>


   
    </form>

    
    <div className='flex my-3 items-center justify-center'>
      <p className='!text-base text-white font-normal'>New to TestOrbit</p>
    <Button className='!text-[#1121D4] !p-1 bg-transparent !text-base' title="Sign Up" onClick={()=>setAuthPage(AuthPage.SignUp)}/>
    </div>
    </div>
  )
}

export default LoginForm
