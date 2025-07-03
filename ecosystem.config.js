/**
 * PM2 Ecosystem Configuration for LabSuite Full Stack
 * Configuración para desarrollo local con PM2
 */

module.exports = {
  apps: [
    {
      name: 'backend',
      script: './apirest-rowesuite-v5/src/main.js',
      cwd: './apirest-rowesuite-v5',
      instances: 1,
      autorestart: true,
      watch: [
        './apirest-rowesuite-v5/src',
        './apirest-rowesuite-v5/control-lab-traceability'
      ],
      ignore_watch: [
        'node_modules',
        'logs',
        'dist',
        'build',
        '.git',
        '*.log'
      ],
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      log_file: './logs/backend-combined.log',
      out_file: './logs/backend-out.log',
      error_file: './logs/backend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '500M',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: 'frontend',
      script: './start-frontend.js',
      cwd: '.',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development'
      },
      log_file: './logs/frontend-combined.log',
      out_file: './logs/frontend-out.log', 
      error_file: './logs/frontend-error.log',
      max_memory_restart: '500M',
      kill_timeout: 10000
    }
  ],

  // Configuración para deploy (futuro)
  deploy: {
    development: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/develop',
      repo: 'git@github.com:username/labsuite-full.git',
      path: '/var/www/labsuite-dev',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env development',
      'pre-setup': ''
    },
    production: {
      user: 'node',
      host: 'production-server',
      ref: 'origin/main',
      repo: 'git@github.com:username/labsuite-full.git',
      path: '/var/www/labsuite-prod',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  },

  // Configuración adicional
  pm2: {
    // Configuración global de PM2
    daemon_mode: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G',
    
    // Configuración de logs
    log_type: 'json',
    merge_logs: true,
    time: true
  }
}; 