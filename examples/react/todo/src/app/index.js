import circuit from './circuit'
import view from './view.jsx'
import { filterTodos } from './intent'

const testData = {
  todos:[
    { id: 1, description: '1st todo', completed: false },
    { id: 2, description: '2nd todo', completed: true }
  ]
}

// Add a new layer of behaviour to the Todo circuit. In this example, the model
// is already bound to the circuit, so overlay the filter and view will feed into
// the view through a filter.
circuit
    .prime(testData)
    .flow(filterTodos, view)

// Pushing the testData directly to the view kicks it all off.
view(testData)