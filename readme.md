# 简介
基于estree，复原解构语法
# Api
## restore
### 引入
``` javascript
// in esmodule
import { restore } from 'estree-restore-bp'
// in global
const { restore } = window.EstBpRestorer
```
### 案例
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
 * 复原解构后的直观表示：
 *  temp0 = user || {},
 *  key1 = temp0.key1,
 *  temp1 = temp0.key2,
 *  key2 = temp1 === void 0 ? 10 : temp1,
 *  rest = omit(temp0, ['key1', 'key2'])
 */
const restoredItems = []
const ast = parse(script, {
  ecmaVersion: 'latest',
  sourceType: 'script'
})
const declarator = ast.body[1].declarations[0]
expect(restore(declarator)).toEqual(restoredItems) // true
```
# 类型
```typescript
import type { VariableDeclarator, Identifier, MemberExpression, Expression, AssignmentExpression } from 'estree';
export interface Definition<T extends Identifier | MemberExpression = any> {
    id: T;
    value: Expression;
}
export interface RestoredItem<T extends Identifier | MemberExpression = any> {
    temporary: boolean;
    useOmitAPI: boolean;
    definition: Definition<T>;
}
declare function restoreBindingPattern<T extends VariableDeclarator | AssignmentExpression>(
  node: T
): RestoredItem<T extends VariableDeclarator ? Identifier : MemberExpression>[];
export { restoreBindingPattern as restore };
```
# 其它
所有辅助变量的名称都是唯一且安全的