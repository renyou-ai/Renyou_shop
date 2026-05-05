#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test recommendations"""

from agents.products_csv_agent import ProductsCSVAgent
from config import CHEMIN_CSV_PRODUITS

print("Testing Product Recommendations...")
agent = ProductsCSVAgent()
df, docs = agent.charger_et_transformer(CHEMIN_CSV_PRODUITS)

# Test recommendation
recommendations = agent.obtenir_recommandations(
    "Quel produit pour traiter l'acne et les peaux grasses?",
    df,
    top_n=5
)

print(f"\n🎯 Recommandations trouvées: {len(recommendations)}")
for i, rec in enumerate(recommendations, 1):
    print(f"\n{i}. {rec['name']}")
    print(f"   Marque: {rec['brand']}")
    print(f"   Catégorie: {rec['category']}")
    print(f"   Prix: {rec['price']} TND")
    print(f"   Score: {rec['score']}")
    
print("\n✅ Test des recommandations réussi!")
