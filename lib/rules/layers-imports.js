/**
 * @fileoverview Import is allowed only from the below layers
 * @author ves-sev
 */
"use strict";

const path = require("path");
const micromatch = require("micromatch");
const { isPathRelative } = require("../helpers");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, 
    docs: {
      description: "Import is allowed only from the below layers",
      recommended: false,
      url: null, 
    },
    fixable: null, 
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
          layersFromTopToBottom: {
            type: "array",
          },
          ignoreImportPatterns: {
            type: "array",
          },
        },
      },
    ], 
    messages: {
      alarm: "Слой может импортировать в себя только нижележащие слои",
    }, 
  },

  create(context) {

    var createAvailebleLayersList = (arr) => {
      var layers = {};
      arr.forEach(function (element) {
        layers[element] = element;
      });
      return layers;
    };
    const createLayersImportList = (arr) => {
      const layers = {};
      arr.forEach((element, index) => {
        layers[element] = arr.slice(index+1, arr.length);
      });
      return layers;
    };
    const {
      alias = "",
      layersFromTopToBottom = [],
      ignoreImportPatterns = [],
    } = context.options[0] ?? {};
    const layers = createLayersImportList(layersFromTopToBottom);
    const availableLayers = createAvailebleLayersList(layersFromTopToBottom);
   
    const getCurrentFileLayer = () => {
      const currentFileLayer = context.getFilename()
    
      const normalizedPath = path.toNamespacedPath(currentFileLayer)

      const progectPath = normalizedPath.split('src')[1]

      const segments = progectPath?.split('\\')

      return segments?.[1]
    }

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value
      const segments = importPath?.split('/')
 
      return segments?.[0]
    }
    
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer();
        const importLayer = getImportLayer(importPath);
        if (isPathRelative(importPath)) {
          return;
        }
        if (
          !availableLayers[importLayer] ||
          !availableLayers[currentFileLayer]
        ) {
          return;
        }
          const isIgnored = ignoreImportPatterns.some((pattern) =>
            micromatch.isMatch(importPath, pattern)
          );
        if (isIgnored) {
          return
        }


        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report({ node: node, messageId: "alarm" });
        }

      }
    };
  },
};
