# Circus-js Todo

This application demonstrates the use of a circuit to create the backbone of a fairly standard Todo app.

## Start

`npm install`

`npm start`

Go to `localhost:8080`

# Description

The circuit defines three stateful values: a list of todos, a filter setting and an editing state that determines whether or not to render the input form in place of a selected item:

```javascript
const circuit = app.join({
    todos,
    filter,
    editing
})
```

Since this is standard JavaScript, the three values need to be defined, either beforehand (they might be imported from independent modules), or in-line. This app demonstrates a mixture of both approaches (the model is imported) but it's important to note that circuits make no stipulation of their own. The actual circuit supplied by this app defines the actions, expressed through signal channels, required to make Todo do its thing.

```javascript
const circuit = app.join({
  todos: app.merge({
    addTodo: model.addToList,
    editTodo: model.replaceInList,
    completeTodo: model.replaceInList,
    deleteTodo: model.removeFromList,
    clearComplete: model.purgeList,
    toggleComplete: model.toggleList
  }),
  filter: app.merge({
    active: false,
    completed: true,
    all: Circus.UNDEFINED
  }),
  editing: app.signal().pulse()
})
```

A circuit consists of signals connected through different kinds of joins. The Todo circuit expresses input signals - defined by the object keys connected to

## Circuit basics:
A circuit:

* declaratively defines the flow of data through an application. It has logic for channelling the data, merging, joining or filtering it, or even blocking it until a condition is met or whilst a condition holds true.

* does not alter the state of the data that flows through it.

* makes no claim on the type of data that flows through it. Typing can be applied quite naturally to the topography of a circuit through typescript or flow semantics.

## Model
The model is just pure JavaScript (pun intended ;)). Each of the functions here is pure and stateless - and easy to test.

```javascript
const model = {

  addToList: (description, todos) => todos.slice().concat({
    id: todos.length + 1,
    description,
    completed: false
  }),

  replaceInList: (todo, todos) => todos.map(t => t.id === todo.id? {...todo} : t),

  removeFromList: (id, todos) => todos.filter(t => t.id !== id),

  purgeList: (_, todos) => todos.filter(t => !t.completed),

  toggleList: (completed, todos) => todos.map(t => ({...t, completed}))
}
```

The model, bound to the circuit is equally easy to test, but you may prefer to mock out the model and test the circuit independently.
