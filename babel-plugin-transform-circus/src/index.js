import 'better-log/install';

const log = function() {
  console.log(`log: ${new Date()}`)
  console.log(arguments)
}
const vstep = (count => (...args) => {
  console.log(`vstep: `,...args)
})(0)

module.exports = function ({ types: t }) {

const functorTraverser = {
  Identifier(path, file) {
    vstep('Identifier', path.node.name)
  }
}
function functor(path, file) {
  var functorState = {left:path.node.left,right:path.node.right}
  path.traverse(functorTraverser, {functorState})
// if (path.isReferencedIdentifier()) {
//     path.replaceWithSourceString(
//       //`${`
//     )
//   }
}

	return {
		visitor: {
			Program(path, file) {
                vstep('Program')
//                path.unshiftContainer('body', t.expressionStatement(t.stringLiteral('use helloworld')));
      },
      BinaryExpression(path, file) {
        vstep('BinaryExpression', path)
        switch (path.node.operator) {
          case '>' : functor(path, file); break
        }
      }
		}
	};
};
