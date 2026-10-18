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

  if (authPage === AuthPage.SignUp) {
    return <SignupForm setAuthPage={setAuthPage} />;
  }

  return (
    // Exactly one viewport tall. overflow-y-auto is only a safety net for very short screens.
    <main
      className="h-dvh w-full overflow-y-auto bg-[#101222] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${AbstractLayer.src})` }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col items-center justify-center gap-3 px-4 py-4 md:px-8">
        {/* Brand: logo and name on one row */}
        <div className="flex items-center gap-2">
          <Image
            src={TestOrbitLogo}
            alt="Test Orbit Logo"
            height={48}
            width={42}
            className="h-12 w-auto"
            priority
          />
          <p className="text-xl font-semibold text-slate-900">
            Test<span className="text-3xl text-amber-600">Orbit</span>
          </p>
        </div>

        {/* Copy */}
        <div className="text-center">
          <p className="text-2xl font-semibold text-slate-900">Keep quality in orbit.</p>
          <p className="mt-1 text-xs text-slate-900">
            Your mission control for QA and testing excellence.
          </p>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-md">
          <LoginForm setAuthPage={setAuthPage} />
        </div>

        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} TestOrbit. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default LandingPage;