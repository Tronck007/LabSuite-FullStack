#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🎨 Iniciando Frontend con pnpm...');

// Cambiar al directorio del frontend
process.chdir(path.join(__dirname, 'LABSUITE-FRONTEND-V5'));

// Ejecutar pnpm run dev
const frontend = spawn('pnpm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

frontend.on('error', (error) => {
  console.error('❌ Error al iniciar el frontend:', error);
  process.exit(1);
});

frontend.on('close', (code) => {
  console.log(`Frontend terminó con código: ${code}`);
  process.exit(code);
});

// Manejar señales para terminar correctamente
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando frontend...');
  frontend.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando frontend...');
  frontend.kill('SIGTERM');
}); 