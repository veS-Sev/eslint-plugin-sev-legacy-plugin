
/**
 * @fileoverview feature sliced relative path checker
 * @author ves-sev
 */
"use strict";

const path = require('path')
const micromatch = require('micromatch')
const { isPathRelative } = require('../helpers')
const PUBLIC_API = "PUBLIC_API";
const TESTING_PUBLIC_API = "TESTING_PUBLIC_API";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "allowing imports are from the PublicApi(index.ts) only",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
          testFilesPatterns: {
            type: "array",
          },
          checkingLayers: {
            type: "object",
          },
        },
      },
    ],
    messages: {
      [PUBLIC_API]: "Абсолютный импорт должен быть из PublicApi(index.ts(.js))",
      [TESTING_PUBLIC_API]:
        "Тестовые данные необходимо импортировать из publicApi/testing.ts",
    },
    output: null,
  },

  create(context) {
    const {
      alias = "",
      testFilesPatterns = [],
      checkingLayers = {},
    } = context.options[0] ?? {};

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, "") : value;

        if (isPathRelative(importTo)) {
          return;
        }

        // [entities, article, model, types]
        const segments = importTo.split("/");
        const layer = segments[0];
        const slice = segments[1];

        if (!checkingLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        // [entities, article, testing]
        const isTestingPublicApi =
          segments[2] === "testing" && segments.length < 4;

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node,
            messageId: "PUBLIC_API",
            fix: (fixer) => {
              return fixer.replaceText(
                node.source,
                `'${alias}/${layer}/${slice}'`
              );
            },
          });
        }
        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename();
          const normalizedPath = path.toNamespacedPath(currentFilePath);

          const isCurrentFileTesting = testFilesPatterns.some((pattern) =>
            micromatch.isMatch(normalizedPath, pattern)
          );
          if (!isCurrentFileTesting) {
            context.report({
              node,
              messageId: TESTING_PUBLIC_API,
              fix: (fixer) => {
                console.log(
'CONTEXT', context
                );
                return fixer.replaceText(
                  node.source,
                  `'${alias}/${layer}/${slice}/testing'`
                );
              },
            });
          }
        }
      },
    };
  },
};