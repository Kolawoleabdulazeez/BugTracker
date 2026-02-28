import React from "react";

interface TextProps {
  variant?: "span" | "p" | "h1"; // make it stricter
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const Text = ({
  variant = "h1",
  className = "",
  style,
  children,
}: TextProps) => {
  return variant === "span" ? (
    <span
      className={`dark:text-white text-darkPrimary ${className}`}
      style={style}
    >
      {children}
    </span>
  ) : variant === "p" ? (
    <p
      className={`dark:text-white text-darkPrimary ${className}`}
      style={style}
    >
      {children}
    </p>
  ) : (
    <h1
      className={`dark:text-white text-darkPrimary ${className}`}
      style={style}
    >
      {children}
    </h1>
  );
};

export default Text;
