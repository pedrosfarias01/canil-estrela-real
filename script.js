// ============================================================
// CONFIGURAÇÃO: só precisa mexer aqui
// ============================================================
const CONFIG = {
  // WhatsApp com código do país (55) + DDD + número, só dígitos. Ex.: "5511912345678"
  whatsapp: "5500000000000",

  // Usuário do Instagram, sem @. Deixe "" para esconder o link.
  instagram: "",

  // Cidade que aparece no rodapé. Deixe "" para esconder.
  cidade: "Cidade · UF",

  // URL do Google Apps Script (veja README.md, passo "Planilha do Google").
  formEndpoint: "",
};


// ============ Links do WhatsApp, Instagram e rodapé ============
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  const msg = encodeURIComponent(link.dataset.whatsapp);
  link.href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
});

const insta = document.getElementById("instagram-link");
if (CONFIG.instagram) insta.href = `https://instagram.com/${CONFIG.instagram}`;
else insta.remove();

document.getElementById("cidade-canil").textContent = CONFIG.cidade;
document.getElementById("ano").textContent = new Date().getFullYear();


// ============ Máscara do telefone: (11) 91234-5678 ============
const phone = document.querySelector('input[name="whatsapp"]');
phone.addEventListener("input", () => {
  const d = phone.value.replace(/\D/g, "").slice(0, 11);
  let out = d;
  if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  phone.value = out;
});


// ============ Envio do formulário para a planilha ============
const form = document.getElementById("form-filhotes");
const msg = form.querySelector(".form-msg");
const button = form.querySelector("button");

function showMessage(text, type) {
  msg.textContent = text;
  msg.className = `form-msg ${type}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const digits = (data.get("whatsapp") || "").replace(/\D/g, "");

  if (!data.get("nome").trim()) return showMessage("Faltou o seu nome.", "error");
  if (digits.length < 10) return showMessage("Confere o WhatsApp? Precisa ter o DDD.", "error");
  if (!data.get("consentimento")) return showMessage("Marca a autorização pra gente poder te chamar no WhatsApp.", "error");

  if (!CONFIG.formEndpoint) {
    return showMessage("Formulário ainda não conectado à planilha (veja o README).", "error");
  }

  button.disabled = true;
  button.textContent = "Enviando...";

  try {
    // "no-cors": o Google não deixa ler a resposta, mas os dados chegam na planilha
    await fetch(CONFIG.formEndpoint, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams(data),
    });
    form.reset();
    showMessage("Pronto, seu nome está na lista! Assim que tiver novidade, a gente te chama no WhatsApp.", "ok");
  } catch (err) {
    showMessage("Ops, não conseguimos enviar. Tenta de novo ou chama a gente no WhatsApp.", "error");
  } finally {
    button.disabled = false;
    button.textContent = "Quero entrar na lista";
  }
});
