#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Simple test for CSV loading"""

from agents.products_csv_agent import ProductsCSVAgent
from config import CHEMIN_CSV_PRODUITS

print("Testing ProductsCSVAgent...")
agent = ProductsCSVAgent()
df, docs = agent.charger_et_transformer(CHEMIN_CSV_PRODUITS)

print(f"Products loaded: {len(df)}")
print(f"Documents generated: {len(docs)}")

if len(docs) > 0:
    print(f"First doc product name: {docs[0]['metadata']['product_name']}")
    print(f"First doc suitable_skin_types: {docs[0]['metadata']['suitable_skin_types']}")
    print(f"First doc target_concerns: {docs[0]['metadata']['target_concerns']}")
    
print("✅ Test passed!")
