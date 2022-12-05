import type { AssignmentExpression, ExpressionStatement, VariableDeclaration, Identifier } from 'estree'
import { restore, type RestoredItem } from '../src'
import { withoutPos, parseScript, genIsUndefTest } from './helpers'

test('应正确复原对象解构', () => {
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
  const target: RestoredItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'temp0'
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
            name: 'temp0'
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
          name: 'temp1'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: 'temp0'
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
            name: 'temp1'
          }),
          consequent: {
            type: 'Literal',
            value: 3,
            raw: '3'
          },
          alternate: {
            type: 'Identifier',
            name: 'temp1'
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
            name: 'temp0'
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
          name: 'temp2'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: 'temp0'
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
            name: 'temp2'
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
          name: 'temp3'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: 'temp2'
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
            name: 'temp3'
          }),
          consequent: {
            type: 'Literal',
            value: 5,
            raw: '5'
          },
          alternate: {
            type: 'Identifier',
            name: 'temp3'
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
            name: 'temp2'
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
              name: 'temp2',
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
              name: 'temp0',
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

test('应正确处理缓存变量命名重复的问题', () => {
  const script = `
    const user = {}
    const {
      key1: {
        temp0,
      } = {}
    } = user || {}
  `
  const ast = parseScript(script)
  const declarataor = (ast.body[1] as VariableDeclaration).declarations[0]
  const target: RestoredItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'temp1'
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
          name: 'temp2'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: 'temp1',
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
          name: 'temp3'
        },
        value: {
          type: 'ConditionalExpression',
          test: genIsUndefTest({
            type: 'Identifier',
            name: 'temp2'
          }),
          consequent: {
            type: 'ObjectExpression',
            properties: []
          },
          alternate: {
            type: 'Identifier',
            name: 'temp2'
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
          name: 'temp0'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: 'temp3'
          },
          property: {
            type: 'Identifier',
            name: 'temp0'
          }
        }
      }
    },
  ]
  expect(withoutPos(restore(declarataor))).toEqual(target)
})

test('应正确复原数组解构', () => {
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
  const target: RestoredItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'temp0'
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
            name: 'temp0'
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
          name: 'temp1'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp0'
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
            name: 'temp1'
          }),
          consequent: {
            type: 'Literal',
            value: 3,
            raw: '3'
          },
          alternate: {
            type: 'Identifier',
            name: 'temp1'
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
          name: 'temp2'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp0'
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
            name: 'temp2'
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
          name: 'temp3'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp2'
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
            name: 'temp3'
          }),
          consequent: {
            type: 'Literal',
            value: 5,
            raw: '5'
          },
          alternate: {
            type: 'Identifier',
            name: 'temp3'
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
              name: 'temp2'
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
              name: 'temp0'
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

test('应正确复原对象、数组混合解构', () => {
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
  const target: RestoredItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'temp0'
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
            name: 'temp0'
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
          name: 'temp1'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: 'temp0'
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
            name: 'temp1'
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

test('应正确复原赋值表达式', () => {
  const script = `
    const arr = [], obj = {};
    [obj.name, obj.age = 10, temp0] = arr;
    key3 *= arr
  `
  const ast = parseScript(script)
  const exp1 = (ast.body[1] as ExpressionStatement).expression as AssignmentExpression
  const exp2 = (ast.body[2] as ExpressionStatement).expression as AssignmentExpression

  const target1: RestoredItem[] = [
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'temp1'
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
            name: 'temp1'
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
          name: 'temp2'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp1'
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
            name: 'temp2'
          }),
          consequent: {
            type: 'Literal',
            value: 10,
            raw: '10'
          },
          alternate: {
            type: 'Identifier',
            name: 'temp2'
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
          name: 'temp0'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: true,
          object: {
            type: 'Identifier',
            name: 'temp1'
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
  expect(withoutPos(restore(exp1))).toEqual(target1)
  expect(withoutPos(restore(exp2))).toEqual([])
})

test('应使用传入的omitApiId来处理对象解构', () => {
  const script = 'const { a, ...rest } = user'
  const ast = parseScript(script)
  const declaration = ast.body[0] as VariableDeclaration
  const MyOmitApi: Identifier = {
    type: 'Identifier',
    name: 'MyOmit'
  }
  const result = restore(withoutPos(declaration.declarations[0]), MyOmitApi)
  expect(result).toEqual([
    {
      temporary: true,
      useOmitAPI: false,
      definition: {
        id: {
          type: 'Identifier',
          name: 'temp0'
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
          name: 'a'
        },
        value: {
          type: 'MemberExpression',
          optional: false,
          computed: false,
          object: {
            type: 'Identifier',
            name: 'temp0',
          },
          property: {
            type: 'Identifier',
            name: 'a'
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
          callee: MyOmitApi,
          arguments: [
            {
              type: 'Identifier',
              name: 'temp0'
            },
            {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Literal',
                  value: 'a',
                  raw: '\'a\''
                }
              ]
            }
          ],
        }
      }
    }
  ] as RestoredItem<Identifier>[])
})