
/**
 * @fileoverview feature sliced relative path checker
 * @author ves-sev
 */
"use strict";

const path = require('path')
const micromatch = require('micromatch')
const { isPathRelative } = require('../helpers')


/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "allowing imports are from the PublicApi(index.ts) only",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
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
            type: "object"
          }
        },
      },
    ],
    messages: {
      alarm: "Абсолютный импорт должен быть из PublicApi(index.ts(.js))",
    }, // Add messageId and message
  },

  create(context) {
    const {
      alias = "",
      testFilesPatterns = [],
      checkingLayers = {}
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

        if (!checkingLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        // [entities, article, testing]
        const isTestingPublicApi =
          segments[2] === "testing" && segments.length < 4;

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report(
            node,
            "Абсолютный импорт должен быть из PublicApi(index.ts(.js))"
          );
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename();
          const normalizedPath = path.toNamespacedPath(currentFilePath);
        
          const isCurrentFileTesting = testFilesPatterns.some((pattern) =>
            micromatch.isMatch(normalizedPath, pattern)
          );

          if (!isCurrentFileTesting) {
            context.report(
              node,
              "Тестовые данные необходимо импортировать из publicApi/testing.ts"
            );
          }
        }
      },
    };
  },
};