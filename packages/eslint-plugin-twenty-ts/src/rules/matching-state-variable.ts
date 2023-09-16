import {
  TSESTree,
  ESLintUtils,
  AST_NODE_TYPES,
} from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator((name) => `https://docs.twenty.com`);

const matchingStateVariableRule = createRule({
  create: (context) => {
    return {
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (
          node?.init?.type === AST_NODE_TYPES.CallExpression &&
          node.init.callee.type === AST_NODE_TYPES.Identifier &&
          [
            "useRecoilState",
            "useRecoilFamilyState",
            "useRecoilSelector",
            "useRecoilScopedState",
            "useRecoilScopedFamilyState",
            "useRecoilScopedSelector",
            "useRecoilValue",
          ].includes(node.init.callee.name)
        ) {
          const stateNameBase =
            node.init.arguments?.[0]?.type === AST_NODE_TYPES.Identifier
              ? node.init.arguments[0].name
              : undefined;

          if (!stateNameBase) {
            return;
          }

          let expectedVariableNameBase = stateNameBase.replace(
            /(State|FamilyState|Selector|ScopedState|ScopedFamilyState|ScopedSelector)$/,
            ""
          );

          if (node.id.type === AST_NODE_TYPES.Identifier) {
            const actualVariableName = node.id.name;
            if (actualVariableName !== expectedVariableNameBase) {
              context.report({
                node,
                messageId: "invalidVariableName",
                data: {
                  actual: actualVariableName,
                  expected: expectedVariableNameBase,
                  callee: node.init.callee.name,
                },
                fix(fixer) {
                  return fixer.replaceText(node.id, expectedVariableNameBase);
                },
              });
            }
            return;
          }

          if (node.id.type === AST_NODE_TYPES.ArrayPattern) {
            const actualVariableName =
              node.id.elements?.[0]?.type === AST_NODE_TYPES.Identifier
                ? node.id.elements[0].name
                : undefined;
            if (
              actualVariableName &&
              actualVariableName !== expectedVariableNameBase
            ) {
              context.report({
                node,
                messageId: "invalidVariableName",
                data: {
                  actual: actualVariableName,
                  expected: expectedVariableNameBase,
                  callee: node.init.callee.name,
                },
                fix(fixer) {
                  if (node.id.type === AST_NODE_TYPES.ArrayPattern) {
                    return fixer.replaceText(
                      node.id.elements[0] as TSESTree.Node,
                      expectedVariableNameBase
                    );
                  }
                  return null;
                },
              });
              return;
            }

            if (node.id.elements?.[1]?.type === AST_NODE_TYPES.Identifier) {
              const actualSetterName = node.id.elements[1].name;
              const expectedSetterName = `set${expectedVariableNameBase
                .charAt(0)
                .toUpperCase()}${expectedVariableNameBase.slice(1)}`;

              if (actualSetterName !== expectedSetterName) {
                context.report({
                  node,
                  messageId: "invalidSetterName",
                  data: {
                    actual: actualSetterName,
                    expected: expectedSetterName,
                  },
                  fix(fixer) {
                    if (node.id.type === AST_NODE_TYPES.ArrayPattern) {
                      return fixer.replaceText(
                        node.id.elements[1]!,
                        expectedSetterName
                      );
                    }
                    return null;
                  },
                });
              }
            }
          }
        }
      },
    };
  },
  name: "matching-state-variable",
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure recoil value and setter are named after their atom name",
      recommended: "recommended",
    },
    messages: {
      invalidVariableName:
        "Invalid usage of {{callee}}: the value should be named '{{expected}}' but found '{{actual}}'.",
      invalidSetterName:
        "Invalid usage of {{callee}}: Expected setter '{{expected}}' but found '{{actual}}'.",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
});

module.exports = matchingStateVariableRule;

export default matchingStateVariableRule;
