import React from 'react';
import {render} from 'react-dom';
import Circuit from './circuit'

const testData = {
  todos:[
    { id: 1, description: '1st todo', completed: false },
    { id: 2, description: '2nd todo', completed: true }
  ],
  filter:'all'
}

const app = new Circuit()

// Model : i -> M -> v aka functional components
const addToList = (description, todos) => todos.slice().concat({
  id: todos.length+1,
  description,
  completed: false
})
const replaceInList = (todo, todos) => todos.map(t => t.id===todo.id? {...todo} : t)
const removeFromList = (id, todos) => todos.filter(t => t.id!==id)
const purgeList = (_,todos) => todos.filter(t => !t.completed)
const toggleList = completed => (_, todos) => {completed=!completed; return todos.map(t => ({...t, completed}))}
const filterList = ({ filter, todos, editing }) => ({
  todos: todos.filter(t => filter==='all' || t.completed===filter),
  editing
})

// circuit : aka structural components
const circuit = app.join({
  todos: app.merge({
    addTodo: addToList,
    editTodo: replaceInList,
    completeTodo: replaceInList,
    deleteTodo: removeFromList,
    clearComplete: purgeList,
    toggleComplete: toggleList()
  }),
  filter: app.merge({
    all: 'all',
    completed: true,
    active: false
  }),
  editing: app.signal().pulse()
}).map(filterList)

// Intentions : v -> I -> m aka channel bindings
// Extract the channel inputs - there are quite a lot of them!
const {
  editing,
  filter: { channels: { all, completed, active }},
  todos: { channels: {completeTodo, editTodo, deleteTodo, addTodo, clearComplete, toggleComplete }}
} = circuit.channels

// a helper function filtering on keyboard behaviour
const take = (e,t) => {
  if ((e.keyCode===13 || t==='blur')) {
    const v = e.target.value
    if (t==='reset') e.target.value=''
    return v
  }
}

// extend the input signal intentions
const newTodo = e => addTodo.value(take(e,'reset'))
addTodo.map(v => v)
editTodo.map(v => v.description && v)

// bundle up bound signal values for convenience.
const props = (todo) => ({
  todo,
  editing:      editing.value() === todo.id,
  toggleEdit:   e => editing.value(todo.id),
  completeTodo: e => completeTodo.value({...todo, completed: e.target.checked}),
  deleteTodo:   e => deleteTodo.value(todo.id),
  editTodo:     t => e => editTodo.value({...todo, description: take(e,t)})
})

// View : m -> V -> i
const TodoList = ({todos}) =>
render(
  <div className="todoapp">
    <div className="header">
      <h1>TODO</h1>
      <input className="new-todo" placeholder="What needs to be done?" onKeyUp={newTodo}/>
    </div>
    <section className="main">
      <button className="toggle-all" onClick={toggleComplete.value}/>
      <ul className="todo-list">
        {todos.map(todo => <Todo key={todo.id} {...props(todo)}/>)}
      </ul>
    </section>
    {todos.length ?
    <footer className="footer">
      <ul className="filters">
        <li><button onClick={all.value}>all</button></li>
        <li><button onClick={active.value}>active</button></li>
        <li><button onClick={completed.value}>completed</button></li>
      </ul>
      <button className="clear-completed" onClick={clearComplete.value}>Clear completed</button>
    </footer> : null}
  </div>,
  document.querySelector('#app')
)

const Todo = ({todo, completeTodo, editTodo, deleteTodo, toggleEdit, editing}) =>
  editing
  ? <input className="edit" defaultValue={todo.description} onKeyUp={editTodo()} onBlur={editTodo('blur')} autoFocus={true}/>
  : <li className={todo.completed? 'completed':''}>
    <div className="view">
      <input className="toggle" type="checkbox" checked={todo.completed} onChange={completeTodo}/>
      <label onDoubleClick={toggleEdit}>{todo.description}</label>
      <button className="destroy" type="checkbox" onClick={deleteTodo} />
    </div>
  </li>

circuit.map(TodoList).value(testData)
