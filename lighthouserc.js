module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run start',
            url: ['http://localhost:3000'],
            numberOfRuns: 3,
        },
        upload: {
            target: 'temporary-public-storage',
        },
        assert: {
            preset: 'lighthouse:recommended',
            assertions: {
                'categories:performance': ['error', { minScore: 0.9 }],
                'categories:accessibility': ['error', { minScore: 0.95 }],
                'categories:best-practices': ['error', { minScore: 0.95 }],
                'categories:seo': ['error', { minScore: 0.95 }],
                'categories:pwa': ['warn', { minScore: 0.9 }],
            },
        },
    },
};
