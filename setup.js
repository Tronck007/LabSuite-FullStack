#!/usr/bin/env node

/**
 * Script de Setup Automático para LabSuite con PM2
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando LabSuite con PM2...\n');

// Colores para console
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`⏳ ${description}...`, 'yellow');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completado`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error en: ${description}`, 'red');
    console.error(error.message);
    return false;
  }
}

function checkDependency(command, name) {
  try {
    execSync(command, { stdio: 'ignore' });
    log(`✅ ${name} está instalado`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${name} no está instalado`, 'red');
    return false;
  }
}

function createEnvFiles() {
  const backendEnvExample = path.join(__dirname, 'apirest-rowesuite-v5', '.env.example');
  const backendEnv = path.join(__dirname, 'apirest-rowesuite-v5', '.env');
  
  const frontendEnvExample = path.join(__dirname, 'LABSUITE-FRONTEND-V5', '.env.example');
  const frontendEnv = path.join(__dirname, 'LABSUITE-FRONTEND-V5', '.env');

  // Backend .env
  if (fs.existsSync(backendEnvExample) && !fs.existsSync(backendEnv)) {
    try {
      fs.copyFileSync(backendEnvExample, backendEnv);
      log('✅ Archivo .env del backend creado', 'green');
    } catch (error) {
      log('⚠️  No se pudo crear .env del backend', 'yellow');
    }
  }

  // Frontend .env
  if (fs.existsSync(frontendEnvExample) && !fs.existsSync(frontendEnv)) {
    try {
      fs.copyFileSync(frontendEnvExample, frontendEnv);
      log('✅ Archivo .env del frontend creado', 'green');
    } catch (error) {
      log('⚠️  No se pudo crear .env del frontend', 'yellow');
    }
  }
}

async function main() {
  log('🔍 Verificando dependencias del sistema...', 'blue');
  
  // Verificar Node.js
  if (!checkDependency('node --version', 'Node.js')) {
    log('Por favor instala Node.js desde https://nodejs.org/', 'red');
    process.exit(1);
  }

  // Verificar npm
  if (!checkDependency('npm --version', 'npm')) {
    log('npm debería venir con Node.js', 'red');
    process.exit(1);
  }

  // Verificar pnpm
  if (!checkDependency('pnpm --version', 'pnpm')) {
    log('⏳ Instalando pnpm globalmente...', 'yellow');
    if (!runCommand('npm install -g pnpm', 'Instalación de pnpm')) {
      log('❌ No se pudo instalar pnpm. Intenta manualmente: npm install -g pnpm', 'red');
      process.exit(1);
    }
  }

  // Verificar PM2
  if (!checkDependency('pm2 --version', 'PM2')) {
    log('⏳ Instalando PM2 globalmente...', 'yellow');
    if (!runCommand('npm install -g pm2', 'Instalación de PM2')) {
      log('❌ No se pudo instalar PM2. Intenta manualmente: npm install -g pm2', 'red');
      process.exit(1);
    }
  }

  // Verificar MongoDB (opcional)
  if (!checkDependency('mongod --version', 'MongoDB')) {
    log('⚠️  MongoDB no está instalado. Necesitarás instalarlo para que funcione el backend.', 'yellow');
    log('📝 Descarga MongoDB desde: https://www.mongodb.com/try/download/community', 'blue');
  }

  // Verificar Redis (opcional)
  if (!checkDependency('redis-server --version', 'Redis')) {
    log('⚠️  Redis no está instalado. Es opcional para desarrollo.', 'yellow');
    log('📝 Descarga Redis desde: https://redis.io/download', 'blue');
  }

  log('\n📦 Instalando dependencias...', 'blue');

  // Instalar dependencias del proyecto principal
  if (!runCommand('npm install', 'Instalación de dependencias principales')) {
    process.exit(1);
  }

  // Instalar dependencias del backend
  if (!runCommand('cd apirest-rowesuite-v5 && npm install', 'Instalación de dependencias del backend')) {
    process.exit(1);
  }

  // Instalar dependencias del frontend
  if (!runCommand('cd LABSUITE-FRONTEND-V5 && pnpm install', 'Instalación de dependencias del frontend')) {
    process.exit(1);
  }

  log('\n📝 Configurando archivos de entorno...', 'blue');
  createEnvFiles();

  log('\n🎯 Configuración completa!', 'green');
  log('\n📋 Próximos pasos:', 'blue');
  log('1. Inicia MongoDB: mongod', 'yellow');
  log('2. (Opcional) Inicia Redis: redis-server', 'yellow');
  log('3. Inicia el proyecto: npm run dev', 'yellow');
  log('4. Ve el estado: npm run status', 'yellow');
  log('5. Ve los logs: npm run logs', 'yellow');
  log('6. Monitor: npm run monit', 'yellow');

  log('\n🌐 URLs de desarrollo:', 'blue');
  log('• Frontend: http://localhost:5173', 'green');
  log('• Backend: http://localhost:3000', 'green');
  log('• API: http://localhost:3000/api/v1', 'green');

  log('\n📚 Documentación:', 'blue');
  log('• README.md - Guía principal', 'yellow');
  log('• PM2-GUIDE.md - Guía específica de PM2', 'yellow');

  log('\n🚀 ¡Listo para desarrollar!', 'green');
}

// Ejecutar setup
main().catch(error => {
  log('❌ Error durante el setup:', 'red');
  console.error(error);
  process.exit(1);
}); 