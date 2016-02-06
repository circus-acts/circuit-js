import Circuit from './circuit'
import React from 'react';
import {render} from 'react-dom';

const testData = {
  todos:[
    { id: 0, description: '1st todo', completed: false },
    { id: 1, description: '2nd todo', completed: true }
  ],
  filter:'all'
}

const app = new Circuit(testData)

// Model : i -> M -> v aka functional components
const addToList = (description, todos) => todos.slice().concat({
  id: todos.length,
  description,
  completed: false
})
const replaceInList = (todo, todos) => todos.map(t => t.id===todo.id? todo : t)
const removeFromList = (todo, todos) => todos.filter(t => t.id!==todo.id)
const filterList = ({ filter, todos }) => todos.filter(t => filter==='all' || t.completed===filter)

// circuit : aka structural components
const circuit = app.join({
  todos: app.merge({
    newTodo: addToList,
    editTodo: replaceInList,
    completeTodo: replaceInList,
    deleteTodo: removeFromList
  }),
  filter: app.merge({
    all: 'all',
    completed: true,
    notCompleted: false
  })
}).map(filterList)

// Intentions : v -> I -> m aka channel bindings
const {
  filter: { channels: { all, completed, notCompleted }},
  todos: { channels: {completeTodo, editTodo, deleteTodo, newTodo }}
} = circuit.channels


const bind = todo => ({
  todo,
  completeTodo: e => completeTodo.value({...todo, completed: e.target.checked}),
  editTodo:     e => editTodo.value({...todo, description: e.target.value}),
  deleteTodo:  () => deleteTodo.value(todo)
})

newTodo.map(e => {
  const v = e.target.value
  if (e.keyCode===13 && v.length) {
    e.target.value=''
    return v
  }
})

// View : m -> V -> i
const TodoList = todos =>
render(
  <div>
    <h1>TODOs</h1>
    <input placeholder="What do you want to do?" onKeyUp={newTodo.value}/>
    <ul>
      {todos.map(todo => <Todo key={todo.id} {...bind(todo)}/>)}
    </ul>
    <footer>
      <button onClick={all.value}>all</button>
      <button onClick={completed.value}>completed</button>
      <button onClick={notCompleted.value}>notCompleted</button>
    </footer>
  </div>,
  document.querySelector('#app')
)

const Todo = ({todo, completeTodo, editTodo, deleteTodo }) => <li>
  <input type="checkbox" defaultChecked={todo.completed} onClick={completeTodo} />
  <input className={todo.completed} value={todo.description} onChange={editTodo} />
  <input type="checkbox" onClick={deleteTodo} />
</li>

// kick off with an identity test.
circuit.map(TodoList).value(Circuit.ID);
