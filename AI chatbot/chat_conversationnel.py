# -*- coding: utf-8 -*-
"""
Mode Chat Conversationnel avec Mémoire
Démonstration du mode conversationnel du RAG avec mémoire persistante
"""

import os
from agents.orchestrator_agent import OrchestratorAgent
from config import CHEMIN_PDF, CHEMIN_TXT, CHEMIN_CSV_PRODUITS


def mode_chat_conversationnel():
    """Lance le mode chat interactif avec mémoire conversationnelle."""
    print("\n" + "🎯"*35)
    print("MODE CHAT CONVERSATIONNEL RAG")
    print("🎯"*35 + "\n")

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("❌ Erreur: variable GROQ_API_KEY manquante")
        print("Veuillez configurer votre clé API Groq")
        return

    orchestrator = OrchestratorAgent(groq_api_key=groq_api_key)

    # Lancer le chat interactif
    orchestrator.chat_interactif(
        chemin_pdf=CHEMIN_PDF,
        chemin_txt=CHEMIN_TXT,
        chemin_csv=CHEMIN_CSV_PRODUITS,
        groq_api_key=groq_api_key,
        faire_eda=False,
        reinitialiser_index=False,
    )


def demo_conversation():
    """Démo automatisée de la conversation avec mémoire."""
    print("\n" + "📖"*35)
    print("DÉMO CONVERSATION - SCÉNARIO AVEC CONTEXTE")
    print("📖"*35 + "\n")

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("❌ Erreur: variable GROQ_API_KEY manquante")
        return

    orchestrator = OrchestratorAgent(groq_api_key=groq_api_key)

    # Initialiser le pipeline sans questions
    print("\n🔧 Initialisation du pipeline...")
    orchestrator.pipeline_complet(
        chemin_pdf=CHEMIN_PDF,
        chemin_txt=CHEMIN_TXT,
        chemin_csv=CHEMIN_CSV_PRODUITS,
        questions=None,
        faire_eda=False,
        reinitialiser_index=False,
        groq_api_key=groq_api_key,
        faire_recommandation=False,
    )

    # Initialiser le mode conversationnel
    orchestrator.initialiser_mode_conversationnel()

    # Scénario conversationnel
    questions = [
        "Je cherche un produit pour peau sensible",
        "Et pour hydrater?",
        "Quelles sont les contre-indications?",
        "Recommandez-moi un traitement complet",
    ]

    reponses = []
    for i, question in enumerate(questions, 1):
        print(f"\n{'='*70}")
        print(f"Question {i}: {question}")
        print(f"{'='*70}")

        try:
            resultat = orchestrator.poser_question_conversationnelle(
                question,
                faire_recommandation=True,
                verbose=True
            )
            reponses.append(resultat)

            # Afficher les produits recommandés
            recs = resultat.get("recommandations_produits", {})
            if recs.get("nombre_recommandations", 0) > 0:
                print("\n💡 Produits suggérés:")
                for prod in recs["recommandations"]:
                    print(f"  - {prod['name']} ({prod['brand']})")

        except Exception as e:
            print(f"❌ Erreur: {e}")

    # Résumé de la conversation
    if orchestrator.rag_generator and orchestrator.rag_generator.memory:
        print("\n" + "="*70)
        print("📊 RÉSUMÉ DE LA CONVERSATION")
        print("="*70)
        resume = orchestrator.rag_generator.memory.obtenir_resume_conversation()
        print(resume)

        # Exporter la conversation
        export = orchestrator.exporter_conversation("conversation_demo.json")
        print(f"\n✅ Conversation exportée en JSON: {len(export.get('historique', []))} messages")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "demo":
        demo_conversation()
    else:
        mode_chat_conversationnel()
