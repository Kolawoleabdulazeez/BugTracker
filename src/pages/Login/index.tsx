
import React, { useState } from "react";
import Image from "next/image";
import TestOrbitLogo from "../../../public/OrbitLogo.png";
import SignupForm from "./Components/SignupForm";
import LoginForm from "./Components/LoginForm";
import AbstractLayer from "../../../public/AbstractOrbital.png";
import Globe from "../../../public/BrandingV.png";

export const enum AuthPage {
  Login = "Login",
  SignUp = "SignUp",
}

const LandingPage = () => {
  const [authPage, setAuthPage] = useState<AuthPage>(AuthPage.Login);

  return (
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
            <Image src={TestOrbitLogo} alt="Test Orbit Logo" height={44} width={44} />
            <p className="text-white text-xl">
              Test<span className="text-[#1121D4]">Orbit</span>
            </p>
          </div>

          {/* Copy */}
          <div className="mt-3 text-center">
            <p className="text-2xl md:text-2xl font-semibold text-white">
              Keep quality in orbit.
            </p>
            <p className="mt-1 text-gray-200 text-xs">
              Your mission control for QA and testing excellence.
            </p>
          </div>

          {/* Main responsive section */}
          <div className="mt-8 flex flex-col justify-center w-full  items-center gap-2 ">
            {/* Auth card column */}
            <div className="flex w-full justify-center ">
              <div className="w-full max-w-md">
                {authPage === AuthPage.SignUp ? (
                  <SignupForm setAuthPage={setAuthPage} />
                ) : (
                  <LoginForm setAuthPage={setAuthPage} />
                )}
              </div>
            </div>

            {/* Branding image column */}
            <div className="flex w-full justify-center ">
              <div className="relative w-[160px] sm:w-[120px] md:w-[160px] lg:w-[220px] ">
                <Image
                  src={Globe}
                  alt="Branding Globe"
                  className="h-auto w-full"
                  priority
                />
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
  );
};

export default LandingPage;




// import React, { useState } from 'react'
// import backgroundLayer from "../../../public/backgroundLayer.png"
// import backgroundImage from "../../../public/backgroundImage.png"
// import Image from 'next/image';
// import TestOrbitLogo from "../../../public/TestOrbit.png"
// import LoginForm from './Components/LoginForm';
// import SignupForm from './Components/SignupForm';
// import BackGroundLayer from "../../../public/layerBg.jpg"

// export const enum AuthPage  {
//   Login = "Login",
//   SignUp = "SignUp"
// }


// const LandingPage = () => {

//   const [authPage, setAuthPage] = useState<AuthPage>(AuthPage.Login)


//   return (
//     <div className='flex flex-col md:flex-row min-h-screen  w-full bg-[#101222]'>
//       <div className='w-full lg:basis-2/5  flex flex-col items-center justify-center px-6 py-10 md:px-0'
      
//       >

//       <div className='flex gap-2 items-center justify-center mb-8'>
        
//       <Image
//       src={TestOrbitLogo}
//       alt='Test Orbit Logo'
//       height={50}
//       width={50}
//     className=""  
//     />

//       <p className='font-bold text-2xl'>Test<span className='text-[#e7305a]'>Orbit</span> </p>
//       </div>

//          {
//         authPage === AuthPage.SignUp?
//         <SignupForm setAuthPage = {setAuthPage}/>: <LoginForm setAuthPage = {setAuthPage}/>
//       }

      
//       </div>
//     <div
//       className="hidden lg:flex md:basis-3/5 bg-cover bg-center flex-col justify-end py-20"
//       style={{ backgroundImage: `url(${backgroundLayer.src})` }}
//     >

//       <Image
//         src={backgroundImage}
//         alt='background image '
//       />
      
//     </div>
    
//   </div>
//   )
// }

// export default LandingPage
