# Circus-js Todo

This application demonstrates the use of a circuit to create the backbone of a fairly standard Todo app.

## Start

`npm install`

`npm start`

Go to `localhost:8080`

# Description

The circuit expresses the idea of a todo list as a collection of three stateful (ie, changeable) values: a list of todos, a filter setting and an editing state that determines whether or not to render the input form in place of a selected item. Whenever any of these values changes, a new item is added to the list, the user selects a different filter setting and so on, the circuit

These changeable values are called signals, and they can be declared easily enough through the construction of an simple object:

```javascript
const todoList = {
    todos,
    filter,
    editing
}
```

Since this is standard JavaScript, the three object properties need to be defined, either beforehand (they might be imported from independent modules, or in line. So before completing the circuit, lets flesh out the application with missing details.

First

## Model
The model is just pure JavaScript (pun intended ;)). Each of the functions defined here is pure and stateless - and easy to test.


```javascript

export const model = {

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

## Intentions
Intentions are loosely based on the idea expounded by the cycle-js application model


The actual circuit supplied by this app defines the actions, expressed through signal channels, required to make Todo do its thing.

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
    ACTIVE,
    COMPLETED,
    ALL
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


The model, bound to the circuit is equally easy to test, but you may prefer to mock out the model and test the circuit independently.
