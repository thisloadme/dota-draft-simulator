module.exports = {
  apps: [
    {
      name: 'dota-draft-simulator',
      port: '8000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
