# aula1-fundamentos

<!--
  Este arquivo entra na janela de contexto do Claude Code em TODA sessão neste projeto.
  Ele é curto de propósito: cada linha aqui custa token em cada turno.
  No LAB 3 você completa os TODOs abaixo. Quando terminar, apague os comentários e os TODOs.
  Referência: https://code.claude.com/docs/en/memory
-->

## O que é este projeto

Campo de treino da Aula 1 (Fundamentos) da Especialização em IA da PDA.
Projeto Node pequeno com funções utilitárias em `src/` e testes em `tests/`.

## Stack

- Node.js 18+ (`engines` no `package.json`; confira com `node -v`)
- ESM: `"type": "module"` no `package.json` — use `import`/`export`, nunca `require`
- Runner de testes: `node:test` nativo (sem Jest/Mocha/Vitest)

## Comandos

- `npm test` — roda todos os testes uma vez (`node --test`)
- `npm run test:watch` — roda os testes em modo watch (`node --test --watch`)
- Um único arquivo: `node --test tests/validaCpf.test.js`

## Regras

- Os arquivos em `tests/` são a especificação. **Nunca edite testes** pra fazê-los passar.
- TODO: escreva a regra "sempre rode os testes antes de dizer que terminou" com as suas palavras
- TODO: uma regra sua sobre estilo (ex.: `const` em vez de `let`, sem `==`, mensagens de erro em português…)

## Como eu quero trabalhar com você

- Antes de editar, explique em 1–2 frases o que vai mudar e por quê.
- Mudanças pequenas e focadas. Uma tarefa por vez.
- Se não tiver certeza sobre uma API ou lib, consulte a documentação (MCP context7) em vez de chutar.
- TODO: adicione uma preferência sua
