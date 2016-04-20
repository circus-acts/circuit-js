export default {

  todos: {
    addToList: (description, todos) => todos.slice().concat({
      id: todos.length+1,
      description,
      completed: false
    }),

    replaceInList: (todo, todos) => todos.map(t => t.id===todo.id? {...todo} : t),

    removeFromList: (id, todos) => todos.filter(t => t.id!==id),

    purgeList: (_, todos) => todos.filter(t => !t.completed),

    toggleList: completed => (_, todos) => {completed=!completed; return todos.map(t => ({...t, completed}))},
  }
}
