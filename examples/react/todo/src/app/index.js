import circuit from './circuit'
import view from './todo-list'
import { filter } from './intent'

const testData = {
  todos:[
    { id: 1, description: '1st todo', completed: false },
    { id: 2, description: '2nd todo', completed: true }
  ],
  filter:'all'
}

// Add a new layer of behaviour to the Todo circuit. The model,
// already bound to the circuit, will feed to the view through
// a filter (this by simple channel name matching). The initial
//value kicks it all off.
circuit
    .overlay(filter, view)
    .value(testData)
