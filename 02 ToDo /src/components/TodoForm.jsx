import React, { useState } from "react";
import { useTodo } from "../contexts/TodoContext";

function TodoForm() {
  const [todo, setTodo] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { addTodo } = useTodo();

  const submit = (e) => {
    e?.preventDefault?.();
    if (!todo.trim()) return;
    setIsAdding(true);

    setTimeout(() => {
      addTodo({ todo: todo.trim(), completed: false });
      setTodo("");
      setIsAdding(false);
    }, 200);
  };

  return (
    <form onSubmit={submit} className="relative mb-8 group" autoComplete="off">
      <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 transition-all duration-300 focus-within:border-blue-400/50 focus-within:shadow-lg focus-within:shadow-blue-500/20">
        <input
          type="text"
          placeholder="What needs to be done? ✨"
          className="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-3 outline-none text-lg"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          disabled={isAdding}
        />

        <button
          type="submit"
          disabled={!todo.trim() || isAdding}
          className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:from-blue-600 hover:to-sky-600 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          {isAdding ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.29A8 8 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Adding...
            </>
          ) : (
            <>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
