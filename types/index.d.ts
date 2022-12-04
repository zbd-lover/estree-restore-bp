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
declare type TempVarNameGenerator<T = unknown> = Generator<string, string, T>;
/** 解构复原 */
declare function restoreBindingPattern<T extends VariableDeclarator | AssignmentExpression>(node: T, tempVarNamegenerator?: TempVarNameGenerator): RestoredItem<T extends VariableDeclarator ? Identifier : MemberExpression>[];
export { restoreBindingPattern as restore };
