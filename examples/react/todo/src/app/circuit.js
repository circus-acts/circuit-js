import { Circuit } from 'circus-js'
import model from './model'

const circuit = new Circuit();

export circuit.join({
  todos: circuit.merge({
    addTodo: model.addToList,
    editTodo: model.replaceInList,
    completeTodo: model.replaceInList,
    deleteTodo: model.removeFromList,
    clearComplete: model.purgeList,
    toggleComplete: model.toggleList
  }),
  filters: circuit.merge({
    all: 'all',
    completed: true,
    active: false
  }),
  editing: circuit.pulse
).flow({
  filter: _,
  view: _
})

export const inputs = circuit.channels.todos.channels
export const filters = circuit.channels.filters.channels