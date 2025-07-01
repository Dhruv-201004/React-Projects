import React, { useState } from "react";
import { useTodo } from "../contexts/TodoContext";

function TodoItem({ todo, index }) {
  const [editable, setEditable] = useState(false);
  const [msg, setMsg] = useState(todo.todo);
  const [deleting, setDeleting] = useState(false);
  const { updateTodo, deleteTodo, toggleComplete } = useTodo();

  const saveEdit = () => {
    if (msg.trim()) {
      updateTodo(todo.id, { ...todo, todo: msg.trim() });
    } else setMsg(todo.todo);
    setEditable(false);
  };
  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => deleteTodo(todo.id), 300);
  };
  const handleKey = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") {
      setMsg(todo.todo);
      setEditable(false);
    }
  };

  return (
    <div
      className={`group relative transform transition-all duration-500 hover:scale-[1.02] ${
        deleting ? "scale-0 opacity-0" : "scale-100 opacity-100"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
          todo.completed
            ? "bg-green-500/20 border-green-400/30 shadow-lg shadow-green-500/10"
            : "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 shadow-lg shadow-black/10"
        }`}
      >
        {/* Checkbox */}
        <div className="relative">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleComplete(todo.id)}
            className="sr-only"
          />
          <div
            onClick={() => toggleComplete(todo.id)}
            className={`w-6 h-6 rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center ${
              todo.completed
                ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/30"
                : "border-white/40 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
            }`}
          >
            {todo.completed && (
              <svg
                className="w-4 h-4 text-white animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Text / edit field */}
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKey}
          readOnly={!editable}
          className={`flex-1 bg-transparent text-white text-lg font-medium transition-all duration-300 ${
            editable
              ? "border-b-2 border-blue-400 pb-1 outline-none"
              : "border-transparent"
          } ${todo.completed ? "line-through text-white/70" : ""}`}
        />

        {/* Action buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Edit / save */}
          <button
            onClick={() =>
              todo.completed ? null : editable ? saveEdit() : setEditable(true)
            }
            disabled={todo.completed}
            className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center ${
              todo.completed
                ? "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                : editable
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-400/30"
                : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-400/30"
            } hover:scale-110 active:scale-95`}
            title={editable ? "Save changes" : "Edit todo"}
          >
            {editable ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            )}
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-400/30 transition-all duration-300 hover:scale-110 active:scale-95"
            title="Delete todo"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
