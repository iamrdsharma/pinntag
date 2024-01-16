module.exports = {
    apps: [
      {
        name: 'Pinntag-BE', // Give your app a name
        script: 'npm run start:prod', // Path to your TypeScript entry point
        instances: 'max',
        exec_mode: 'cluster',
        watch: false,
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  