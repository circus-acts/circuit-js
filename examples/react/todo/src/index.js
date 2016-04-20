import circuit from './circuit'
import model from './model'
import view from './view'
import intent, { filter } from './intent'

const testData = {
  todos:[
    { id: 1, description: '1st todo', completed: false },
    { id: 2, description: '2nd todo', completed: true }
  ],
  filter:'all'
}

// Add a new layer of behaviour to the Todo circuit. The model will
// bind to the circuit outputs, the intent to the inputs (this by
// simple channel name matching). The filter and view complete the
// circuit, and the initial value kicks it all off.
circuit.overlay(model, intent).flow(filter, view).value(testData)
