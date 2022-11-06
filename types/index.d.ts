import { VariableDeclarator, Identifier, MemberExpression, Expression, AssignmentExpression } from 'estree';
export interface Definition {
    id: Identifier | MemberExpression;
    value: Expression;
}
export interface ResultItem {
    temporary: boolean;
    useOmitAPI: boolean;
    definition: Definition;
}
declare function restoreBindingPattern<T extends VariableDeclarator | AssignmentExpression>(node: T): ResultItem[];
export { restoreBindingPattern as restore };
