import React from 'react'
import { render } from 'react-dom'
import { bind, todos as intents } from './intent'
import Todo from './todo.jsx'

const Todo = ({editing, todo}) => {
  const { description, completed } = todo
  const intents = bind(todo)

  return editing ?
  <input
      className="edit"
      defaultValue={description}
      onKeyUp={intents.editTodoOnKeyUp}
      onBlur={intents.editTodoOnBlur}
      autoFocus={true} />
  :
  <li className={completed? 'completed':''}>
    <div className="view">

      <input
        className="toggle"
        type="checkbox"
        checked={completed}
        onChange={intents.completeTodo} />

      <label onDoubleClick={intents.toggleEdit}>{description}</label>

      <button
        className="destroy"
        type="checkbox"
        onClick={intents.deleteTodo} />
    </div>
  </li>
}

// The main view will receive its props directly from the circuit.
export default ({todos, editing}) => render (
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
            todo={todo}
          />
        )}
      </ul>
    </section>
    <footer className="footer">
      {todos.length && <ul className="filters">
        <li><button onClick={intents.all}>all</button></li>
        <li><button onClick={intents.active}>active</button></li>
        <li><button onClick={intents.completed}>completed</button></li>
      </ul>}
      <button className="clear-completed" onClick={intents.clearComplete}>Clear completed</button>
    }
    </footer>}
  </div>,
  document.querySelector('#todo')
)
