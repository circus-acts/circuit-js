import React from 'react'
import { render } from 'react-dom'
import circuit, { channels } from './circuit'

export default (props) => render( props.loggedIn
? <p>{props.loggedIn}</p>
: <div>
  <label>E-mail: <input defaultValue={email} onInput={channels.email.value}/></label>
  <label>password: <input type='password' onInput={channels.password.value}/></label>
  <p className='error'>{circuit.error()}</p>
  <button onClick={channels.login.value}>Login</button>
</div>
,document.querySelector('#login'))