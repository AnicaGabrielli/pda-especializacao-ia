// meu-mcp-server — MyFuture: orçamento de tempo.
//
// Uma tool só: `projetar_orcamento_de_tempo`. Escopo e limites em ../DECISAO-ESCOPO.md.
// Este processo só LÊ um arquivo fixo (dados/objetivos.json). Não escreve, não abre rede,
// não executa comandos.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

// Caminho fixo, calculado a partir deste arquivo. Não existe parâmetro de caminho.
const ARQUIVO_OBJETIVOS = fileURLToPath(
  new URL("../dados/objetivos.json", import.meta.url),
);

const MAX_OBJETIVOS = 50;
const MAX_TITULO = 200;
const MAX_SAIDA = 4000;
const MS_POR_SEMANA = 7 * 24 * 60 * 60 * 1000;

// O título vem de um arquivo editável, então é dado não confiável. Só passa o que casa com
// esta allow-list (letras, números, espaço e . , - ( ), até 60 caracteres). O que não casa é
// substituído por um marcador, nunca cortado: um payload cortado ainda pode funcionar.
const TITULO_PERMITIDO = /^[\p{L}\p{N} .,()-]{1,60}$/u;
const TITULO_REMOVIDO = "[título removido: caracteres ou tamanho não permitidos]";

function tituloSeguro(titulo: string): string {
  return TITULO_PERMITIDO.test(titulo) ? `"${titulo}"` : TITULO_REMOVIDO;
}

const arquivoSchema = z.object({
  objetivos: z
    .array(
      z.object({
        titulo: z.string().max(MAX_TITULO),
        custo_horas: z.number().positive(),
        horas_feitas: z.number().min(0),
        data_desejada: z.iso.date(),
        prioridade: z.number().int(),
      }),
    )
    .max(MAX_OBJETIVOS),
});

const server = new McpServer({
  name: "meu-mcp-server",
  version: "0.1.0",
});

server.registerTool(
  "projetar_orcamento_de_tempo",
  {
    description:
      "Lê os objetivos da pessoa no MyFuture (somente leitura) e calcula, para um número de " +
      "horas livres por semana, a data projetada de cada objetivo e se a data desejada é " +
      "cumprida. Só lê um arquivo fixo e não altera nada.",
    inputSchema: z.object({
      horas_livres_por_semana: z
        .number()
        .finite()
        .min(0.5)
        .max(80)
        .describe("Horas por semana que a pessoa tem livres para os objetivos, de 0,5 a 80."),
    }),
  },
  async ({ horas_livres_por_semana }) => {
    const bruto = await readFile(ARQUIVO_OBJETIVOS, "utf-8");
    const { objetivos } = arquivoSchema.parse(JSON.parse(bruto));

    const hoje = new Date();
    const ordenados = [...objetivos].sort((a, b) => a.prioridade - b.prioridade);

    let horasAcumuladas = 0;
    let necessarioPorSemana = 0;
    const linhas: string[] = [];

    for (const o of ordenados) {
      const restantes = Math.max(0, o.custo_horas - o.horas_feitas);
      horasAcumuladas += restantes;

      const semanasAteProjecao = horasAcumuladas / horas_livres_por_semana;
      const projetada = new Date(hoje.getTime() + semanasAteProjecao * MS_POR_SEMANA);

      const desejada = new Date(o.data_desejada);
      const semanasAteDesejada = (desejada.getTime() - hoje.getTime()) / MS_POR_SEMANA;
      const porSemana = semanasAteDesejada > 0 ? restantes / semanasAteDesejada : Infinity;
      necessarioPorSemana += porSemana;

      const cumpre = projetada.getTime() <= desejada.getTime();
      linhas.push(
        `- ${tituloSeguro(o.titulo)}: faltam ${restantes.toFixed(0)}h; ` +
          `precisa de ${Number.isFinite(porSemana) ? porSemana.toFixed(1) : "mais que o possível"}h/semana ` +
          `para ${o.data_desejada}; data projetada ${projetada.toISOString().slice(0, 10)} ` +
          `(${cumpre ? "cumpre" : "não cumpre"} a data desejada)`,
      );
    }

    const resumo =
      `Orçamento: ${horas_livres_por_semana}h/semana disponíveis; ` +
      `${Number.isFinite(necessarioPorSemana) ? necessarioPorSemana.toFixed(1) : "mais que o possível"}h/semana ` +
      `necessárias para cumprir todas as datas desejadas.`;

    const texto = [resumo, ...linhas].join("\n").slice(0, MAX_SAIDA);
    return { content: [{ type: "text", text: texto }] };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("meu-mcp-server rodando em stdio");
}

main().catch((error) => {
  console.error("Erro fatal em main():", error);
  process.exit(1);
});
