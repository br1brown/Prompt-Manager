// Pattern tipici della scrittura AI, per categoria.
//
// Sostituisce il vecchio approccio a lista fissa di parole vietate
// (fragile: invecchia, si aggira con un sinonimo, e spinge il modello a
// circonlocuzioni innaturali pur di evitare la parola esatta). Un modello
// moderno generalizza bene da una categoria descritta con pochi esempi
// rappresentativi: non serve né è opportuno enumerare ogni variante.
export const PATTERN_SCRITTURA_AI = [
    {
        categoria: "riempitivi e intensificatori vuoti",
        esempi: "può, potrebbe, solo, molto, davvero, letteralmente, effettivamente, certamente, probabilmente, fondamentalmente"
    },
    {
        categoria: "vocabolario da hype tecnologico",
        esempi: "rivoluzionario, dirompente, innovativo, all'avanguardia, sbloccare, tuffarsi, navigare, cruciale, intricato, entusiasmante, robusto"
    },
    {
        categoria: "enfasi indebita su importanza o eredità storica",
        esempi: "fondamentale, svolta, punto di svolta, segna un momento, pietra miliare, gioca un ruolo chiave"
    },
    {
        categoria: "tono promozionale da guida turistica",
        esempi: "vivace, ricco patrimonio, vanta, eccellenza, rinomato, impegno verso, meticoloso, vetrina"
    },
    {
        categoria: "connettori vaghi al posto di preposizioni dirette",
        esempi: "in relazione a, in associazione con"
    },
    // Categoria aggiunta a Wikipedia:Signs of AI writing nel 2026: il testo
    // racconta il processo che l'ha prodotto invece di affermare il fatto
    // direttamente - lo fa chi ha appena "letto" la fonte, non chi la conosce
    {
        categoria: "narrazione del processo invece del risultato",
        esempi: "dopo un'attenta analisi risulta che, un esame del testo mostra che, a uno sguardo più attento si nota che"
    }
];
