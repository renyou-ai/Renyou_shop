# 🚀 Guide Rapide: Utilisation du Nouveau CSV

## 📋 Vue d'ensemble

Le CSV produits a été migré vers un nouveau schéma simplifié. Ce guide montre comment l'utiliser.

---

## 🔧 Schéma Nouveau CSV

**Localisation:** `./demo_data/df_selected_columns.csv`

**Colonnes requises:**
```
name          : Nom du produit
brand         : Marque
category      : Catégorie principale
subcategory   : Sous-catégorie / Type de peau
ingredients   : Ingrédients
price         : Prix (TND)
description   : Description détaillée
```

**Exemple de ligne:**
```csv
name,brand,category,subcategory,ingredients,price,description
FILORGA NCEF ESSENCE - LOTION MULTI CORRECTION 150ML,FILORGA,Soins Visage,Peaux grasses,"aqua (water), propanediol, glycerin, ...",145.0,"Améliorez votre peau avec la lotion multi-correction..."
```

---

## 💻 Utilisation Basique

### 1. Charger le CSV dans votre code

```python
from agents.products_csv_agent import ProductsCSVAgent
from config import CHEMIN_CSV_PRODUITS

agent = ProductsCSVAgent()
df_produits, documents = agent.charger_et_transformer(CHEMIN_CSV_PRODUITS)

print(f"✅ {len(df_produits)} produits chargés")
```

### 2. Obtenir des recommandations

```python
# Basé sur une question utilisateur
recommendations = agent.obtenir_recommandations(
    question="Quel produit pour peaux grasses?",
    df_produits=df_produits,
    top_n=5
)

for prod in recommendations:
    print(f"- {prod['name']} ({prod['brand']}) - Score: {prod['score']}")
```

### 3. Filtrer par type de peau

```python
produits_grasses = agent.filtrer_produits_par_type_peau(
    df_produits,
    skin_type="gras"
)
print(f"Trouvé {len(produits_grasses)} produits pour peaux grasses")
```

### 4. Filtrer par préoccupation

```python
produits_acne = agent.filtrer_produits_par_concerns(
    df_produits,
    concerns=["acne", "rides"]
)
print(f"Trouvé {len(produits_acne)} produits pour acne/rides")
```

---

## 🧪 Tests Rapides

### Test 1: Vérifier le chargement
```bash
python test_simple.py
```
✅ Résultat attendu: "3016 produits chargés"

### Test 2: Vérifier les recommandations
```bash
python test_recommendations.py
```
✅ Résultat attendu: "5 recommandations trouvées"

### Test 3: Pipeline complet (optionnel)
```bash
python main.py  # Choisir mode 1
```

---

## 🔍 Métadonnées Déduites Automatiquement

Quand vous chargez un produit, le système **déduit automatiquement:**

### `suitable_skin_types`
Qui vient de `subcategory`:
```
"Peaux grasses" → suitable_skin_types = "Peaux grasses"
"Peaux sensibles" → suitable_skin_types = "Peaux sensibles"
```

### `target_concerns`
Qui est déduit de `description` en cherchant:
```
Description contient: "rides" → ajoute "rides"
Description contient: "hydrat" → ajoute "hydratation"
Description contient: "acné" → ajoute "acne"
etc...
```

**Exemple:**
```
Description: "Riche de 50 actifs, repulpe les ridules, hydrate intensément..."
Target Concerns déduits: "rides, hydratation"
```

---

## ⚙️ Configuration via Code

### Modifier les chemins (si nécessaire)

**config.py:**
```python
CHEMIN_CSV_PRODUITS = "./demo_data/df_selected_columns.csv"
```

### Modifier les mots-clés de déduction

**agents/products_csv_agent.py** (méthode `enrichir_document_produit`):
```python
concern_keywords = {
    "acné": "acne",           # Cherche "acné" dans description
    "rides": "rides",          # Cherche "rides" ou "ridules"
    "hyperpigmentation": "hyperpigmentation",
    # Ajouter d'autres mots-clés comme nécessaire...
}
```

---

## 📊 Système de Scoring des Recommandations

Quand l'utilisateur pose une question, le système:

1. **Cherche dans la description:**
   - Si mot-clé présent ET mot-clé en question: Score += 3

2. **Cherche dans subcategory:**
   - Si mot-clé présent ET mot-clé en question: Score += 2

3. **Trie par score décroissant**

4. **Retourne les top N produits**

**Exemple:**
```
Question: "Quel produit pour traiter l'acne et les peaux grasses?"

Produit 1:
  - description contains "acne": +3
  - subcategory contains "gras": +2
  - Total Score: 5

Produit 2:
  - description contains "acne": +3
  - Total Score: 3

Classement: Produit 1 (5) > Produit 2 (3)
```

---

## 💾 Ajouter de Nouveaux Produits

### Méthode 1: Ajouter une ligne au CSV manuellement
```csv
NOM PRODUIT,MARQUE,Soins Visage,Peaux sèches,"ingrédient1, ingrédient2",99.9,"Description du produit..."
```

### Méthode 2: Ajouter programmatiquement
```python
import pandas as pd

new_product = {
    'name': 'Mon Produit',
    'brand': 'Ma Marque',
    'category': 'Soins Visage',
    'subcategory': 'Peaux sèches',
    'ingredients': 'Ingrédient 1, Ingrédient 2',
    'price': 49.99,
    'description': 'Description du produit...'
}

df = pd.read_csv('./demo_data/df_selected_columns.csv')
df = pd.concat([df, pd.DataFrame([new_product])], ignore_index=True)
df.to_csv('./demo_data/df_selected_columns.csv', index=False)
```

---

## 🔗 Intégration dans le Pipeline RAG

Les documents produits sont automatiquement:

1. ✅ Chargés par `OrchestratorAgent`
2. ✅ Transformés en documents RAG par `ProductsCSVAgent`
3. ✅ Indexés dans ChromaDB avec leurs métadonnées
4. ✅ Récupérés lors des requêtes RAG
5. ✅ Recommandés dynamiquement basé sur les questions

---

## 📞 Dépannage

### Problème: "CSV non trouvé"
**Solution:** Vérifier que `df_selected_columns.csv` existe dans `./demo_data/`

### Problème: "Aucune colonne X"
**Solution:** Vérifier que le CSV contient exactement: `name, brand, category, subcategory, ingredients, price, description`

### Problème: "Aucune recommandation"
**Solution:** 
- La question ne contient pas de mots-clés pertinents
- Essayer avec: "acne", "rides", "hydratation", "sensible", "gras", "sec", etc.

### Problème: Métadonnées incorrectes
**Solution:** Vérifier le contenu de `description` pour les mots-clés détectables

---

## ✨ Résumé

| Aspect | Ancien CSV | Nouveau CSV |
|--------|-----------|------------|
| Colonnes requises | 17 | 7 ✅ |
| Maintenance | Manuelle | Automatique ✅ |
| Flexibilité | Fixe | Adaptive ✅ |
| Métadonnées | Statiques | Déduites ✅ |
| Recommandations | Basées sur rating | Basées sur contenu ✅ |

**Status:** ✅ Prêt pour la production

