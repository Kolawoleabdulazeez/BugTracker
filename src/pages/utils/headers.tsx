import { formatLabel, formatTimestamp } from ".";
import { AssignedDeveloper, AssignedTester } from "../services/bugs/bugs.api";

export const BUG_HEADERS = [
    {
        key:"Action",
        propertyName:"action"
    },
  {
    key: "Bug ID",
    propertyName: "bugLabel",
  },
  {
    key: "Title",
    propertyName: "title",
  },
  {
    key:"Severity",
    propertyName:"severity",
      render: (value: string) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === "High"
            ? "bg-red-100 text-red-600"
            : value === "Medium"
            ? "bg-yellow-100 text-yellow-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    key: "Priority",
    propertyName: "priority",
    render: (value: string) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === "High"
            ? "bg-red-100 text-red-600"
            : value === "Medium"
            ? "bg-yellow-100 text-yellow-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    key: "Bug Status",
    propertyName: "status",
    render: (value: string) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === "Open"
            ? "bg-gray-100 text-gray-600"
            : value === "InProgress"
            ? "bg-blue-100 text-blue-600"
            : value === "Closed"
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {value}
      </span>
    ),
  },
   {
    key: "Developer Status",
    propertyName: "developerStatus",
    render: (value: string) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === "Open"
            ? "bg-gray-100 text-gray-600"
            : value === "InProgress"
            ? "bg-blue-100 text-blue-600"
            : value === "Closed"
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {formatLabel(value) || "-"}
      </span>
    ),
  },
  {
    key: "Assigned To",
    propertyName: "assignedDeveloper",
  render: (value: AssignedDeveloper) => <p>{value?.fullName || "Unassigned"}</p>,
  },
  {
    key:"Assignee",
    propertyName:"assignedTester",
  render: (value: AssignedTester) => <p>{value?.fullName || "Unassigned"}</p>,

  },
  {
    key: "Created At",
    propertyName: "createdAt",
          render: (value: string) => (

        formatTimestamp(value)
    ),
  },
  {
  key: "View Detail",
  propertyName: "viewMore",
},
];