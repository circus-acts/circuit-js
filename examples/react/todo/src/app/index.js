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
// is already bound to the circuit, so we just need to map its values over a filter
// function and a view (flow is just sugar for map -> map). The view, like all other
// map functions should be pure - a perfect fit for React stateless function components!
// (https://facebook.github.io/react/docs/reusable-components.html#stateless-functions)

circuit
    .prime(testData)
    .flow(filterTodos, view)

// Pushing the testData directly to the view kicks it all off.
view(testData)