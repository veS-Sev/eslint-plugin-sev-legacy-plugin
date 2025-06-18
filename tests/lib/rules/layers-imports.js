/**
 * @fileoverview Import is allowed only from the below layers
 * @author ves-sev
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layers-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const aliasOptions = [
  {
    alias: "@",
  },
];

const options = [
  {
    alias: "@",
    layersFromTopToBottom: [
      "app",
      "pages",
      "widgets",
      "features",
      "entities",
      "shared",
    ],
    ignoreImportPatterns: ["**/StoreProvider"],
  },
];
const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" },
});
ruleTester.run("layers-imports", rule, {
  valid: [
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\Article",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button.tsx'",
      errors: [],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\Article",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/lib/classNames/classNames'",
      errors: [],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\Article",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\app\\providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\widgets\\pages",
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\index.tsx",
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
      errors: [],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\Article.tsx",
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\Article.tsx",
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: options,
    },
    {
      filename:
        "D:\\PROJECTS\\production_project\\src\\shared\\ui\\Icon\\Icon.tsx",
      code: "import { classNames } from '../../lib/classNames/classNames'",
      errors: [],
      options: options,
    },
  ],

  invalid: [
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Article'",
      errors: [
        {
          message: "Слой может импортировать в себя только нижележащие слои",
        },
      ],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [
        {
          message: "Слой может импортировать в себя только нижележащие слои",
        },
      ],
      options: options,
    },
    {
      filename:
        "C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Articl'",
      errors: [
        {
          message: "Слой может импортировать в себя только нижележащие слои",
        },
      ],
      options: options,
    },
  ],
});
