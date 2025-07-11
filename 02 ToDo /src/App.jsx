import React, { useState, useEffect } from "react";
import { TodoProvider } from "./contexts/TodoContext";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all"); 

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
  };
  const updateTodo = (id, todo) => {
    setTodos((prev) =>
      prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo))
    );
  };
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };
  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id
          ? { ...prevTodo, completed: !prevTodo.completed }
          : prevTodo
      )
    );
  };
  const clearCompleted = () =>
    setTodos((prev) => prev.filter((todo) => !todo.completed));

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos"));
    if (saved?.length) setTodos(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <TodoProvider
      value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}
    >
      {/* --- App background --- */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated circles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" />
          <div className="absolute -bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500" />
        </div>

        {/* --- Main content --- */}
        <div className="relative z-10 min-h-screen py-8 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <header className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-sky-600 rounded-3xl mb-6 shadow-2xl shadow-blue-500/30">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0a2 2 0 012 2h2a2 2 0 012-2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text">
                Todo Master
              </h1>
              <p className="text-white/80 text-lg">
                Organize your life, one task at a time
              </p>
            </header>

            {/* Todo input */}
            <TodoForm />

            {/* Filter tabs */}
            {todos.length > 0 && (
              <nav className="flex justify-center mb-6">
                <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-1 border border-white/10">
                  {[
                    { key: "all", label: "All", count: todos.length },
                    { key: "active", label: "Active", count: activeCount },
                    {
                      key: "completed",
                      label: "Completed",
                      count: completedCount,
                    },
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        filter === key
                          ? "bg-white text-sky-600 shadow-lg"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {label}
                      {!!count && (
                        <span className="ml-1 text-sm">({count})</span>
                      )}
                    </button>
                  ))}
                </div>
              </nav>
            )}

            {/* Todo list */}
            <section className="space-y-3">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 opacity-50">
                    <svg
                      className="w-full h-full text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white/80 mb-2">
                    {filter === "all"
                      ? "No tasks yet"
                      : filter === "active"
                      ? "No active tasks"
                      : "No completed tasks"}
                  </h3>
                  <p className="text-white/60">
                    {filter === "all"
                      ? "Add your first task above to get started!"
                      : filter === "active"
                      ? "All tasks are completed! 🎉"
                      : "Complete some tasks to see them here"}
                  </p>
                </div>
              ) : (
                filteredTodos.map((todo, i) => (
                  <TodoItem key={todo.id} todo={todo} index={i} />
                ))
              )}
            </section>

            {/* footer actions */}
            {completedCount > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={clearCompleted}
                  className="bg-red-500/20 text-red-400 border border-red-400/30 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-red-500/30 hover:scale-105 active:scale-95"
                >
                  Clear Completed ({completedCount})
                </button>
              </div>
            )}

            {/* stats */}
            {todos.length > 0 && (
              <p className="mt-8 text-center text-white/60">
                {activeCount} of {todos.length} tasks remaining
              </p>
            )}
          </div>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
