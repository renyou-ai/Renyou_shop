# -*- coding: utf-8 -*-
"""
Products CSV Agent
Responsabilité : Charger et transformer les données produits CSV pour le RAG
"""

import os
from typing import List, Dict, Tuple
import pandas as pd
import numpy as np


class ProductsCSVAgent:
    """Agent responsable du chargement et transformation des données produits CSV."""

    def __init__(self):
        """Initialise l'agent produits."""
        pass

    @staticmethod
    def charger_csv_produits(chemin_csv: str) -> pd.DataFrame:
        """
        Charge le fichier CSV des produits.

        Args:
            chemin_csv: Chemin vers le fichier CSV

        Returns:
            DataFrame des produits
        """
        if not os.path.exists(chemin_csv):
            print(f"⚠️  Fichier CSV non trouvé : {chemin_csv}")
            return pd.DataFrame()

        try:
            df = pd.read_csv(chemin_csv)
            print(f"✅ CSV chargé : {len(df)} produits")
            return df
        except Exception as e:
            print(f"⚠️  Erreur chargement CSV : {e}")
            return pd.DataFrame()

    @staticmethod
    def enrichir_document_produit(produit: Dict, index: int) -> Dict:
        """
        Enrichit une ligne produit en document RAG avec contexte de recommandation.

        Args:
            produit: Dict avec les colonnes du produit
            index: Index du produit

        Returns:
            Dict {text, metadata} pour le RAG
        """
        # Extraire et nettoyer les données (Nouvelles colonnes)
        name = str(produit.get("name", "")).strip()
        brand = str(produit.get("brand", "")).strip() or "Marque inconnue"
        category = str(produit.get("category", "")).strip()
        subcategory = str(produit.get("subcategory", "")).strip()
        ingredients = str(produit.get("ingredients", "")).strip()
        description = str(produit.get("description", "")).strip()
        
        # Gérer le prix
        price = produit.get("price")
        if price is None or (isinstance(price, float) and pd.isna(price)) or price == "":
            price = None
        else:
            try:
                price = float(price)
            except (ValueError, TypeError):
                price = None
        
        # Déduire les types de peau recommandés à partir de la subcategory
        # Exemple: "Peaux grasses" -> "grasse"
        suitable_skin_types = subcategory if subcategory else "tous les types"
        
        # Déduire les préoccupations cibles à partir de la categorie et description
        # Chercher des mots-clés dans la description ou la catégorie
        target_concerns = ""
        description_lower = description.lower()
        concern_keywords = {
            "acné": "acne",
            "ridules": "rides",
            "rides": "rides",
            "hyperpigmentation": "hyperpigmentation",
            "taches": "taches",
            "hydratation": "hydratation",
            "sensibilité": "sensibilité",
            "sécheresse": "sécheresse",
            "eczema": "eczema",
            "psoriasis": "psoriasis",
            "rosacée": "rosacée",
            "anti-âge": "anti-âge",
            "jeunesse": "anti-âge",
        }
        
        found_concerns = []
        for keyword, concern in concern_keywords.items():
            if keyword in description_lower and concern not in found_concerns:
                found_concerns.append(concern)
        
        target_concerns = ", ".join(found_concerns) if found_concerns else "soin général"

        # Construire le texte enrichi pour le RAG
        text_parts = []

        # Titre et identité du produit
        text_parts.append(f"PRODUIT: {name}")
        if brand and brand != "Marque inconnue":
            text_parts.append(f"Marque: {brand}")

        # Catégorisation
        if category:
            text_parts.append(f"Catégorie: {category}")
        if subcategory:
            text_parts.append(f"Sous-catégorie: {subcategory}")

        # Contexte d'utilisation (déduit des données disponibles)
        text_parts.append(f"Types de peau recommandés: {suitable_skin_types}")
        text_parts.append(f"Préoccupations ciblées: {target_concerns}")

        # Description et ingrédients
        if description:
            text_parts.append(f"Description: {description}")
        if ingredients:
            text_parts.append(f"Ingrédients: {ingredients}")

        # Informations commerciales (simplifiées)
        if price is not None:
            text_parts.append(f"Prix: {price} TND")

        # Référence et source (simplifiées - utiliser name comme ID)
        text_parts.append(f"Référence Produit: {name}")

        # Ajouter une section de recommandation
        text_parts.append("--- RECOMMANDATION DYNAMIQUE ---")
        text_parts.append("Ce produit peut être recommandé pour les besoins suivants:")
        text_parts.append(f"- Types de peau: {suitable_skin_types}")
        text_parts.append(f"- Problèmes cutanés: {target_concerns}")
        
        # Ingrédients principaux en recommandation
        if ingredients:
            text_parts.append(f"- Ingrédients actifs: {ingredients[:100]}...")  # Premières 100 chars

        # Fusionner
        full_text = "\n".join(text_parts)

        # Métadonnées enrichies
        metadata = {
            "type": "product",
            "source": "products_csv",
            "product_name": name,
            "brand": brand,
            "category": category,
            "subcategory": subcategory,
            "suitable_skin_types": suitable_skin_types,
            "target_concerns": target_concerns,
            "price": price,
            "product_index": index,
        }

        return {
            "text": full_text,
            "metadata": metadata,
        }

    def transformer_produits_en_documents(self, df_produits: pd.DataFrame) -> List[Dict]:
        """
        Transforme les produits CSV en documents RAG.

        Args:
            df_produits: DataFrame des produits

        Returns:
            Liste de documents {text, metadata}
        """
        if df_produits.empty:
            print("⚠️  DataFrame vide, aucun document créé")
            return []

        documents = []
        for index, row in df_produits.iterrows():
            doc = self.enrichir_document_produit(row.to_dict(), index)
            documents.append(doc)

        print(f"✅ {len(documents)} documents produits créés")
        return documents

    def charger_et_transformer(self, chemin_csv: str) -> Tuple[pd.DataFrame, List[Dict]]:
        """
        Charge le CSV et le transforme en documents RAG.

        Args:
            chemin_csv: Chemin vers le fichier CSV

        Returns:
            Tuple (DataFrame, liste de documents)
        """
        df = self.charger_csv_produits(chemin_csv)
        if df.empty:
            return df, []

        documents = self.transformer_produits_en_documents(df)
        return df, documents

    def filtrer_produits_par_concerns(
        self,
        df_produits: pd.DataFrame,
        concerns: List[str]
    ) -> pd.DataFrame:
        """
        Filtre les produits par préoccupations cutanées.

        Args:
            df_produits: DataFrame des produits
            concerns: Liste des préoccupations (ex: ['acne', 'rides'])

        Returns:
            DataFrame filtré
        """
        if df_produits.empty or not concerns:
            return df_produits

        mask = pd.Series([False] * len(df_produits))
        for concern in concerns:
            concern_lower = concern.lower()
            # Chercher dans description et subcategory
            mask |= df_produits["description"].fillna("").str.lower().str.contains(concern_lower)
            mask |= df_produits["subcategory"].fillna("").str.lower().str.contains(concern_lower)

        return df_produits[mask]

    def filtrer_produits_par_type_peau(
        self,
        df_produits: pd.DataFrame,
        skin_type: str
    ) -> pd.DataFrame:
        """
        Filtre les produits par type de peau.

        Args:
            df_produits: DataFrame des produits
            skin_type: Type de peau (ex: 'sèche', 'grasse', 'mixte')

        Returns:
            DataFrame filtré
        """
        if df_produits.empty or not skin_type:
            return df_produits

        skin_type_lower = skin_type.lower()
        # Chercher dans subcategory
        mask = df_produits["subcategory"].fillna("").str.lower().str.contains(skin_type_lower)

        return df_produits[mask]

    def obtenir_top_produits(
        self,
        df_produits: pd.DataFrame,
        criterion: str = "price",
        top_n: int = 10
    ) -> pd.DataFrame:
        """
        Récupère les meilleurs produits selon un critère.

        Args:
            df_produits: DataFrame des produits
            criterion: Critère de tri ('price' ou 'name')
            top_n: Nombre de produits à retourner

        Returns:
            DataFrame des top produits
        """
        if df_produits.empty:
            return df_produits

        if criterion == "price":
            return df_produits.nsmallest(top_n, "price")
        else:
            return df_produits.head(top_n)

    def obtenir_recommandations(self, question: str, df_produits: pd.DataFrame, top_n: int = 5) -> List[Dict]:
        """
        Recommende les meilleurs produits basés sur la question.

        Args:
            question: Question/requête utilisateur
            df_produits: DataFrame des produits
            top_n: Nombre de produits à recommander

        Returns:
            Liste des produits recommandés avec scores
        """
        if df_produits.empty:
            return []

        recommandations = []
        question_lower = question.lower()

        # Chercher les produits pertinents avec scoring
        for idx, product in df_produits.iterrows():
            score = 0
            
            description = str(product.get("description", "")).lower()
            subcategory = str(product.get("subcategory", "")).lower()
            ingredients = str(product.get("ingredients", "")).lower()
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
                "seche": 2,
                "sec": 2,
                "gras": 2,
                "hydrat": 2,
            }

            skin_keywords = {
                "sensible": 2,
                "gras": 2,
                "sec": 2,
                "seche": 2,
                "mixte": 1,
            }

            for keyword, points in concerns_keywords.items():
                if keyword in question_lower and keyword in description:
                    score += points
                if keyword in question_lower and keyword in name:
                    score += 1

            for keyword, points in skin_keywords.items():
                if keyword in question_lower and keyword in subcategory:
                    score += points

            if score > 0:
                recommandations.append({
                    "score": score,
                    "name": product.get("name"),
                    "brand": product.get("brand"),
                    "category": product.get("category"),
                    "subcategory": product.get("subcategory"),
                    "price": product.get("price"),
                    "description": product.get("description"),
                })

        # Trier par score
        recommandations.sort(key=lambda x: -x["score"])
        return recommandations[:top_n]
