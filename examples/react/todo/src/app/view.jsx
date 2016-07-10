import React from 'react'
import { render } from 'react-dom'
import { todos as intents } from './intent'
import Todo from './todo.jsx'

// The view will receive its props directly from the circuit.
// A more sophisticated app will probably map circuit outputs
// onto React state.
const view = ({todos, editing}) => render (
  <div className="todoapp">
    <div className="header">
      <h1>TODO</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        onKeyUp={intents.newTodo} />
    </div>
    <section className="main">
      <input
        type="checkbox"
        className="toggle-all"
        onClick={intents.toggleComplete} />
      <ul className="todo-list">
        {todos.map(todo =>
          <Todo
            key={todo.id}
            editing={todo.id===editing}
            todo={todo} />
        )}
      </ul>
    </section>
    {!todos.length ? null :
    <footer className="footer">
      <ul className="filters">
        <li><button onClick={intents.all}>all</button></li>
        <li><button onClick={intents.active}>active</button></li>
        <li><button onClick={intents.completed}>completed</button></li>
      </ul>
      <button className="clear-completed" onClick={intents.clearComplete}>Clear completed</button>
    </footer>}
  </div>,
  document.querySelector('#todo')
)

export default view