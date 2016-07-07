import React from 'react'
import { render } from 'react-dom'
import { bind } from './intent'

const Todo = ({editing, todo}) => {
  const { id, description, completed, intents } = bind(todo)

  return editing ?
  <input
      className="edit"
      defaultValue={description}
      onKeyUp={intents.editTodoOnCR}
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

export default Todo