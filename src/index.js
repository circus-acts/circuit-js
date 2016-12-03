import Circuit from './circuit'
import Signal, {fail, halt, state} from './signal'
import Match from './match'
import utils from './utils'

import { Error, test } from './error'

export { Signal, Match, Error, test, utils, fail, halt, state }
export default Circuit
