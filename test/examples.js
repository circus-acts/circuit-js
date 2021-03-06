import Circuit, {Channel} from '../src'
import Utils from '../src/utils'
import * as error from '../src/error'

runTests('exaples', function() {
	test('readme 1', function(done){
		const dbl = v => v + v
		const log = v => console.log(v)

		const channel1 = new Channel().map(dbl).tap(log)
		channel1.signal('ho') // maps 'ho' onto 'hoho' and then logs => hoho

		const channel2 = new Channel().map(dbl).tap(log)

		const circuit = new Circuit().assign({
			channel1,
			channel2
		})

		circuit.tap(log)

		channel2.signal('he') // logs..
		// => hehe
		// => {channel1: 'hoho', channel2: 'hehe'}
		return true;
	})

	test('readme 2', function(done){
		const dbl = v => v + v
		const log = v => console.log(v)
		// new signature takes parent value and signalled value
		const dblUp = (pv = '', sv) => pv + dbl(sv)

		const channel1 = new Channel().map(dblUp)
		const channel2 = new Channel().map(dblUp)

		const circuit = new Circuit().fold({
			channel1,
			channel2
		}).tap(log)

		channel1.signal('ho') // logs => hoho
		channel2.signal('he') // logs => hohohehe
		return true;
	})
})