/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { SortAsc, Square } from "lucide-react";

import NoRecord from "../NoRecord/NoRecord";

import PaginationControls from "./PaginationControls";
import { Checkbox } from "@mui/material";
import { TABLE_ROWS_PER_PAGE } from "@/utils/lib";
import { PageDetails } from "@/utils/types";

export type TableHeader = {
  key: string;
  propertyName: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
};

export type ReusableTableProps = {
  headers: TableHeader[];
  data: any[];
  rowsPerPage?: number;
  onDBPageChange?: (page: number) => void;
  onRowClick?: (row: any) => void;
  loading?: boolean;
  onBulkSelect?: (item: string, checked: boolean) => void;
  showPagination?: boolean;
  className?: string;
  DBPageDetails?: PageDetails;
};

const PaginatedTable = ({
  headers = [],
  data = [],
  rowsPerPage = TABLE_ROWS_PER_PAGE,
  className = "",
  showPagination = true,
  loading = false,
  onBulkSelect,
  onRowClick,
  onDBPageChange,
  DBPageDetails,
}: ReusableTableProps) => {
  const [page, setPage] = useState(1);

  const currentItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  }, [data, page, rowsPerPage]);

  useEffect(() => {
  setPage(1); // filtering can leave you on a page that no longer exists
}, [data.length]);

  const renderCellContent = (header: TableHeader, item: any) => {
    if (header.render) {
      return header.render(item[header.propertyName], item);
    }
    return item[header.propertyName];
  };

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, item: any) => {
  if (!onRowClick) return;
  const target = e.target as HTMLElement;


  if (!e.currentTarget.contains(target)) return;

  if (target.closest("[data-no-row-click]")) return;

  onRowClick(item);
};

  return loading ? (
    <div className="p-4 space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-12 w-full rounded-md bg-slate-200 dark:bg-white/10"
        />
      ))}
    </div>
  ) : (
    <div className={`glass-card p-3 rounded-lg pb-1 ${className}`}>
      {currentItems.length === 0 ? (
        <NoRecord />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl custom-scrollbar pb-2">
            <table className="min-w-full border-collapse rounded-lg">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  {onBulkSelect && (
                    <th className="px-6 py-5 flex justify-center items-center text-center text-xs bg-orange-500 text-white whitespace-nowrap relative">
                      <Square size={18} />
                    </th>
                  )}
                  {headers.map((header, idx) => (
                    <th
                      key={header.key}
                      className={`${
                        idx === 0 && !onBulkSelect ? "rounded-tl-lg" : ""
                      } ${idx === headers.length - 1 ? "rounded-tr-lg" : ""}
                          px-6 py-4 text-left text-sm bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-secondary-400 whitespace-nowrap relative`}
                    >
                      <span className="flex items-center gap-1">
                        <span>{header.key}</span>
                        {header.sortable && (
                          <span className="cursor-pointer hover:text-orange-500">
                            <SortAsc size={14} />
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {currentItems.map((item, index) => (
                  <tr
 key={item.id ?? item.Id ?? index}
  onClick={(e) => handleRowClick(e, item)}
  onKeyDown={(e) => {
    if (onRowClick && e.key === "Enter" && e.target === e.currentTarget) onRowClick(item);
  }}
  tabIndex={onRowClick ? 0 : undefined}
  className={`transition-colors ${
    onRowClick
      ? "cursor-pointer hover:bg-orange-500/[0.04] focus:bg-orange-500/[0.06] focus:outline-none dark:hover:bg-orange-500/[0.06]"
      : ""
  }`}
>
                    {onBulkSelect && (
                      <td className="px-6 py-[0.4rem] whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                        <Checkbox
                          size="small"
                          onChange={(e) => onBulkSelect(item.Id, e.target.checked)}
                          sx={{
                            color: "rgba(148, 163, 184, 0.6)",
                            "&.Mui-checked": { color: "#ED6214" },
                          }}
                        />
                      </td>
                    )}
                    {headers.map((header, columnIndex) => (
                      <td
                        key={columnIndex}
                        className={`px-6 ${
                          onBulkSelect ? "py-[0.4rem]" : "py-4"
                        } whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-gray-200`}
                        data-label={header.key}
                      >
                        {renderCellContent(header, item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPagination && (
            <PaginationControls
              totalItems={data.length}
              page={page}
              setPage={(val) => {
                setPage(val);
              }}
              onDBPageChange={onDBPageChange}
              DBPageDetails={DBPageDetails}
              rowsPerPage={rowsPerPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PaginatedTable;