import React from "react";

type ThemeContainerProps = {
  light?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const ThemeContainer = ({
  className,
  children,
  light,
}: ThemeContainerProps) => {
  return (
    <div
      className={`bg-white ${
        light ? "!bg-gray1 dark:!bg-darkBgSecondary" : "dark:!bg-darkBgPrimary"
      } dark:text-white ${className}`}
    >
      {children}
    </div>
  );
};

export default ThemeContainer;
