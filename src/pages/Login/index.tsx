import React, { useState } from "react";
import Image from "next/image";
import TestOrbitLogo from "../../../public/UpdatedTestOrbitLogo.png";
import SignupForm from "./Components/SignupForm";
import LoginForm from "./Components/LoginForm";
import AbstractLayer from "../../../public/ConcentricGlow.png";

export const enum AuthPage {
  Login = "Login",
  SignUp = "SignUp",
}

const LandingPage = () => {
  const [authPage, setAuthPage] = useState<AuthPage>(AuthPage.Login);

  return (
    <div>
      {authPage === AuthPage.Login ? (
        <div className="min-h-screen w-full bg-[#101222]">
          {/* Background */}
          <div
            className="min-h-screen w-full bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${AbstractLayer.src})` }}
          >
            {/* Page container (desktop-first) */}
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-10 md:px-8">
              {/* Brand */}
              <div className="flex items-center justify-center gap-3">
                <Image src={TestOrbitLogo} alt="Test Orbit Logo" height={70} width={60} />
         
              </div>

                     <p className="font-semibold text-slate-900 text-xl">
                  Test<span className="text-amber-600 text-3xl">Orbit</span>
                </p>

              {/* Copy */}
              <div className="mt-3 text-center">
                <p className="text-2xl md:text-2xl font-semibold  text-slate-900 ">
                  Keep quality in orbit.
                </p>
                <p className="mt-1  text-slate-900 text-xs">
                  Your mission control for QA and testing excellence.
                </p>
              </div>

              {/* Main responsive section */}
              <div className="mt-8 flex flex-col justify-center w-full items-center gap-2">
                {/* Auth card column */}
                <div className="flex w-full justify-center">
                  <div className="w-full max-w-md">
                    <LoginForm setAuthPage={setAuthPage} />
                  </div>
                </div>

              </div>

              {/* Optional: footer space */}
              <div className="mt-10 text-center text-xs text-gray-400">
                © {new Date().getFullYear()} TestOrbit. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      ) : (
          <SignupForm setAuthPage={setAuthPage} />
      )}
    </div>
  );
};

export default LandingPage;