import { AssignmentExpression, ExpressionStatement, VariableDeclaration } from 'estree'
import { restore, ResultItem } from '../src'

import { withoutPos, parseScript, genIsUndefTest } from './helpers'

test('object pattern 1', () => {
  const script = `
    const user = {}
    const {
      key1,
      key2 = 3,
      _key3: key3,
      _key4: {
        key4,
        key5 = 5,
        _key6: key6,
        ...rest1
      },
      ...rest2
    } = user
  `
  const ast = parseScript(script)
  const declarataor = (ast.body[1] as VariableDeclaration).declarations[0]
  const target: ResultItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'temp'
        },
        value: {
          type: 'Identifier',
          name: 'user'
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
          test: genIsUndefTest({
            type: 'Identifier',
            name: '$temp'
          }),
          consequent: {
            type: 'Literal',
            value: 3,
            raw: '3'
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
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'key3'
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
            name: '_key3'
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
          name: '$$temp'
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
            name: '_key4'
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
          name: 'key4'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: '$$temp'
          },
          property: {
            type: 'Identifier',
            name: 'key4'
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
          name: '$$$temp'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: '$$temp'
          },
          property: {
            type: 'Identifier',
            name: 'key5'
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
          name: 'key5'
        },
        value: {
          type: 'ConditionalExpression',
          test: genIsUndefTest({
            type: 'Identifier',
            name: '$$$temp'
          }),
          consequent: {
            type: 'Literal',
            value: 5,
            raw: '5'
          },
          alternate: {
            type: 'Identifier',
            name: '$$$temp'
          }
        }
      },
    },
    {
      temporary: false,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'key6'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: '$$temp'
          },
          property: {
            type: 'Identifier',
            name: '_key6'
          }
        }
      },
    },
    {
      temporary: false,
      useOmitAPI: true,
      definition: {
        id: {
          type: 'Identifier',
          name: 'rest1'
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
              name: '$$temp',
            },
            {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 'key4',
                  raw: '\'key4\''
                },
                {
                  type: 'Literal',
                  value: 'key5',
                  raw: '\'key5\''
                },
                {
                  type: 'Literal',
                  value: '_key6',
                  raw: '\'_key6\''
                },
              ]
            }
          ]
        }
      },
    },
    {
      temporary: false,
      useOmitAPI: true,
      definition: {
        id: {
          type: 'Identifier',
          name: 'rest2'
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
              name: 'temp',
            },
            {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 'key1',
                  raw: '\'key1\''
                },
                {
                  type: 'Literal',
                  value: 'key2',
                  raw: '\'key2\''
                },
                {
                  type: 'Literal',
                  value: '_key3',
                  raw: '\'_key3\''
                },
                {
                  type: 'Literal',
                  value: '_key4',
                  raw: '\'_key4\''
                },
              ]
            }
          ]
        }
      },
    }
  ]
  expect(withoutPos(restore(declarataor))).toEqual(target)
})

test('object pattern 2', () => {
  const script = `
    const user = {}
    const {
      key1: {
        temp,
      } = {}
    } = user || {}
  `
  const ast = parseScript(script)
  const declarataor = (ast.body[1] as VariableDeclaration).declarations[0]
  const target: ResultItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: '$temp'
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
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: '$$temp'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: '$temp',
          },
          property: {
            type: 'Identifier',
            name: 'key1',
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
          name: '$$$temp'
        },
        value: {
          type: 'ConditionalExpression',
          test: genIsUndefTest({
            type: 'Identifier',
            name: '$$temp'
          }),
          consequent: {
            type: 'ObjectExpression',
            properties: []
          },
          alternate: {
            type: 'Identifier',
            name: '$$temp'
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
          name: 'temp'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: '$$$temp'
          },
          property: {
            type: 'Identifier',
            name: 'temp'
          }
        }
      }
    },
  ]
  expect(withoutPos(restore(declarataor))).toEqual(target)
})

test('array pattern 1', () => {
  const script = `
    const user = []
    const [
      key1,
      key2 = 3,
      [
        key3,
        key4 = 5,
        ...rest1
      ],
      ...rest2
    ] = user
  `
  const ast = parseScript(script)
  const declarataor = (ast.body[1] as VariableDeclaration).declarations[0]
  const target: ResultItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'temp'
        },
        value: {
          type: 'Identifier',
          name: 'user'
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
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp'
          },
          property: {
            type: 'Literal',
            value: 0,
            raw: '0'
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
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp'
          },
          property: {
            type: 'Literal',
            value: 1,
            raw: '1'
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
          test: genIsUndefTest({
            type: 'Identifier',
            name: '$temp'
          }),
          consequent: {
            type: 'Literal',
            value: 3,
            raw: '3'
          },
          alternate: {
            type: 'Identifier',
            name: '$temp'
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
          name: '$$temp'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp'
          },
          property: {
            type: 'Literal',
            value: 2,
            raw: '2'
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
          name: 'key3'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: '$$temp'
          },
          property: {
            type: 'Literal',
            value: 0,
            raw: '0'
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
          name: '$$$temp'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: '$$temp'
          },
          property: {
            type: 'Literal',
            value: 1,
            raw: '1'
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
          name: 'key4'
        },
        value: {
          type: 'ConditionalExpression',
          test: genIsUndefTest({
            type: 'Identifier',
            name: '$$$temp'
          }),
          consequent: {
            type: 'Literal',
            value: 5,
            raw: '5'
          },
          alternate: {
            type: 'Identifier',
            name: '$$$temp'
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
          name: 'rest1'
        },
        value: {
          type: 'CallExpression',
          optional: false,
          callee: {
            type: 'MemberExpression',
            optional: false,
            computed: false,
            object: {
              type: 'Identifier',
              name: '$$temp'
            },
            property: {
              type: 'Identifier',
              name: 'slice'
            }
          },
          arguments: [
            {
              type: 'Literal',
              value: 2,
              raw: '2'
            }
          ]
        }
      }
    },
    {
      temporary: false,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'rest2'
        },
        value: {
          type: 'CallExpression',
          optional: false,
          callee: {
            type: 'MemberExpression',
            optional: false,
            computed: false,
            object: {
              type: 'Identifier',
              name: 'temp'
            },
            property: {
              type: 'Identifier',
              name: 'slice'
            }
          },
          arguments: [
            {
              type: 'Literal',
              value: 3,
              raw: '3'
            }
          ]
        }
      }
    }
  ]
  expect(withoutPos(restore(declarataor))).toEqual(target)
})

test('array pattern 2', () => {
  const script = `
    const user = []
    const [
      [
        temp
      ] = [],
      ...[key1]
    ] = user
  `
  const ast = parseScript(script)
  const declarataor = (ast.body[1] as VariableDeclaration).declarations[0]
  const target: ResultItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: '$temp'
        },
        value: {
          type: 'Identifier',
          name: 'user'
        }
      }
    },
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: '$$temp'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: '$temp'
          },
          property: {
            type: 'Literal',
            value: 0,
            raw: '0'
          }
        },
      }
    },
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: '$$$temp'
        },
        value: {
          type: 'ConditionalExpression',
          test: genIsUndefTest({
            type: 'Identifier',
            name: '$$temp'
          }),
          consequent: {
            type: 'ArrayExpression',
            elements: []
          },
          alternate: {
            type: 'Identifier',
            name: '$$temp'
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
          name: 'temp'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: '$$$temp'
          },
          property: {
            type: 'Literal',
            value: 0,
            raw: '0'
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
          name: '$$$$temp',
        },
        value: {
          type: 'CallExpression',
          optional: false,
          callee: {
            type: 'MemberExpression',
            computed: false,
            optional: false,
            object: {
              type: 'Identifier',
              name: '$temp'
            },
            property: {
              type: 'Identifier',
              name: 'slice'
            }
          },
          arguments: [
            {
              type: 'Literal',
              value: 1,
              raw: '1'
            }
          ]
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
          computed: true,
          object: {
            type: 'Identifier',
            name: '$$$$temp'
          },
          property: {
            type: 'Literal',
            value: 0,
            raw: '0'
          }
        }
      }
    }
  ]
  expect(withoutPos(restore(declarataor))).toEqual(target)
})

test('mixed pattern', () => {
  const script = `
    const user = {}
    const {
      key1,
      key2: [
        key3,
      ]      
    } = user
  `
  const ast = parseScript(script)
  const declarataor = (ast.body[1] as VariableDeclaration).declarations[0]
  const target: ResultItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'temp'
        },
        value: {
          type: 'Identifier',
          name: 'user'
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
          name: 'key3'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: '$temp'
          },
          property: {
            type: 'Literal',
            value: 0,
            raw: '0'
          }
        }
      }
    },
  ]
  expect(withoutPos(restore(declarataor))).toEqual(target)
})

test('assignment expression', () => {
  const script = `
    const arr = [], obj = {};
    [obj.name, obj.age = 10, key1] = arr;
    key3 *= arr
  `
  const ast = parseScript(script)
  const exp1 = ast.body[1] as ExpressionStatement
  const exp2 = ast.body[2] as ExpressionStatement

  const target1: ResultItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'temp'
        },
        value: {
          type: 'Identifier',
          name: 'arr'
        }
      }
    },
    {
      temporary: false,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: 'obj'
          },
          property: {
            type: 'Identifier',
            name: 'name'
          }
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp'
          },
          property: {
            type: 'Literal',
            value: 0,
            raw: '0'
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
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp'
          },
          property: {
            type: 'Literal',
            value: 1,
            raw: '1'
          }
        }
      }
    },
    {
      temporary: false,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: 'obj'
          },
          property: {
            type: 'Identifier',
            name: 'age'
          }
        },
        value: {
          type: 'ConditionalExpression',
          test: genIsUndefTest({
            type: 'Identifier',
            name: '$temp'
          }),
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
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'key1'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp'
          },
          property: {
            type: 'Literal',
            value: 2,
            raw: '2'
          }
        }
      }
    }
  ]
  expect(withoutPos(restore(exp1.expression as AssignmentExpression))).toEqual(target1)
  expect(withoutPos(restore(exp2.expression as AssignmentExpression))).toEqual([])
})

test('temp', () => {
  const script = `
  const user = {}
  const {
    key1,
    key2 = 10,
    ...rest
  } = user || {}
`
  /**
   * it is equivalent to:
   *  const temp = user || {},
   *    key1 = temp.key1,
   *    $temp = temp.key2,
   *    key2 = $temp === void 0 ? 10 : $temp
   *    rest = omit(temp, ['key1', 'key2'])
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
                  raw: '\'key1\''
                },
                {
                  type: 'Literal',
                  value: 'key2',
                  raw: '\'key2\''
                }
              ]
            },
          ]
        }
      }
    },
  ]
  const ast = parseScript(script)
  expect(withoutPos(restore((ast.body[1] as VariableDeclaration).declarations[0]))).toEqual(target)
})