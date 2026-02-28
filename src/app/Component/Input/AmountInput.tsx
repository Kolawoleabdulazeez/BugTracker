import { useEffect, useState } from "react";
import Input from "./Input";

const removeCommas = (v: string) => v.replace(/,/g, "");
const addCommasToNumber = (value: string) => {
  if (!value) return "";
  const parts = value.split(".");
  const integerPart = parts[0] || "0";
  const intWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? `${intWithCommas}.${parts[1]}` : intWithCommas;
};

type AmountInputProps = {
  value: string;
  onChange: (val: string) => void;
  maxDecimals?: number;
  placeholder?: string;
  lefticon?: React.ReactNode;
  errortxt?: string;
  dark?: boolean;
  label: string;
  className?: string;
  labelClassName?: string;
  leftIconClassName?: string;
  inputClassName?: string;
  required?: boolean;
  disabled?: boolean;

  // ...spread other Input props as needed
};

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  maxDecimals = 2,
  placeholder = "0.00",
  lefticon,
  errortxt,
  dark,
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState<string>(
    value ? addCommasToNumber(value) : ""
  );

  useEffect(() => {
    setDisplayValue(value ? addCommasToNumber(value) : "");
  }, [value]);

  const sanitizeInput = (raw: string) => {
    let s = removeCommas(raw).replace(/[^\d.]/g, "");

    // only allow one dot
    const firstDotIndex = s.indexOf(".");
    if (firstDotIndex !== -1) {
      // remove additional dots
      s =
        s.slice(0, firstDotIndex + 1) +
        s.slice(firstDotIndex + 1).replace(/\./g, "");
    }

    // limit decimals
    if (firstDotIndex !== -1) {
      const [intPart, decPart = ""] = s.split(".");
      s = decPart
        ? `${intPart}.${decPart.slice(0, maxDecimals)}`
        : intPart + ".";
    }

    return s;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typed = e.target.value;
    const sanitized = sanitizeInput(typed);

    onChange(sanitized);

    setDisplayValue(sanitized ? addCommasToNumber(sanitized) : "");
  };

  const handleBlur = () => {
    const raw = removeCommas(displayValue);
    if (!raw) {
      setDisplayValue("");
      return;
    }

    // ensure a numeric representation
    let sanitized = sanitizeInput(raw);

    // if ends with dot (user typed "123.") keep as "123" then add decimals
    if (sanitized.endsWith(".")) sanitized = sanitized.slice(0, -1);

    // Add 0 prefix for ".5"
    if (sanitized.startsWith(".")) sanitized = "0" + sanitized;

    // Force fixed decimals
    const num = Number(sanitized || 0);
    const withFixed = num.toFixed(maxDecimals); // string like "123.50"

    // update RHF value and display
    onChange(withFixed);
    setDisplayValue(addCommasToNumber(withFixed));
  };

  const handleFocus = () => {
    // when focusing, show raw without commas to make editing easier
    const raw = removeCommas(displayValue);
    setDisplayValue(raw);
  };

  return (
    <div>
      {/* If your existing Input supports lefticon, label, etc, pass them in */}
      <Input
        {...(rest as any)}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        inputMode="decimal"
        dark={dark}
        lefticon={lefticon}
      />
      {errortxt && <div className="text-red-500 text-sm">{errortxt}</div>}
    </div>
  );
};

export default AmountInput;
