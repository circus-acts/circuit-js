import circuit from 'babel-plugin-transform-circus-circuit'

var defaultStart = `
    const Circus = import 'circus'
    const app = new Circus()
`

var defaultEnd = `export default circuit`

function wrap(src, start, end) {
    return (start || defaultStart) + src + (end || defaultEnd)
}

runTests('circuit', function() {

    test('join', function(){
        var src = `const circuit = join { x }`

        var expected = `const circuit = app.join( { x } )`

        var actual = circuit.parse(src)

        return actual = wrap(expected)
    })

    test('operators', function(){
        var src = `const circuit = join { x > pulse}`

        var expected = `
        const x = app.signal().pulse()
        const circuit = app.join( { x: x.pulse() } )
        `

        var actual = circuit.parse(src)

        return actual = wrap(expected)
    })


})