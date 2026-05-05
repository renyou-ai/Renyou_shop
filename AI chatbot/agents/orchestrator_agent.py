# -*- coding: utf-8 -*-
"""
Orchestrator / Main Agent
Responsabilité : Coordonner tous les agents et gérer le flux complet
"""

import os
from typing import Optional, Dict, List

from agents.document_loader_agent import DocumentLoaderAgent
from agents.nlp_preprocessing_agent import NLPPreprocessingAgent
from agents.eda_visualization_agent import EDAVisualizationAgent
from agents.embedding_vectorstore_agent import EmbeddingVectorStoreAgent
from agents.retriever_agent import RetrieverAgent
from agents.rag_generation_agent import RAGGenerationAgent
from agents.products_csv_agent import ProductsCSVAgent


class OrchestratorAgent:
    """Agent orchestrateur : coordonne tous les autres agents."""

    def __init__(self, groq_api_key: Optional[str] = None):
        """
        Initialise l'orchestrateur et tous les agents.

        Args:
            groq_api_key: Clé API Groq (si None, essaye la variable d'environnement)
        """
        self.document_loader = DocumentLoaderAgent()
        self.nlp_preprocessor = NLPPreprocessingAgent()
        self.eda_visualizer = EDAVisualizationAgent()
        self.embedding_vectorstore = EmbeddingVectorStoreAgent()
        self.products_csv = ProductsCSVAgent()
        self.retriever_agent = None
        self.rag_generator = None

        # Initialiser le RAG Generator si la clé API est fournie
        api_key = groq_api_key or os.getenv("GROQ_API_KEY")
        if api_key:
            self.rag_generator = RAGGenerationAgent(api_key)

        # État interne
        self.docs_rag_bruts = None
        self.tokens_eda = None
        self.vectorstore = None
        self.df_produits = None

        print("✅ Orchestrateur initialisé avec tous les agents")

    def etape_1_charger_documents(self, chemin_pdf: str, chemin_txt: str, chemin_csv: str = None) -> tuple:
        """
        Étape 1 : Charge les PDF, TXT et CSV.

        Args:
            chemin_pdf: Chemin du dossier PDF
            chemin_txt: Chemin du dossier TXT
            chemin_csv: Chemin du fichier CSV produits (optionnel)

        Returns:
            Tuple (docs_rag combinés, fichiers chargés)
        """
        print("\n" + "="*70)
        print("ÉTAPE 1️⃣  - DOCUMENT & PRODUCTS LOADING")
        print("="*70)

        print("\n📂 Chargement des PDF...")
        _, docs_pdf = self.document_loader.charger_documents(chemin_pdf)

        print("\n📂 Chargement des TXT...")
        _, docs_txt = self.document_loader.charger_documents(chemin_txt)

        # Charger les produits CSV si disponible
        docs_produits = []
        if chemin_csv and os.path.exists(chemin_csv):
            print("\n📦 Chargement du CSV produits...")
            self.df_produits, docs_produits = self.products_csv.charger_et_transformer(chemin_csv)
        else:
            if chemin_csv:
                print(f"\n⚠️  CSV produits non trouvé : {chemin_csv}")

        # Fusion (TXT d'abord pour priorité, puis produits, puis PDF)
        self.docs_rag_bruts = docs_txt + docs_produits + docs_pdf
        print(f"\n📊 Total corpus RAG : {len(self.docs_rag_bruts)} document(s)")
        print(f"   - Documents texte: {len(docs_txt)}")
        print(f"   - Produits: {len(docs_produits)}")
        print(f"   - Documents PDF: {len(docs_pdf)}\n")

        return self.docs_rag_bruts, len(docs_pdf) + len(docs_txt) + len(docs_produits)

    def etape_2_pretraitement_nlp(self) -> dict:
        """
        Étape 2 : Traite les documents avec NLP.

        Returns:
            Dict avec tokens_eda et docs_traites
        """
        print("\n" + "="*70)
        print("ÉTAPE 2️⃣  - NLP PREPROCESSING")
        print("="*70)

        if not self.docs_rag_bruts:
            raise ValueError("Charger d'abord les documents (Étape 1).")

        tokens_eda, docs_traites = self.nlp_preprocessor.pretraiter_documents(
            self.docs_rag_bruts
        )
        self.tokens_eda = tokens_eda

        return {
            "tokens_eda": tokens_eda,
            "docs_traites": docs_traites,
            "nombre_tokens": len(tokens_eda),
        }

    def etape_3_eda_visualization(self) -> None:
        """
        Étape 3 : Génère les visualisations EDA.
        """
        print("\n" + "="*70)
        print("ÉTAPE 3️⃣  - EDA VISUALIZATION")
        print("="*70)

        if not self.tokens_eda:
            raise ValueError("Effectuer d'abord le preprocessing (Étape 2).")

        self.eda_visualizer.analyser_corpus(
            self.tokens_eda,
            nom_corpus="Corpus Dermatologie"
        )

    def etape_4_embedding_vectorstore(self, reinitialiser: bool = True) -> dict:
        """
        Étape 4 : Crée les embeddings et le vector store.

        Args:
            reinitialiser: Supprime l'index existant

        Returns:
            Dict avec informations du vector store
        """
        print("\n" + "="*70)
        print("ÉTAPE 4️⃣  - EMBEDDING & VECTOR STORE")
        print("="*70)

        if not self.docs_rag_bruts:
            raise ValueError("Charger d'abord les documents (Étape 1).")

        vectorstore, retriever = self.embedding_vectorstore.conditionner_pipeline(
            self.docs_rag_bruts,
            reinitialiser=reinitialiser
        )

        self.vectorstore = vectorstore

        # Initialiser le retriever agent
        self.retriever_agent = RetrieverAgent(retriever)

        return {
            "vectorstore": vectorstore,
            "retriever": retriever,
            "nombre_vecteurs": vectorstore._collection.count(),
        }

    def etape_5_test_retriever(self, requete_test: str = "traitement de l'acné") -> None:
        """
        Étape 5 : Teste le retriever.

        Args:
            requete_test: Requête de test
        """
        print("\n" + "="*70)
        print("ÉTAPE 5️⃣  - RETRIEVER TEST")
        print("="*70)

        if not self.retriever_agent:
            raise ValueError("Créer d'abord le vector store (Étape 4).")

        self.embedding_vectorstore.tester_retriever(requete_test, verbose=True)

    def etape_5_1_recommander_produits(self, question: str, top_n: int = 5) -> Dict:
        """
        Étape 5.1 : Recommande dynamiquement les produits basés sur la question.

        Args:
            question: Question/requête utilisateur
            top_n: Nombre de produits à recommander

        Returns:
            Dict avec produits recommandés
        """
        if self.df_produits is None or self.df_produits.empty:
            return {
                "recommandations": [],
                "nombre_recommandations": 0,
                "message": "Aucun produit disponible"
            }

        recommandations = []
        question_lower = question.lower()

        # Chercher les produits pertinents
        for idx, product in self.df_produits.iterrows():
            score = 0
            description = str(product.get("description", "")).lower()
            subcategory = str(product.get("subcategory", "")).lower()
            name = str(product.get("name", "")).lower()

            # Scoring basé sur la pertinence
            concerns_keywords = {
                "acne": 3,
                "rides": 3,
                "hyperpigment": 3,
                "eczema": 2,
                "psoriasis": 2,
                "rosacée": 2,
                "taches": 2,
            }

            skin_keywords = {
                "sensible": 2,
                "gras": 2,
                "sec": 2,
                "mixte": 1,
            }

            for keyword, points in concerns_keywords.items():
                if keyword in question_lower and keyword in description:
                    score += points

            for keyword, points in skin_keywords.items():
                if keyword in question_lower and keyword in subcategory:
                    score += points

            if score > 0:
                recommandations.append({
                    "score": score,
                    "name": product.get("name"),
                    "brand": product.get("brand"),
                    "subcategory": product.get("subcategory"),
                    "price": product.get("price"),
                    "description": product.get("description"),
                })

        # Trier par score et limiter aux top N
        recommandations.sort(key=lambda x: -x["score"])
        recommandations = recommandations[:top_n]

        print(f"\n💡 {len(recommandations)} produits recommandés")
        for i, rec in enumerate(recommandations, 1):
            print(f"  {i}. {rec['name']} ({rec['brand']}) - Prix: {rec['price']} TND")

        return {
            "recommandations": recommandations,
            "nombre_recommandations": len(recommandations),
        }

    def etape_6_repondre_question(self, question: str, verbose: bool = True) -> Dict:
        """
        Étape 6 : Génère une réponse complète au pipeline RAG.

        Args:
            question: Question utilisateur
            verbose: Affiche les détails

        Returns:
            Dict contenant la réponse complète avec métadonnées
        """
        print("\n" + "="*70)
        print("ÉTAPE 6️⃣  - RAG GENERATION")
        print("="*70)

        if not self.retriever_agent or not self.rag_generator:
            raise ValueError(
                "Créer d'abord le vector store (Étape 4) et initialiser le RAG generator."
            )

        # Retrieval + construction du contexte
        docs_pertinents, contexte = self.retriever_agent.retrouver_et_construire(
            question,
            verbose=verbose
        )

        # Génération
        reponse_complete = self.rag_generator.generer_pipeline_complet(
            question,
            contexte,
            docs_pertinents,
            streaming=True,
            verbose=verbose
        )

        return reponse_complete

    def pipeline_complet(
        self,
        chemin_pdf: str,
        chemin_txt: str,
        chemin_csv: str = None,
        questions: list = None,
        faire_eda: bool = True,
        reinitialiser_index: bool = True,
        groq_api_key: Optional[str] = None,
        faire_recommandation: bool = True,
    ) -> Dict:
        """
        Exécute le pipeline complet du RAG avec produits.

        Args:
            chemin_pdf: Chemin des PDFs
            chemin_txt: Chemin des TXTs
            chemin_csv: Chemin du CSV produits (optionnel)
            questions: Liste de questions à poser (optionnel)
            faire_eda: Génère les visualisations EDA
            reinitialiser_index: Réinitialise l'index ChromaDB
            groq_api_key: Clé API Groq
            faire_recommandation: Active les recommandations de produits

        Returns:
            Dict avec résumé du pipeline
        """
        print("\n" + "🚀"*35)
        print("🔬 PIPELINE RAG DERMATOLOGIE — VERSION ORCHESTRÉE")
        print("🚀"*35 + "\n")

        # Initialiser le RAG generator si clé fournie
        if groq_api_key:
            self.rag_generator = RAGGenerationAgent(groq_api_key)

        # Étape 1 : Charger documents et produits
        self.etape_1_charger_documents(chemin_pdf, chemin_txt, chemin_csv)

        # Étape 2
        self.etape_2_pretraitement_nlp()

        # Étape 3
        if faire_eda:
            self.etape_3_eda_visualization()
        else:
            print("\n⏭️  EDA visualization skipped")

        # Étape 4
        self.etape_4_embedding_vectorstore(reinitialiser=reinitialiser_index)

        # Étape 5
        self.etape_5_test_retriever()

        # Étape 5.1 : Recommandations produits (optionnel)
        produits_recommandes = {}
        if faire_recommandation and self.df_produits is not None:
            print("\n" + "="*70)
            print("ÉTAPE 5️⃣ .1️⃣  - PRODUCT RECOMMENDATIONS")
            print("="*70)

        # Étape 6
        reponses = []
        if questions and self.rag_generator:
            for i, question in enumerate(questions, 1):
                print(f"\n{'─'*70}")
                print(f"Question {i}/{len(questions)}")
                print(f"{'─'*70}")

                # Recommandations produits si activées
                recommandations = {}
                if faire_recommandation:
                    print("\n" + "="*70)
                    print("RECOMMANDATIONS DE PRODUITS")
                    print("="*70)
                    recommandations = self.etape_5_1_recommander_produits(question, top_n=5)

                # Réponse RAG
                reponse = self.etape_6_repondre_question(question)
                reponse["recommandations_produits"] = recommandations

                reponses.append(reponse)
        elif not self.rag_generator:
            print("\n⚠️  Aucune clé API Groq — Étape 6 skipped")

        print("\n" + "="*70)
        print("✅ PIPELINE COMPLET TERMINÉ")
        print("="*70 + "\n")

        return {
            "nombre_documents": len(self.docs_rag_bruts),
            "nombre_tokens": len(self.tokens_eda),
            "nombre_vecteurs": self.vectorstore._collection.count(),
            "nombre_produits": len(self.df_produits) if self.df_produits is not None else 0,
            "reponses": reponses,
        }

    def initialiser_mode_conversationnel(self) -> None:
        """
        Initialise le mode conversationnel avec mémoire persistante.

        Doit être appelé après le pipeline_complet.
        """
        if not self.rag_generator or not self.rag_generator.memory:
            print("⚠️  RAG Generator ou mémoire non initialisés")
            return

        print("\n" + "="*70)
        print("🎯 MODE CONVERSATIONNEL ACTIVÉ")
        print("="*70)
        print("Le chatbot peut maintenant conserver le contexte des conversations")
        print("Tapez 'quit' ou 'exit' pour terminer\n")

    def poser_question_conversationnelle(
        self,
        question: str,
        faire_recommandation: bool = True,
        verbose: bool = True
    ) -> Dict:
        """
        Pose une question dans le mode conversationnel avec mémoire.

        Args:
            question: Question de l'utilisateur
            faire_recommandation: Recommander des produits
            verbose: Afficher les détails

        Returns:
            Dict avec réponse et métadonnées
        """
        if not self.retriever_agent or not self.rag_generator:
            raise ValueError("Pipeline non initialisé. Appelez pipeline_complet() d'abord.")

        if verbose:
            print(f"\n{'─'*70}")
            print(f"👤 Question: {question}")
            print(f"{'─'*70}")

        # Reformuler la question en tenant compte du contexte
        question_reformulee = self.rag_generator.reformuler_question_avec_contexte(question, verbose=verbose)

        # Retrieval
        docs_pertinents, contexte = self.retriever_agent.retrouver_et_construire(
            question_reformulee,
            verbose=False
        )

        # Recommandations produits
        recommandations = {}
        if faire_recommandation:
            recommandations = self.etape_5_1_recommander_produits(question, top_n=3)

        # Génération de réponse avec mémoire conversationnelle
        resultat = self.rag_generator.generer_pipeline_complet(
            question,
            contexte,
            docs_pertinents,
            streaming=True,
            verbose=verbose,
            avec_memoire=True
        )

        resultat["recommandations_produits"] = recommandations

        # Afficher le résumé de la mémoire
        if self.rag_generator.memory:
            tour = self.rag_generator.memory.turn_count
            if verbose:
                print(f"\n📊 Tour conversation: {tour}")

        return resultat

    def chat_interactif(
        self,
        chemin_pdf: str = None,
        chemin_txt: str = None,
        chemin_csv: str = None,
        groq_api_key: Optional[str] = None,
        faire_eda: bool = False,
        reinitialiser_index: bool = False,
    ) -> None:
        """
        Lance le mode chat interactif avec mémoire conversationnelle.

        Args:
            chemin_pdf: Chemin des PDFs
            chemin_txt: Chemin des TXTs
            chemin_csv: Chemin du CSV produits
            groq_api_key: Clé API Groq
            faire_eda: Générer EDA
            reinitialiser_index: Réinitialiser ChromaDB
        """
        # Initialiser le pipeline
        print("\n🚀 Initialisation du pipeline RAG conversationnel...")

        self.pipeline_complet(
            chemin_pdf=chemin_pdf,
            chemin_txt=chemin_txt,
            chemin_csv=chemin_csv,
            questions=None,  # Pas de questions prédéf en mode interactif
            faire_eda=faire_eda,
            reinitialiser_index=reinitialiser_index,
            groq_api_key=groq_api_key,
            faire_recommandation=False,  # Pas de recommandation en initialization
        )

        # Initialiser le mode conversationnel
        self.initialiser_mode_conversationnel()

        # Boucle interactive
        while True:
            try:
                question = input("\n💭 Votre question: ").strip()

                if not question:
                    print("⚠️  Question vide")
                    continue

                if question.lower() in ["quit", "exit", "sortir", "quitter"]:
                    print("\n👋 Fin de la conversation")
                    if self.rag_generator and self.rag_generator.memory:
                        resume = self.rag_generator.memory.obtenir_resume_conversation()
                        print(f"\n{resume}")
                    break

                # Poser la question
                resultat = self.poser_question_conversationnelle(
                    question,
                    faire_recommandation=True,
                    verbose=True
                )

                # Produits recommandés
                if resultat.get("recommandations_produits", {}).get("nombre_recommandations", 0) > 0:
                    print("\n" + "="*70)
                    print("💡 PRODUITS RECOMMANDÉS")
                    print("="*70)
                    for produit in resultat["recommandations_produits"]["recommandations"]:
                        print(f"- {produit['name']} ({produit['brand']}) - {produit['price']} TND")

            except KeyboardInterrupt:
                print("\n\n👋 Interrupted")
                break
            except Exception as e:
                print(f"\n❌ Erreur: {e}")
                continue

    def obtenir_historique_conversation(self) -> List[Dict]:
        """
        Retourne l'historique complet de la conversation.

        Returns:
            Liste des messages
        """
        if not self.rag_generator or not self.rag_generator.memory:
            return []

        return self.rag_generator.memory.obtenir_historique()

    def exporter_conversation(self, chemin_fichier: str = None) -> Dict:
        """
        Exporte la conversation en JSON.

        Args:
            chemin_fichier: Chemin de sauvegarde (optionnel)

        Returns:
            Dict exporté
        """
        if not self.rag_generator or not self.rag_generator.memory:
            return {}

        export = self.rag_generator.memory.export_conversation()

        if chemin_fichier:
            import json
            with open(chemin_fichier, 'w', encoding='utf-8') as f:
                json.dump(export, f, ensure_ascii=False, indent=2)
            print(f"✅ Conversation exportée: {chemin_fichier}")

        return export
