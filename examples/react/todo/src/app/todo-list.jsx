import React from 'react';
import { render } from 'react-dom';
import { todos : intents } from './intents'
import Todo from './todo'

const TodoList = ({todos}) => render (
  <div className="todoapp">
    <div className="header">
      <h1>TODO</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        onKeyUp={intents.newTodo} />
    </div>
    <section className="main">
      <button
        className="toggle-all"
        onClick={intents.toggleComplete} />
      <ul className="todo-list">
        {todos.map(todo => <Todo
          key={todo.id}
          editing={intents.editing(todo.id)}
          {...todo}
        />)}
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

export default TodoList