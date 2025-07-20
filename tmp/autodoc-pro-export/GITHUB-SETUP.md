# Guida per Caricare su GitHub

## Opzione 1: Caricamento Manuale

1. **Vai su GitHub.com** e accedi al tuo account
2. **Crea un nuovo repository**:
   - Clicca su "New" (verde)
   - Nome repository: `autodoc-pro`
   - Descrizione: `Sistema professionale per documentazione automotive AIAG-VDA`
   - Scegli se pubblico o privato
   - NON aggiungere README, .gitignore o license (già inclusi)
   - Clicca "Create repository"

3. **Carica i file**:
   - Nella pagina del repository vuoto, clicca "uploading an existing file"
   - Trascina tutti i file e cartelle da questa cartella
   - Scrivi commit message: "Initial commit: AutoDoc Pro completo"
   - Clicca "Commit new files"

## Opzione 2: Da Riga di Comando

Se hai git installato localmente:

```bash
# 1. Vai nella cartella del progetto
cd autodoc-pro-export

# 2. Aggiungi il repository remoto (sostituisci USERNAME)
git remote add origin https://github.com/USERNAME/autodoc-pro.git

# 3. Pusha il codice
git branch -M main
git push -u origin main
```

## Struttura Repository

Il repository include:
- ✅ Codice completo frontend e backend
- ✅ Configurazioni (package.json, tsconfig, etc.)
- ✅ Schema database completo
- ✅ Componenti UI professionali
- ✅ Editor Flow Chart funzionante
- ✅ README dettagliato
- ✅ Git history inizializzato

## Dopo il Caricamento

1. **Clona per lavorare**:
```bash
git clone https://github.com/USERNAME/autodoc-pro.git
cd autodoc-pro
npm install
```

2. **Configura database**:
```bash
# Imposta DATABASE_URL nel tuo ambiente
export DATABASE_URL="postgresql://..."
npm run db:push
```

3. **Avvia applicazione**:
```bash
npm run dev
```

Il progetto sarà pronto per essere sviluppato e deployato!