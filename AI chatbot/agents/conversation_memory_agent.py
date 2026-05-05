# -*- coding: utf-8 -*-
"""
Conversation Memory Agent
Responsabilité : Gérer l'historique et la mémoire conversationnelle du RAG
"""

from typing import List, Dict, Tuple, Optional
from collections import deque
from datetime import datetime


class ConversationMemoryAgent:
    """Agent responsable de la gestion de la mémoire conversationnelle."""

    def __init__(self, max_history: int = 10, max_summary_tokens: int = 500):
        """
        Initialise l'agent de mémoire conversationnelle.

        Args:
            max_history: Nombre maximum de tours de conversation à conserver
            max_summary_tokens: Nombre maximum de tokens pour un résumé
        """
        self.max_history = max_history
        self.max_summary_tokens = max_summary_tokens
        
        # Historique de conversation : [(role, message, timestamp), ...]
        self.conversation_history = deque(maxlen=max_history * 2)
        
        # Compteur pour le nombre de tours
        self.turn_count = 0
        
        # Contexte accumulé
        self.accumulated_context = {}

    def ajouter_message(self, role: str, content: str, metadata: Dict = None) -> None:
        """
        Ajoute un message à l'historique.

        Args:
            role: 'user' ou 'assistant'
            content: Contenu du message
            metadata: Métadonnées optionnelles (documents pertinents, etc.)
        """
        timestamp = datetime.now().isoformat()
        
        message = {
            "role": role,
            "content": content,
            "timestamp": timestamp,
            "metadata": metadata or {}
        }
        
        self.conversation_history.append(message)
        
        # Incrémenter le tour si c'est un message utilisateur
        if role == "user":
            self.turn_count += 1

    def obtenir_historique(self, include_metadata: bool = False) -> List[Dict]:
        """
        Retourne l'historique complet de la conversation.

        Args:
            include_metadata: Inclure les métadonnées

        Returns:
            Liste des messages
        """
        historique = list(self.conversation_history)
        
        if not include_metadata:
            for msg in historique:
                msg.pop("metadata", None)
        
        return historique

    def obtenir_derniers_messages(self, n: int = 5) -> List[Dict]:
        """
        Retourne les N derniers messages.

        Args:
            n: Nombre de messages à retourner

        Returns:
            Liste des derniers messages
        """
        historique = list(self.conversation_history)
        return historique[-n:] if historique else []

    def construire_contexte_conversationnel(self, max_messages: int = 6) -> str:
        """
        Construit un contexte conversationnel formaté pour le prompt.

        Args:
            max_messages: Nombre maximum de messages à inclure

        Returns:
            Contexte formaté en string
        """
        derniers = self.obtenir_derniers_messages(max_messages)
        
        if not derniers:
            return ""

        contexte_parties = ["### Historique de la conversation"]
        
        for msg in derniers:
            role_label = "👤 Utilisateur" if msg["role"] == "user" else "🤖 Assistant"
            contexte_parties.append(f"\n{role_label}:")
            contexte_parties.append(msg["content"][:500])  # Limiter la longueur
        
        return "\n".join(contexte_parties)

    def reformuler_question(self, question: str, llm_func=None) -> str:
        """
        Reformule la question en tenant compte de l'historique.

        Si la question contient des références implicites (ex: "et pour hydrater?"),
        elle est enrichie avec le contexte précédent.

        Args:
            question: Question de l'utilisateur
            llm_func: Fonction LLM pour reformulation (optionnel)

        Returns:
            Question reformulée
        """
        # Chercher des références implicites
        references_implicites = [
            "et pour",
            "et comment",
            "aussi",
            "également",
            "pareil",
            "même chose",
            "autre",
            "alternative",
        ]

        question_lower = question.lower()
        a_reference_implicite = any(ref in question_lower for ref in references_implicites)

        if not a_reference_implicite:
            return question

        # Extraire le dernier contexte pertinent
        derniers = self.obtenir_derniers_messages(4)
        
        contexte_precedent = ""
        for msg in reversed(derniers):
            if msg["role"] == "user":
                contexte_precedent = msg["content"]
                break

        if not contexte_precedent:
            return question

        # Reformuler par simple concat si pas de LLM, sinon utiliser le LLM
        if llm_func:
            prompt_reformulation = f"""Reformulez cette question en tenant compte du contexte précédent:

Contexte précédent: {contexte_precedent}
Nouvelle question: {question}

Retournez UNIQUEMENT la question reformulée, pas d'explication:"""
            
            question_reformulee = llm_func(prompt_reformulation)
            return question_reformulee.strip()
        else:
            # Reformulation simple par défaut
            return f"{contexte_precedent} {question}"

    def extraire_themes_conversation(self) -> Dict[str, int]:
        """
        Extrait les thèmes/mots-clés principaux de la conversation.

        Returns:
            Dict {theme: frequency}
        """
        themes = {}
        
        for msg in self.conversation_history:
            if msg["role"] == "user":
                # Extraire les mots importants (> 4 caractères)
                mots = msg["content"].lower().split()
                for mot in mots:
                    if len(mot) > 4 and not mot.startswith("http"):
                        themes[mot] = themes.get(mot, 0) + 1
        
        # Trier par fréquence
        return dict(sorted(themes.items(), key=lambda x: x[1], reverse=True)[:10])

    def accumuler_contexte(self, key: str, value: any) -> None:
        """
        Accumule du contexte durant la conversation.

        Args:
            key: Clé du contexte
            value: Valeur
        """
        self.accumulated_context[key] = value

    def obtenir_contexte_accumule(self, key: str = None) -> any:
        """
        Récupère le contexte accumulé.

        Args:
            key: Clé spécifique (optionnel)

        Returns:
            Valeur ou dict complet
        """
        if key:
            return self.accumulated_context.get(key)
        return self.accumulated_context

    def reinitialiser_contexte(self) -> None:
        """Réinitialise le contexte accumulé."""
        self.accumulated_context = {}

    def reinitialiser_historique(self) -> None:
        """Réinitialise complètement la conversation."""
        self.conversation_history.clear()
        self.turn_count = 0
        self.accumulated_context = {}

    def obtenir_resume_conversation(self) -> str:
        """
        Génère un résumé court de la conversation.

        Returns:
            Résumé formaté
        """
        if not self.conversation_history:
            return "Aucune conversation en cours"

        resume_parties = [
            f"📊 Résumé de la conversation ({self.turn_count} tours)",
            f"- Nombre de messages: {len(self.conversation_history)}",
        ]

        themes = self.extraire_themes_conversation()
        if themes:
            top_themes = ", ".join(list(themes.keys())[:5])
            resume_parties.append(f"- Thèmes principaux: {top_themes}")

        contexte = self.obtenir_contexte_accumule()
        if contexte:
            resume_parties.append(f"- Contexte accumulé: {len(contexte)} éléments")

        return "\n".join(resume_parties)

    def export_conversation(self) -> Dict:
        """
        Exporte la conversation complète.

        Returns:
            Dict avec historique, résumé, contexte
        """
        return {
            "turn_count": self.turn_count,
            "timestamp_debut": self.conversation_history[0]["timestamp"] if self.conversation_history else None,
            "timestamp_fin": self.conversation_history[-1]["timestamp"] if self.conversation_history else None,
            "nombre_messages": len(self.conversation_history),
            "historique": list(self.conversation_history),
            "themes": self.extraire_themes_conversation(),
            "contexte_accumule": self.accumulated_context,
        }

    def importer_conversation(self, export: Dict) -> None:
        """
        Importe une conversation sauvegardée.

        Args:
            export: Dict d'export
        """
        self.reinitialiser_historique()
        self.turn_count = export.get("turn_count", 0)
        self.accumulated_context = export.get("contexte_accumule", {})
        
        for msg in export.get("historique", []):
            self.conversation_history.append(msg)

    def obtenir_messages_format_llm(self) -> List[Dict]:
        """
        Formate l'historique pour LangChain/LLM.

        Returns:
            Liste des messages au format LLM
        """
        messages = []
        for msg in self.conversation_history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        return messages

    def obtenir_chat_history(self) -> str:
        """
        Retourne l'historique formaté pour les prompts.

        Returns:
            String formaté pour injection dans prompt
        """
        if not self.conversation_history:
            return ""

        parties = []
        for msg in self.conversation_history:
            role = "Utilisateur" if msg["role"] == "user" else "Assistant"
            parties.append(f"{role}: {msg['content']}")

        return "\n".join(parties)
