import Image from "next/image";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import { Bug } from "./Row";
import Row from "./Row";

type TableProps = {
  bugs: Bug[];
  searchTerm: string;
};

export default function Table({ bugs, searchTerm }: TableProps) {
  const filteredBugs = bugs.filter(
    (bug) =>
      bug.id.toString().includes(searchTerm) ||
      bug.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const bugsToRender = searchTerm ? filteredBugs : bugs;

  return (
    /* Outer wrapper: horizontal scroll on small screens */
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-spacing-y-1 border-separate">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm whitespace-nowrap">#ID</th>
            <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Module</th>
            <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Ticket Title</th>
            <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Status</th>
            <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Priority</th>
            <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Assignee</th>
            <th className="px-4 py-2 text-left text-sm whitespace-nowrap">Attachments</th>
          </tr>
        </thead>
        <tbody>
          {bugsToRender.length > 0 ? (
            bugsToRender.map((bug) => <Row bug={bug} key={bug.id} />)
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}