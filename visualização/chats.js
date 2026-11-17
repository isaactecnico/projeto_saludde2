const API_URL = "http://localhost:3000/chat";


const messages = document.getElementById("messages");
const input = document.getElementById("input");

function addMessage(text, type) {

    const div = document.createElement("div");
    div.className = "message " + type;
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;

}

async function send() {
    let texto = input.value.trim();
    if (texto === "") return;
    addMessage(
        "👤 " + texto,
        "user"
    );


    input.value = "";
    addMessage(
        "🤖 Pensando...",
        "bot"
    );



    try {



        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },


            body: JSON.stringify({
                mensagem: texto

            })


        });
        const dados = await resposta.json();
        messages.lastChild.remove();

        if (dados.resposta) {


            addMessage(

                "🤖 " + dados.resposta,
                "bot"
            );

        } else {
            addMessage(

                "❌ " + dados.erro,
                "bot"
            );
        }

    } catch (erro) {

        messages.lastChild.remove();
        addMessage(

            "❌ Não consegui conectar com o servidor.",
            "bot"
        );


        console.log(erro);
    }



}





function quick(tipo) {

    let pergunta = "";
    switch (tipo) {

        case "consulta":

            pergunta =
                "Como faço para marcar uma consulta?";
            break;
        case "vacina":
            pergunta =
                "Onde posso tomar vacina?";
            break;
        case "exames":
            pergunta =
                "Como funciona para fazer exames?";
            break;
        case "horario":

            pergunta =
                "Qual o horário de atendimento?";
            break;
        case "emergencia":

            pergunta =
                "Qual o contato de emergência?";

            break;
    }
    input.value = pergunta;
    send();
}