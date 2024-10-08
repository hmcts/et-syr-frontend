module.exports = {
  root: true,
  env: { browser: true, es6: true, node: true, 'codeceptjs/codeceptjs': true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'import', 'jest', 'codeceptjs'],
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:codeceptjs/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    actor: true,
    Feature: true,
    Scenario: true,
    xScenario: true,
    Before: true,
    BeforeSuite: true,
    AfterSuite: true,
    codecept_helper: true,
    pause: true,
    inject: true,
  },
  rules: {
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
    curly: 'error',
    eqeqeq: 'error',
    'import/no-duplicates': 'error',
    'import/no-named-as-default': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: false,
          order: 'asc',
        },
        'newlines-between': 'always',
      },
    ],
    'jest/prefer-to-have-length': 'error',
    'linebreak-style': ['error', 'unix'],
    'no-console': 'warn',
    'no-prototype-builtins': 'off',
    'no-return-await': 'error',
    'no-unneeded-ternary': [
      'error',
      {
        defaultAssignment: false,
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    'object-shorthand': ['error', 'properties'],
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: false,
        avoidEscape: true,
      },
    ],
    semi: ['error', 'always'],
    'sort-imports': [
      'error',
      {
        allowSeparatedGroups: false,
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
