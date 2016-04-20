const { runTest, test } = require('test')
const todo, { inputs, outputs } = require('./todo')

runTest('todo circuit', function(){

    test('list channels', function(){
        return Object.keys(inputs.todos.channels).reduce( (pass,action) => {
            inputs[action].value('xxx')
            return pass && todos.value() === 'xxx'
        }, true)
    })

    test('filter all', function(){
        inputs.all.value(true)
        return inputs.filter === 'all'
    })

    test('filter completed', function(){
        inputs.completed.value(true)
        return inputs.filter === true
    })

    test('filter active', function(){
        inputs.active.value(true)
        return inputs.filter === false
    })

    test('editing', function(){
        inputs.editing.value(true)
        return inputs.editing.value() !== true
    })

    test('filtered list', function(){
        inputs.addTodo.value('xxx')
        inputs.active.value(true)
        inputs.editing.value(true)

        var result = todo.output.filteredList.value()

        return result.todos === 'xxx' & result.filter === true && result.editing === true
    })
})