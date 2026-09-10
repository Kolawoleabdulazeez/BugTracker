import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CreatePasswordRules from "./CreatePasswordRules";
import { AuthPage } from "..";
import Input from "@/Component/Input/Input";
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from "@/utils";
import Button from "@/Component/Button/Button";
import { Loader2 } from "lucide-react";
import FullPane from "../../../../public/signupConcentricGlow.png";
import TestOrbitLogo from "../../../../public/UpdatedTestOrbitLogo.png";
import Image from "next/image";
import EngineersPG from "../../../../public/engineers.png";
import { useSignup } from "@/services/auth/useAuths";

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
    <div className="min-h-screen bg-[#F7F5F2] font-sans">
      <div className="flex min-h-screen">
        {/* =====================================================
            LEFT SIDE — BRAND PANEL
        ====================================================== */}
        <div className="relative hidden overflow-hidden md:flex md:w-1/2 lg:flex-1">
          <div className="absolute inset-0 bg-[#F7F5F2]" />

          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.28]"
            style={{ backgroundImage: `url(${FullPane.src})` }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5F2]/95 via-[#F7F5F2]/65 to-[#F7F5F2]/30" />

          {/* Additional soft orange glow */}
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />

          {/* Content */}
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 lg:p-10 xl:p-12">
            {/* Logo */}
            <div className="flex w-fit items-center gap-3">
              <Image
                src={TestOrbitLogo}
                alt="TestOrbit Logo"
                height={42}
                width={42}
                className="object-contain"
              />

              <p className="text-xl font-medium tracking-tight text-secondary-800">
                Test<span className="text-orange-500">Orbit</span>
              </p>
            </div>

            {/* Main message */}
            <div className="max-w-xl">
              <p className="text-4xl font-bold leading-[1.08] tracking-tight text-secondary-800 lg:text-5xl xl:text-6xl">
                Launch better
                <br />
                software with
                <br />
                <span className="text-orange-500">TestOrbit.</span>
              </p>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-secondary-500 lg:text-lg">
                Join the mission to perfect every release.
                <br />
                The ultimate collaboration platform for modern QA teams.
              </p>

              {/* Small brand accent */}
              <div className="mt-7 flex items-center gap-3">
                <div className="h-1 w-10 rounded-full bg-orange-500" />
                <div className="h-1 w-2 rounded-full bg-orange-300" />
                <div className="h-1 w-2 rounded-full bg-orange-200" />
              </div>
            </div>

            {/* Trust section */}
            <div className="flex items-center gap-4">
              <Image
                src={EngineersPG}
                alt="Trusted engineering teams"
                height={100}
                width={100}
                className="h-auto w-[85px] lg:w-[95px]"
              />

              <div>
                <p className="text-sm font-medium text-secondary-600 lg:text-base">
                  Trusted by 500+ engineering teams
                </p>
                <p className="mt-0.5 text-xs text-secondary-400">
                  Building, testing &amp; shipping better software
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE — SIGN UP FORM
        ====================================================== */}
        <div className="flex min-h-screen flex-1 items-center justify-center bg-[#F7F5F2] px-4 py-8 sm:px-6 lg:flex-[0.85] lg:px-10 xl:px-16">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-7 flex items-center justify-center gap-3 md:hidden">
              <Image
                src={TestOrbitLogo}
                alt="TestOrbit Logo"
                height={38}
                width={38}
                className="object-contain"
              />

              <p className="text-xl font-semibold text-secondary-800">
                Test<span className="text-orange-500">Orbit</span>
              </p>
            </div>

            {/* Form Card */}
            <div className="glass-card w-full rounded-2xl border border-secondary-200/70 p-5 shadow-[0_12px_40px_rgba(17,23,42,0.08)] sm:p-7">
              {/* Form heading */}
              <div className="text-center">
                <p className="text-xl font-semibold tracking-tight text-secondary-800">
                  Create Account
                </p>
                <p className="mt-1 text-sm text-secondary-500 sm:text-base">
                  Sign up to start using TestOrbit
                </p>
              </div>

              {/* Form */}
              <form onSubmit={signupForm.handleSubmit(onSubmitSignUpForm)} className="mt-6 w-full">
                {/* First + Last Name */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    {...signupForm.register("firstName", {
                      required: "First name is required",
                    })}
                    type="text"
                    label="First Name"
                    placeholder="Enter first name"
                    labelClassName="!mb-2 !text-sm !font-medium !text-secondary-800"
                    parentClassName="my-0"
                    inputClassName="!bg-white/80 !text-secondary-800 placeholder:!text-secondary-300 focus:!border-orange-500"
                    className="!h-12 w-full rounded-xl border border-secondary-200 font-normal shadow-sm transition-all hover:border-orange-300"
                    errortxt={signupForm.formState.errors.firstName?.message}
                  />

                  <Input
                    {...signupForm.register("lastName", {
                      required: "Last name is required",
                    })}
                    type="text"
                    label="Last Name"
                    placeholder="Enter last name"
                    labelClassName="!mb-2 !text-sm !font-medium !text-secondary-800"
                    parentClassName="my-0"
                    inputClassName="!bg-white/80 !text-secondary-800 placeholder:!text-secondary-300 focus:!border-orange-500"
                    className="!h-12 w-full rounded-xl border border-secondary-200 font-normal shadow-sm transition-all hover:border-orange-300"
                    errortxt={signupForm.formState.errors.lastName?.message}
                  />
                </div>

                {/* Email */}
                <div className="mt-4">
                  <Input
                    {...signupForm.register("email", {
                      validate: EMAIL_VALIDATION,
                    })}
                    type="email"
                    label="Email"
                    placeholder="user@email.com"
                    labelClassName="!mb-2 !text-sm !font-medium !text-secondary-800"
                    parentClassName="my-0"
                    inputClassName="!bg-white/80 !text-secondary-800 placeholder:!text-secondary-300 focus:!border-orange-500"
                    className="!h-12 w-full rounded-xl border border-secondary-200 font-normal shadow-sm transition-all hover:border-orange-300"
                    errortxt={signupForm.formState.errors.email?.message}
                  />
                </div>

                {/* Phone */}
                <div className="mt-4">
                  <Input
                    {...signupForm.register("phoneNmber", {
                      required: "Phone number is required",
                    })}
                    type="text"
                    label="Phone Number"
                    placeholder="Enter phone number"
                    labelClassName="!mb-2 !text-sm !font-medium !text-secondary-800"
                    parentClassName="my-0"
                    inputClassName="!bg-white/80 !text-secondary-800 placeholder:!text-secondary-300 focus:!border-orange-500"
                    className="!h-12 w-full rounded-xl border border-secondary-200 font-normal shadow-sm transition-all hover:border-orange-300"
                    errortxt={signupForm.formState.errors.phoneNmber?.message}
                  />
                </div>

                {/* New Password */}
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
                        labelClassName="!mb-2 !text-sm !font-medium !text-secondary-800"
                        parentClassName="my-0"
                        inputClassName="!bg-white/80 !text-secondary-800 placeholder:!text-secondary-300 focus:!border-orange-500"
                        className="!h-12 w-full rounded-xl border border-secondary-200 font-normal shadow-sm transition-all hover:border-orange-300"
                        errortxt={
                          signupForm.formState.errors.password?.message as
                            | string
                            | undefined
                        }
                      />
                    )}
                  />
                </div>

                {/* Password Rules */}
                {watchedNewPassword && !passRequirements && (
                  <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/70 p-3">
                    <CreatePasswordRules
                      password={watchedNewPassword}
                      isComplete={(val) => setPassRequirements(val)}
                    />
                  </div>
                )}

                {/* Confirm Password */}
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
                        labelClassName="!mb-2 !text-sm !font-medium !text-secondary-800"
                        parentClassName="my-0"
                        inputClassName="!bg-white/80 !text-secondary-800 placeholder:!text-secondary-300 focus:!border-orange-500"
                        className="!h-12 w-full rounded-xl border border-secondary-200 font-normal shadow-sm transition-all hover:border-orange-300"
                        errortxt={signupForm.formState.errors.confirmPassword?.message}
                      />
                    )}
                  />
                </div>

                {/* Submit */}
                <div className="mt-6">
                  <Button
                    title={
                      isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Create Account"
                      )
                    }
                    type="submit"
                    disabled={isPending}
                    className="!h-12 w-full !rounded-xl !border-0 !bg-gradient-to-r !from-orange-500 !to-orange-600 !text-base !font-semibold !text-white shadow-[0_8px_20px_rgba(237,98,20,0.22)] transition-all duration-200 hover:!from-orange-600 hover:!to-orange-700 hover:-translate-y-[1px] hover:shadow-[0_10px_25px_rgba(237,98,20,0.28)]"
                  />
                </div>
              </form>

              {/* Login */}
              <div className="mt-5 flex items-center justify-center gap-1">
                <p className="text-sm text-secondary-500 sm:text-base">
                  Already have an account?
                </p>

                <Button
                  className="!bg-transparent !p-1 !text-sm !font-semibold !text-orange-500 hover:!text-orange-600 sm:!text-base"
                  title="Login"
                  onClick={() => setAuthPage(AuthPage.Login)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;