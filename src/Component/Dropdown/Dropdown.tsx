/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Spinner from "../Spinner/Spinner";
import Image from "next/image";
import Search from "../Search/Search";
import { RiLoopLeftFill } from "react-icons/ri";
import ListItem from "../ListItem/ListItem";

export type ListItem = { [key: string]: string | any };
export type DropdownProps = {
  parentClassName?: React.HTMLAttributes<HTMLInputElement>["className"];
  list: ListItem[];
  hasSearch?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  dark?: boolean;
  fetchErrorMessage?: string;
  refetchFxn?: () => void;
  showArrow?: boolean;
selectedValue?: string | number | null;
  valueParam?: string;
  isRequired?: boolean;
  imgParam?: string;
  labelParam: string;
  subtitleParam?: string;
  endParam?: string;
  placeholder?: string;
  label?: string;
  labelClassname?: string;
  dropdownClassName?: string;
  errortxt?: string;
  infotxt?: string;
  successtxt?: string;
  defaultItem?: ListItem;
  defaultImg?: any;
  noImg?: any;
  onValChange?: (val: ListItem) => void;
  noTruncate?: boolean;
  onOpen?: () => void; // ADDED THIS
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Dropdown = ({
  list,
  disabled,
  isLoading,
  isRequired,
  fetchErrorMessage,
  showArrow,
  defaultItem,
  subtitleParam,
  endParam,
  errortxt,
  placeholder,
  className,
  label,
  labelClassname,
  onValChange,
  imgParam,
  labelParam,
  parentClassName,
  dropdownClassName,
  hasSearch,
  noTruncate,
  refetchFxn,
  dark,
  defaultImg,
  onOpen,
  selectedValue,
  valueParam = "id"
}: DropdownProps) => {
  const scrollRef = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(defaultItem);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectItem = (val: any) => {
    if (!val) {
      setSelectedItem({
        ...val,
        value: (
          <span
            className={`text-dis sm1:whitespace-nowrap ${
              dark ? "dark:!text-white" : ""
            }`}
          >
            {placeholder}
          </span>
        ),
      });
    } else {
      setSelectedItem({
        ...val,
        value: (
          <span className="font-semibold sm1:whitespace-nowrap">
            {val[labelParam] || placeholder}
          </span>
        ),
      });
    }
    setShow(false);
    onValChange && val && onValChange(val);
  };

useEffect(() => {
  if (selectedValue !== undefined && selectedValue !== null && list.length) {
    const matchedItem = list.find(
      (item) => String(item[valueParam]) === String(selectedValue)
    );

    if (matchedItem) {
      setSelectedItem({
        ...matchedItem,
        value: (
          <span className="font-semibold sm1:whitespace-nowrap">
            {matchedItem[labelParam] || placeholder}
          </span>
        ),
      });
      return;
    }
  }

  if (defaultItem) {
    handleSelectItem(defaultItem);
    return;
  }

  setSelectedItem(undefined);
}, [selectedValue, list, valueParam, labelParam, placeholder, defaultItem]);

  // Filter the list based on the search query
  const filteredList = searchQuery
    ? list.filter((item) =>
        item[labelParam]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : list;

  return (
    <div
      className={`relative content-center w-full  ${className}`}
      onClick={() => (disabled ? setShow(false) : undefined)}
    >
      {show && (
        <div
          className="fixed top-0 bottom-0 right-0 left-0 z-[1]"
          onClick={() => setShow(false)}
        />
      )}
      <h1
        className={`text-labelBlue ${labelClassname} mt-2 text-[0.85rem] xss:text-[1rem] font-semibold`}
      >
        {label} {isRequired && <span className="text-errorRed">*</span>}
      </h1>
      <div
        className={`flex border ${
          dark ? "dark:border-none" : ""
        } rounded-[2px] px-2 justify-between items-center cursor-pointer ${parentClassName} ${
          dark ? "dark:bg-darkGrayBg4 " : ""
        } ${selectedItem && imgParam ? "!py-[0.5rem]" : "!py-4"}`}
        onClick={() => {
          // ADDED THIS LOGIC
          if (!show && onOpen) {
            onOpen();
          }
          setShow((prev) => !prev);
        }}
      >
        {selectedItem ? (
          <>
            {imgParam && (
              <Image
                alt="select-icon"
                src={selectedItem[imgParam] ?? defaultImg}
                className={`p-1 rounded-full h-[35px] w-[35px] bg-disabledBg ${
                  dark ? "dark:bg-disabledBg" : ""
                }`}
                width={25}
                height={25}
              />
            )}
            <div
              className={`text-[0.8rem] text-disabledText  font-normal ${
                dark ? "dark:text-white" : ""
              } w-full flex flex-col justify-between px-3 lg1:flex-row `}
              data-testid="dropdown-selected-value"
            >
              {selectedItem.value}
            </div>
          </>
        ) : (
          <p
            className={`text-disabledText text-[0.8rem] ${
              dark ? "" : ""
            }`}
          >
            {placeholder}
          </p>
        )}
        <IoIosArrowDown className={`${dark ? "dark:text-white" : ""}`} />
      </div>
       {errortxt && <p className="text-red-500 text-sm mt-1">{errortxt}</p>}

      {show && (
        <div
          className={`${
            dark ? "dark:!bg-darkGrayBg3" : ""
          } bg-slate-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 absolute left-0 mt-2 py-3 px-5 shadow-2xl rounded-lg w-full z-10 overflow-y-scroll ${
            filteredList.length > 5 ? "h-[470px]" : "h-auto"
          } ${dropdownClassName}`}
        >
          <div className="flex justify-between items-center">
            {placeholder && (
              <h1
                className={`text-disabledText font-bold ${
                  dark ? "dark:!text-white" : ""
                }`}
              >
                {placeholder}
              </h1>
            )}
            <button
              className="font-bold text-grayText"
              onClick={() => setShow(false)}
              type="button"
              ref={scrollRef}
            >
              X
            </button>
          </div>
          {hasSearch && (
            <Search
              searchValue={searchQuery}
              setSearchValue={setSearchQuery}
            />
          )}
          {isLoading && !filteredList.length ? (
            <Spinner className="my-20" />
          ) : !isLoading && !filteredList.length ? (
            <p className="my-20 text-center font-bold text-borderRed flex flex-col items-center justify-center">
              {fetchErrorMessage ?? "Nothing found"}
              {refetchFxn && (
                <button
                  className={`bg-transparent ${
                    dark
                      ? "text-white border-darkGrayBg4"
                      : "text-primary border-primary"
                  } px-5 py-2 mt-5 rounded-lg border`}
                  onClick={() => refetchFxn && refetchFxn()}
                >
                  <RiLoopLeftFill />
                </button>
              )}
            </p>
          ) : (
            filteredList.map((li, index) => (
              <ListItem
                key={`${li.name}-${index}`}
                dark={dark}
                className={`!py-2 text-darkPrimary bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm ${
                  dark ? "dark:!bg-darkGrayBg4 dark:!text-white" : ""
                }`}
                imgComponent={
                  imgParam &&
                  typeof li[imgParam as keyof ListItem] === "string" ? (
                    <Image
                      src={li[imgParam as keyof ListItem] ?? ""}
                      alt="logo"
                      className="border-disabledBgBorder border-2 bg-disabledBg rounded-full m-auto h-[30px] w-[30px]"
                      width={25}
                      height={25}
                    />
                  ) : null
                }
                name={li[labelParam as keyof ListItem]}
                subtitleComponent={
                  subtitleParam ? (
                    <span>{li[subtitleParam as keyof ListItem]}</span>
                  ) : null
                }
                endComponent={
                  endParam && endParam.toLowerCase() === "amount"
                    ? `N${li[endParam as keyof ListItem]}`
                    : endParam
                    ? li[endParam as keyof ListItem]
                    : null
                }
                showArrow={showArrow}
                onClick={() => handleSelectItem(li)}
                noTruncate={noTruncate}
              />
            ))
          )}
        </div>

      )}
    </div>
  );
};

export default Dropdown;