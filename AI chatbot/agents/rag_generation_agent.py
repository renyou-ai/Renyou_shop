# -*- coding: utf-8 -*-
"""
RAG Generation Agent
Responsabilité : Générer les réponses avec le LLM Groq et mémoire conversationnelle
"""

from groq import Groq
from typing import List, Optional

from langchain_core.documents import Document
from config import GROQ_CONFIG, SYSTEM_PROMPT
from agents.conversation_memory_agent import ConversationMemoryAgent


class RAGGenerationAgent:
    """Agent responsable de la génération de réponses via le LLM Groq avec mémoire conversationnelle."""

    def __init__(self, api_key: str, use_memory: bool = True):
        """
        Initialise le client Groq et la mémoire conversationnelle.

        Args:
            api_key: Clé API Groq
            use_memory: Activer la mémoire conversationnelle
        """
        if not api_key:
            raise EnvironmentError(
                "❌ Clé GROQ_API_KEY manquante. "
                "Fournissez-la en paramètre ou via variable d'environnement."
            )
        self.client = Groq(api_key=api_key)
        self.use_memory = use_memory
        self.memory = ConversationMemoryAgent(max_history=10) if use_memory else None
        print("✅ Client Groq initialisé")
        if self.use_memory:
            print("✅ Mémoire conversationnelle activée")

    def generer_reponse(
        self,
        question: str,
        contexte: str,
        streaming: bool = True,
        verbose: bool = True,
        avec_memoire: bool = True
    ) -> str:
        """
        Génère une réponse basée sur le contexte, la question et l'historique.

        Args:
            question: Question utilisateur
            contexte: Contexte augmenté (documents récupérés)
            streaming: Active le streaming de la réponse
            verbose: Affiche les détails
            avec_memoire: Inclure l'historique conversationnel

        Returns:
            Réponse complète du LLM
        """
        if verbose:
            print(f"\n💬 Génération de la réponse...")

        # Construire les messages avec ou sans historique
        messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT.format(context=contexte)
            }
        ]

        # Ajouter l'historique conversationnel si activé
        if avec_memoire and self.memory and self.memory.conversation_history:
            historique_msgs = self.memory.obtenir_messages_format_llm()
            # Limiter à 4 derniers messages pour ne pas surcharger
            messages.extend(historique_msgs[-4:])

        # Ajouter la question actuelle
        messages.append({
            "role": "user",
            "content": question
        })

        completion = self.client.chat.completions.create(
            model=GROQ_CONFIG["model"],
            messages=messages,
            temperature=GROQ_CONFIG["temperature"],
            max_completion_tokens=GROQ_CONFIG["max_completion_tokens"],
            top_p=GROQ_CONFIG["top_p"],
            stream=streaming,
            stop=None,
        )

        if streaming:
            response = self._traiter_streaming(completion, verbose)
        else:
            response = completion.choices[0].message.content

        # Enregistrer dans la mémoire
        if self.use_memory and self.memory:
            self.memory.ajouter_message("user", question)
            self.memory.ajouter_message("assistant", response, metadata={"contexte": contexte})

        return response

    @staticmethod
    def _traiter_streaming(completion, verbose: bool = True) -> str:
        """
        Traite la réponse en streaming et l'accumule.

        Args:
            completion: Objet de complétion Groq
            verbose: Affiche les tokens en temps réel

        Returns:
            Réponse complète
        """
        if verbose:
            print("💬 Réponse :\n")

        reponse_complete = ""
        for chunk in completion:
            token = chunk.choices[0].delta.content or ""
            if verbose:
                print(token, end="", flush=True)
            reponse_complete += token

        if verbose:
            print("\n")

        return reponse_complete

    def reformuler_question_avec_contexte(self, question: str, verbose: bool = False) -> str:
        """
        Reformule la question en tenant compte de l'historique conversationnel.

        Args:
            question: Question originale
            verbose: Afficher les détails

        Returns:
            Question reformulée ou originale
        """
        if not self.use_memory or not self.memory or not self.memory.conversation_history:
            return question

        # Utiliser la reformulation du memory agent
        reformulee = self.memory.reformuler_question(question)

        if verbose and reformulee != question:
            print(f"🔄 Question reformulée: {reformulee}")

        return reformulee

    def generer_pipeline_complet(
        self,
        question: str,
        contexte: str,
        docs_sources: List[Document],
        streaming: bool = True,
        verbose: bool = True,
        avec_memoire: bool = True
    ) -> dict:
        """
        Génère une réponse avec métadonnées complètes et mémoire conversationnelle.

        Args:
            question: Question utilisateur
            contexte: Contexte augmenté
            docs_sources: Documents sources utilisés
            streaming: Active le streaming
            verbose: Affiche les détails
            avec_memoire: Utiliser la mémoire conversationnelle

        Returns:
            Dict contenant question, réponse, sources et métadonnées
        """
        if verbose:
            print(f"📝 Question : {question}\n")
            print(f"📚 Sources utilisées : {len(docs_sources)}")
            for i, doc in enumerate(docs_sources, 1):
                src = doc.metadata.get("source", "?")
                stype = doc.metadata.get("source_type", "?").upper()
                print(f"   [{i}] [{stype}] {src}")
            print()

        reponse = self.generer_reponse(question, contexte, streaming, verbose, avec_memoire)

        resultat = {
            "question": question,
            "reponse": reponse,
            "sources": [
                {
                    "nom": doc.metadata.get("source", "?"),
                    "type": doc.metadata.get("source_type", "?"),
                    "chemin": doc.metadata.get("source_path", "?"),
                }
                for doc in docs_sources
            ],
            "modele": GROQ_CONFIG["model"],
            "tokens_contexte": len(contexte.split()),
        }

        # Ajouter les infos de mémoire conversationnelle
        if self.use_memory and self.memory:
            resultat["tour_conversation"] = self.memory.turn_count
            resultat["nombre_messages_historique"] = len(self.memory.conversation_history)
            resultat["themes_principaux"] = list(self.memory.extraire_themes_conversation().keys())[:3]

        return resultat
