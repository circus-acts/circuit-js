// Intentions are a good place to extend and customise circuit logic. An application
// might typically extend input signals through validation and animation steps. Here
// though, we are simply separating the concerns of circuit binding from the view to
// provide a cleaner interface.

import circuit, {editing, inputs, filters} from './circuit'

// The first signal extension we need is a filter to refine the displayed list into all,
// completed or active todos.
//
// Notice that this mapping function receives both the immediate signal value and its
// binding context value, a list of todos. If you look to the circuit you will see that
// this list is the product of a merge of input signals
export const filter = ({ filters, todos }) => ({
  todos: todos.filter(t => filters==='all' || t.completed===filters),
  empty: todos.length === 0
})

// A helper function bound to event type that returns a signal to extract and propagate
// the event value
const take = bindType => circuit.asSignal(e => {
  const value = e.target[bindType || 'value']
  if ((e.keyCode===13 || bindType==='blur')) {
    if (bindType==='value') e.target.value=''
    return value
  }
  return bindType==='checked'? v : undefined
})

// Export prepared bindings and item props. Note that the signals are pure which implies
// that identity must be maintained at value level. The binding strategy selected here
// is not the most performant (a new closure is created for each todo in the list) but
// takes into account the likely number of todos - a good compromise for clean view syntax.

export const todos  = {
  newTodo:        take('value').map(inputs.addTodo.value).value,
  toggleComplete: inputs.toggleComplete.value,
  clearComplete:  inputs.clearComplete.value,

  editing: id => editing.value() === id,

  all:  filters.all.value,
  active:  filters.active.value,
  completed:  filters.completed.value
}

export const bind = todo => ({
  intents: {
    toggleEdit:     _ => editing.value(todo.id),
    deleteTodo:     _ => inputs.deleteTodo.value(todo.id),
    completeTodo:   take('checked').map(v => inputs.editTodo.value({...todo, completed: v})).value,
    editTodoOnCR:   take().map(v => inputs.editTodo.value({...todo, description: v})).value,
    editTodoOnBlur: take('blur').map(v => inputs.editTodo.value({...todo, description: v})).value
  },

  // spread the data props - again, just for cleaner syntax
  ...todo
})

