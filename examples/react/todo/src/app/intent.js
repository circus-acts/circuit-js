import {editing, inputs, filters} from './circuit'

export const filter = ({ filter, todos }) => ({
  todos: todos.filter(t => filter==='all' || t.completed===filter),
  empty: todos.length === 0
})

// a helper function filtering on keyboard behaviour and binding type
export const take = (e, bindType) => {
  const value = e.target[bindType]
  if ((e.keyCode===13 || bindType==='blur')) {
    if (bindType==='reset') e.target.value=''
  }
  return value
}

export const todos  = {
  newTodo:  e => inputs.addTodo.value(take(e,'reset')),
  toggleComplete:  inputs.toggleComplete.value,
  clearComplete:  inputs.clearComplete.value,

  editing: id => editing.value() === id,

  all:  filters.all.value,
  active:  filters.active.value,
  complete:  filters.compete.value
}

// prepare bindings and item props. Note that signal bindings are
// all re-entrant which means that identity must be maintained at
// value level.
export const bind = todo => ({
  toggleEdit:     _ => editing.value(todo.id),
  deleteTodo:     _ => inputs.deleteTodo.value(todo.id),
  completeTodo:   e => inputs.completeTodo.value({...todo, completed: take('checked')}),
  editTodoOnCR:   e => inputs.editTodo.value({...todo, description: take(e)}),
  editTodoOnBlur: e => inputs.editTodo.value({...todo, description: take(e,'blur')}),
  ...todo
})

