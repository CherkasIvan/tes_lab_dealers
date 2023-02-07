module.exports = {
    ignorePatterns: ['.eslintrc.js', 'migrations/*'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        semi: ['error', `always`],
        curly: ['error', `all`],
        eqeqeq: ['error', 'always'],
        'no-var': 'error',
        // 'indent': ['error', 4,
        //     {
        //         SwitchCase: 1,
        //         VariableDeclarator: {"var": 2, "let": 2, "const": 3},
        //         FunctionExpression: {"body": 1, "parameters": 1},
        //         ObjectExpression: "first",
        //         MemberExpression: 1,
        //         outerIIFEBody: 2,
        //         CallExpression: {"arguments":2},
        //         flatTernaryExpressions: false,
        //     }],
        'eol-last': ['error', 'always'],
        'no-proto': 'error',
        'no-console': 'off',
        'quote-props': ['error', `consistent-as-needed`],
        'no-multiple-empty-lines': ['error', { max: 3, maxEOF: 0 }],
        'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
        'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'only-multiline',
            },
        ],
        'padded-blocks': ['error', 'never'],
        'comma-spacing': ['error', { before: false, after: true }],
        'block-spacing': ['error', 'always'],
        'no-unused-vars': 'off',
        'space-in-parens': ['error', 'never'],
        'keyword-spacing': ['error', { before: true, after: true }],
        'no-return-await': 'error',
        'object-shorthand': 'error',
        'no-trailing-spaces': 'error',
        'space-before-blocks': ['error', 'always'],
        'no-duplicate-imports': 'error',
        'object-curly-spacing': ['error', 'always'],
        //'array-bracket-spacing': ['error', `always`],
        '@typescript-eslint/quotes': ['error', 'single'],
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['camelCase'],
                leadingUnderscore: 'allow',
                trailingUnderscore: 'allow',
            },
            // {
            //     selector: 'variable',
            //     format: ['camelCase'],
            //     leadingUnderscore: 'allow',
            //     trailingUnderscore: 'allow',
            // },

            {
                selector: 'property',
                modifiers: ['private'],
                format: ['camelCase'],
                leadingUnderscore: 'allow',
                trailingUnderscore: 'allow',
            },
            {
                selector: 'variable',
                // modifiers: ['const'],
                format: ['camelCase', 'UPPER_CASE', 'snake_case'],
                leadingUnderscore: 'allow',
                trailingUnderscore: 'allow',
            },
            {
                selector: 'parameter',
                format: ['camelCase', 'UPPER_CASE', 'snake_case'],
                leadingUnderscore: 'allow',
                trailingUnderscore: 'allow',
            },
            {
                selector: 'function',
                format: ['camelCase', 'PascalCase'],
            },
            {
                selector: 'property',
                format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
            {
                selector: 'enumMember',
                format: ['PascalCase'],
            },
        ],
        // NOTE: works incorrectly with two recursive calling functions
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
};
