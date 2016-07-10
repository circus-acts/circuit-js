const model = require('./model')
const { deepEqual } = require('circus-utils')

runTest('todo model', function(){

    const todo, list

    setup(function(){

        todo = {
            id: 1,
            description: 'xxx',
            completed: true
        }

        list = [{...todo, completed: false}]
    })

    test('add a new todo', function(){
        var result = model.addToList('xxx', [])
        return deepEqual(result, list)
    })

    test('update a todo', function(){
        const expected = [todo]
        const result = model.replaceInList({todo, list)
        return deepEqual(result, expected)
    })

    test('remove a todo', function(){
        const result = model.removeFromList(1, list)
        return deepEqual(result, [])
    })

    test('remove completed todos', function(){
        const result = model.purgeList(null, list)
        return deepEqual(result, [])
    })

    test('toggle completed todos', function(){
        const result = model.toggleList(null, list)
        return deepEqual(result, [todo])
    })

    test('immutable', function(){
        var result = model.removeFromList(1, list)
        return result !== list
    })

})