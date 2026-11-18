
import { supabase } from "./supabase.js";

const form = document.getElementById("authForm");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
const addressInput = document.getElementById("addressInput");
const birthInput = document.getElementById("birthInput");
const passwordInput = document.getElementById("passwordInput");
const confirmInput = document.getElementById("confirmInput");

function showMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.classList.add("show");
    formMessage.style.color = isError ? "#f87171" : "#4ade80";
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = nameInput.value.trim();
    const email = emailInput.value.trim();
    const telefone = phoneInput.value.trim();
    const endereco = addressInput.value.trim();
    const nascimento = birthInput.value;
    const senha = passwordInput.value;
    const confirmacao = confirmInput.value;

    if (
        !nome ||
        !email ||
        !telefone ||
        !endereco ||
        !nascimento ||
        !senha ||
        !confirmacao
    ) {
        showMessage("Preencha todos os campos.", true);
        return;
    }

    if (senha.length < 6) {
        showMessage("A senha precisa ter pelo menos 6 caracteres.", true);
        return;
    }

    if (senha !== confirmacao) {
        showMessage("As senhas não coincidem.", true);
        return;
    }

    if (new Date(nascimento + "T00:00:00") > new Date()) {
        showMessage("A data de nascimento não pode ser futura.", true);
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Criando conta...";

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password: senha,
            options: {
                data: {
                    nome,
                    telefone,
                    endereco,
                    nascimento
                }
            }
        });

        if (error) {
            throw error;
        }

        if (data.session) {
            showMessage("Conta criada com sucesso! Redirecionando...");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1800);

        } else {
            showMessage(
                "Cadastro realizado! Confira seu e-mail para confirmar sua conta antes de entrar."
            );

            form.reset();
        }

    } catch (error) {
        showMessage(
            error.message || "Não foi possível realizar o cadastro.",
            true
        );

    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Criar minha conta";
    }
});
