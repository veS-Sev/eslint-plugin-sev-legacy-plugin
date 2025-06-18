# eslint-plugin-sev-legacy-plugin

Plugin for checking relative paths and public api imports.
Checking imports from the lower layer to the upper one.
Supports aliases.

Plugin for projects with eslint &lt;=9.0.0

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-sev-legacy-plugin`:

```sh
npm install eslint-plugin-sev-legacy-plugin --save-dev
```

## Usage

In your [configuration file](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file), import the plugin `eslint-plugin-sev-legacy-plugin` and add `sev-legacy-plugin` to the `plugins` key:

```js
import sev-legacy-plugin from "eslint-plugin-sev-legacy-plugin";

export default [
    {
        plugins: {
            sev-legacy-plugin
        }
    }
];
```

Then configure the rules you want to use under the `rules` key.

```js
import sev-legacy-plugin from "eslint-plugin-sev-legacy-plugin";

export default [
    {
        plugins: {
            sev-legacy-plugin
        },
        rules: {
            'sev-legacy-plugin/path-checker': ['error', {
                alias:'@'
                }
            ],
            'sev-legacy-plugin/public-api-imports': ['error', {
            alias:'@',
            testFilesPatterns:['**/*.test.ts',
            '**/*.test.ts',
            '**/StoreDecorator.tsx'],
            checkingLayers: {
              entities: "entities",
              features: "features",
              pages: "pages",
              widgets: "widgets",
      },},],
      'sev-legacy-plugin/layers-imports':
      ['error', {
            alias:'@',
          layersFromTopToBottom: [
            "app",
            "pages",
            "widgets",
            "features",
            "entities",
            "shared",
          ],
            ignoreImportPatterns:['**/*.test.ts',
            '**/*.test.ts',
            '**/StoreDecorator.tsx'],},]
        }
    }
];
```

## Configurations

<!-- begin auto-generated configs list -->

<!-- end auto-generated configs list -->

## Rules

<!-- begin auto-generated rules list -->



<!-- end auto-generated rules list -->
