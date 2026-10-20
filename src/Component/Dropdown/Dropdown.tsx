/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
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
  onOpen?: () => void;
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
  className = "",
  label,
  labelClassname = "",
  onValChange,
  imgParam,
  labelParam,
  parentClassName = "",
  dropdownClassName = "",
  hasSearch,
  noTruncate,
  refetchFxn,
  dark,
  defaultImg,
  onOpen,
  selectedValue,
  valueParam = "id",
}: DropdownProps) => {
  const scrollRef = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(defaultItem);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectItem = useCallback(
    (val: any) => {
      if (!val) {
        setSelectedItem({
          ...val,
          value: (
            <span className="text-slate-400 dark:text-[#475569] sm1:whitespace-nowrap">
              {placeholder}
            </span>
          ),
        });
      } else {
        setSelectedItem({
          ...val,
          value: (
            <span className="font-semibold text-slate-800 dark:text-slate-200 sm1:whitespace-nowrap">
              {val[labelParam] || placeholder}
            </span>
          ),
        });
      }

      setShow(false);
      if (onValChange && val) {
        onValChange(val);
      }
    },
    [placeholder, labelParam, onValChange]
  );

  useEffect(() => {
    if (selectedValue !== undefined && selectedValue !== null && list.length) {
      const matchedItem = list.find(
        (item) => String(item[valueParam]) === String(selectedValue)
      );

      if (matchedItem) {
        setSelectedItem({
          ...matchedItem,
          value: (
            <span className="font-semibold text-slate-800 dark:text-slate-200 sm1:whitespace-nowrap">
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
  }, [selectedValue, list, valueParam, labelParam, placeholder, defaultItem, handleSelectItem]);

  const filteredList = searchQuery
    ? list.filter((item) =>
        String(item[labelParam] ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : list;

  const selectedId = selectedItem ? String(selectedItem[valueParam]) : null;

  return (
    <div
      className={`relative w-full content-center ${className}`}
      onClick={() => {
        if (disabled) {
          setShow(false);
        }
      }}
    >
      {show && (
        <div
          className="fixed bottom-0 left-0 right-0 top-0 z-[1]"
          onClick={() => setShow(false)}
        />
      )}

      {label && (
        <h1
          className={`mb-1.5 mt-2 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-[#334155] ${labelClassname}`}
        >
          {label} {isRequired && <span className="text-danger-500">*</span>}
        </h1>
      )}

      <div
        className={`flex cursor-pointer items-center justify-between rounded-[2px] border px-2 transition-colors ${
          show
            ? "border-orange-500/50"
            : "border-slate-200 hover:border-orange-500/30 dark:border-white/[0.08]"
        } bg-slate-50 dark:bg-white/[0.03] ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        } ${parentClassName} ${
          selectedItem && imgParam ? "!py-[0.5rem]" : "!py-2.5"
        }`}
        onClick={() => {
          if (disabled) return;
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
                className="h-[35px] w-[35px] rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-white/[0.08] dark:bg-white/[0.05]"
                width={25}
                height={25}
              />
            )}
            <div
              className="flex w-full flex-col justify-between px-3 text-[0.8rem] font-normal text-slate-800 dark:text-slate-200 lg1:flex-row"
              data-testid="dropdown-selected-value"
            >
              {selectedItem.value}
            </div>
          </>
        ) : (
          <p className="m-0 px-1 text-[0.8rem] text-slate-400 dark:text-[#475569]">
            {placeholder}
          </p>
        )}
        <IoIosArrowDown
          className={`flex-shrink-0 text-slate-400 transition-transform duration-150 dark:text-secondary-500 ${
            show ? "rotate-180 text-orange-500 dark:text-orange-400" : ""
          }`}
        />
      </div>

      {errortxt && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errortxt}</p>
      )}

      {show && (
        <div
          className={`absolute left-0 z-10 mt-1.5 max-h-[320px] w-full overflow-y-auto rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-2xl dark:border-white/[0.08] dark:bg-secondary-900 ${dropdownClassName}`}
        >
          <div className="mb-1 flex items-center justify-between">
            {placeholder ? (
              <h1 className="m-0 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-secondary-500">
                {placeholder}
              </h1>
            ) : (
              <span />
            )}
            <button
              className="cursor-pointer border-none bg-transparent px-1 text-xs font-bold text-slate-400 transition-colors hover:text-slate-600 dark:text-secondary-500 dark:hover:text-slate-300"
              onClick={() => setShow(false)}
              type="button"
              ref={scrollRef}
              aria-label="Close"
            >
              X
            </button>
          </div>

          {hasSearch && (
            <Search searchValue={searchQuery} setSearchValue={setSearchQuery} />
          )}

          {isLoading && !filteredList.length ? (
            <Spinner className="my-20" />
          ) : !isLoading && !filteredList.length ? (
            <p className="my-16 flex flex-col items-center justify-center text-center text-[13px] font-semibold text-slate-400 dark:text-secondary-500">
              {fetchErrorMessage ?? "Nothing found"}
              {refetchFxn && (
                <button
                  className="mt-4 cursor-pointer rounded-lg border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-orange-600 transition-colors hover:bg-orange-500/20 dark:text-orange-400"
                  onClick={() => refetchFxn && refetchFxn()}
                >
                  <RiLoopLeftFill />
                </button>
              )}
            </p>
          ) : (
            <div className="mt-1 flex flex-col gap-0.5">
              {filteredList.map((li, index) => {
                const isSelected = selectedId !== null && String(li[valueParam]) === selectedId;
                return (
                  <ListItem
                  compact
                    key={`${li[valueParam] ?? li[labelParam]}-${index}`}
                    dark={dark}
                    className={`!py-1.5 !px-3 border shadow-none transition-colors ${
                      isSelected
                        ? "!border-orange-500/30 !bg-orange-500/10 !text-orange-700 dark:!text-orange-400"
                        : "!border-transparent !bg-slate-50 !text-slate-700 hover:!bg-orange-500/[0.06] dark:!bg-white/[0.03] dark:!text-slate-200 dark:hover:!bg-orange-500/[0.08]"
                    }`}
                    imgComponent={
                      imgParam &&
                      typeof li[imgParam as keyof ListItem] === "string" ? (
                        <Image
                          src={li[imgParam as keyof ListItem] ?? ""}
                          alt="logo"
                          className="m-auto h-[30px] w-[30px] rounded-full border border-slate-200 bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.05]"
                          width={25}
                          height={25}
                        />
                      ) : null
                    }
                    name={li[labelParam as keyof ListItem]}
                    subtitleComponent={
                      subtitleParam ? (
                        <span className="text-slate-400 dark:text-secondary-500">
                          {li[subtitleParam as keyof ListItem]}
                        </span>
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
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;