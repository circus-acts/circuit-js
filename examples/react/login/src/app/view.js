import React from 'react'
import { render } from 'react-dom'
import circuit, { channels } from './circuit'

const input = channel => e => channel.value(e.target.value)

export default ({email, loggedIn}) => render(
loggedIn
  ? <p>{loggedIn}</p>
  : <fieldset>
      <label>
        <span>E-mail:</span>
        <input defaultValue={email} onBlur={input(channels.email)}/>
      </label>
      <label>
        <span>Password:</span>
        <input type='password' onBlur={input(channels.password)}/>
      </label>
      <p className='error'>{circuit.error()}</p>
      <button onClick={channels.login.value}>Login</button>
    </fieldset>
,document.querySelector('#login'))