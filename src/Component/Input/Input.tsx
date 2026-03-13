import React, { useState, type JSX } from "react";
import lockSvg from "../../../public/lock.svg";
import eyeSvg from "../../../public/eye.svg";
import crosseyeSvg from "../../../public/crosseye.svg";
import DateInput from "./DateInput";
import Image from "next/image";

export type InputProps = {
  lefticon?: JSX.Element;
  righticon?: JSX.Element;
  leftIconClassName?: string;
  rightIconClassName?: string;
  labelClassName?: string;
  errortxt?: string;
  checkboxClassName?: string;
  infotxt?: string;
  successtxt?: string;
  label?: string;
  textarea?: boolean;
  lefticonClick?: () => void;
  righticonClick?: () => void;
  inputClassName?: React.HTMLAttributes<HTMLInputElement>["className"];
  parentClassName?: string;
  numOnly?: boolean;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function Input(props: InputProps): JSX.Element {
  const { inputClassName, parentClassName, label, errortxt, infotxt, successtxt, lefticon, righticon, leftIconClassName, rightIconClassName, textarea, lefticonClick, righticonClick, numOnly, labelClassName, ...inputProps } = props;
  const [showpass, setShowPass] = useState(false);
  const returnLeftIcon = () => {
    if (props.type == "password") {
      return (
        <button
          className="outline-none ml-2"
          type="button"
          onClick={props.lefticonClick}
        >
          <Image
            src={lockSvg}
            className="object-cover object-center w-5"
            alt="password icon"
          />
        </button>
      );
    }
    if (props.lefticon) {
      return (
        <button
          className={`h-full outline-none ${props.leftIconClassName}`}
          type="button"
          onClick={props.lefticonClick}
        >
          {props.lefticon}
        </button>
      );
    }
    return null;
  };

  const returnRightIcon = () => {
    if (props.type == "password") {
      return (
        <button
          className="outline-none ml-4 mr-4"
          onClick={() => setShowPass((val) => !val)}
          type="button"
        >
          {showpass ? (
            <Image
              src={crosseyeSvg}
              className="object-fill object-center w-6"
              alt="password eye closed"
            />
          ) : (
            <Image
              src={eyeSvg}
              className="object-fill object-center w-6"
              alt="password eye"
            />
          )}
        </button>
      );
    }
    if (props.righticon) {
      return (
        <button
          className="h-full outline-none ml-4 mr-4"
          onClick={props.righticonClick}
          type="button"
        >
          {props.righticon}
        </button>
      );
    }
    return null;
  };

  const returnInputType = () =>
    props.type == "password" ? (showpass ? "text" : "password") : props.type;

  const returnInputStyle = () => {
    if (props.errortxt)
      return "border-2 border-red-500 hover:border-red-500 focus-within:border-red-500";
    if (props.successtxt)
      return "border-2 border-color2 hover:border-color2 focus-within:border-color2";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.numOnly) {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
      if (props.type === "tel") {
        e.target.value = e.target.value.replace(/^-/, "");
      }
    }
    if (props.maxLength && e.target.value.length > props.maxLength) {
      e.target.value = e.target.value.slice(0, props.maxLength);
    }
    props.onChange && props.onChange(e);
  };

  const handleChangeTextArea = (e: any) => {
    if (props.numOnly) {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    }
    if (props.maxLength && e.target.value.length > props.maxLength) {
      e.target.value = e.target.value.slice(0, props.maxLength);
    }
    props.onChange && props.onChange(e);
  };

  const className = `border border-lightgray flex w-full ${
    props.textarea ? "h-[120px] pt-2" : "h-[50.23px]"
  } overflow-hidden items-center bg-white transition-all ${props.className || ""} ${returnInputStyle()}`.trim();

  const renderStatusText = () => {
    if (props.errortxt) {
      return (
        <span className="font-inter text-xs font-bold leading-4 text-red-500">
          {props.errortxt}
        </span>
      );
    }
  };
  if (props.type === "checkbox") {
    return (
      <div className={props.parentClassName}>
        <div className="flex items-center gap-2">
          <div className="relative">
            {" "}
            {/* Add relative container */}
            <input
              {...inputProps}
              type="checkbox"
              className={`peer appearance-none w-4 h-4 bg-white border-2 border-primary rounded cursor-pointer 
              checked:bg-primary checked:border-primary
              focus:ring-2 focus:ring-primary focus:ring-opacity-50
              hover:border-blue-600 transition-all duration-200
              ${props.checkboxClassName || ""}`}
              onChange={handleChange}
              id={props.id}
              checked={props.checked}
            />
            <svg
              className="absolute top-0.5 left-0.5 w-4 h-4 font-bold text-primary opacity-0 peer-checked:opacity-100 pointer-events-none"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {props.label && (
            <label
              htmlFor={props.id}
              className={`text-labelBlue ${props.labelClassName} text-[0.85rem] xss:text-[1rem] font-bold cursor-pointer`}
            >
              {props.label}
              {props.required && <span className="text-errorRed mx-1">*</span>}
            </label>
          )}
        </div>
        {renderStatusText()}
      </div>
    );
  }

  return (
    <div className={props.parentClassName}>
      {props.label && (
        <p
          className={`text-darkPrimary ${props.labelClassName} text-[0.85rem] xss:text-[1rem] !text-sm font-bold`}
        >
          {props.label}
          {props.required && <span className="text-errorRed mx-1">*</span>}
        </p>
      )}
      <div
        className={` rounded-lg focus-within:border-2 focus-within:border-primary transition-border duration-300 ${className}`}
      >
        {props.lefticon && returnLeftIcon()}
        {props.textarea ? (
          <textarea
            className={`text-black bg-inherit w-full ${
              props.lefticon ? "ml-[0.8rem]" : "pl-[0.8rem]"
            } h-full outline-0 border-0 placeholder:text-color4 placeholder:leading-6  font-normal relative placeholder:text-[0.8rem]  sm1:placeholder:text-[0.95rem] placeholder:font-normal  ${
              props.inputClassName
            }`}
            id={props.id}
            placeholder={props.placeholder || ""}
            name={props.name || ""}
            disabled={props.disabled}
            defaultValue={props.defaultValue}
            minLength={props.minLength}
            readOnly={props.readOnly}
            maxLength={props.maxLength}
            value={props.value}
            onChange={handleChangeTextArea}
            required={props.required || false}
            rows={6}
          >
            {props.value}
          </textarea>
        ) : (
          <>
            {props.type == "date" ? (
              <DateInput {...props} handleChange={handleChange} />
            ) : (
              <input
                {...inputProps}
                className={`text-black bg-transparent w-full pl-[0.8rem] h-full focus:border-primary outline-0 border-0 placeholder:text-color4 placeholder:leading-6 font-normal placeholder:text-[0.8rem]   ${
                  props.inputClassName
                }`}
                placeholder={props.placeholder || ""}
                type={returnInputType()}
                name={props.name || ""}
                value={props.value}
                onChange={handleChange}
                required={props.required || false}
                maxLength={props.maxLength ?? 50}
              />
            )}
          </>
        )}
        {returnRightIcon()}
      </div>
      {renderStatusText()}
    </div>
  );
}
