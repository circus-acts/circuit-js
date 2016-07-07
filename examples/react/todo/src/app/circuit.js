import Circus, { Circuit } from 'circus-js'
import model from './model'

const _ = Circus.UNDEFINED

const app = new Circuit()

const circuit = app.join({
  todos: app.merge({
    addTodo: model.addToList,
    editTodo: model.replaceInList,
    completeTodo: model.replaceInList,
    deleteTodo: model.removeFromList,
    clearComplete: model.purgeList,
    toggleComplete: model.toggleList
  }),
  filters: app.merge({
    all: 'all',
    completed: true,
    active: false
  }),
  editing: app.signal().pulse()
}).flow({
  filter: _,
  view: _
})

export default circuit
export const inputs = circuit.channels.todos.channels
export const filters = circuit.channels.filters.channels
export const editing = circuit.channels.editing
