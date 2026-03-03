import Card from "@/components/ui/Card";

interface TodoProgressCardProps {
  progress: number;
  doneCount: number;
  totalCount: number;
  pendingCount: number;
}

const TodoProgressCard = ({
  progress,
  doneCount,
  totalCount,
  pendingCount,
}: TodoProgressCardProps) => {
  return (
    <Card>
      <h3 className="mb-4 text-base font-bold text-gray-900">Summary</h3>

      <div className="flex items-center justify-center">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#ec5b13"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.64} ${264 - progress * 2.64}`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#ec5b13]">
              {progress}%
            </span>
            <span className="text-xs text-gray-400">completed</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-gray-50 px-2 py-2.5">
          <p className="text-lg font-bold text-gray-900">{totalCount}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="rounded-lg bg-orange-50 px-2 py-2.5">
          <p className="text-lg font-bold text-[#ec5b13]">{pendingCount}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="rounded-lg bg-emerald-50 px-2 py-2.5">
          <p className="text-lg font-bold text-emerald-600">{doneCount}</p>
          <p className="text-xs text-gray-500">Done</p>
        </div>
      </div>
    </Card>
  );
};

export default TodoProgressCard;
