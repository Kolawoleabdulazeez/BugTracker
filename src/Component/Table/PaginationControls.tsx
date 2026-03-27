import { useEffect, useState } from "react";
import {
  Pagination,
  Button,
  PaginationItem,
  Select,
  MenuItem,
} from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageDetails } from "@/pages/utils/types";
import { TABLE_ROWS_PER_PAGE } from "@/pages/utils/lib";


interface CustomPaginationProps {
  totalItems: number;
  page: number;
  rowsPerPage?: number;
  setPage: (val: number) => void;
  DBPageDetails: PageDetails | undefined;
  onDBPageChange?: (val: number) => void;
}
const PaginationControls = ({
  totalItems,
  page,
  rowsPerPage = TABLE_ROWS_PER_PAGE,
  setPage,
  onDBPageChange,
  DBPageDetails,
}: CustomPaginationProps) => {
  const [pagesLeft, setPagesLeft] = useState<any[]>([]);
  const [activeDBPage, setActiveDBPage] = useState<any>({ key: "", value: 0 });
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };
  const handleDBPageChange = (val: number) => {
    const selectedPage = pagesLeft.find((p) => p.value === val);
    if (selectedPage) {
      setActiveDBPage(selectedPage);
    }
    setPage(1);
    onDBPageChange?.(val);
  };
  useEffect(() => {
    if (DBPageDetails?.TotalRecords && DBPageDetails?.PageSize) {
      let pagesFromDB = Math.ceil(
        DBPageDetails.TotalRecords / DBPageDetails.PageSize
      ); //Number of pages retrievable from DB
      let arr = [];
      for (let i = 0; i < pagesFromDB; i++) {
        arr.push({
          key: `${i * Number(DBPageDetails?.PageSize) + 1}-${
            (i + 1) * Number(DBPageDetails?.PageSize)
          }`,
          value: i + 1,
        });
      }
      setActiveDBPage(arr[0]);
      setPagesLeft(arr);
    }
  }, []);
  return (
    <div className="gap-2 flex items-center justify-between mt-3 mb-2">
      <Button
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        className="!pl-[7px] !pr-[14px] !py-[18px]  h-[30px] rounded-lg w-[100px] font-bold flex items-center justify-center gap-[2px] !bg-gray1 !text-black"
        startIcon={<ArrowLeft size={16} className="text-black ml-3" />}
        sx={{ textTransform: "none", border: "1px solid darkgray" }}
      >
        Previous
      </Button>

      <Pagination
        count={Math.ceil(totalItems / rowsPerPage)}
        page={page}
        onChange={(_, value) => handlePageChange(value)}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            className={`px-3 py-1 rounded ${
              item.selected
                ? "!bg-gray1 text-primary font-bold !rounded-[7px]"
                : "bg-gray-100 text-gray-700"
            }`}
            slots={{ previous: () => null, next: () => null }}
          />
        )}
      />
      <div className="flex items-center gap-6">
        {DBPageDetails?.TotalRecords && (
          <div className="text-xs">
            Showing
            <Select
              className="mx-1"
              sx={{
                "& > div": {
                  padding: "0px 10px",
                  fontSize: "0.8rem",
                },
              }}
              value={activeDBPage?.value ?? ""}
              onChange={(e) => handleDBPageChange(e.target.value)}
              size="small"
            >
              {pagesLeft.map((page) => (
                <MenuItem key={page.value} value={page.value}>
                  {page.key}
                </MenuItem>
              ))}
            </Select>
            of {DBPageDetails.TotalRecords || totalItems}
          </div>
        )}
        <Button
          className="px-[7px] !py-[18px] h-[30px] cursor-pointer border border-gray-300 rounded-lg w-[100px] font-bold flex items-center justify-center gap-[10px] !bg-gray1 !text-black"
          endIcon={<ArrowRight size={16} className="text-black" />}
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          sx={{ textTransform: "none", border: "1px solid darkgray" }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
