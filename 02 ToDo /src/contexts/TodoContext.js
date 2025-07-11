import React, { createContext, useContext } from "react";

/* -------- Context setup -------- */
const TodoContext = createContext({
  todos: [],
  addTodo: () => {},
  updateTodo: () => {},
  deleteTodo: () => {},
  toggleComplete: () => {},
});

export const useTodo = () => useContext(TodoContext);
export const TodoProvider = TodoContext.Provider;
