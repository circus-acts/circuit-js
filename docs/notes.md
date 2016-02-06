match -> filter

filter: () -> v -> v // pass all truthy (shallow diff)
filter: fn -> v -> v // pass fn -> truthy
filter: ({}) -> v -> v // pass all truthy (mask diff)
filter: ({},fn) -> v -> v // pass all truthy (mask diff)
