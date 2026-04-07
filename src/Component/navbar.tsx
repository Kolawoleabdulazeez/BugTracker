"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import TestOrbitLogo from "../../public/OrbitLogo.png";
import { setActiveSection } from "@/features/Sectionslice";
import type { RootState } from "@/store";

type Section = {
  label: string;
  route: string;
  dotClass: string;
};

type NavbarProps = {
  onClose?: () => void;
};

const sections: Section[] = [
  { label: "Dashboard", route: "/Dashboard", dotClass: "bg-green-500" },
  { label: "Project", route: "/Project", dotClass: "bg-red-500" },
  { label: "Bugs", route: "/Bugs", dotClass: "bg-blue-500" },
  { label: "Teams", route: "/Teams", dotClass: "bg-orange-500" },
  { label: "Chatroom", route: "/Chatroom", dotClass: "bg-gray-500" },
];

const Navbar = ({ onClose }: NavbarProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const activeSection = useSelector(
    (state: RootState) => state.section.activeSection
  );

  const handleClick = (section: Section) => {
    dispatch(setActiveSection(section.label));
    router.push(section.route);
    onClose?.();
  };

  const NavButton = ({ section }: { section: Section }) => {
    const isActive = activeSection === section.label;

    return (
      <button
        type="button"
        onClick={() => handleClick(section)}
        className={`my-1 flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
          isActive
            ? "border border-indigo-200/80 bg-indigo-50 text-indigo-900 shadow-sm dark:border-white/20 dark:bg-white/10 dark:shadow-black/20"
            : "hover:bg-slate-200/60 dark:hover:bg-white/5"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span
            className={`h-3 w-3 rounded-full ${section.dotClass} ${
              isActive
                ? "ring-2 ring-pink-400 ring-offset-2 ring-offset-slate-50 dark:ring-offset-[#101222]"
                : ""
            }`}
          />
          <p
            className={`text-base font-medium ${
              isActive
                ? "text-indigo-800 dark:text-pink-400"
                : "text-slate-700 dark:text-gray-200"
            }`}
          >
            {section.label}
          </p>
        </div>

        <span
          className={`text-base font-bold transition-transform duration-200 ${
            isActive
              ? "text-pink-500"
              : "text-slate-400 dark:text-gray-500"
          }`}
        >
          ›
        </span>
      </button>
    );
  };

  return (
    <div className="h-full overflow-y-auto border-r border-slate-200/80 bg-slate-50 px-5 text-slate-900 md:min-h-0 dark:border-white/10 dark:bg-[#101222] dark:text-white">
      <div className="flex flex-col py-5">
        <div className="hidden items-center justify-center gap-3 md:flex">
          <Image
            src={TestOrbitLogo}
            alt="Test Orbit Logo"
            height={50}
            width={50}
          />
          <p className="text-xl font-semibold text-slate-900 dark:text-white">
            Test<span className="text-[#1121D4]">Orbit</span>
          </p>
        </div>

        <div className="mt-6">
          <span className="mb-2 block px-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">
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