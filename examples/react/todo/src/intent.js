export const filter = ({ filter, todos }) => ({
  todos: todos.filter(t => filter==='all' || t.completed===filter),
  empty: todos.length === 0
})

export default {
  todos: {
    addTodo: any(),
    editTodo: any(description: true)
  }
}
