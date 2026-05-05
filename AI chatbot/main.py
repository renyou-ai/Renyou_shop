# -*- coding: utf-8 -*-
"""
Main entry point for the orchestrated dermatology RAG pipeline.
"""

import os

from agents.orchestrator_agent import OrchestratorAgent
from config import CHEMIN_PDF, CHEMIN_TXT, CHEMIN_CSV_PRODUITS


try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    env_path = ".env"
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    os.environ[key.strip()] = value.strip()


def mode_pipeline_complet():
    print("\nMode: PIPELINE COMPLET")
    print("=" * 70)

    questions = [
        "Quels sont les traitements disponibles pour l'acne ?",
        "Comment traiter l'hyperpigmentation du visage ?",
        "Quelles sont les contre-indications dermatologiques ?",
    ]

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("\nWarning: variable GROQ_API_KEY non trouvee.")
        print("Les reponses LLM seront desactivees.")

    orchestrator = OrchestratorAgent(groq_api_key=groq_api_key)
    resultat = orchestrator.pipeline_complet(
        chemin_pdf=CHEMIN_PDF,
        chemin_txt=CHEMIN_TXT,
        chemin_csv=CHEMIN_CSV_PRODUITS,
        questions=questions if groq_api_key else None,
        faire_eda=True,
        reinitialiser_index=True,
        groq_api_key=groq_api_key,
        faire_recommandation=True,
    )

    print("\nResume final:")
    print(f"Documents charges : {resultat['nombre_documents']}")
    print(f"Produits integres : {resultat['nombre_produits']}")
    print(f"Tokens extraits : {resultat['nombre_tokens']:,}")
    print(f"Vecteurs indexes : {resultat['nombre_vecteurs']}")
    print(f"Reponses generees : {len(resultat['reponses'])}")


def mode_index_existant():
    print("\nMode: RECHARGEMENT D'INDEX EXISTANT")
    print("=" * 70)

    from agents.embedding_vectorstore_agent import EmbeddingVectorStoreAgent
    from agents.rag_generation_agent import RAGGenerationAgent
    from agents.retriever_agent import RetrieverAgent

    embedding_vs_agent = EmbeddingVectorStoreAgent()
    embedding_vs_agent.charger_modele_embeddings()
    embedding_vs_agent.charger_vector_store_existant()
    embedding_vs_agent.creer_retriever()
    retriever_agent = RetrieverAgent(embedding_vs_agent.retriever)

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("Erreur: cle GROQ_API_KEY manquante")
        return

    rag_generator = RAGGenerationAgent(groq_api_key)
    questions = ["Traitement de l'acne", "Hyperpigmentation"]

    for i, question in enumerate(questions, 1):
        print(f"\n{'-' * 70}")
        print(f"Question {i}: {question}")
        print(f"{'-' * 70}")

        docs, contexte = retriever_agent.retrouver_et_construire(question, verbose=True)
        rag_generator.generer_pipeline_complet(
            question,
            contexte,
            docs,
            streaming=True,
            verbose=True,
        )


def mode_interactif():
    print("\nMode: INTERACTIF")
    print("=" * 70)

    from agents.embedding_vectorstore_agent import EmbeddingVectorStoreAgent
    from agents.rag_generation_agent import RAGGenerationAgent
    from agents.retriever_agent import RetrieverAgent
    from agents.products_csv_agent import ProductsCSVAgent
    from agents.conversation_memory_agent import ConversationMemoryAgent

    embedding_vs_agent = EmbeddingVectorStoreAgent()
    embedding_vs_agent.charger_modele_embeddings()

    try:
        embedding_vs_agent.charger_vector_store_existant()
        embedding_vs_agent.creer_retriever()
    except Exception as e:
        print(f"Impossible de charger l'index : {e}")
        print("Executez d'abord le mode pipeline complet.")
        return

    retriever_agent = RetrieverAgent(embedding_vs_agent.retriever)

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("Erreur: cle GROQ_API_KEY manquante")
        return

    # Charger les produits CSV
    products_csv_agent = ProductsCSVAgent()
    df_produits = None
    try:
        if os.path.exists(CHEMIN_CSV_PRODUITS):
            df_produits, _ = products_csv_agent.charger_et_transformer(CHEMIN_CSV_PRODUITS)
            print(f"✅ {len(df_produits)} produits chargés")
        else:
            print(f"⚠️  CSV produits non trouvé : {CHEMIN_CSV_PRODUITS}")
    except Exception as e:
        print(f"⚠️  Erreur chargement CSV : {e}")

    # Initialiser la mémoire conversationnelle
    memory_agent = ConversationMemoryAgent()

    rag_generator = RAGGenerationAgent(groq_api_key)
    print("\n✅ Mémoire conversationnelle activée")
    print("Index charge. Tapez 'exit' pour quitter.\n")

    while True:
        try:
            question = input("Votre question : ").strip()
            if question.lower() == "exit":
                print("Au revoir")
                break
            if not question:
                continue

            # Reformulation avec contexte conversationnel
            question_reformulee = memory_agent.reformuler_question(question)

            docs, contexte = retriever_agent.retrouver_et_construire(question_reformulee, verbose=False)
            
            # Générer réponse avec produits recommandés
            resultat = rag_generator.generer_pipeline_complet(
                question,
                contexte,
                docs,
                streaming=False,
                verbose=False,
            )
            
            # Ajouter recommandations produits si disponibles
            if df_produits is not None:
                recommandations = products_csv_agent.obtenir_recommandations(question, df_produits, top_n=3)
                if recommandations:
                    resultat["recommandations_produits"] = recommandations
            
            print(resultat["reponse"])
            
            # Ajouter à la mémoire
            memory_agent.ajouter_message("user", question)
            memory_agent.ajouter_message("assistant", resultat["reponse"])
            
        except KeyboardInterrupt:
            print("\nInterrompu")
            break


def main():
    print("\n" + "=" * 70)
    print("Pipeline RAG Dermatologie - Version Orchestree")
    print("=" * 70 + "\n")

    print("Modes disponibles:")
    print("  1. Pipeline complet (chargement + indexation + reponses)")
    print("  2. Recharger index existant")
    print("  3. Mode interactif")
    print("  0. Quitter\n")

    while True:
        try:
            choix = input("Selectionnez un mode (0-3) : ").strip()

            if choix == "1":
                mode_pipeline_complet()
            elif choix == "2":
                mode_index_existant()
            elif choix == "3":
                mode_interactif()
            elif choix == "0":
                print("Au revoir")
                break
            else:
                print("Choix invalide. Reessayez.\n")
        except KeyboardInterrupt:
            print("\nInterrompu")
            break
        except Exception as e:
            print(f"Erreur : {e}")


if __name__ == "__main__":
    main()
