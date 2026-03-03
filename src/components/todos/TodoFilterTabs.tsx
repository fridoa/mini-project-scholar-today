import type { TodoFilter } from "@/hooks/useTodos";

interface TodoFilterTabsProps {
  active: TodoFilter;
  onChange: (filter: TodoFilter) => void;
  totalCount: number;
  pendingCount: number;
  doneCount: number;
}

const TodoFilterTabs = ({
  active,
  onChange,
  totalCount,
  pendingCount,
  doneCount,
}: TodoFilterTabsProps) => {
  const tabs: { key: TodoFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: totalCount },
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "done", label: "Done", count: doneCount },
  ];

  return (
    <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            active === tab.key
              ? "bg-white text-[#ec5b13] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
          <span
            className={`ml-1.5 text-xs ${
              active === tab.key ? "text-[#ec5b13]" : "text-gray-400"
            }`}
          >
            ({tab.count})
          </span>
        </button>
      ))}
    </div>
  );
};

export default TodoFilterTabs;
