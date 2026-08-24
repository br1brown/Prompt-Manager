export const linkAI = [
    { nome: "Claude", url: "https://claude.ai/new", app: "claude://chat" },
    { nome: "ChatGPT", url: "https://chatgpt.com/", app: "chatgpt://" },
    { nome: "Perplexity", url: "https://www.perplexity.ai", app: "perplexity://" },
    { nome: "DeepSeek", url: "https://chat.deepseek.com/", app: "deepseek://" },
    { nome: "Copilot", url: "https://copilot.microsoft.com/", app: "ms-copilot://" },
    // Grok è un'app standalone dal 2025 (prima solo dentro X): niente deep
    // link verificato per l'app dedicata, meglio nessuno che uno sbagliato
    { nome: "Grok", url: "https://grok.com", app: null },
    { nome: "Gemini", url: "https://gemini.google.com", app: "googleapp://google.com/gemini" },
    { nome: "Le Chat", url: "https://chat.mistral.ai/chat", app: null },
    // Meta AI ha una sua app standalone dal 2025: il vecchio deep link
    // "fb-messenger://" apriva Messenger, non l'app giusta
    { nome: "Meta AI", url: "https://www.meta.ai", app: null }
];
