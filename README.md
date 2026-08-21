# Prompt Manager
Un'applicazione web per la generazione di prompt ottimizzati per contenuti AI, con interfaccia intuitiva e funzionalità avanzate di personalizzazione.

## 🚀 Demo
Prova subito l'applicazione: **[Prompt Manager Live](https://br1brown.github.io/Prompt-Manager/)**

## 🚀 Caratteristiche
- **Generazione automatica di prompt** ottimizzati per diversi tipi di contenuto
- **Interfaccia responsive** compatibile con dispositivi desktop e mobile
- **Modalità di tono personalizzabile** con profili predefiniti e toni personalizzati
- **Supporto per social media** con template specifici per piattaforme
- **Funzione di revisione** con mantenimento delle interruzioni di riga
- **Copia negli appunti** con notifiche integrate
- **Salvataggio automatico** dei toni utilizzati di recente

## 📋 Requisiti
- Browser web moderno con JavaScript abilitato
- Connessione internet (per il caricamento delle librerie CDN)

## 🌐 Accesso
L'applicazione è completamente web-based e non richiede installazioni. Funziona direttamente nel browser.

## 📁 Struttura del progetto

```
prompt-manager/
├── index.html              # Pagina principale
├── stile.css              # Stili CSS personalizzati
├── main.js                 # Entry point (ES module), avvia PromptGenerator
├── EventManager.js        # Gestione eventi dell'interfaccia
├── ModalManager.js        # Gestione delle finestre modali
├── PromptGenerator.js     # Classe principale di orchestrazione
├── PromptService.js       # Servizio per la generazione dei prompt
├── UIRenderer.js          # Rendering dell'interfaccia utente
├── promptFactory.js        # Helper condivisi per costruire i task-prompt
├── config.js                # Catalogo dei bottoni/prompt (aggrega prompts/)
├── prompts/                 # Definizione dei vari prompt, per categoria
│   ├── armonizzazione.js
│   └── revisione.js
├── data/                    # Dati puri (lessico vietato, profili tono, link AI)
│   ├── lessico.js
│   ├── toneProfiles.js
│   └── linkAI.js
└── icon.svg               # Icona dell'applicazione
```

L'app è caricata interamente tramite moduli ES nativi (`<script type="module">`), senza bundler né build step: ogni file è servito così com'è, il che la rende compatibile con GitHub Pages.

## 🌐 Dipendenze
L'applicazione utilizza le seguenti librerie CDN:
- **Bootstrap 5.3.0** - Framework CSS
- **jQuery 3.6.0** - Manipolazione DOM
- **Font Awesome 6.4.0** - Icone
- **SweetAlert2** - Notifiche e modali eleganti

## 📱 Compatibilità
- ✅ Chrome (versione 70+)
- ✅ Firefox (versione 65+)
- ✅ Safari (versione 12+)
- ✅ Edge (versione 79+)
- ✅ Dispositivi mobili (iOS Safari, Chrome Mobile)

## 🔒 Privacy
L'applicazione funziona completamente lato client. I dati vengono salvati solo nel localStorage del browser per:
- Statistiche di utilizzo dei toni e conseguenti preferenze utente

Nessun dato viene inviato a server esterni. Tutto in locale.
