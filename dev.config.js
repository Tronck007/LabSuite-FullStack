/**
 * Configuración de desarrollo para LabSuite Full Stack
 * Este archivo contiene configuraciones compartidas para desarrollo local
 */

const path = require('path');

module.exports = {
  // Configuración general del proyecto
  project: {
    name: 'LabSuite Full Stack',
    version: '1.0.0',
    description: 'Sistema completo de gestión de laboratorio'
  },

  // Configuración de puertos para desarrollo
  ports: {
    backend: 3000,
    frontend: 5173,
    mongodb: 27017,
    redis: 6379,
    docs: 3001 // Puerto para documentación
  },

  // URLs de desarrollo
  urls: {
    backend: 'http://localhost:3000',
    frontend: 'http://localhost:5173',
    api: 'http://localhost:3000/api/v1',
    docs: 'http://localhost:3000/api/docs',
    mongodb: 'mongodb://localhost:27017/rowesuite_dev',
    redis: 'redis://localhost:6379'
  },

  // Configuración de paths
  paths: {
    root: __dirname,
    backend: path.join(__dirname, 'apirest-rowesuite-v5'),
    frontend: path.join(__dirname, 'LABSUITE-FRONTEND-V5'),
    docs: path.join(__dirname, 'docs'),
    logs: path.join(__dirname, 'logs'),
    temp: path.join(__dirname, 'temp')
  },

  // Configuración de base de datos
  database: {
    mongodb: {
      host: 'localhost',
      port: 27017,
      database: 'rowesuite_dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    redis: {
      host: 'localhost',
      port: 6379,
      db: 0,
      ttl: 1800 // 30 minutos
    }
  },

  // Configuración de JWT
  jwt: {
    secret: 'your-development-secret-key',
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },

  // Configuración de logging
  logging: {
    level: 'debug',
    format: 'combined',
    file: true,
    console: true,
    maxSize: '10MB',
    maxFiles: 5
  },

  // Configuración de CORS para desarrollo
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },

  // Configuración de hot reload y file watching
  watch: {
    backend: {
      ignore: ['node_modules', 'logs', 'dist', 'build'],
      extensions: ['js', 'json', 'env']
    },
    frontend: {
      ignore: ['node_modules', 'dist', 'build'],
      extensions: ['vue', 'js', 'ts', 'css', 'scss']
    }
  },

  // Configuración de tests
  testing: {
    backend: {
      testEnvironment: 'node',
      testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
      collectCoverage: true,
      coverageDirectory: 'coverage'
    },
    frontend: {
      testEnvironment: 'jsdom',
      testMatch: ['**/__tests__/**/*.{js,ts,vue}', '**/?(*.)+(spec|test).{js,ts,vue}'],
      collectCoverage: true,
      coverageDirectory: 'coverage'
    }
  },

  // Configuración de Docker
  docker: {
    compose: {
      dev: 'docker-compose.dev.yml',
      prod: 'docker-compose.prod.yml'
    },
    networks: {
      default: 'labsuite-network'
    },
    volumes: {
      mongodb: 'mongo_data',
      redis: 'redis_data'
    }
  },

  // Scripts de utilidad
  scripts: {
    setup: [
      'npm run install:all',
      'echo "Configurando variables de entorno..."',
      'cp apirest-rowesuite-v5/.env.example apirest-rowesuite-v5/.env',
      'cp LABSUITE-FRONTEND-V5/.env.example LABSUITE-FRONTEND-V5/.env',
      'echo "✅ Configuración completa!"'
    ],
    cleanup: [
      'docker-compose -f docker-compose.dev.yml down -v',
      'docker system prune -f',
      'rm -rf */node_modules',
      'rm -rf */dist',
      'rm -rf */build'
    ]
  },

  // Configuración de herramientas de desarrollo
  tools: {
    eslint: {
      fix: true,
      cache: true,
      extensions: ['.js', '.vue', '.ts']
    },
    prettier: {
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5'
    },
    nodemon: {
      delay: 1000,
      ignore: ['node_modules', 'dist', 'build'],
      env: {
        NODE_ENV: 'development'
      }
    }
  },

  // Configuración de proxy para desarrollo
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    }
  },

  // Configuración de módulos específicos
  modules: {
    controlLabTraceability: {
      enabled: true,
      schedulerInterval: 600000, // 10 minutos
      autoStart: false,
      debugMode: true
    },
    auth: {
      enabled: true,
      tokenExpiration: '24h',
      refreshEnabled: true
    },
    audit: {
      enabled: true,
      logLevel: 'info',
      degradedMode: true
    }
  }
};

// Función helper para obtener configuración por ambiente
function getConfig(environment = 'development') {
  const config = module.exports;
  
  // Configuraciones específicas por ambiente
  const envConfigs = {
    development: {
      ...config,
      logging: { ...config.logging, level: 'debug' },
      jwt: { ...config.jwt, secret: 'dev-secret-key' }
    },
    production: {
      ...config,
      logging: { ...config.logging, level: 'info' },
      jwt: { ...config.jwt, secret: process.env.JWT_SECRET }
    },
    test: {
      ...config,
      database: {
        ...config.database,
        mongodb: { ...config.database.mongodb, database: 'rowesuite_test' }
      }
    }
  };

  return envConfigs[environment] || envConfigs.development;
}

module.exports.getConfig = getConfig; 