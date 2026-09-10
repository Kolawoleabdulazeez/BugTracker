/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Pagination,
  Button,
  PaginationItem,
  Select,
  MenuItem,
} from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageDetails } from "@/utils/types";
import { TABLE_ROWS_PER_PAGE } from "@/utils/lib";

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
      const pagesFromDB = Math.ceil(
        DBPageDetails.TotalRecords / DBPageDetails.PageSize
      );
      const arr = [];
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
  }, [DBPageDetails]);

  return (
    <div className="gap-2 flex items-center justify-between mt-3 mb-2">
      <Button
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        className="!pl-[7px] !pr-[14px] !py-[18px] h-[30px] rounded-lg w-[100px] font-bold flex items-center justify-center gap-[2px]"
        startIcon={<ArrowLeft size={16} />}
        sx={{
          textTransform: "none",
          border: "1px solid",
          borderColor: "rgba(148, 163, 184, 0.4)",
          backgroundColor: "transparent",
          color: "inherit",
          ".dark &": { color: "#ededed" },
          "&:hover": { backgroundColor: "rgba(237, 98, 20, 0.08)" },
        }}
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
            slots={{ previous: () => null, next: () => null }}
            sx={{
              borderRadius: "7px",
              fontWeight: item.selected ? 700 : 400,
              color: item.selected ? "#ED6214" : "inherit",
              backgroundColor: item.selected
                ? "rgba(237, 98, 20, 0.12)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(237, 98, 20, 0.08)",
              },
            }}
          />
        )}
      />

      <div className="flex items-center gap-6">
        {DBPageDetails?.TotalRecords && (
          <div className="text-xs text-slate-600 dark:text-secondary-400">
            Showing
            <Select
              className="mx-1"
              sx={{
                "& > div": {
                  padding: "0px 10px",
                  fontSize: "0.8rem",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(148, 163, 184, 0.4)",
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
          className="px-[7px] !py-[18px] h-[30px] rounded-lg w-[100px] font-bold flex items-center justify-center gap-[10px]"
          endIcon={<ArrowRight size={16} />}
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          sx={{
            textTransform: "none",
            border: "1px solid",
            borderColor: "rgba(148, 163, 184, 0.4)",
            backgroundColor: "transparent",
            color: "inherit",
            "&:hover": { backgroundColor: "rgba(237, 98, 20, 0.08)" },
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;