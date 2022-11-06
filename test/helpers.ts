
import { parse } from 'acorn'
import { Program, Expression, BinaryExpression } from 'estree'

export function withoutPos (node: unknown) {
  if (node === null || node === undefined) return node
  const clone = JSON.parse(JSON.stringify(node))
  delete clone.start
  delete clone.end

  const keys = Object.keys(clone)
  for (let i = 0, key: string; i < keys.length; i++) {
    key = keys[i]
    if (typeof clone[key] === 'object') {
      clone[key] = withoutPos(clone[key])
    }
  }

  return clone
}

export function parseScript (script: string) {
  return parse(script, {
    ecmaVersion: 'latest',
    sourceType: 'script'
  }) as unknown as Program
}

export function genIsUndefTest (left: Expression): BinaryExpression {
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