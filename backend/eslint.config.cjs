// @ts-check
const eslint = require('@eslint/js')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const globals = require('globals')
const tseslint = require('typescript-eslint')
const importPlugin = require('eslint-plugin-import')

module.exports = tseslint.config(
  {
    ignores: ['eslint.config.cjs', 'prettier.config.cjs']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      import: importPlugin
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname
      }
    }
  },
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'as-needed'],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports'
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
          destructuredArrayIgnorePattern: '^_*',
          argsIgnorePattern: '^_*'
        }
      ],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },
          groups: [['builtin', 'external'], 'internal', 'parent', 'sibling'],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '~/**',
              group: 'parent'
            }
          ]
        }
      ]
    }
  }
)
