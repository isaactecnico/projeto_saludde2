
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

console.log("ARQUIVO EXECUTADO:", __filename);

// Verifica a API
app.get("/", (req, res) => {
    res.send("API Saúde Tiradentes funcionando!");
});

// Verifica a chave
if (!process.env.API_KEY) {
    console.error("ERRO: API_KEY não encontrada no arquivo .env");
    process.exit(1);
}

// Conexão com Gemini
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Rota do chat
app.post("/chat", async (req, res) => {

    console.log("\n========== NOVA MENSAGEM ==========");

    try {

        const mensagem = req.body.mensagem;

        console.log("MENSAGEM RECEBIDA:", mensagem);

        if (!mensagem || !mensagem.trim()) {
            return res.status(400).json({
                erro: "Digite uma mensagem."
            });
        }

        const modelo = genAI.getGenerativeModel({
            model: "gemini-3.8-flash"
        });

        const prompt = `
Você é o Assistente Saúde Tiradentes.

Você atende usuários de um sistema de saúde.

Ajude com:

- Consultas
- Vacinação
- Exames
- Horários de atendimento
- Informações gerais de saúde

Se for emergência, informe:

SAMU 192.

Seja educado, simples e claro.
Não invente informações sobre serviços locais.
Não substitua orientações de profissionais de saúde.

Mensagem do usuário:

${mensagem}
`;

        console.log("Enviando mensagem para o Gemini...");

        let resultado;
        const tentativas = 3;

        for (let i = 1; i <= tentativas; i++) {

            console.log(`Tentativa Gemini ${i}/${tentativas}`);

            try {

                resultado = await modelo.generateContent(prompt);

                console.log("Gemini respondeu com sucesso!");
                break;

            } catch (erro) {

                const status = erro.status || erro.response?.status;

                console.error("Erro:", status);
                console.error(erro.message);

                if (
                    (status === 503 || status === 429) &&
                    i < tentativas
                ) {

                    const espera = i * 2000;

                    console.log("Gemini indisponível.");
                    console.log(`Aguardando ${espera / 1000} segundos...`);

                    await new Promise(resolve =>
                        setTimeout(resolve, espera)
                    );

                } else {

                    throw erro;

                }
            }
        }

        if (!resultado) {
            throw new Error("Gemini indisponível após 3 tentativas.");
        }

        const resposta = resultado.response.text();

        console.log("RESPOSTA GEMINI:");
        console.log(resposta);

        console.log("========== SUCESSO ==========\n");

        return res.json({
            resposta: resposta
        });

    } catch (erro) {

        console.error("\n========== ERRO GEMINI ==========");
        console.error("Nome:", erro.name);
        console.error("Mensagem:", erro.message);
        console.error("Status:", erro.status);
        console.error("========== FIM DO ERRO ==========\n");

        const status = erro.status || erro.response?.status;

        return res.status(
            status === 503 || status === 429 ? status : 500
        ).json({
            erro: "Não foi possível conectar ao Gemini. Tente novamente mais tarde."
        });

    }
});

// Inicia servidor
app.listen(3000, () => {

    console.log("==================================");
    console.log("SAÚDE TIRADENTES");
    console.log("Servidor rodando em http://localhost:3000");
    console.log("Aguardando mensagens...");
    console.log("==================================");

});
