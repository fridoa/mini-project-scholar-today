import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import type { ITodo } from "@/types/user.type";

interface TodoItemProps {
  todo: ITodo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl px-4 py-3 transition-colors ${
        todo.completed ? "bg-gray-50" : "bg-white"
      }`}
    >
      {todo.completed ? (
        <MdCheckCircle className="mt-0.5 shrink-0 text-emerald-500" size={22} />
      ) : (
        <MdRadioButtonUnchecked
          className="mt-0.5 shrink-0 text-[#ec5b13]"
          size={22}
        />
      )}
      <p
        className={`text-sm leading-relaxed ${
          todo.completed
            ? "text-gray-400 line-through"
            : "font-medium text-gray-800"
        }`}
      >
        {todo.title}
      </p>
    </div>
  );
};

export default TodoItem;
