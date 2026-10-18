# Parágrafos da entrega — MyFuture

## Parágrafo para o dono do negócio

Demos ao assistente de IA uma ferramenta que olha a lista de objetivos de uma pessoa no
MyFuture, como "vestibular" ou "aprender violão", e, a partir de quantas horas livres ela
tem por semana, calcula quando cada objetivo ficaria pronto e se a data desejada cabe no
tempo disponível. Isso deixa o assistente responder "dá para fazer tudo isso?" com uma conta
de verdade, e não com um palpite. A ferramenta só lê essa lista: ela não pode alterar nem
apagar nada, não olha nenhum outro arquivo do computador e não acessa a internet. Também
cortamos, no código, qualquer nome de objetivo que tenha símbolos ou frases longas, para que
ninguém consiga esconder uma ordem para o assistente dentro do nome de um objetivo. Essa
última trava reduz o risco, mas não zera: um nome curto e bem escrito ainda passa.

## Parágrafo extra (entrega completa): qual risco ameaça mais o MyFuture

O risco que mais ameaça o MyFuture é a **injeção de prompt indireta** (LLM01), chegando por
saída mal tratada (LLM05). O produto vive de texto escrito pelo usuário (nomes de objetivos,
etapas, notas) e, em algum momento, esse texto vai voltar ao assistente de IA como contexto.
Quem controla o texto controla o que o assistente lê. Se um dia os objetivos puderem ser
importados, compartilhados com outra pessoa ou sincronizados de outro app, o texto de
terceiros entra no mesmo caminho. A mitigação em código ajuda, mas o teste mostrou que um
título curto, só com letras, passa pelo filtro; ela não substitui o princípio de dar ao
assistente poder mínimo (somente leitura, sem acesso a outros arquivos). Prompt injection por
ferramentas (tool poisoning) e cadeia de suprimentos (LLM03) também importam, mas o MyFuture
hoje não instala ferramentas de terceiros nem aceita descrições externas de tools.

Observação honesta sobre a evidência: nos quatro ataques testados, o modelo não obedeceu. O
risco continua real porque a trava estava no modelo, e não no código, até a mitigação ser
feita.
