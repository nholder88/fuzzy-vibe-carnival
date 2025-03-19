module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'chore',
                'ci',
                'build',
                'revert'
            ]
        ],
        'scope-enum': [
            2,
            'always',
            [
                'frontend',
                'chore-service',
                'inventory-service',
                'shopping-service',
                'household-service',
                'infrastructure',
                'deps',
                'config'
            ]
        ],
        'subject-case': [0]
    }
}; 