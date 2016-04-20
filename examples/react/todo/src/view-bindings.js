import { inputs } from './circuit'
import { BLUR, RESET } from './constants'

// a helper function filtering on keyboard behaviour
const take = (evt, type) => {
  if ((evt.keyCode === 13 || type === BLUR)) {
    const v = evt.target.value
    if (type === RESET) evt.target.value=''
    return v
  }
}

// bundle up bound signal values for convenience.
const props = (todo) => ({
  todo,
  editing:      editing.value() === todo.id,
  toggleEdit:   e => editing.value(todo.id),
  completeTodo: e => completeTodo.value({...todo, completed: e.target.checked}),
  deleteTodo:   e => deleteTodo.value(todo.id),
  editTodo:     t => e => editTodo.value({...todo, description: take(e,t)})
})

const newTodo = e => addTodo.value(take(e, RESET))

export default {
  todos: {
    addTodo: v => v,
    editTodo: v => v.description && v
  }
}

  newTodo,
  props,
  todos
}