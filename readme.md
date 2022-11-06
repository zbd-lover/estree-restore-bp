# Profile
Restore deconstruction syntax that bases on estree.
# Api
## restore
### use
``` javascript
// in esmodule
import { restore } from 'estree-restore-bp'
// in global
const { restore } = window.EstBpRestorer
```
### example
``` javascript
import { parse } from 'acorn'
const script = `
const user = {}
const {
  key1,
  key2 = 10,
  ...rest
} = user || {}
`
/**
 * Abstract representation of
 *  temp = user || {},
 *  key1 = temp.key1,
 *  $temp = temp.key2,
 *  key2 = $temp === void 0 ? 10 : $temp,
 *  rest = omit(temp, ['key1', 'key2'])
 */
const target = [
  {
    temporary: true,
    useOmitAPI: false,
    definition: {
      id: {
        type: 'Identifier',
        name: 'temp'
      },
      value: {
        type: 'LogicalExpression',
        operator: '||',
        left: {
          type: 'Identifier',
          name: 'user'
        },
        right: {
          type: 'ObjectExpression',
          properties: []
        }
      }
    }
  },
  {
    temporary: false,
    useOmitAPI: false,
    definition: {
      id: {
        type: 'Identifier',
        name: 'key1'
      },
      value: {
        type: 'MemberExpression',
        optional: false,
        computed: false,
        object: {
          type: 'Identifier',
          name: 'temp'
        },
        property: {
          type: 'Identifier',
          name: 'key1'
        }
      }
    }
  },
  {
    temporary: true,
    useOmitAPI: false,
    definition: {
      id: {
        type: 'Identifier',
        name: '$temp'
      },
      value: {
        type: 'MemberExpression',
        optional: false,
        computed: false,
        object: {
          type: 'Identifier',
          name: 'temp'
        },
        property: {
          type: 'Identifier',
          name: 'key2'
        }
      }
    }
  },
  {
    temporary: false,
    useOmitAPI: false,
    definition: {
      id: {
        type: 'Identifier',
        name: 'key2'
      },
      value: {
        type: 'ConditionalExpression',
        test: {
          type: 'BinaryExpression',
          operator: '===',
          left: {
            type: 'Identifier',
            name: '$temp'
          },
          right: {
            type: 'UnaryExpression',
            operator: 'void',
            argument: {
              type: 'Literal',
              value: 0,
              raw: '0'
            },
            prefix: true
          }
        },
        consequent: {
          type: 'Literal',
          value: 10,
          raw: '10'
        },
        alternate: {
          type: 'Identifier',
          name: '$temp'
        }
      }
    }
  },
  {
    temporary: false,
    useOmitAPI: true,
    definition: {
      id: {
        type: 'Identifier',
        name: 'rest'
      },
      value: {
        type: 'CallExpression',
        optional: false,
        callee: {
          type: 'Identifier',
          name: 'omit'
        },
        arguments: [
          {
            type: 'Identifier',
            name: 'temp'
          },
          {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'Literal',
                value: 'key1',
                raw: `'key1'`
              },
              {
                type: 'Literal',
                value: 'key2',
                raw: `'key2'`
              }
            ]
          },
        ]
      }
    }
  },
]
const ast = parse(script, {
  ecmaVersion: 'latest',
  sourceType: 'script'
})
const declarator = ast.body[1].declarations[0]
expect(restore(declarator)).toEqual(target)
```
# Types
```typescript
interface Definition {
  id: Identifier | MemberExpression,
  value: Expression
}

interface ResultItem {
  temporary: boolean,
  useOmitAPI: boolean,
  definition: Definition,
}

function restore<T extends VariableDeclarator | AssignmentExpression>(node: T): ResultItem[];
```
# Note
All temp var names will be unique.