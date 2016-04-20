import React from 'react'
import { render } from 'react-dom'
import circuit, { channels } from './circuit'

export default ({ email }) => render(
<div>
  <label>E-mail: <input defaultValue={email} onInput={channels.email.value}/></label>
  <label>password: <input type='password' onInput={channels.password.value}/></label>
  <p className='error'>{circuit.error()}</p>
  <button onClick={channels.cta.value}>Login</button>
</div>
,document.querySelector('#login'))