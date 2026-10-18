# Decisão de escopo — MyFuture / orçamento de tempo

## O projeto

- **Domínio do catálogo (semana 2):** MyFuture, aplicativo de planejamento de vida que usa
  tempo e esforço aplicados como unidade comum dos objetivos (repositório `MyFuture`).
- **Que dado ou sistema real esse tool vai tocar:** um único arquivo JSON local,
  `meu-mcp-server/dados/objetivos.json`, com os objetivos da pessoa (título, custo em horas,
  horas já feitas, data desejada, prioridade). Mais nada: sem banco, sem rede, sem agenda.

## Por que esta tool

A pesquisa de descoberta do MyFuture (26 respostas) sustenta o **orçamento de tempo**: 21 de
26 dizem ter mais objetivos do que tempo, e 12 de 14 entre quem abandona por falta de tempo.
Foi a única hipótese de produto com veredito "Sustentada". Esta tool responde à pergunta
central dessa hipótese: *"com o tempo livre que tenho por semana, dá para chegar a tudo que
quero?"* — sem punir, só mostrando a conta.

## A tool

- **Nome da tool:** `projetar_orcamento_de_tempo`
- **O que ela recebe (parâmetros):** `horas_livres_por_semana` — um número entre 0,5 e 80.
  Nenhum outro parâmetro. Em especial, **nenhum caminho de arquivo**.
- **O que ela devolve:** texto com, para cada objetivo, as horas restantes, as horas por
  semana necessárias para cumprir a data desejada, a data projetada com o orçamento
  informado (objetivos atendidos em ordem de prioridade) e se a data desejada é cumprida;
  mais o total de horas por semana necessárias contra as disponíveis.

## O que ela PRECISA poder fazer

(a menor lista possível — cada item é uma permissão concedida)

1. Ler **um** arquivo fixo: `dados/objetivos.json`.
2. Fazer contas com os números dele e com `horas_livres_por_semana`, e devolver o resultado
   como texto.

## O que ela NÃO PODE poder fazer

1. **Escrever, alterar, criar ou apagar qualquer arquivo.** Registrar objetivo ou horas
   feitas é trabalho de outra tool, que não existe.
2. **Ler qualquer arquivo que não seja `dados/objetivos.json`** (nada de `.env`, chaves,
   outros projetos, o resto do disco), mesmo que o texto de um objetivo peça.
3. **Acessar a rede ou executar comandos/código.** O processo não importa `child_process`,
   `http`, `net` nem `fetch`.
4. **Aceitar parâmetros fora do esperado:** texto no lugar de número, valor negativo, zero,
   `NaN`, `Infinity` ou acima de 80 horas por semana.
5. **Devolver uma resposta gigante** (mais de 50 objetivos ou mais de 4000 caracteres).
6. **Fazer o texto livre vindo do arquivo (título dos objetivos) passar por instrução para
   o agente.** O arquivo é dado, não ordem. *(Este é o item mais difícil de garantir; ver
   previsão abaixo.)*

## Como isso é garantido no código

1. **Itens 1 e 2:** o caminho do arquivo é uma constante calculada a partir de
   `import.meta.url`; não existe parâmetro de caminho. O código só usa `readFile` e não
   importa nenhuma função de escrita de `fs`.
2. **Item 3:** o `index.ts` não importa `child_process`, `http`, `https`, `net` nem usa
   `fetch`. Verificável com `grep` no código-fonte.
3. **Item 4:** `inputSchema` em zod com `z.number().finite().min(0.5).max(80)`; a entrada
   inválida é rejeitada antes de qualquer leitura.
4. **Item 5:** o arquivo é validado por schema (no máximo 50 objetivos) e a resposta é
   cortada em 4000 caracteres.
5. **Item 6:** na primeira versão, **só limite de tamanho do título**. A sanitização real
   do texto livre só será escrita depois do ataque (ver "Se alguém tentasse…").

## Se alguém tentasse enganar o agente pra fazer o que está na lista de "NÃO PODE"

- **O que você acha que aconteceria hoje, antes de qualquer correção?** A tool só lê e
  calcula, então os itens 1 a 5 devem aguentar: ela não tem como escrever nem ler outro
  arquivo. Já o item 6 provavelmente **não aguenta**: o título de um objetivo é devolvido
  como veio, então uma instrução escondida no título (injeção indireta) chega ao agente
  misturada com os números. Se o agente tiver outras ferramentas (ler arquivos, por
  exemplo), ele pode obedecer. Ou seja: a tool em si não faz nada fora do escopo, mas pode
  ser a porta de entrada para o agente fazer.
- **Qual sinal mostraria que o ataque funcionou?** O agente, depois de chamar a tool,
  executar uma ação que ninguém pediu e que o texto do título mandou (por exemplo, ler um
  arquivo-isca fora de `dados/` e mostrar o conteúdo, ou responder com uma frase combinada
  em vez do resumo). Para ter prova objetiva, o teste usa um arquivo-isca com um código
  fictício: se o código aparecer na resposta, o ataque funcionou.
