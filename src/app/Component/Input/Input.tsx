import React, { JSX, useState } from "react";
import lockSvg from "../../../../public/lock.svg";
import eyeSvg from "../../../../public/eye.svg";
import crosseyeSvg from "../../../../public/crosseye.svg";
import Image from "next/image";
import DateInput from "./DateInput";
import Text from "../UI/Text";
import ErrorText from "../UI/ErrorText";

export type InputProps = {
  lefticon?: JSX.Element;
  righticon?: JSX.Element;
  leftIconClassName?: string;
  rightIconClassName?: string;
  labelClassName?: string;
  errortxt?: string;
  infotxt?: string;
  successtxt?: string;
  label?: string;
  textarea?: boolean;
  dark?: boolean;
  hidePasswordIcon?: boolean;
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
  const [showpass, setShowPass] = useState(false);
  const returnLeftIcon = () => {
    if (props.type == "password" && !props.hidePasswordIcon) {
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

  const className = `border border-lightgray dark:border-none flex w-full ${
    props.textarea ? "h-[100px] pt-2" : "h-[50.23px]"
  } overflow-hidden items-center transition-all ${
    props.className || ""
  } ${returnInputStyle()}`.trim();

  const renderStatusText = () => {
    if (props.errortxt) {
      return (
        // <span className="font-inter text-xs font-bold leading-4 text-red-500">
        //   {props.errortxt}
        // </span>
        <ErrorText text={props.errortxt} />
      );
    }
  };

  return (
    <div className={props.parentClassName}>
      {props.label && (
        <Text
          variant="p"
          className={`text-darkPrimary mb-1 mt-2 text-[0.85rem] !xss:text-[1rem] font-semibold
          
          ${props.labelClassName}
            `}
        >
          {props.label}
          {props.required && <span className="text-errorRed mx-1">*</span>}
        </Text>
      )}
      <div
        className={`${className} focus-within:border-2 dark:!bg-darkBgSecondary  transition-border duration-300`}
      >
        {returnLeftIcon()}
        {props.textarea ? (
          <textarea
            className={`text-black bg-inherit w-full ${
              props.lefticon ? "ml-[0.8rem]" : "pl-[0.8rem]"
            } h-full outline-0 border-0 placeholder:text-color4 placeholder:leading-6  font-normal relative placeholder:text-[0.8rem] resize-none  sm1:placeholder:text-[0.95rem] placeholder:font-normal bg-transparent dark:border-none dark:text-white dark:focus:!border-none ${
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
                {...props}
                className={`text-darkPrimary ${
                  props.dark ? "dark:!text-white dark:focus:!border-white" : ""
                } bg-transparent w-full px-[0.8rem] h-full focus:border-primary outline-0 border-0 placeholder:text-color4 placeholder:leading-6 font-normal placeholder:text-[0.8rem] ${
                  props.inputClassName
                }`}
                placeholder={props.placeholder || ""}
                type={returnInputType()}
                name={props.name || ""}
                value={props.value}
                onChange={handleChange}
                required={props.required || false}
              />
            )}
          </>
        )}
        {returnRightIcon()}
      </div>
      {props.infotxt && (
        <Text variant="p" className="text-disabledText text-xs mt-1 w-[90%]">
          {props.infotxt}
        </Text>
      )}
      {renderStatusText()}
    </div>
  );
}
