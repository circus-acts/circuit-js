// circuit syntax:
//   identifiers: referenced || signal
//   verbs: join, merge, sample, match [any, all, none, one]
//   channels:
//      input===output
//      input -> output
//      input -> step -> output

const circuit = join(
    a1 -> a2 -> a3,
    b -> match({
        1: b1 -> b12,
        2: b2
    }),
    c -> any({
        1: a1,
        2: a2
    })
)

const circuit = app.join({
    a1: a2,
    b: app.match({
        1: b1.map(b12),
        2: b2
    })
})
