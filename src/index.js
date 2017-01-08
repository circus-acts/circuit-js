import Circuit from './circuit'
import Channel, {fail, halt, state} from './channel'
import Match from './match'
import utils from './utils'

import { Error, test } from './error'

export { Channel, Match, Error, test, utils, fail, halt, state }
export default Circuit
