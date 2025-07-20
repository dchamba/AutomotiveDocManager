# AutoDoc Pro - Sistema di Documentazione AIAG-VDA

## Panoramica

AutoDoc Pro è un'applicazione web professionale per la gestione della documentazione automotive secondo gli standard AIAG-VDA. Il sistema gestisce clienti, catalogo prodotti con versioni, e tre tipi di documenti principali: Flow Chart (editor visuale), FMEA, e Control Plan.

## Caratteristiche Principali

- **Gestione Clienti**: Registro completo delle aziende automotive
- **Catalogo Prodotti**: Prodotti con versioni obbligatorie e controllo delle modifiche
- **Flow Chart Editor**: Editor visuale con simboli standard e gestione fasi processo
- **Sistema FMEA**: Supporto per standard AIAG-VDA 2019 e AIAG 4th Ed. 2008
- **Control Plan**: Pianificazione controlli qualità per fase processo
- **UI Professionale**: Design automotive con tema blu/arancione

## Architettura Tecnica

### Frontend
- **React 18** con TypeScript
- **Vite** per sviluppo e build
- **Tailwind CSS** + shadcn/ui per UI components
- **Wouter** per routing
- **TanStack Query** per gestione stato server
- **React Hook Form** + Zod per validazione form
- **React Flow** per editor flowchart

### Backend
- **Node.js** + Express con TypeScript
- **PostgreSQL** con Neon serverless
- **Drizzle ORM** per database
- **Zod** per validazione schema

### Database
- Struttura gerarchica: Users → Clients → Products → Versions → Documents
- Gestione relazioni con Drizzle ORM
- Schema completo per tutti i tipi di documento

## Installazione

1. **Clona il repository**
```bash
git clone <repository-url>
cd autodoc-pro
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Configura il database**
```bash
# Crea un database PostgreSQL (Neon consigliato)
# Imposta la variabile d'ambiente DATABASE_URL
export DATABASE_URL="postgresql://user:password@host:port/database"

# Applica lo schema
npm run db:push
```

4. **Avvia l'applicazione**
```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5000`

## Struttura del Progetto

```
autodoc-pro/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componenti UI
│   │   ├── pages/         # Pagine dell'applicazione
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilità e configurazioni
│   │   └── types/         # Tipi TypeScript
│   └── index.html
├── server/                # Backend Express
│   ├── index.ts          # Entry point server
│   ├── routes.ts         # Route API
│   ├── storage.ts        # Interfaccia storage
│   └── db.ts            # Configurazione database
├── shared/               # Codice condiviso
│   └── schema.ts        # Schema database e validazione
└── package.json
```

## Script Disponibili

- `npm run dev` - Avvia sviluppo (frontend + backend)
- `npm run build` - Build per produzione
- `npm run db:push` - Applica modifiche schema al database
- `npm run db:pull` - Scarica schema dal database

## Variabili d'Ambiente

- `DATABASE_URL` - URL connessione PostgreSQL (obbligatorio)
- `NODE_ENV` - Ambiente di esecuzione (development/production)

## Contribuire

1. Fork del repository
2. Crea branch per feature (`git checkout -b feature/nuova-funzionalita`)
3. Commit delle modifiche (`git commit -am 'Aggiunge nuova funzionalità'`)
4. Push del branch (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

## Licenza

Progetto sviluppato per gestione documentazione automotive secondo standard AIAG-VDA.

## Supporto

Per supporto tecnico o domande sul progetto, contatta il team di sviluppo.