# 🎯 Exemples d'utilisation - Mémoire Conversationnelle

## 1. Mode Chat Interactif Simple

```bash
python chat_conversationnel.py
```

**Flux:**
```
🎯 MODE CHAT CONVERSATIONNEL RAG

Initialisation du pipeline...

💭 Votre question: Je cherche un produit pour peau sensible

📝 Question: Je cherche un produit pour peau sensible
📚 Sources utilisées: 5
   [TXT] base de connaissances
   [PRODUCT] Uriage Xemose...
   ...

🤖 Assistant: Basé sur votre requête, voici les meilleurs produits pour peau sensible...

💡 PRODUITS RECOMMANDÉS
- CERAVE Hydratant (Cerave) - 25.50 TND
- AVENE Eau Thermale (Avène) - 18.00 TND

📊 Tour conversation: 1

💭 Votre question: Et pour hydrater?

🔄 Question reformulée: Produits hydratants pour peau sensible
(Machine comprend le contexte!)

📝 Question: Et pour hydrater?
📚 Sources utilisées: 4
...

🤖 Assistant: Voici les meilleurs produits hydratants pour peau sensible...

💡 PRODUITS RECOMMANDÉS
- La Roche Posay Toleriane (La Roche Posay) - 35.00 TND
- Eucerin Advanced Hydrating (Eucerin) - 28.50 TND

📊 Tour conversation: 2

💭 Votre question: quit
👋 Fin de la conversation

📊 Résumé de la conversation (2 tours)
- Nombre de messages: 4
- Thèmes principaux: sensible, hydratation, peau
- Contexte accumulé: 2 éléments
```

## 2. Mode Démo Automatisé

```bash
python chat_conversationnel.py demo
```

Lance un scénario prédéfini montrant comment le chatbot comprend les références implicites.

## 3. Utilisation Programmation - Chat Simple

```python
from agents.orchestrator_agent import OrchestratorAgent
from config import CHEMIN_PDF, CHEMIN_TXT, CHEMIN_CSV_PRODUITS

# Initialiser
orchestrator = OrchestratorAgent(groq_api_key=api_key)

# Setup du pipeline
orchestrator.pipeline_complet(
    chemin_pdf=CHEMIN_PDF,
    chemin_txt=CHEMIN_TXT,
    chemin_csv=CHEMIN_CSV_PRODUITS,
    groq_api_key=api_key,
)

# Activer mode conversationnel
orchestrator.initialiser_mode_conversationnel()

# Question 1
rep1 = orchestrator.poser_question_conversationnelle(
    "Quels sont les traitements pour l'acné?"
)
print("Réponse 1:", rep1["reponse"][:200])

# Question 2 (avec contexte)
rep2 = orchestrator.poser_question_conversationnelle(
    "Et pour prévenir les cicatrices?"
)
# Le chatbot comprend que c'est toujours sur l'acné!
print("Réponse 2:", rep2["reponse"][:200])
```

## 4. Accès à la Mémoire Conversationnelle

```python
# Après les questions posées...

# Historique complet
historique = orchestrator.obtenir_historique_conversation()
print(f"Nombre de messages: {len(historique)}")

for msg in historique:
    print(f"{msg['role']}: {msg['content'][:100]}...")

# Exporter en JSON
export = orchestrator.exporter_conversation("ma_conversation.json")
print(f"Conversation exportée: {export['turn_count']} tours")

# Résumé de conversation
if orchestrator.rag_generator.memory:
    resume = orchestrator.rag_generator.memory.obtenir_resume_conversation()
    print(resume)
```

## 5. Contrôle Détaillé de la Mémoire

```python
from agents.conversation_memory_agent import ConversationMemoryAgent

# Créer mémoire standalone
memory = ConversationMemoryAgent(max_history=10)

# Ajouter des messages
memory.ajouter_message("user", "Je cherche des produits pour peau grasse")
memory.ajouter_message("assistant", "Voici les meilleurs produits...")
memory.ajouter_message("user", "Et pour les pores dilatés?")

# Reformuler une question
question_ref = memory.reformuler_question("Et pour les pores dilatés?")
print(f"Reformulée: {question_ref}")
# → "Produits peau grasse pour pores dilatés"

# Extraire les thèmes principaux
themes = memory.extraire_themes_conversation()
print(f"Thèmes: {themes}")
# → {"peau": 2, "grasse": 2, "pores": 1, ...}

# Obtenir les derniers messages
derniers = memory.obtenir_derniers_messages(n=3)
print(f"Derniers 3 messages: {len(derniers)}")

# Résumé
resume = memory.obtenir_resume_conversation()
print(resume)

# Exporter/Importer
export = memory.export_conversation()
memory2 = ConversationMemoryAgent()
memory2.importer_conversation(export)
```

## 6. Scénario Réel: Diagnostic Progressif

```python
orchestrator = OrchestratorAgent(groq_api_key=api_key)
orchestrator.pipeline_complet(...)
orchestrator.initialiser_mode_conversationnel()

# Étape 1: Symptômes
r1 = orchestrator.poser_question_conversationnelle(
    "J'ai des rougeurs et des démangeaisons sur le visage"
)
# Mémorise: rougeurs, démangeaisons, visage

# Étape 2: Contexte additionnel
r2 = orchestrator.poser_question_conversationnelle(
    "Depuis 1 mois environ, notamment en hiver"
)
# Enrichit contexte: durée, saison

# Étape 3: Type de peau
r3 = orchestrator.poser_question_conversationnelle(
    "Ma peau est plutôt sèche"
)
# Accumule: sèche

# Étape 4: Recommandation adaptée
r4 = orchestrator.poser_question_conversationnelle(
    "Quel traitement me conseilleriez-vous?"
)
# LLM a le contexte complet: rougeurs + démangeaisons + 
# durée 1 mois + saison hiver + peau sèche
```

## 7. Scénario: Construction de Routine

```python
# Première demande
q1 = "Je veux une routine complète pour le matin"
r1 = orchestrator.poser_question_conversationnelle(q1)
# Assistant recommande: nettoyant + tonique + sérum + crème

# Amélioration 1
q2 = "Ajoute un produit anti-rides"
r2 = orchestrator.poser_question_conversationnelle(q2)
# Assistant: "Voici la routine révisée avec sérum anti-rides..."

# Amélioration 2
q3 = "Les marques moins chères?"
r3 = orchestrator.poser_question_conversationnelle(q3)
# Assistant: "Voici les alternatives moins chères avec les mêmes propriétés..."

# Final
q4 = "Prix total de cette routine?"
r4 = orchestrator.poser_question_conversationnelle(q4)
# Assistant: "Routine complète anti-rides budget: X TND"
```

## 8. Analyser les Performances

```python
# Après plusieurs questions
memory = orchestrator.rag_generator.memory

# Nombre de tours
print(f"Nombre de tours: {memory.turn_count}")

# Thèmes principaux
themes = memory.extraire_themes_conversation()
print(f"Top 5 thèmes:")
for theme, count in list(themes.items())[:5]:
    print(f"  - {theme}: {count}x")

# Contexte accumulé
contexte = memory.obtenir_contexte_accumule()
print(f"Contexte accumulé: {list(contexte.keys())}")

# Rapport complet
export = memory.export_conversation()
print(f"""
Conversation Report:
- Duration: {export['timestamp_debut']} → {export['timestamp_fin']}
- Turns: {export['turn_count']}
- Messages: {export['nombre_messages']}
- Main topics: {', '.join(list(export['themes'].keys())[:3])}
""")
```

## 9. Sauvegarde et Reprise de Conversation

```python
# Session 1
orchestrator1 = OrchestratorAgent(api_key)
orchestrator1.pipeline_complet(...)

r1 = orchestrator1.poser_question_conversationnelle("..."
r2 = orchestrator1.poser_question_conversationnelle("...")

# Exporter
export1 = orchestrator1.exporter_conversation("session1.json")

# === Plus tard ===

# Session 2
orchestrator2 = OrchestratorAgent(api_key)
orchestrator2.pipeline_complet(...)

# Importer l'historique
if orchestrator2.rag_generator.memory:
    with open("session1.json") as f:
        import json
        saved = json.load(f)
        orchestrator2.rag_generator.memory.importer_conversation(saved)

# Continuer la conversation!
r3 = orchestrator2.poser_question_conversationnelle("Suite de ma question précédente...")
# Le chatbot comprend le contexte des messages précédents!
```

## 10. Mode Batch (Questions Multiples)

```python
questions = [
    "Produits pour acné",
    "Comment appliquer?",
    "Effets secondaires?",
    "Prix?",
    "Alternatives?"
]

results = []
for q in questions:
    r = orchestrator.poser_question_conversationnelle(q)
    results.append(r)

# Analyse globale
print(f"Tour final: {orchestrator.rag_generator.memory.turn_count}")
print(f"Questions connexes: {len(questions)}")

# Export
orchestrator.exporter_conversation("batch_result.json")
```

---

**Conseil:** Pour une meilleure expérience, utilisez le mode interactif (`python chat_conversationnel.py`) qui offre une interface naturelle avec affichage en temps réel.

