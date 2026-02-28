"use client";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setActiveSection } from "../features/Sectionslice";

const sections = [
  { label: "Android",         color: "bg-green-500"  },
  { label: "IOS",             color: "bg-orange-500" },
  { label: "Website",         color: "bg-red-500"    },
  { label: "Suggestions",     color: "bg-blue-500"   },
  { label: "Client Feedback", color: "bg-blue-950"   },
];

const testCases = [
  { label: "Mobile App",      color: "bg-green-500"  },
  { label: "Web Dashboard",   color: "bg-red-500"    },
  { label: "User Onboarding", color: "bg-blue-500"   },
  { label: "Super Admin",     color: "bg-orange-500" },
  { label: "Control Panel",   color: "bg-gray-500"   },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const activeSection = useSelector((state: RootState) => state.section.activeSection);

  const handleClick = (label: string) => {
    dispatch(setActiveSection(activeSection === label ? null : label));
  };

  const NavButton = ({ label, color }: { label: string; color: string }) => {
    const isActive = activeSection === label;
    return (
      <button
        onClick={() => handleClick(label)}
        className={`flex items-center justify-between w-full px-4 py-3 my-1 rounded-lg transition-all duration-200 ${
          isActive ? "bg-pink-100 ring-2 ring-pink-300 shadow-sm" : "hover:bg-pink-50"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className={`w-3 h-3 rounded-full ${color} ${isActive ? "ring-2 ring-offset-1 ring-pink-400" : ""}`} />
          <p className={`text-base font-medium ${isActive ? "text-pink-700" : "text-gray-800"}`}>{label}</p>
        </div>
        <span className={`text-base font-bold transition-transform duration-200 ${isActive ? "text-pink-500" : "text-gray-400"}`}>›</span>
      </button>
    );
  };

  return (
    <div className="px-5 bg-amber-50  overflow-y-auto h-full md:min-h-0">
      <div className="flex flex-col text-black py-5">
        <div className="hidden md:block">
          <h1 className="text-3xl font-bold">Epic Bug Tracker</h1>
        </div>

        <div className="flex mx-auto items-center my-4">
          <Image src="/userImage.jpg" alt="user image" height={60} width={60} className="rounded-[15px]" />
          <span className="flex flex-col mx-4">
            <span className="font-bold">Drey John</span>
            <span className="text-sm text-gray-500">QA Lead</span>
          </span>
        </div>

        <div className="mt-4">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1 block mb-1">Section</span>
          {sections.map((s) => <NavButton key={s.label} {...s} />)}
        </div>

        <div className="mt-6">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1 block mb-1">Test Cases</span>
          {testCases.map((t) => <NavButton key={t.label} {...t} />)}
        </div>
      </div>
    </div>
  );
};

export default Navbar;