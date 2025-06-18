/**
 * @fileoverview feature sliced relative path checker
 * @author ves-sev
 */
"use strict";

const path = require('path')

const layers = {
  'entities':'entities',
  'features':'features',
  'pages':'pages',
  'shared':'shared',
  'widgets':'widgets'

}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [{
      type: 'object',
      properties: {
        alias: {
          type: 'string'
        }
      }
     },
      
    ], // Add a schema if the rule has options
    messages: {
      alarm: 'В рамках одного слайса импорты должны быть относительными'
    }, // Add messageId and message
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const alias = context.options[0]?.alias || ''
        
      const value = node.source.value
      // app/entities/Article
      const importTo = alias? value.replace(`${alias}/`, '') : value

      // C:\users\Desctop\production-progect\app\entities\Article
      const fromFilename = context.getFilename()
      if(shouldBeRelative(fromFilename, importTo)){
        context.report({node:node, messageId:'alarm'})
      }
      
     }
    };
  },
};

function isPathRelative (path){
  return path === '.' || path.startsWith('./') || path.startsWith('../')
}

function shouldBeRelative (from, to){
 if(isPathRelative(to)){
  return false
 }
 //'entities/Article/ui/ArticleCodeBlockComponent
 const toArray = to.split('/')
 const toLayer = toArray[0]//entities
 const toSlice = toArray[1]//Article


 if(!toLayer || ! toSlice || !layers[toLayer]){
  return false
 }
 // D:\\PROJECTS\\production_project\\src\\entities\\Article\\ui\\ArticleDetails
 const normalizedPath = path.toNamespacedPath(from)


 //отсекаем правую часть пути от src для дальнейшего использования. Если указали бы [0]то получили бы путь слева от src
 const projectFrom = normalizedPath.split('src')[1]


  // т.к. в пути используется \, то экранируем его '\\'
  const fromArray =  projectFrom.split('\\')

  const fromLayer = fromArray[1]//entities
  const fromSlice = fromArray[2]//Article

  if(!fromLayer || ! fromSlice || !layers[toLayer]){
    return false
   }
  
  return toLayer === fromLayer && toSlice === fromSlice
  }


