import React, { useRef } from "react";

const DateInput = (props: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="relative inline-block w-full"
      onClick={() => inputRef.current?.showPicker?.()}
    >
      <input
        ref={inputRef}
        type="date"
        {...props}
        className={`text-black ${
          props.dark ? "dark:!text-white dark:focus:!border-white " : ""
        } bg-inherit w-full pl-[0.8rem] h-full focus:border-primary outline-0 border-0 placeholder:text-color4 placeholder:leading-6 font-normal placeholder:text-[0.8rem] ${
          props.inputClassName
        }`}
        name={props.name || ""}
        value={props.value}
        onChange={props.handleChange}
        required={props.required || false}
      />

      <label
        htmlFor="date"
        className={`absolute ${
          props.value ? "hidden" : "block lg:hidden"
        } left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all opacity-100 peer-focus:opacity-0 peer-valid:opacity-0 ${
          props.dark ? "dark:text-white" : ""
        }`}
      >
        {props.value ? props.value : "dd/mm/yyyy"}
      </label>
    </div>
  );
};

export default DateInput;
