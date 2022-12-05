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
declare function restoreBindingPattern<T extends VariableDeclarator | AssignmentExpression>(node: T, omitApiId?: Identifier): RestoredItem<T extends VariableDeclarator ? Identifier : MemberExpression>[];
export { 
/** 复原解构声明 */
restoreBindingPattern as restore };
