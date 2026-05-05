# Guide d'utilisation en Jupyter Notebook

Ce guide explique comment utiliser les agents orchestrés dans un environnement Jupyter Notebook (Colab ou local).

## Setup initial (Colab)

```python
# Installer les dépendances
!pip install -q \
    pdfplumber nltk wordcloud groq \
    langchain==0.3.25 langchain-core==0.3.65 \
    langchain-text-splitters==0.3.8 langchain-community==0.3.24 \
    huggingface_hub==0.33.4 transformers==4.47.0 \
    sentence-transformers==3.4.1 langchain-huggingface==0.1.2 \
    chromadb==0.5.23 langchain-chroma==0.1.4 \
    opentelemetry-api==1.27.0

# Monter Google Drive
from google.colab import drive
drive.mount("/content/drive")

# Importer les agents
import sys
sys.path.append("/content/drive/MyDrive/path/to/your/project")

from agents.orchestrator_agent import OrchestratorAgent
from config import CHEMIN_PDF, CHEMIN_TXT
```

## Cellule 1 : Pipeline complet

```python
import os
from google.colab import userdata
from agents.orchestrator_agent import OrchestratorAgent
from config import CHEMIN_PDF, CHEMIN_TXT

# Récupérer la clé API
try:
    groq_api_key = userdata.get("GROQ_API_KEY")
except:
    groq_api_key = None
    print("⚠️  Ajouter la clé GROQ_API_KEY via Secrets (🔑)")

# Initialiser
orchestrator = OrchestratorAgent(groq_api_key=groq_api_key)

# Questions à poser
questions = [
    "Quels sont les traitements disponibles pour l'acné ?",
    "Comment traiter l'hyperpigmentation du visage ?",
]

# Exécuter
resultat = orchestrator.pipeline_complet(
    chemin_pdf=CHEMIN_PDF,
    chemin_txt=CHEMIN_TXT,
    questions=questions,
    faire_eda=True,
)

print(f"✅ Pipeline terminé!")
print(f"   Documents : {resultat['nombre_documents']}")
print(f"   Vecteurs : {resultat['nombre_vecteurs']}")
```

## Cellule 2 : Mode interactif (poser une question)

```python
question = "Traitement de l'acné"

# Retrouver et générer
docs, contexte = orchestrator.retriever_agent.retrouver_et_construire(question, verbose=True)

# Générer réponse
reponse = orchestrator.rag_generator.generer_pipeline_complet(
    question, contexte, docs, streaming=True, verbose=True
)
```

## Cellule 3 : Analyser les statistiques uniquement (sans LLM)

```python
# EDA sans générer de réponses
orchestrator.etape_3_eda_visualization()
```

## Cellule 4 : Accéder aux agents individuels

```python
# Chaque agent peut être utilisé séparément

# Document Loader
documents = orchestrator.document_loader.charger_documents(CHEMIN_PDF)

# NLP
tokens, docs_traites = orchestrator.nlp_preprocessor.pretraiter_documents(documents)

# EDA Stats
stats = orchestrator.eda_visualizer.generer_statistiques(tokens)
print(f"Top 10 mots : {stats['top_10']}")

# Vector Store
embeddings = orchestrator.embedding_vectorstore.vectorstore
print(f"Vecteurs indexés : {embeddings._collection.count()}")
```

## Cellule 5 : Batch de questions

```python
questions_batch = [
    "Traitement de l'acné",
    "Hyperpigmentation",
    "Eczéma",
    "Psoriasis",
]

for i, question in enumerate(questions_batch, 1):
    print(f"\n{'─'*60}")
    print(f"Question {i}/{len(questions_batch)}: {question}")
    print(f"{'─'*60}\n")
    
    orchestrator.etape_6_repondre_question(question, verbose=True)
```

## Cellule 6 : Débogage (inspecter le pipeline)

```python
# Afficher le parcours complet du pipeline

print("📄 Documents chargés :")
print(f"   Total: {len(orchestrator.docs_rag_bruts)}")
for i, doc in enumerate(orchestrator.docs_rag_bruts[:3], 1):
    source = doc.get("metadata", {}).get("source", "?")
    print(f"   [{i}] {source}")

print("\n🔤 Tokens extraits :")
print(f"   Total: {len(orchestrator.tokens_eda):,}")
print(f"   Top 5: {orchestrator.tokens_eda[:5]}")

print("\n📦 Vector Store :")
vcount = orchestrator.vectorstore._collection.count()
print(f"   Vecteurs indexés: {vcount}")

print("\n✅ Pipeline opérationnel!")
```

## Cellule 7 : Rechargement rapide

```python
# Si le vector store existe déjà, recharger sans retraiter

from agents.embedding_vectorstore_agent import EmbeddingVectorStoreAgent
from agents.retriever_agent import RetrieverAgent

# Recharger
embedding_agent = EmbeddingVectorStoreAgent()
embedding_agent.charger_modele_embeddings()
vs = embedding_agent.charger_vector_store_existant()
embedding_agent.creer_retriever()

# Utiliser
ret = RetrieverAgent(embedding_agent.retriever)
docs = ret.retrouver("traitement acné", verbose=True)

print(f"✅ {len(docs)} documents récupérés!")
```

## Cellule 8 : Sauvegarder les résultats

```python
import json
from datetime import datetime

# Sauvegarder les résultats
resultats_session = {
    "timestamp": datetime.now().isoformat(),
    "nombre_documents": resultat['nombre_documents'],
    "nombre_tokens": resultat['nombre_tokens'],
    "nombre_vecteurs": resultat['nombre_vecteurs'],
    "questions_posees": len(resultat['reponses']),
}

# Sauvegarder en JSON
with open("resultats.json", "w") as f:
    json.dump(resultats_session, f, indent=2)

print("✅ Résultats sauvegardés dans resultats.json")
```

## Bonne pratiques Jupyter

1. **Organiser en cellules logiques** : Chaque étape du pipeline dans sa propre cellule
2. **Utiliser verbose=True** : Pour voir la progression
3. **Recharger l'index** : Si le notebook a crashé mais l'index existe
4. **Batch les questions** : Pour éviter les re-indexations
5. **Documenter avec Markdown** : Expliquer ce que chaque cellule fait

## Dépannage Jupyter

### ChromaDB corrompu
```python
import shutil
from config import CHROMA_PATH

# Supprimer et recréer
shutil.rmtree(CHROMA_PATH)
print("✅ Ancien index supprimé. Relancer l'étape 4 pour recréer.")
```

### Kernel qui crash
```python
# Trop d'embeddings en RAM? Réduire:
from config import CHUNK_CONFIG, GROQ_CONFIG
CHUNK_CONFIG["chunk_size"] = 500  # au lieu de 1000
```

### API timeout
```python
# Augmenter le timeout Groq
import os
os.environ["GROQ_REQUEST_TIMEOUT"] = "60"
```

---

**Version** : 2.0  
**Compatible** : Google Colab, Jupyter Lab, Jupyter Notebook
