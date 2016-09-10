const model = {

  addToList: (description, todos) => todos.concat({
    id: todos.length + 1,
    description,
    completed: false
  }),

  replaceInList: (todo, todos) => todos.map(t => t.id === todo.id? {...todo} : t),

  removeFromList: (id, todos) => todos.filter(t => t.id !== id),

  purgeList: (_, todos) => todos.filter(t => !t.completed),

  toggleList: (completed, todos) => todos.map(t => ({...t, completed}))
}

export default model