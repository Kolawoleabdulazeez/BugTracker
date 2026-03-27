import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";

export const InlineDropdown = ({
  anchorRef,
  children,
  isOpen,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  isOpen: boolean;
}) => {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const recalculate = useCallback(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [anchorRef]);

  useEffect(() => {
    if (!isOpen) return;

    recalculate();

    window.addEventListener("scroll", recalculate, true);
    window.addEventListener("resize", recalculate);

    return () => {
      window.removeEventListener("scroll", recalculate, true);
      window.removeEventListener("resize", recalculate);
    };
  }, [isOpen, recalculate]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        width: coords.width,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body
  );
};