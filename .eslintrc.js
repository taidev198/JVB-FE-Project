module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@next/next/recommended', 'next/core-web-vitals', 'plugin:prettier/recommended'],
  ignorePatterns: [],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'comma-spacing': ['error', { before: false, after: true }],
    'object-curly-spacing': ['error', 'always'],
    'padding-line-between-statements': ['error', { blankLine: 'always', prev: 'export', next: 'export' }],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'no-console': ['error', { allow: ['error'] }],
    'no-alert': ['error'],
    'import/no-useless-path-segments': 'error',
    'react/display-name': 'off',
    'react/no-unstable-nested-components': 'error',
    'no-use-before-define': 'error',
    'no-param-reassign': 'error',
    'import/order': 'error',
    '@next/next/no-img-element': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 0,
      },
    },
  ],
};
