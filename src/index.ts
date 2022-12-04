/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type {
  Node,
  VariableDeclarator,
  Identifier,
  MemberExpression,
  Expression,
  AssignmentExpression,
  Pattern,
  CallExpression,
  Literal,
  ConditionalExpression,
  BinaryExpression,
  VariableDeclaration
} from 'estree'
import { createNameMaker } from 'estree-idname-maker'

function isBindingPattern (node: Node) {
  return node.type === 'ArrayPattern' || node.type === 'ObjectPattern'
}

function genIsUndefTest (left: Expression): BinaryExpression {
  return {
    type: 'BinaryExpression',
    operator: '===',
    left,
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
  }
}

export interface Definition<T extends Identifier | MemberExpression = any> {
  id: T,
  value: Expression
}

export interface RestoredItem<T extends Identifier | MemberExpression = any> {
  temporary: boolean,
  useOmitAPI: boolean,
  definition: Definition<T>
}

interface PatternUse {
  left: Pattern,
  right: Expression
}

type TempVarNameGenerator<T = unknown> = Generator<string, string, T>

/** 解构复原 */
function restoreBindingPattern<T extends VariableDeclarator | AssignmentExpression> (
  node: T, tempVarNamegenerator?: TempVarNameGenerator
): RestoredItem<T extends VariableDeclarator ? Identifier : MemberExpression>[] {
  if (
    (node.type === 'VariableDeclarator' && !node.init) ||
    (node.type === 'AssignmentExpression' && (!node.right || node.operator !== '='))
  ) {
    return []
  }

  type NameMaker = ReturnType<typeof createNameMaker>

  let makeName: NameMaker
  if (node.type === 'VariableDeclarator') {
    const mockDeclaration: VariableDeclaration = {
      type: 'VariableDeclaration',
      declarations: [node],
      kind: 'const'
    }
    makeName = createNameMaker({
      type: 'Program',
      body: [mockDeclaration],
      sourceType: 'script'
    }, tempVarNamegenerator ? () => tempVarNamegenerator.next().value : undefined)
  } else {
    makeName = createNameMaker({
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: node
        }
      ],
      sourceType: 'script'
    }, tempVarNamegenerator ? () => tempVarNamegenerator.next().value : undefined)
  }

  const res: RestoredItem[] = []

  let temporaryDefId: Identifier
  function addTemporaryDef (exp: Expression, useOmitAPI: boolean) {
    temporaryDefId = {
      type: 'Identifier',
      name: makeName('temp')
    }
    res.push({
      temporary: true,
      useOmitAPI,
      definition: {
        id: temporaryDefId,
        value: exp
      }
    })
    return temporaryDefId
  }

  function addNormalDef (def: Definition, useOmitAPI: boolean) {
    res.push({
      temporary: false,
      useOmitAPI,
      definition: def
    })
  }

  function restore (pu: PatternUse, first?: boolean) {
    if (first) {
      pu.right = addTemporaryDef(pu.right, false)
      restore(pu)
      return
    }

    if (pu.left.type === 'ArrayPattern') {
      const patterns = pu.left.elements
      patterns.forEach((pattern, index) => {
        function getSource (pattern: Pattern): Expression {
          let source: Expression
          switch (pattern.type) {
            case 'AssignmentPattern':
              source = getSource(pattern.left)
              break
            case 'Identifier':
            case 'MemberExpression':
            case 'ArrayPattern':
            case 'ObjectPattern':
              source = {
                type: 'MemberExpression',
                object: pu.right,
                property: {
                  type: 'Literal',
                  value: index,
                  raw: `${index}`
                },
                computed: true,
                optional: false
              }
              break
            case 'RestElement':
              source = {
                type: 'CallExpression',
                optional: false,
                callee: {
                  type: 'MemberExpression',
                  object: pu.right,
                  computed: false,
                  optional: false,
                  property: {
                    type: 'Identifier',
                    name: 'slice'
                  }
                },
                arguments: [
                  {
                    type: 'Literal',
                    value: index,
                    raw: `${index}`
                  }
                ]
              }
          }
          return source
        }

        if (pattern) {
          separate(getSource(pattern), pattern)
        }
      })
    } else if (pu.left.type === 'ObjectPattern') {
      const properties = pu.left.properties
      const namedKeys: Identifier[] = []
      properties.forEach((property) => {
        if (property.type === 'Property') {
          const key = property.key as Identifier
          namedKeys.push(key)

          function getSource (pattern: Pattern): Expression {
            switch (pattern.type) {
              case 'AssignmentPattern':
                return getSource(pattern.left)
              case 'Identifier':
              case 'MemberExpression':
              case 'ArrayPattern':
              case 'ObjectPattern':
              default:
                return {
                  type: 'MemberExpression',
                  object: pu.right,
                  property: key,
                  computed: false,
                  optional: false
                }
            }
          }

          separate(getSource(property.value), property.value)

        } else {
          const omitCall: CallExpression = {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'omit'
            },
            optional: false,
            arguments: [
              pu.right,
              {
                type: 'ArrayExpression',
                elements: namedKeys.map<Literal>((_id) => {
                  return {
                    type: 'Literal',
                    value: _id.name,
                    raw: `'${_id.name}'`
                  }
                })
              }
            ]
          }
          separate(omitCall, property.argument)
        }
      })
    }
  }

  function separate (source: Expression, pattern: Pattern, defaultValue?: Expression) {
    const isBp = isBindingPattern(pattern)

    const useOmitAPI = source.type === 'CallExpression' &&
      source.callee.type === 'Identifier' &&
      source.callee.name === 'omit'

    if (isBp && defaultValue) {
      const temp0 = addTemporaryDef(source, useOmitAPI)
      const nextSource: ConditionalExpression = {
        type: 'ConditionalExpression',
        test: genIsUndefTest(temp0),
        consequent: defaultValue,
        alternate: temp0
      }
      separate(nextSource, pattern)
      return
    }

    const currentDefinition = () => {
      let _source = source
      if (defaultValue || isBp) {
        _source = addTemporaryDef(_source, useOmitAPI)
      }
      return (defaultValue ? {
        type: 'ConditionalExpression',
        test: genIsUndefTest(_source),
        consequent: defaultValue,
        alternate: _source
      } : _source) as Expression
    }

    switch (pattern.type) {
      case 'Identifier':
      case 'MemberExpression':
        addNormalDef({
          id: pattern,
          value: currentDefinition(),
        }, useOmitAPI)
        break
      case 'ArrayPattern':
      case 'ObjectPattern':
        restore({
          left: pattern,
          right: currentDefinition()
        })
        break
      case 'AssignmentPattern':
        separate(source, pattern.left, pattern.right)
        break
      case 'RestElement':
        separate(source, pattern.argument)
        break
    }
  }

  if (node.type === 'VariableDeclarator') {
    node.init && restore({
      left: node.id,
      right: node.init
    }, true)
  } else {
    restore({
      left: node.left,
      right: node.right
    }, true)
  }

  return res
}

export {
  restoreBindingPattern as restore
}