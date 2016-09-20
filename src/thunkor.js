import Signal from './signal'

export default function thunkor(v, resolve) {
  resolve = resolve || Signal.id
  return typeof v === 'function'
  ? function(next) { v(function(tv) {next(resolve(tv))}) }
  : resolve(v)
}
