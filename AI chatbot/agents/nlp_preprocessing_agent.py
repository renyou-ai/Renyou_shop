# -*- coding: utf-8 -*-
"""
NLP Preprocessing Agent
Responsabilité : Nettoyer les textes et générer les tokens
"""

import re
from typing import List

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

from config import STOP_WORDS_FR


class NLPPreprocessingAgent:
    """Agent responsable du nettoyage et preprocessing NLP."""

    def __init__(self):
        """Initialise le téléchargement des ressources NLTK."""
        self._telecharger_ressources_nltk()

    @staticmethod
    def _telecharger_ressources_nltk():
        """Télécharge les ressources NLTK nécessaires."""
        try:
            nltk.download("stopwords", quiet=True)
            nltk.download("punkt", quiet=True)
            nltk.download("punkt_tab", quiet=True)
        except Exception as e:
            print(f"⚠️  Erreur téléchargement ressources NLTK: {e}")

    @staticmethod
    def nettoyer_nlp_fr(texte: str) -> List[str]:
        """
        Nettoie et tokenise un texte français.
        Retourne la liste des tokens pertinents (hors stop-words, > 2 caractères).

        Args:
            texte: Texte brut à nettoyer

        Returns:
            Liste de tokens filtrés
        """
        texte = texte.lower()
        # Remplace la ponctuation par un espace (conserve accentués + chiffres)
        texte = re.sub(r"[^a-z0-9àâçéèêëîïôûùµÿñæœ]", " ", texte)
        tokens = word_tokenize(texte, language="french")
        return [
            m for m in tokens
            if m not in STOP_WORDS_FR and (m.isdigit() or len(m) > 2)
        ]

    def pretraiter_documents(self, docs_rag: List[dict]) -> tuple[List[str], List[dict]]:
        """
        Traite les documents bruts : extraction des tokens et conservation des textes.

        Args:
            docs_rag: Liste de documents avec texte et métadonnées

        Returns:
            Tuple contenant :
            - Liste de tokens pour EDA
            - Liste de documents nettoyés avec texte original
        """
        tokens_pour_eda = []
        docs_traites = []

        for doc in docs_rag:
            texte = doc.get("text", "")
            if texte.strip():
                tokens = self.nettoyer_nlp_fr(texte)
                tokens_pour_eda.extend(tokens)
                
                # Conserver le document avec son texte original (pour RAG)
                docs_traites.append({
                    "text": texte,
                    "metadata": doc.get("metadata", {}),
                    "tokens": tokens
                })

        print(f"✅ {len(docs_traites)} document(s) traité(s)")
        print(f"📊 Total tokens extraits : {len(tokens_pour_eda):,}")
        return tokens_pour_eda, docs_traites
