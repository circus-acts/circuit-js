import React from 'react'
import { render } from 'react-dom'
import circuit, { channels } from './circuit'

export default ({email, loggedIn}) => render(
loggedIn
  ? <p>{loggedIn}</p>
  : <fieldset>
      <label>
        <span>E-mail:</span>
        <input defaultValue={email} onInput={channels.email.value}/>
      </label>
      <label>
        <span>Password:</span>
        <input type='password' onInput={channels.password.value}/>
      </label>
      <p className='error'>{circuit.error()}</p>
      <button onClick={channels.login.value}>Login</button>
    </fieldset>
,document.querySelector('#login'))