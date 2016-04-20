const todo = join(

  todos -> merge (
    addTodo -> addToList,
    editTodo -> replaceInList,
    completeTodo -> replaceInList,
    deleteTodo -> removeFromList,
    clearComplete -> purgeList,
    toggleComplete -> toggleList
  ),

  filter -> merge (
    all -> 'all',
    completed -> true,
    active -> false
  ),

  editing -> pulse
)

export default todo
export inputs()
export outputs()
