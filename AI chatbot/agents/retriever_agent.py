# -*- coding: utf-8 -*-
"""
Retriever Agent
Responsabilité : Interroger le vector store et retourner les chunks pertinents
"""

from typing import List

from langchain_core.documents import Document


class RetrieverAgent:
    """Agent responsable de la récupération et filtrage des documents pertinents."""

    def __init__(self, retriever):
        """
        Initialise le Retriever.

        Args:
            retriever: Instance du retriever LangChain
        """
        self.retriever = retriever

    def retrouver(self, requete: str, verbose: bool = False) -> List[Document]:
        """
        Retrouve les documents pertinents pour une requête.

        Args:
            requete: Requête utilisateur
            verbose: Affiche les détails

        Returns:
            Liste de documents récupérés
        """
        if not self.retriever:
            raise ValueError("Retriever non initialisé.")

        docs_pertinents = self.retriever.invoke(requete)

        if verbose:
            print(f"\n🔍 Retrieval pour : '{requete}'")
            print(f"   {len(docs_pertinents)} chunk(s) récupéré(s) :")
            for i, doc in enumerate(docs_pertinents, 1):
                src = doc.metadata.get("source", "?")
                stype = doc.metadata.get("source_type", "?").upper()
                print(f"   [{i}] [{stype}] {src}")

        return docs_pertinents

    def construire_contexte(self, docs_pertinents: List[Document]) -> str:
        """
        Construit le contexte augmenté à partir des documents récupérés.

        Args:
            docs_pertinents: Liste de documents

        Returns:
            String formatée contenant tous les documents avec leurs sources
        """
        blocs = [
            f"[Source: {doc.metadata.get('source', '?')} | Format: {doc.metadata.get('source_type', '?').upper()}]\n{doc.page_content}"
            for doc in docs_pertinents
        ]
        contexte = "\n\n---\n\n".join(blocs)
        return contexte

    def retrouver_et_construire(self, requete: str, verbose: bool = False) -> tuple[List[Document], str]:
        """
        Combine retrieval et construction du contexte.

        Args:
            requete: Requête utilisateur
            verbose: Affiche les détails

        Returns:
            Tuple (documents récupérés, contexte formaté)
        """
        docs = self.retrouver(requete, verbose=verbose)
        contexte = self.construire_contexte(docs)
        return docs, contexte

    def filtrer_par_score(self, docs: List[Document], score_min: float = 0.5) -> List[Document]:
        """
        Filtre les documents selon un score minimum (si disponible).

        Args:
            docs: Liste de documents
            score_min: Score minimum

        Returns:
            Documents filtrés
        """
        # Note: ChromaDB retourne les résultats déjà classés par pertinence
        # Cette méthode est préparée pour des intégrations futures avec scores explicites
        return docs
