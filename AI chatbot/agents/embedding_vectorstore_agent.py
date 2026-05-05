# -*- coding: utf-8 -*-
"""
Embedding & Vector Store Agent
Responsabilité : Chunking, embeddings et création du vector store
"""

import os
import shutil
from typing import List, Tuple

import chromadb
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from config import (
    CHUNK_CONFIG,
    MODEL_EMBED,
    CHROMA_PATH,
    CHROMA_COLLECTION_NAME,
    CHROMA_COLLECTION_METADATA,
)


class EmbeddingVectorStoreAgent:
    """Agent responsable du chunking, embeddings et vector store."""

    def __init__(self):
        """Initialise l'agent."""
        self.embeddings = None
        self.vectorstore = None
        self.retriever = None

    def _reinitialiser_chroma(self):
        """Réinitialise ChromaDB si l'index existe."""
        if os.path.exists(CHROMA_PATH):
            print(f"⚠️  Suppression de l'index existant : {CHROMA_PATH}")
            shutil.rmtree(CHROMA_PATH)
            print("✅ Index supprimé — ChromaDB va en créer un nouveau.")
        else:
            print("ℹ️  Pas d'index existant — création from scratch.")

    def fragmenter_documents(self, docs: List[Document]) -> List[Document]:
        """
        Fragmente les documents selon la configuration.

        Args:
            docs: Liste de documents LangChain

        Returns:
            Liste de chunks fragmentés
        """
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_CONFIG["chunk_size"],
            chunk_overlap=CHUNK_CONFIG["chunk_overlap"],
            separators=CHUNK_CONFIG["separators"]
        )
        chunks = text_splitter.split_documents(docs)
        print(f"🧩 Nombre de chunks créés : {len(chunks)}")
        return chunks

    def charger_modele_embeddings(self):
        """Charge le modèle d'embedding HuggingFace sur CPU."""
        print(f"🔤 Chargement du modèle d'embedding : {MODEL_EMBED}")
        self.embeddings = HuggingFaceEmbeddings(
            model_name=MODEL_EMBED,
            model_kwargs={"device": "cpu"}
        )
        print("✅ Modèle d'embedding chargé (CPU)")

    def creer_vector_store(self, chunks: List[Document]) -> Chroma:
        """
        Crée le vector store ChromaDB.

        Args:
            chunks: Liste de chunks fragmentés

        Returns:
            Instance du vector store
        """
        if not self.embeddings:
            self.charger_modele_embeddings()

        # Nettoyage du cache système ChromaDB
        try:
            chromadb.api.client.SharedSystemClient.clear_system_cache()
        except Exception:
            pass

        persistent_client = chromadb.PersistentClient(path=CHROMA_PATH)

        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            collection_name=CHROMA_COLLECTION_NAME,
            client=persistent_client,
            collection_metadata=CHROMA_COLLECTION_METADATA
        )

        self.vectorstore = vectorstore
        print(f"✅ Vector Store créé : {CHROMA_PATH}")
        print(f"   📦 {vectorstore._collection.count()} vecteurs indexés")
        return vectorstore

    def charger_vector_store_existant(self) -> Chroma:
        """
        Charge un vector store existant.

        Returns:
            Instance du vector store existant
        """
        if not self.embeddings:
            self.charger_modele_embeddings()

        vectorstore = Chroma(
            persist_directory=CHROMA_PATH,
            embedding_function=self.embeddings,
            collection_name=CHROMA_COLLECTION_NAME
        )
        self.vectorstore = vectorstore
        print(f"✅ Vector Store rechargé : {vectorstore._collection.count()} vecteurs")
        return vectorstore

    def creer_retriever(self, search_type: str = "similarity", k: int = 5):
        """
        Crée le retriever à partir du vector store.

        Args:
            search_type: Type de recherche (similarity par défaut)
            k: Nombre de chunks à retourner
        """
        if not self.vectorstore:
            raise ValueError("Vector store non initialisé. Créez d'abord le vector store.")

        self.retriever = self.vectorstore.as_retriever(
            search_type=search_type,
            search_kwargs={"k": k}
        )
        print(f"✅ Retriever créé (top-{k} résultats)")

    def conditionner_pipeline(
        self,
        docs_bruts: List[dict],
        reinitialiser: bool = True
    ) -> Tuple[Chroma, object]:
        """
        Conditionne le pipeline complet : transformation → chunking → indexation.

        Args:
            docs_bruts: Liste de dicts {text, metadata}
            reinitialiser: Si True, supprime l'index existant

        Returns:
            Tuple (vectorstore, retriever)
        """
        if reinitialiser:
            self._reinitialiser_chroma()

        # 1. Transformation en objets Document LangChain
        docs = [
            Document(page_content=d["text"], metadata=d["metadata"])
            for d in docs_bruts
        ]
        print(f"\n📄 Nombre de documents : {len(docs)}")

        # 2. Fragmenter
        chunks = self.fragmenter_documents(docs)

        # 3. Charger le modèle d'embedding
        self.charger_modele_embeddings()

        # 4. Créer le vector store
        self.creer_vector_store(chunks)

        # 5. Créer le retriever
        self.creer_retriever()

        return self.vectorstore, self.retriever

    def tester_retriever(self, requete: str, verbose: bool = True) -> List[Document]:
        """
        Teste le retriever avec une requête.

        Args:
            requete: Requête de test
            verbose: Affiche les résultats

        Returns:
            Liste des documents récupérés
        """
        if not self.retriever:
            raise ValueError("Retriever non initialisé.")

        resultats = self.retriever.invoke(requete)

        if verbose:
            print(f"🔍 Requête test : '{requete}'")
            print(f"   {len(resultats)} résultat(s)\n")
            for i, doc in enumerate(resultats, 1):
                source = doc.metadata.get("source", "?")
                stype = str(doc.metadata.get("source_type", "?")).upper()
                extrait = doc.page_content[:150].replace("\n", " ")
                print(f"  [{i}] [{stype}] {source}")
                print(f"      {extrait}...\n")

        return resultats
