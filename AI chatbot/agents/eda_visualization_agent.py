# -*- coding: utf-8 -*-
"""
EDA Visualization Agent
Responsabilité : Générer les statistiques et visualisations
"""

from typing import List

import pandas as pd

from config import EDA_CONFIG


class EDAVisualizationAgent:
    """Agent responsable de l'analyse exploratoire et visualisations."""

    def __init__(self):
        """Initialise l'agent EDA."""
        pass







    def analyser_corpus(self, tokens: List[str], nom_corpus: str = "Corpus"):
        """
        Effectue une analyse du corpus.

        Args:
            tokens: Liste de tokens
            nom_corpus: Nom du corpus
        """
        print(f"Analyse corpus: {nom_corpus}")
