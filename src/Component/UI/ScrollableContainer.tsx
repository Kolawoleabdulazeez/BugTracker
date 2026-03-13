import React, { useEffect, useRef, useState, ReactNode } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface ScrollableContainerProps {
  children: ReactNode;
  className?: string;
  arrowClassName?: string;
}

const ScrollableContainer = ({
  children,
  className = "",
  arrowClassName = "",
}: ScrollableContainerProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const scrollToStart = () => {
    scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const scrollToEnd = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div className="relative flex items-center w-full">
      {showLeft && (
        <button
          onClick={scrollToStart}
          aria-label="Scroll left"
          className={`absolute left-0 top-1/2 -translate-y-1/2 p-1 bg-white dark:bg-gray-800 rounded-md shadow-sm md:hidden z-10 ${arrowClassName}`}
        >
          <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-white" />
        </button>
      )}

      <div
        ref={scrollRef}
        className={`flex gap-2 overflow-x-auto no-scroll scroll-smooth hide-scrollbar w-full py-2 rounded-md ${className}`}
      >
        {children}
      </div>

      {showRight && (
        <button
          onClick={scrollToEnd}
          aria-label="Scroll right"
          className={`absolute right-0 top-1/2 -translate-y-1/2 p-1 bg-white dark:bg-gray-800 rounded-md shadow-sm md:hidden z-10 ${arrowClassName}`}
        >
          <ChevronRight className="w-4 h-4 text-gray-700 dark:text-white" />
        </button>
      )}
    </div>
  );
};

export default ScrollableContainer;
