#!/usr/bin/env node
const { spawn } = require('child_process');
const readline = require('readline');

// Uruchamiamy oryginalny proces ruflo. IDE przekazuje zmienne środowiskowe, które proces dziedziczy.
const child = spawn('npx', ['-y', 'ruflo@latest', 'mcp', 'start'], {
  env: process.env,
  stdio: ['pipe', 'pipe', 'pipe']
});

// Przepływ wejścia (stdin) z IDE do ruflo
process.stdin.pipe(child.stdin);
// Przepływ błędów z ruflo bezpośrednio do wyjścia błędów proxy
child.stderr.pipe(process.stderr);

// Przechwytywanie wyjścia (stdout) ruflo linia po linii
const rl = readline.createInterface({
  input: child.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (!line.trim()) {
    console.log(line);
    return;
  }
  
  try {
    const msg = JSON.parse(line);
    // Przechwytywanie odpowiedzi na metodę `tools/list`
    if (msg.result && msg.result.tools && Array.isArray(msg.result.tools)) {
      if (msg.result.tools.length > 95) {
        // Ucinamy listę do ok. 95 narzędzi (poniżej limitu IDE)
        msg.result.tools = msg.result.tools.slice(0, 95);
      }
    }
    // Wypisywanie z powrotem do stdout - IDE odczytuje przefiltrowaną listę
    console.log(JSON.stringify(msg));
  } catch (e) {
    // Jeżeli to nie jest poprawny JSON (np. log), przepuść bez zmian
    console.log(line);
  }
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
