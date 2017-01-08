import Channel from './channel'

export default function thunkor(v, resolve) {
  resolve = resolve || Channel.id
  return typeof v === 'function'
  ? function(next) { v(function(tv) {next(resolve(tv))}) }
  : resolve(v)
}
