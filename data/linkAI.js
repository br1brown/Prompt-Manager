// prefillUrl: solo per i servizi con un parametro di query per
// prevalorizzare il prompt confermato e ancora attivo (lo stesso usato
// per impostarli come motore di ricerca del browser). Claude l'aveva
// (claude.ai/new?q=) ma Anthropic l'ha rimosso a ottobre 2025 per motivi
// di sicurezza; Gemini non l'ha mai avuto. Meglio ometterlo che indovinare.
export const linkAI = [
    { nome: "Claude", url: "https://claude.ai/new", app: "claude://chat" },
    { nome: "ChatGPT", url: "https://chatgpt.com/", app: "chatgpt://", prefillUrl: "https://chatgpt.com/?q={q}" },
    { nome: "Perplexity", url: "https://www.perplexity.ai", app: "perplexity://", prefillUrl: "https://www.perplexity.ai/search?q={q}" },
    { nome: "DeepSeek", url: "https://chat.deepseek.com/", app: "deepseek://" },
    { nome: "Copilot", url: "https://copilot.microsoft.com/", app: "ms-copilot://" },
    // Grok è un'app standalone dal 2025 (prima solo dentro X): niente deep
    // link verificato per l'app dedicata, meglio nessuno che uno sbagliato
    { nome: "Grok", url: "https://grok.com", app: null },
    { nome: "Gemini", url: "https://gemini.google.com", app: "googleapp://google.com/gemini" },
    // Mistral ha rinominato "Le Chat" in "Vibe" il 28 maggio 2026; l'url
    // di ingresso resta lo stesso
    { nome: "Mistral Vibe", url: "https://chat.mistral.ai/chat", app: null },
    // Meta AI ha una sua app standalone dal 2025: il vecchio deep link
    // "fb-messenger://" apriva Messenger, non l'app giusta
    { nome: "Meta AI", url: "https://www.meta.ai", app: null }
];
