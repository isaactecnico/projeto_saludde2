
import { supabase } from "./supabase.js";

// Animação do título
const texto = "Bem-vindo de volta! Saúde Tiradentes";
const el = document.getElementById("texto");

let i = 0;

function digitar() {
    if (el && i < texto.length) {
        el.textContent += texto.charAt(i);
        i++;
        setTimeout(digitar, 55);
    }
}

if (el) digitar();

// Elementos do formulário
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");

const nameField = document.getElementById("nameField");
const confirmField = document.getElementById("confirmField");
const phoneField = document.getElementById("phoneField");
const addressField = document.getElementById("addressField");
const birthField = document.getElementById("birthField");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const confirmInput = document.getElementById("confirmInput");
const phoneInput = document.getElementById("phoneInput");
const addressInput = document.getElementById("addressInput");
const birthInput = document.getElementById("birthInput");

const rememberRow = document.getElementById("rememberRow");
const submitBtn = document.getElementById("submitBtn");
const registerText = document.getElementById("registerText");
const toggleAuth = document.getElementById("toggleAuth");
const authForm = document.getElementById("authForm");
const formMessage = document.getElementById("formMessage");

const headerLoginBtn = document.getElementById("headerLoginBtn");
const headerCadastroBtn = document.getElementById("headerCadastroBtn");

let isRegister = false;

function showMessage(message, error = false) {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.classList.add("show");
    formMessage.style.color = error ? "#dc2626" : "#0f766e";
}

function setFormMode(mode) {
    isRegister = mode === "register";

    authTitle.textContent = isRegister
        ? "Criar conta"
        : "Entrar na conta";

    authSubtitle.textContent = isRegister
        ? "Preencha os dados abaixo para se cadastrar"
        : "Preencha seus dados para continuar";

    nameField.style.display = isRegister ? "block" : "none";
    confirmField.style.display = isRegister ? "block" : "none";
    phoneField.style.display = isRegister ? "block" : "none";
    addressField.style.display = isRegister ? "block" : "none";
    birthField.style.display = isRegister ? "block" : "none";

    rememberRow.style.display = isRegister ? "none" : "flex";

    nameInput.required = isRegister;
    confirmInput.required = isRegister;
    phoneInput.required = isRegister;
    addressInput.required = isRegister;
    birthInput.required = isRegister;

    passwordInput.autocomplete = isRegister
        ? "new-password"
        : "current-password";

    submitBtn.textContent = isRegister ? "Cadastrar" : "Entrar";

    toggleAuth.textContent = isRegister
        ? "Entrar agora"
        : "Cadastrar agora";

    registerText.textContent = isRegister
        ? "Já tem uma conta?"
        : "Ainda não tem conta?";

    headerLoginBtn?.classList.toggle("active", !isRegister);
    headerCadastroBtn?.classList.toggle("active", isRegister);

    showMessage("");
}

// Alternar entre login e cadastro
toggleAuth.addEventListener("click", (event) => {
    event.preventDefault();
    setFormMode(isRegister ? "login" : "register");
});

headerLoginBtn?.addEventListener("click", () => {
    setFormMode("login");
});

headerCadastroBtn?.addEventListener("click", () => {
    setFormMode("register");
});

// Enviar formulário ao Supabase
authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    submitBtn.disabled = true;
    submitBtn.textContent = "Aguarde...";

    try {
        if (isRegister) {
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const address = addressInput.value.trim();
            const birth = birthInput.value;

            if (password !== confirmInput.value) {
                throw new Error("As senhas não coincidem.");
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nome: name,
                        telefone: phone,
                        endereco: address,
                        nascimento: birth
                    }
                }
            });

            if (error) throw error;

            if (data.session) {
                showMessage("Cadastro realizado com sucesso! Redirecionando...");
            } else {
                showMessage(
                    "Cadastro realizado! Confirme seu e-mail. Redirecionando..."
                );
            }

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (!data.session) {
                throw new Error("Não foi possível iniciar sua sessão.");
            }

            showMessage("Login realizado com sucesso! Redirecionando...");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);
        }

    } catch (error) {
        showMessage(error.message || "Ocorreu um erro.", true);

        submitBtn.disabled = false;
        submitBtn.textContent = isRegister ? "Cadastrar" : "Entrar";
    }
});

setFormMode("login");
