import Dropdown from "@/Component/Dropdown/Dropdown";

export type FilterItem = { id: string; name: string };

export const toFilterItems = (allLabel: string, options: string[]): FilterItem[] => [
  { id: "all", name: allLabel },
  ...options.map((o) => ({ id: o, name: o })),
];

interface FilterDropdownProps {
  list: FilterItem[];
  value: string; // "" means "all"
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}

export const FilterDropdown = ({
  list,
  value,
  placeholder,
  onChange,
  className = "",
}: FilterDropdownProps) => (
  <Dropdown
    list={list}
    labelParam="name"
    valueParam="id"
    selectedValue={value || "all"}
    placeholder={placeholder}
    className={className}
    parentClassName="rounded-lg h-10"
    dropdownClassName="!w-48"
    onValChange={(item) => onChange(item.id === "all" ? "" : item.id)}
  />
);