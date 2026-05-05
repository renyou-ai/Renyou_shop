# -*- coding: utf-8 -*-
"""
Test rapide pour vérifier que le CSV mis à jour fonctionne correctement.
"""

import sys
import os

# Ajouter le répertoire parent au path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents.products_csv_agent import ProductsCSVAgent
from config import CHEMIN_CSV_PRODUITS

def test_csv_loading():
    """Test le chargement du CSV avec les nouvelles colonnes."""
    print("\n" + "="*70)
    print("TEST: Chargement du CSV avec nouvelles colonnes")
    print("="*70)
    
    # Initialiser l'agent
    products_agent = ProductsCSVAgent()
    
    # Charger le CSV
    print(f"\n📂 Chargement du CSV: {CHEMIN_CSV_PRODUITS}")
    df, documents = products_agent.charger_et_transformer(CHEMIN_CSV_PRODUITS)
    
    if df.empty:
        print("❌ ERREUR: Le DataFrame est vide!")
        return False
    
    # Afficher les informations
    print(f"\n✅ CSV chargé avec succès!")
    print(f"   - Nombre de produits: {len(df)}")
    print(f"   - Colonnes disponibles: {list(df.columns)}")
    print(f"   - Nombre de documents générés: {len(documents)}")
    
    # Afficher un premier produit
    if len(df) > 0:
        print(f"\n📦 Exemple de produit chargé:")
        first_product = df.iloc[0]
        print(f"   - Nom: {first_product.get('name')}")
        print(f"   - Marque: {first_product.get('brand')}")
        print(f"   - Catégorie: {first_product.get('category')}")
        print(f"   - Sous-catégorie: {first_product.get('subcategory')}")
        print(f"   - Prix: {first_product.get('price')} TND")
        print(f"   - Description: {str(first_product.get('description', ''))[:100]}...")
    
    # Tester les recommandations
    if len(df) > 0:
        print(f"\n🎯 Test des recommandations:")
        recommendations = products_agent.obtenir_recommandations(
            "Quels produits pour peaux grasses?",
            df,
            top_n=3
        )
        
        if recommendations:
            print(f"   - Nombre de recommandations trouvées: {len(recommendations)}")
            for i, rec in enumerate(recommendations, 1):
                print(f"     {i}. {rec['name']} (Score: {rec['score']})")
        else:
            print("   ⚠️  Aucune recommandation trouvée")
    
    # Tester le premier document généré
    if len(documents) > 0:
        print(f"\n📄 Aperçu du premier document RAG:")
        first_doc = documents[0]
        print(f"   - Type: {first_doc['metadata'].get('type')}")
        print(f"   - Product Name: {first_doc['metadata'].get('product_name')}")
        print(f"   - Suitable Skin Types: {first_doc['metadata'].get('suitable_skin_types')}")
        print(f"   - Target Concerns: {first_doc['metadata'].get('target_concerns')}")
        print(f"   - Text preview: {first_doc['text'][:200]}...")
    
    print("\n" + "="*70)
    print("✅ TEST RÉUSSI - Le CSV est correctement intégré!")
    print("="*70 + "\n")
    
    return True

if __name__ == "__main__":
    success = test_csv_loading()
    sys.exit(0 if success else 1)
