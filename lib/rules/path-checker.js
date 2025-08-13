/**
 * @fileoverview feature sliced relative path checker
 * @author ves-sev
 */
"use strict";

const path = require("path");

const layers = {
  entities: "entities",
  features: "features",
  pages: "pages",
  shared: "shared",
  widgets: "widgets",
};

function isPathRelative(path) {
  return path === "." || path.startsWith("./") || path.startsWith("../");
}

function getNormalizedCurrentFilePath(currentFilePath) {
  // D:\\PROJECTS\\production_project\\src\\entities\\Article\\ui\\ArticleDetails
  const normalizedPath = path.toNamespacedPath(currentFilePath);

  //отсекаем правую часть пути от src для дальнейшего использования. Если указали бы [0]то получили бы путь слева от src
  const projectFrom = normalizedPath.split("src")[1];
  return projectFrom.split("\\").join("/");
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
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
        },
      },
    ], // Add a schema if the rule has options
    messages: {
      alarm: "В рамках одного слайса импорты должны быть относительными",
    }, // Add messageId and message
  },

  create(context) {
    const alias = context.options[0]?.alias || "";
    return {
      ImportDeclaration(node) {
        try {
          // example app/entities/Article
          const value = node.source.value;
          // app/entities/Article
          const importTo = alias ? value.replace(`${alias}/`, "") : value;

          // C:\users\Desctop\production-progect\app\entities\Article
          const fromFilename = context.getFilename();
          if (shouldBeRelative(fromFilename, importTo)) {
            context.report({
              node: node,
              messageId: "alarm",
              fix: (fixer) => {
                const normalizedPath = getNormalizedCurrentFilePath(
                  fromFilename
                ) // entities/Article/Article.tsx
                  .split("/")
                  .slice(0, -1)
                  .join("/");
                let relativePath = path
                  .relative(normalizedPath, `/${importTo}`)
                  .split("\\")
                  .join("/");
                if (!relativePath.startsWith(".")) {
                  relativePath = "./" + relativePath;
                }
                return fixer.replaceText(node.source, `'${relativePath}'`);
              },
            });
          }
        } catch (error) {
          console.log(e);
        }
      },
    };
  },
};
function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  //'entities/Article/ui/ArticleCodeBlockComponent
  const toArray = to.split("/");
  const toLayer = toArray[0]; //entities
  const toSlice = toArray[1]; //Article

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const projectFrom = getNormalizedCurrentFilePath(from);
  // т.к. в пути используется \, то экранируем его '\\'
  const fromArray = projectFrom.split("/");

  const fromLayer = fromArray[1]; //entities
  const fromSlice = fromArray[2]; //Article

  if (!fromLayer || !fromSlice || !layers[toLayer]) {
    return false;
  }

  return toLayer === fromLayer && toSlice === fromSlice;
}
