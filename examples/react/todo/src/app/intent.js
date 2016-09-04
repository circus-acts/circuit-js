// Intentions are a good place to extend and customise circuit logic. An application
// might typically extend input signals through validation and animation steps. Here
// though, we are simply abstracting the concerns of circuit binding out of the view.

import circuit, {editing, inputs, filter, filterType} from './circuit'

// Notice that the signature for this function matches the primary circuit channels
export const filterTodos = ({ todos, filter, editing }) => ({
  todos: todos.filter(t => {
    switch (filter) {
      case filterType.COMPLETED: return t.completed
      case filterType.ACTIVE: return !t.completed
      default: return true
    }
  }),
  editing
})

// A helper function that extracts the event value by type
const take = type => e => {
  const value = e.target[type==='checked' && 'checked' || 'value']
  if ((e.keyCode===13 || type==='blur')) {
    if (type==='value') e.target.value=''
    return value
  }
  return type==='checked'? !!value : undefined
}

// Export prepared bindings and item props. Note that the signals are pure which implies
// that identity must be maintained at value level. The binding strategy selected here
// is not the most performant (a new closure is created for each todo in the list) but
// takes into account the likely number of todos - a good compromise for clean view syntax.

export const todos  = {
  newTodo:        take('value').map(inputs.addTodo.value).value,
  toggleComplete: take('checked').map(inputs.toggleComplete.value).value,
  clearComplete:  inputs.clearComplete.value,

  all:  filter.ALL.value,
  active:  filter.ACTIVE.value,
  completed:  filter.COMPLETED.value
}

export const bind = todo => ({
  intents: {
    toggleEdit:     _ => editing.value(todo.id),
    deleteTodo:     _ => inputs.deleteTodo.value(todo.id),
    completeTodo:   take('checked').map(v => inputs.editTodo.value({...todo, completed: v})).value,
    editTodoOnCR:   take().map(v => inputs.editTodo.value({...todo, description: v})).value,
    editTodoOnBlur: take('blur').map(v => inputs.editTodo.value({...todo, description: v})).value
  }
})

