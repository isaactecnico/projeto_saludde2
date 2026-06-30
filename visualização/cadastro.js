const texto = "Bem-vindo de volta! Saúde Tiradentes";
const el = document.getElementById("texto");

let i = 0;

function digitar() {
    if (i < texto.length) {
        el.innerHTML += texto.charAt(i);
        i++;
        setTimeout(digitar, 55);
    }
}

if (el) {
    digitar();
}

const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const nameField = document.getElementById("nameField");
const confirmField = document.getElementById("confirmField");
const rememberRow = document.getElementById("rememberRow");
const submitBtn = document.getElementById("submitBtn");
const registerText = document.getElementById("registerText");
const toggleAuth = document.getElementById("toggleAuth");
const authForm = document.getElementById("authForm");
const formMessage = document.getElementById("formMessage");
const headerLoginBtn = document.getElementById("headerLoginBtn");
const headerCadastroBtn = document.getElementById("headerCadastroBtn");

let isRegister = false;

function setFormMode(mode) {
    isRegister = mode === "register";

    authTitle.textContent = isRegister ? "Criar conta" : "Entrar na conta";
    authSubtitle.textContent = isRegister
        ? "Preencha os dados abaixo para se cadastrar"
        : "Preencha seus dados para continuar";

    nameField.style.display = isRegister ? "block" : "none";
    confirmField.style.display = isRegister ? "block" : "none";
    rememberRow.style.display = isRegister ? "none" : "flex";
    submitBtn.textContent = isRegister ? "Cadastrar" : "Entrar";
    toggleAuth.textContent = isRegister ? "Entrar agora" : "Cadastrar agora";
    registerText.textContent = isRegister ? "Já tem uma conta?" : "Ainda não tem conta?";

    headerLoginBtn.classList.toggle("active", !isRegister);
    headerCadastroBtn.classList.toggle("active", isRegister);
    formMessage.textContent = "";
}

if (toggleAuth) {
    toggleAuth.addEventListener("click", (event) => {
        event.preventDefault();
        setFormMode(isRegister ? "login" : "register");
    });
}

if (headerLoginBtn) {
    headerLoginBtn.addEventListener("click", () => setFormMode("login"));
}

if (headerCadastroBtn) {
    headerCadastroBtn.addEventListener("click", () => setFormMode("register"));
}

if (authForm) {
    authForm.addEventListener("submit", (event) => {
        event.preventDefault();
        formMessage.textContent = isRegister
            ? "Cadastro realizado com sucesso!"
            : "Login realizado com sucesso!";
        formMessage.classList.add("show");
    });
}

setFormMode("login");
