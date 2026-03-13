"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import TestOrbitLogo from "../../public/OrbitLogo.png";
import { setActiveSection } from "@/pages/features/Sectionslice";
import type { RootState } from "@/pages/store";

type Section = {
  label: string;
  route: string;
  dotClass: string; // Tailwind class for the small dot
};

const sections: Section[] = [
  { label: "Dashboard", route: "/Dashboard", dotClass: "bg-green-500" },
  { label: "Project", route: "/Project", dotClass: "bg-red-500" },
  { label: "Tasks", route: "/Tasks", dotClass: "bg-blue-500" },
  { label: "Teams", route: "/Teams", dotClass: "bg-orange-500" },
  { label: "Messages", route: "/Messages", dotClass: "bg-gray-500" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const activeSection = useSelector(
    (state: RootState) => state.section.activeSection // adjust this path to match your slice
  );

  const handleClick = (section: Section) => {
    dispatch(setActiveSection(section.label));
    router.push(section.route);
  };

  const NavButton = ({ section }: { section: Section }) => {
    const isActive = activeSection === section.label;

    return (
      <button
        type="button"
        onClick={() => handleClick(section)}
        className={`flex items-center justify-between w-full px-4 py-3 my-1 rounded-lg transition-all duration-200 ${
          isActive
      ? "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20"
      : "hover:bg-white/5"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span
            className={`w-3 h-3 rounded-full ${section.dotClass} ${
              isActive ? "ring-2 ring-offset-1 ring-pink-400" : ""
            }`}
          />
          <p
            className={`text-base text-white font-medium ${
              isActive ? "text-pink-700" : "text-gray-800"
            }`}
          >
            {section.label}
          </p>
        </div>

        <span
          className={`text-base font-bold transition-transform duration-200 ${
            isActive ? "text-pink-500" : "text-gray-400"
          }`}
        >
          ›
        </span>
      </button>
    );
  };

  return (
    <div className="px-5 bg-[#101222] overflow-y-auto h-full md:min-h-0">
      <div className="flex flex-col py-5">
        <div className="hidden md:flex justify-center items-center gap-3">
          <Image
            src={TestOrbitLogo}
            alt="Test Orbit Logo"
            height={50}
            width={50}
          />
          <p className="text-white text-xl">
            Test<span className="text-[#1121D4]">Orbit</span>
          </p>
        </div>

     

        <div className="mt-4">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1 block mb-1">
            Section
          </span>

          {sections.map((section) => (
            <NavButton key={section.route} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;