# -*- coding: utf-8 -*-
"""
examples.py — Exemples d'utilisation avancée des agents

Démontre différentes façons d'utiliser le pipeline RAG orchestré.
"""

import os
from agents.orchestrator_agent import OrchestratorAgent
from agents.document_loader_agent import DocumentLoaderAgent
from agents.nlp_preprocessing_agent import NLPPreprocessingAgent
from agents.eda_visualization_agent import EDAVisualizationAgent
from agents.embedding_vectorstore_agent import EmbeddingVectorStoreAgent
from agents.retriever_agent import RetrieverAgent
from agents.rag_generation_agent import RAGGenerationAgent

from config import CHEMIN_PDF, CHEMIN_TXT, CHROMA_PATH


# ─────────────────────────────────────────────────────────────────────────────
# EXEMPLE 1 : Utiliser les agents individuellement
# ─────────────────────────────────────────────────────────────────────────────

def exemple_1_agents_individuels():
    """
    Utilise les agents de façon indépendante (workflow custom).
    """
    print("\n" + "="*70)
    print("EXEMPLE 1 : Utilisation d'agents individuels")
    print("="*70 + "\n")

    # Étape 1 : Charger les documents
    print("📂 Étape 1 : Chargement des documents")
    loader = DocumentLoaderAgent()
    _, docs_pdf = loader.charger_documents(CHEMIN_PDF)
    _, docs_txt = loader.charger_documents(CHEMIN_TXT)
    docs_tous = docs_txt + docs_pdf

    # Étape 2 : Preprocessing NLP
    print("\n🔤 Étape 2 : Preprocessing NLP")
    nlp = NLPPreprocessingAgent()
    tokens, docs_traites = nlp.pretraiter_documents(docs_tous)

    # Étape 3 : EDA (optionnel, et visualisations peuvent être coûteuses)
    print("\n📊 Étape 3 : Génération des statistiques EDA")
    eda = EDAVisualizationAgent()
    stats = eda.generer_statistiques(tokens)
    print(f"   Top 3 termes : {stats['top_10'][:3]}")

    # Étape 4 : Embedding & Vector Store (recharger si existant)
    print("\n🔍 Étape 4 : Embedding & Vector Store")
    embedding_agent = EmbeddingVectorStoreAgent()
    embedding_agent.charger_modele_embeddings()

    # Essayer de charger un index existant, sinon en créer un
    try:
        print("   Tentative de rechargement d'un index existant...")
        vs = embedding_agent.charger_vector_store_existant()
        embedding_agent.creer_retriever()
    except Exception as e:
        print(f"   Index inexistant, création d'un nouveau...")
        vs, retriever = embedding_agent.conditionner_pipeline(docs_tous)

    # Étape 5 : Retrieve + Generate
    print("\n🎯 Étape 5 : Récupération et génération")
    retriever_agent = RetrieverAgent(embedding_agent.retriever)

    question = "Traitement acné"
    docs_pertinents, contexte = retriever_agent.retrouver_et_construire(
        question, verbose=True
    )

    # Générer une réponse
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        rag_agent = RAGGenerationAgent(groq_key)
        reponse = rag_agent.generer_pipeline_complet(
            question, contexte, docs_pertinents, streaming=True, verbose=True
        )
        print(f"\n✅ Réponse générée avec succès")


# ─────────────────────────────────────────────────────────────────────────────
# EXEMPLE 2 : Utiliser l'orchestrateur avec étapes personnalisées
# ─────────────────────────────────────────────────────────────────────────────

def exemple_2_orchestrateur_custom():
    """
    Utilise l'orchestrateur mais exécute seulement certaines étapes.
    """
    print("\n" + "="*70)
    print("EXEMPLE 2 : Orchestrateur avec flow personnalisé")
    print("="*70 + "\n")

    orchestrator = OrchestratorAgent(
        groq_api_key=os.getenv("GROQ_API_KEY")
    )

    # Exécuter juste chargement + indexation (pas d'EDA, pas de génération)
    orchestrator.etape_1_charger_documents(CHEMIN_PDF, CHEMIN_TXT)
    orchestrator.etape_2_pretraitement_nlp()
    orchestrator.etape_4_embedding_vectorstore(reinitialiser=False)

    print("\n✅ Index créé. Prêt pour les requêtes!")


# ─────────────────────────────────────────────────────────────────────────────
# EXEMPLE 3 : Batch processing (plusieurs questions sans recharger)
# ─────────────────────────────────────────────────────────────────────────────

def exemple_3_batch_processing():
    """
    Pose plusieurs questions en batch (économe en ressources).
    """
    print("\n" + "="*70)
    print("EXEMPLE 3 : Batch processing de questions")
    print("="*70 + "\n")

    orchestrator = OrchestratorAgent(
        groq_api_key=os.getenv("GROQ_API_KEY")
    )

    # Charger et indexer une seule fois
    orchestrator.etape_1_charger_documents(CHEMIN_PDF, CHEMIN_TXT)
    orchestrator.etape_2_pretraitement_nlp()
    orchestrator.etape_4_embedding_vectorstore(reinitialiser=False)
    orchestrator.etape_5_test_retriever()

    # Batch de questions
    questions_batch = [
        "Traitement de l'acné",
        "Hyperpigmentation",
        "Eczéma",
        "Psoriasis",
    ]

    resultats = []
    for i, question in enumerate(questions_batch, 1):
        print(f"\n{'─'*70}")
        print(f"Question {i}/{len(questions_batch)}")
        print(f"{'─'*70}")

        try:
            resultat = orchestrator.etape_6_repondre_question(
                question,
                verbose=True
            )
            resultats.append(resultat)
        except Exception as e:
            print(f"❌ Erreur : {e}")

    print(f"\n✅ {len(resultats)}/{len(questions_batch)} questions traitées")


# ─────────────────────────────────────────────────────────────────────────────
# EXEMPLE 4 : Analyser le corpus sans générer de réponses
# ─────────────────────────────────────────────────────────────────────────────

def exemple_4_analyse_eda_seule():
    """
    Analysez seulement les statistiques textuelles (sans LLM).
    """
    print("\n" + "="*70)
    print("EXEMPLE 4 : Analyse EDA complète (sans LLM)")
    print("="*70 + "\n")

    # Charger + Preprocessing
    loader = DocumentLoaderAgent()
    _, docs_pdf = loader.charger_documents(CHEMIN_PDF)
    _, docs_txt = loader.charger_documents(CHEMIN_TXT)
    docs_tous = docs_txt + docs_pdf

    nlp = NLPPreprocessingAgent()
    tokens, _ = nlp.pretraiter_documents(docs_tous)

    # EDA complète
    eda = EDAVisualizationAgent()
    eda.analyser_corpus(tokens, nom_corpus="Corpus Dermatologie")

    print("\n✅ Analyse EDA terminée (voir les graphiques générés)")


# ─────────────────────────────────────────────────────────────────────────────
# EXEMPLE 5 : Déboguer / inspecter le pipeline
# ─────────────────────────────────────────────────────────────────────────────

def exemple_5_debug_pipeline():
    """
    Inspectez les résultats intermédiaires pour déboguer.
    """
    print("\n" + "="*70)
    print("EXEMPLE 5 : Débogage du pipeline")
    print("="*70 + "\n")

    orchestrator = OrchestratorAgent()

    # Étape 1
    print("\n1️⃣  Chargement...")
    orchestrator.etape_1_charger_documents(CHEMIN_PDF, CHEMIN_TXT)
    print(f"   Docs chargés: {len(orchestrator.docs_rag_bruts)}")
    print(f"   Premier doc: {str(orchestrator.docs_rag_bruts[0])[:200]}...")

    # Étape 2
    print("\n2️⃣  Preprocessing...")
    result = orchestrator.etape_2_pretraitement_nlp()
    print(f"   Tokens: {result['nombre_tokens']:,}")
    print(f"   Top 5 tokens: {result['tokens_eda'][:5]}")

    # Étape 4
    print("\n4️⃣  Vector Store...")
    result = orchestrator.etape_4_embedding_vectorstore(reinitialiser=False)
    print(f"   Vecteurs: {result['nombre_vecteurs']}")

    # Test retriever avec requête simple
    print("\n5️⃣  Test retriever...")
    orchestrator.etape_5_test_retriever("acné")

    print("\n✅ Débogage terminé")


# ─────────────────────────────────────────────────────────────────────────────
# Menu principal
# ─────────────────────────────────────────────────────────────────────────────

def main():
    """Sélectionne un exemple à exécuter."""
    print("\n" + "🧪 "*20)
    print("EXEMPLES D'UTILISATION AVANCÉE")
    print("🧪 "*20 + "\n")

    print("1. Agents individuels (workflow custom)")
    print("2. Orchestrateur avec flow personnalisé")
    print("3. Batch processing (plusieurs questions)")
    print("4. Analyse EDA seule (stats textuelles)")
    print("5. Débogage du pipeline")
    print("0. Quitter\n")

    choix = input("Sélectionnez un exemple (0-5) : ").strip()

    exemplaires = {
        "1": exemple_1_agents_individuels,
        "2": exemple_2_orchestrateur_custom,
        "3": exemple_3_batch_processing,
        "4": exemple_4_analyse_eda_seule,
        "5": exemple_5_debug_pipeline,
    }

    if choix in exemplaires:
        try:
            exemplaires[choix]()
        except Exception as e:
            print(f"\n❌ Erreur : {e}")
            import traceback
            traceback.print_exc()
    elif choix == "0":
        print("👋 Au revoir!")
    else:
        print("❌ Choix invalide")


if __name__ == "__main__":
    main()
