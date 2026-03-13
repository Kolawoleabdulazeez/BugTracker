import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CreatePasswordRules from "./CreatePasswordRules";
import { AuthPage } from "..";
import Input from "@/Component/Input/Input";
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from "@/pages/utils";
import Button from "@/Component/Button/Button";
import { useSignup } from "@/pages/utils/services/auth/useAuths";
import { Loader2 } from "lucide-react";

export type signupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNmber: string;
  confirmPassword: string;
  password: string;
};

interface SignupProp {
  setAuthPage: React.Dispatch<React.SetStateAction<AuthPage>>;
}

const SignupForm = ({ setAuthPage }: SignupProp) => {
  const signupForm = useForm<signupFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNmber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [passRequirements, setPassRequirements] = useState<boolean>(false);
  const watchedNewPassword = signupForm.watch("password");
  const { mutateAsync, isPending } = useSignup(setAuthPage);

  const validatePasswordMatch = (value: string) => {
    return value === watchedNewPassword || "Passwords do not match";
  };

  const onSubmitSignUpForm = async (data: signupFormData) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNmber: data.phoneNmber,
      password: data.password,
    };

    await mutateAsync(payload);
  };

  return (
    <div className="flex w-full justify-center">
      {/* Match Login: centered card with max width */}
      <div className="z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#191B33]/40 p-5 sm:p-6 backdrop-blur-md">
        {/* Header */}
        <div className="text-center">
          <p className="text-lg sm:text-xl font-bold text-white">Create Account</p>
          <p className="mt-1 text-sm sm:text-base text-gray-100">
            Sign up to start using TestOrbit
          </p>
        </div>

        <form onSubmit={signupForm.handleSubmit(onSubmitSignUpForm)} className="w-full mt-6">
          {/* Optional: two-column layout on larger screens */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              {...signupForm.register("firstName", {
                required: "First name is required",
              })}
              type="text"
              label="First Name"
              placeholder="Enter first name"
              labelClassName="text-white font-normal "
              parentClassName="my-0"
              inputClassName="text-sm"
              className="!h-[40px] transition-all shadow-sm text-[#00143D] font-normal text-base sm:text-lg w-full"
              errortxt={signupForm.formState.errors.firstName?.message}
            />

            <Input
              {...signupForm.register("lastName", {
                required: "Last name is required",
              })}
              type="text"
              label="Last Name"
              placeholder="Enter last name"
              parentClassName="my-0"
              inputClassName="text-sm"
              labelClassName="text-white font-normal "
              className="!h-[40px] transition-all shadow-sm text-[#00143D] font-normal text-base sm:text-lg w-full"
              errortxt={signupForm.formState.errors.lastName?.message}
            />
          </div>

          <div className="mt-4">
            <Input
              {...signupForm.register("email", {
                validate: EMAIL_VALIDATION,
              })}
              type="email"
              label="Email"
              inputClassName="text-sm"
              placeholder="user@email.com"
              labelClassName="text-white font-normal "
              parentClassName="my-0"
              className="!h-[40px] transition-all shadow-sm text-[#00143D] font-normal text-base sm:text-lg w-full"
              errortxt={signupForm.formState.errors.email?.message}
            />
          </div>

          <div className="mt-4">
            <Input
              {...signupForm.register("phoneNmber", {
                required: "Phone number is required",
              })}
              type="text"
              label="Phone Number"
              placeholder="Enter phone number"
              labelClassName="text-white font-normal "
              parentClassName="my-0"
              inputClassName="text-sm"
              className="!h-[40px] transition-all shadow-sm text-[#00143D] font-normal text-base sm:text-lg w-full"
              errortxt={signupForm.formState.errors.phoneNmber?.message}
            />
          </div>

          <div className="mt-4">
            <Controller
              name="password"
              control={signupForm.control}
              rules={PASSWORD_VALIDATION}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  label="New Password"
                  placeholder="Enter new password"
                  labelClassName="mb-2 font-medium !text-sm text-white"
                  parentClassName="my-0"
                  className="!h-[40px] transition-all shadow-sm w-full"
                  inputClassName="text-sm"
                  errortxt={signupForm.formState.errors.password?.message as string | undefined}
                />
              )}
            />
          </div>

          {/* Password rules panel */}
          {watchedNewPassword && !passRequirements && (
            <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
              <CreatePasswordRules
                password={watchedNewPassword}
                isComplete={(val) => setPassRequirements(val)}
              />
            </div>
          )}

          <div className="mt-4">
            <Controller
              name="confirmPassword"
              control={signupForm.control}
              rules={{ validate: validatePasswordMatch }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  labelClassName="mb-2 font-medium !text-sm text-white"
                  parentClassName="my-0"
                  className="!h-[40px] transition-all shadow-sm w-full"
                  inputClassName="text-sm"
                  errortxt={signupForm.formState.errors.confirmPassword?.message}
                />
              )}
            />
          </div>

          <div className="mt-6">
            <Button
              title={isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign up"}
              type="submit"
              className="w-full !bg-[#1121D4] !h-12 !text-base text-white"
              disabled={isPending}
            />
          </div>
        </form>

        {/* Switch to Login */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <p className="text-sm sm:text-base text-white">Already have an account?</p>
          <Button
            className="!text-[#1121D4] bg-transparent !p-1 !text-sm sm:!text-base"
            title="Login"
            onClick={() => setAuthPage(AuthPage.Login)}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupForm;