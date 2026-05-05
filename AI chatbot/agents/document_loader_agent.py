# -*- coding: utf-8 -*-
"""
Document Loader Agent
Responsabilité : Charger les fichiers PDF et TXT, extraire le texte
"""

import os
import pdfplumber
from typing import Tuple, List, Dict


class DocumentLoaderAgent:
    """Agent responsable du chargement et extraction des documents."""

    def __init__(self):
        pass

    @staticmethod
    def extraire_texte_pdf(chemin_pdf: str) -> str:
        """
        Extrait le texte brut d'un PDF page par page.

        Args:
            chemin_pdf: Chemin vers le fichier PDF

        Returns:
            Texte extrait du PDF
        """
        texte_pages = []
        try:
            with pdfplumber.open(chemin_pdf) as pdf:
                for page in pdf.pages:
                    content = page.extract_text()
                    if content:
                        texte_pages.append(content)
        except Exception as e:
            print(f"⚠️  Erreur lecture PDF {chemin_pdf}: {e}")
        return "\n".join(texte_pages)

    @staticmethod
    def extraire_texte_txt(chemin_txt: str) -> str:
        """
        Extrait le texte d'un fichier TXT.

        Args:
            chemin_txt: Chemin vers le fichier TXT

        Returns:
            Contenu du fichier TXT
        """
        try:
            with open(chemin_txt, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception as e:
            print(f"⚠️  Erreur lecture TXT {chemin_txt}: {e}")
        return ""

    def charger_documents(self, dossier_path: str) -> Tuple[List[str], List[Dict]]:
        """
        Charge tous les PDF et TXT d'un dossier.

        Args:
            dossier_path: Chemin du dossier contenant les documents

        Returns:
            Tuple contenant :
            - Liste de noms de fichiers chargés
            - Liste de dicts {text, metadata}
        """
        fichiers_charges = []
        docs_rag = []

        if not os.path.exists(dossier_path):
            print(f"⚠️  Le dossier n'existe pas : {dossier_path}")
            return fichiers_charges, docs_rag

        for nom_fichier in sorted(os.listdir(dossier_path)):
            chemin = os.path.join(dossier_path, nom_fichier)
            brut, source_type = "", ""

            if nom_fichier.endswith(".pdf"):
                brut = self.extraire_texte_pdf(chemin)
                source_type = "pdf"
            elif nom_fichier.endswith(".txt"):
                brut = self.extraire_texte_txt(chemin)
                source_type = "txt"

            if brut.strip():
                fichiers_charges.append(nom_fichier)
                docs_rag.append({
                    "text": brut,
                    "metadata": {
                        "source": nom_fichier,
                        "source_type": source_type,
                        "source_path": chemin,
                    }
                })
                print(f"  [{source_type.upper()}] {nom_fichier} ({len(brut):,} car.)")

        print(f"\n✅ {len(docs_rag)} fichier(s) chargé(s)")
        return fichiers_charges, docs_rag
