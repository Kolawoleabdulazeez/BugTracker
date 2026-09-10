import React from "react";
import { useForm } from "react-hook-form";
import { AuthPage } from "..";
import { EMAIL_VALIDATION } from "@/utils";
import Input from "@/Component/Input/Input";
import Button from "@/Component/Button/Button";
import { ArrowRightFromLine, Loader2 } from "lucide-react";
import { useLogin } from "@/services/auth/useAuths";

export type loginFormData = {
  email: string;
  password: string;
};

interface LoginFormProp {
  setAuthPage: React.Dispatch<React.SetStateAction<AuthPage>>;
}

const LoginForm = ({ setAuthPage }: LoginFormProp) => {
  const { mutateAsync, isPending } = useLogin();

  const loginForm = useForm<loginFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: loginFormData) => {
    await mutateAsync(data);
  };

  return (
    <div
      className="glass-card relative z-10 flex w-full max-w-md flex-col items-center rounded-2xl border border-orange-200/70 p-6 sm:p-7 shadow-[0_12px_40px_rgba(237,98,20,0.08)]">
      {/* Header */}
      <div className="mb-5 text-center">
        <p className="font-sans text-2xl font-semibold tracking-tight text-secondary-800">
          Welcome Back
        </p>

        <p className="mt-1 font-sans text-sm text-secondary-500">
          Log in to your account
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={loginForm.handleSubmit(onSubmit)}
        className="w-full"
      >
        {/* Email */}
        <Input
          {...loginForm.register("email", {
            validate: EMAIL_VALIDATION,
          })}
          type="email"
          label="Email"
          placeholder="user@email.com"
          inputClassName="!bg-white/80 !text-secondary-800 placeholder:!text-secondary-300 focus:!border-orange-500 focus:!ring-1 focus:!ring-orange-500/2"
          labelClassName=" !mb-2 !text-sm !font-medium !text-secondary-800"
          parentClassName="my-4"
          className="!h-12 w-full rounded-xl border border-secondary-200 !bg-white/80 font-normal text-base shadow-sm transition-all duration-200 hover:border-orange-300 focus-within:border-orange-500"
          errortxt={loginForm.formState.errors.email?.message}
        />

        {/* Password */}
        <Input
          {...loginForm.register("password", {
            required: "Password is required",
          })}
          type="password"
          label="Password"
          placeholder="Enter Password"
          labelClassName="!mb-2 !text-sm !font-medium !text-secondary-800"
          inputClassName="!bg-white/80 !text-secondary-800 placeholder:!text-secondary-300 focus:!ring-orange-500/20"
          parentClassName="my-4"
          className="!h-12 w-full rounded-xl border border-secondary-200 !bg-white/80 font-normal text-base shadow-sm transition-all duration-200 hover:border-orange-300 focus-within:border-orange-500"
          errortxt={loginForm.formState.errors.password?.message}
        />

        {/* Login Button */}
        <div className="mt-6">
          <Button
            disabled={isPending}
            title={
              isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Launch Console
                  <ArrowRightFromLine className="ml-1 inline h-4 w-4" />
                </>
              )
            }
            type="submit"
            className="!h-12 w-full !rounded-xl !border-0 !bg-gradient-to-r !from-orange-500 !to-orange-600 !text-base !font-semibold !text-white shadow-[0_8px_20px_rgba(237,98,20,0.22)] transition-all duration-200 hover:!from-orange-600 hover:!to-orange-700 hover:-translate-y-[1px] hover:shadow-[0_10px_25px_rgba(237,98,20,0.28)] active:translate-y-0"
          />
        </div>
      </form>

      {/* Sign Up */}
      <div className="mt-5 flex items-center justify-center">
        <p className="font-sans text-sm font-normal text-secondary-500">
          New to TestOrbit?
        </p>

        <Button
          className="!ml-1 !p-1 !bg-transparent border-transparent !text-sm !font-semibold !text-orange-500 hover:!text-orange-600"
          title="Sign Up"
          onClick={() => setAuthPage(AuthPage.SignUp)}
        />
      </div>
    </div>
  );
};

export default LoginForm;