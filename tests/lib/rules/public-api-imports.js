/**
 * @fileoverview allowing imports only from the PublicApi(index.ts)
 * @author ves-sev
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;

  const options = [
    {
      alias: "@",
      testFilesPatterns: [
        "**/*.test.ts",
        "**/*.story.ts",
        "**/StoreDecorator.tsx",
      ],
      checkingLayers: {
        entities: "entities",
        features: "features",
        pages: "pages",
        widgets: "widgets",
      },
    },
  ];
  
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});
ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\file.test.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: options,
    },
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
      errors: [
        {
          message: "Абсолютный импорт должен быть из PublicApi(index.ts(.js))",
        },
      ],
      options: options,
    },
    {
      //
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
      errors: [
        {
          message: "Абсолютный импорт должен быть из PublicApi(index.ts(.js))",
        },
      ],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\forbidden.ts",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [
        {
          message:
            "Тестовые данные необходимо импортировать из publicApi/testing.ts",
        },
      ],
      options: options,
    },
  ],
});

