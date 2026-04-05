import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CreatePasswordRules from "./CreatePasswordRules";
import { AuthPage } from "..";
import Input from "@/Component/Input/Input";
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from "@/utils";
import Button from "@/Component/Button/Button";
import { Loader2 } from "lucide-react";
import FullPane from "../../../../public/fullPane.png";
import TestOrbitLogo from "../../../../public/OrbitLogo.png";
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
    <div
      className="min-h-screen bg-[#101222] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${FullPane.src})` }}
    >
      <div className="flex min-h-screen">
        {/* Left pane */}
        <div className="relative hidden md:flex md:flex-1 overflow-hidden bg-cover bg-right bg-no-repeat">
          <div className="absolute inset-0 bg-[#101222]/40" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 lg:p-10">
            <div className="flex w-fit items-center gap-3">
              {/* <Image
                src={TestOrbitLogo}
                alt="Test Orbit Logo"
                height={44}
                width={44}
              /> */}
              <p className="text-xl text-white">
                Test<span className="text-[#1121D4]">Orbit</span>
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold leading-tight text-white lg:text-5xl">
                Launch better
                <br />
                software with
                <br />
                TestOrbit.
              </p>

              <p className="mt-5 text-base text-[#94A3B8] lg:text-xl">
                Join the mission to perfect every release.
                <br />
                The ultimate collaboration platform for modern QA teams.
              </p>
            </div>

            <div className="flex items-center gap-5">
              <Image
                src={EngineersPG}
                alt="Trust image"
                height={100}
                width={100}
                className="h-auto w-[90px] lg:w-[100px]"
              />
              <p className="text-sm text-[#94A3B8] lg:text-base">
                Trusted by 500+ engineering teams
              </p>
            </div>
          </div>
        </div>

        {/* Right pane */}
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-6 flex items-center justify-center gap-3 md:hidden">
              {/* <Image
                src={TestOrbitLogo}
                alt="Test Orbit Logo"
                height={36}
                width={36}
              /> */}
              <p className="text-lg text-white">
                Test<span className="text-[#1121D4]">Orbit</span>
              </p>
            </div>

            <div className="w-full rounded-2xl border border-white/10 bg-[#1E293B]/40 p-5 backdrop-blur-md sm:p-6">
              <div className="text-center">
                <p className="text-lg font-bold text-white sm:text-xl">
                  Create Account
                </p>
                <p className="mt-1 text-sm text-gray-100 sm:text-base">
                  Sign up to start using TestOrbit
                </p>
              </div>

              <form
                onSubmit={signupForm.handleSubmit(onSubmitSignUpForm)}
                className="mt-6 w-full"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    {...signupForm.register("firstName", {
                      required: "First name is required",
                    })}
                    type="text"
                    label="First Name"
                    placeholder="Enter first name"
                    labelClassName="text-white font-normal"
                    parentClassName="my-0"
                    inputClassName="text-sm text-white"
                    className="!h-12 transition-all shadow-sm text-[#00143D] font-normal text-base w-full"
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
                    inputClassName="text-sm text-white"
                    labelClassName="text-white font-normal"
                    className="!h-12 transition-all shadow-sm text-[#00143D] font-normal text-base w-full"
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
                    inputClassName="text-sm text-white"
                    placeholder="user@email.com"
                    labelClassName="text-white font-normal"
                    parentClassName="my-0"
                    className="!h-12 transition-all shadow-sm text-[#00143D] font-normal text-base w-full"
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
                    labelClassName="text-white font-normal"
                    parentClassName="my-0 "
                    inputClassName="text-sm text-white border border-red-500"
                    className="!h-12 transition-all shadow-sm text-[#00143D] font-normal text-base w-full"
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
                        className="!h-12 transition-all shadow-sm w-full"
                        inputClassName="text-sm text-white"
                        errortxt={
                          signupForm.formState.errors.password?.message as
                            | string
                            | undefined
                        }
                      />
                    )}
                  />
                </div>

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
                        className="!h-12 transition-all shadow-sm w-full"
                        inputClassName="text-sm text-white"
                        errortxt={
                          signupForm.formState.errors.confirmPassword?.message
                        }
                      />
                    )}
                  />
                </div>

                <div className="mt-6">
                  <Button
                    title={
                      isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Sign up"
                      )
                    }
                    type="submit"
                    className="w-full !bg-[#1121D4] !h-12 !text-base text-white"
                    disabled={isPending}
                  />
                </div>
              </form>

              <div className="mt-4 flex items-center justify-center gap-2">
                <p className="text-sm text-white sm:text-base">
                  Already have an account?
                </p>
                <Button
                  className="!text-[#1121D4] bg-transparent !p-1 !text-sm sm:!text-base"
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