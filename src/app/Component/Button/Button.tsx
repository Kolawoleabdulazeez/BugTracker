import React from "react";
import clsx from "clsx";

type ButtonProps = {
  title?: string | React.ReactElement;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  iconClassName?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  title,
  icon,
  endIcon,
  type = "button",
  disabled = false,
  style,
  className,
  iconClassName,
  onClick,
}) => {
  const baseClasses = clsx(
    "min-h-[2.5rem] px-3 py-2 rounded-lg font-bold text-sm transition-all duration-300 ease-in flex items-center whitespace-nowrap text-[12px]",
    "bg-primary text-white dark:darkBgSecondary",
    {
      "opacity-30 cursor-not-allowed": disabled,
      "cursor-pointer": !disabled,
      "justify-between": endIcon,
      "justify-center": !endIcon,
    },
    className
  );

  return (
    <button
      type={type}
      style={style}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={baseClasses}
    >
      {icon && (
        <span className={`mr-2 flex items-center ${iconClassName}`}>
          {icon}
        </span>
      )}
      {typeof title === "string" ? <span>{title}</span> : title}
      {endIcon && <span className="ml-2 flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
