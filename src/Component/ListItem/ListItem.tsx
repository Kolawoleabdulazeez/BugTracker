import { trimWithEllipses } from "@/pages/utils";
import { IoIosArrowForward } from "react-icons/io";

type ListItemProps = {
  name?: string;
  showArrow?: boolean;
  imgComponent?: any;
  subtitleComponent?: any;
  onClick?: (val?: any) => void;
  className?: string;
  endComponent?: any;
  nameComponent?: any;
  noHover?: boolean;
  noTruncate?: boolean;
  dark?: boolean;
};

const ListItem = ({
  imgComponent,
  name,
  showArrow,
  subtitleComponent,
  onClick,
  className,
  endComponent,
  nameComponent,
  noHover,
  noTruncate,
  dark,
}: ListItemProps) => {
  return (
    <div
      className={`flex gap-3 my-3 ${
        dark ? "bg-disabledBg dark:bg-darkGrayBg4" : "bg-disabledBg"
      }  px-3 py-[0.3rem]  justify-between rounded-lg  ${
        !noHover ? "hover:bg-primary hover:text-white cursor-pointer" : ""
      } group transition-all duration-300 ease-in-out items-center ${className}`}
      onClick={onClick}
      data-testid="list-item"
    >
      <div className="flex items-center gap-3">
        {imgComponent}
        <div className="flex flex-col">
          <h1
            className={`font-semibold text-darkPrimary ${
              dark ? "dark:!text-white" : "text-darkPrimary"
            }  text-[0.8rem] sm1:text-[0.9rem] transition-transform duration-300  ${
              !noHover ? "group-hover:text-white group-hover:scale-105" : ""
            } `}
            data-testid="list-item-name"
          >
            {nameComponent ??
              (noTruncate ? name : trimWithEllipses(name ?? ""))}
          </h1>
          <div
            className={`flex text-[0.7rem] gap-1 text-labelBlue ${
              dark ? "dark:!text-white" : "text-labelBlue "
            } ${
              !noHover ? "group-hover:text-white" : ""
            } text-[0.7rem] sm1:text-[0.9rem]`}
          >
            {subtitleComponent}
          </div>
        </div>
      </div>
      {onClick && !endComponent && showArrow && (
        <IoIosArrowForward className="text-disabledText" />
      )}
      {endComponent && (
        <span className="font-semibold text-[0.75rem] xl:text-[0.9rem]">
          {endComponent}
        </span>
      )}
    </div>
  );
};

export default ListItem;
