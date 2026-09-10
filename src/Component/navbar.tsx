"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  FolderKanban,
  Bug,
  FlaskConical,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

import TestOrbitLogo from "../../public/UpdatedTestOrbitLogo.png";
import { setActiveSection } from "@/features/Sectionslice";
import type { RootState } from "@/store";

type Section = {
  label: string;
  route: string;
  icon: LucideIcon;
};

type NavbarProps = {
  onClose?: () => void;
};

const sections: Section[] = [
  { label: "Dashboard", route: "/Dashboard", icon: LayoutDashboard },
  { label: "Project", route: "/Project", icon: FolderKanban },
  { label: "Bugs", route: "/Bugs", icon: Bug },
  { label: "Testcases", route: "/Testcases", icon: FlaskConical },
  { label: "Chatroom", route: "/Chatroom", icon: MessageSquare },
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
    const Icon = section.icon;

    return (
      <button
        type="button"
        onClick={() => handleClick(section)}
        className={`my-1 flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
          isActive
            ? "border border-orange-300/60 bg-orange-500/10 text-orange-900 shadow-sm dark:border-orange-500/30 dark:bg-orange-500/10 dark:shadow-black/20"
            : "hover:bg-slate-900/5 dark:hover:bg-white/5"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              isActive
                ? "bg-orange-500 text-white shadow-glow"
                : "bg-slate-900/5 text-slate-500 dark:bg-white/5 dark:text-secondary-300"
            }`}
          >
            <Icon size={16} strokeWidth={2} />
          </span>
          <p
            className={`text-base font-medium ${
              isActive
                ? "text-orange-700 dark:text-orange-400"
                : "text-slate-700 dark:text-gray-200"
            }`}
          >
            {section.label}
          </p>
        </div>

        <span
          className={`text-base font-bold transition-transform duration-200 ${
            isActive ? "text-orange-500" : "text-slate-400 dark:text-gray-500"
          }`}
        >
          ›
        </span>
      </button>
    );
  };

  return (
    <div className="glass-panel h-full overflow-y-auto px-5 text-slate-900 md:min-h-0 dark:text-white">
      <div className="flex flex-col py-5">
        <div className="hidden items-center justify-center gap-3 md:flex">
          <Image
            src={TestOrbitLogo}
            alt="Test Orbit Logo"
            height={50}
            width={50}
          />
          <p className="text-xl font-semibold text-slate-900 dark:text-white">
            Test<span className="text-orange-500">Orbit</span>
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