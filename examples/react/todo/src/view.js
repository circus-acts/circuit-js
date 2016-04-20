import React from 'react';
import { render } from 'react-dom';
import { inputs } from './circuit'

// destructure the circuit inputs - for convenience
const {
  editing,
  filter: { channels: { all, completed, active }},
  todos: { channels: {completeTodo, editTodo, deleteTodo, addTodo, clearComplete, toggleComplete }}
} = inputs

// a helper function filtering on keyboard behaviour and binding type
const take = (e, bt) => {
  if ((e.keyCode===13 || bt==='blur')) {
    const v = e.target.value
    if (bt==='reset') e.target.value=''
    return v
  }
}

// prepare bindings and item props. Note that signal bindings are
// all re-entrant which means that identity must be maintained at
// value level.
const newTodo = e => addTodo.value(take(e,'reset'))
const props = (todo) => ({
  todo,
  editing:      editing.value() === todo.id,
  toggleEdit:   e => editing.value(todo.id),
  completeTodo: e => completeTodo.value({...todo, completed: e.target.checked}),
  deleteTodo:   e => deleteTodo.value(todo.id),
  editTodo:     t => e => editTodo.value({...todo, description: take(e,t)})
})

// the view (s)
const TodoList = ({todos, empty}) => render (
  <div className="todoapp">
    <div className="header">
      <h1>TODO</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        onKeyUp={newTodo} />
    </div>
    <section className="main">
      <button
        className="toggle-all"
        onClick={toggleComplete} />
      <ul className="todo-list">
        {todos.map(todo => <Todo key={todo.id} {...props(todo)}/>)}
      </ul>
    </section>
    {empty ? null :
    <footer className="footer">
      <ul className="filters">
        <li><button onClick={all}>all</button></li>
        <li><button onClick={active}>active</button></li>
        <li><button onClick={completed}>completed</button></li>
      </ul>
      <button className="clear-completed" onClick={clearComplete}>Clear completed</button>
    </footer>}
  </div>,
  document.querySelector('#app')
)

const Todo = ({todo, completeTodo, editTodo, deleteTodo, toggleEdit, editing}) =>
  editing ?
  <input
      className="edit"
      defaultValue={todo.description}
      onKeyUp={editTodo()}
      onBlur={editTodo('blur')}
      autoFocus={true} />
  :
  <li className={todo.completed? 'completed':''}>
    <div className="view">

      <input
        className="toggle"
        type="checkbox"
        checked={todo.completed}
        onChange={completeTodo} />

      <label onDoubleClick={toggleEdit}>{todo.description}</label>

      <button
        className="destroy"
        type="checkbox"
        onClick={deleteTodo} />
    </div>
  </li>

export default TodoList