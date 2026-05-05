# -*- coding: utf-8 -*-
"""
demo.py — Démonstration du pipeline RAG avec fichiers de test

Génère automatiquement des fichiers PDF/TXT de démonstration et exécute
le pipeline complet pour montrer comment tout fonctionne.
"""

import os
import shutil
from pathlib import Path


def creer_fichiers_demo():
    """Crée des fichiers PDF et TXT de démonstration."""
    
    # Créer les dossiers de démo
    demo_dir = Path("demo_data")
    pdf_dir = demo_dir / "pdf"
    txt_dir = demo_dir / "txt"
    
    # Nettoyer si existe
    for d in [pdf_dir, txt_dir]:
        if d.exists():
            shutil.rmtree(d)
        d.mkdir(parents=True, exist_ok=True)
    
    print(f"📁 Dossiers créés : {pdf_dir} et {txt_dir}\n")
    
    # TXT 1 : Traitement de l'acné
    txt1 = """
    TRAITEMENT DE L'ACNÉ
    
    L'acné est une affection chronique des pilosébacées, très fréquente chez 
    l'adolescent mais aussi chez l'adulte.
    
    PHYSIOPATHOLOGIE
    L'acné résulte de 4 facteurs clés :
    1. Augmentation de la séborrhée
    2. Hyperkératinisation du follicule pileux
    3. Prolifération de Cutibacterium acnes (anciennement Propionibacterium acnes)
    4. Inflammation
    
    TRAITEMENT TOPIQUE
    - Bénzoyle de peroxyde : 2,5-5-10% en moussant ou crème
    - Rétinoïdes topiques : Adapalène 0,1%, Trétinoïne micronisée
    - Antibiotiques topiques : Érythromycine, Clindamycine
    - Acide salicylique : 2-3% en lotion
    
    TRAITEMENT SYSTÉMIQUE
    Pour l'acné modérée à sévère :
    - Antibiotiques : Cyclines (Doxycycline, Minocycline), Azithromycine
    - Hormonaux (chez la femme) : Contraceptifs ; Acétate de cyprotérone
    - Isotrétinoïne (Accutane) : Réservé aux acnés sévères
    
    CONTRE-INDICATIONS
    - Grossesse ou risque de grossesse (tératogénicité de l'isotrétinoïne)
    - Allèles sensibles à la tétracycline
    
    RECOMMANDATIONS
    - Hygiène quotidienne avec nettoyants doux
    - Éviter manipulations et grattage
    - Protection solaire (SPF 30+)
    - Éviter cosmétiques comédogènes
    """
    
    # TXT 2 : Hyperpigmentation
    txt2 = """
    TRAITEMENT DE L'HYPERPIGMENTATION
    
    L'hyperpigmentation est une augmentation locale ou généralisée de la 
    production de mélanine, affectant surtout les peaux foncées.
    
    TYPES
    1. Mélasma : Hypermélanose symétrique du visage
    2. Lentigines : Macules brun clair
    3. Cicatrices hyperpigmentées : Séquelles post-inflammatoires
    
    TRAITEMENT TOPIQUE
    Dépigmentants :
    - Hydroquinone 4% : Gold standard, action directe sur mélanine
    - Acide kojique : Inhibiteur de tyrosinase
    - Vitamine C : Antioxydant et dépigmentant modéré
    - Acide azélaïque 15-20% : Efficace sur mélasma
    
    Exfoliants chimiques :
    - Acides hydroxy : AHA (glycolique, lactique), BHA (salicylique)
    - Trétinoïne : Stimule renouvellement - Commencer 0,025%
    
    TRAITEMENT LASER/ÉNERGÉTIQUE
    - Laser Nd:YAG Q-switched : Mélasma, lentigines
    - Laser CO2 fractionné : Pigmentation diffuse
    - IPL (Intense Pulsed Light) : Option moins invasive
    - Microdermabrasion : Mécanique, résultats modérés
    
    PRESCRIPTION COURANTE
    - Hydroquinone 4% le soir
    - Trétinoïne 0,025% 2-3x/semaine
    - SPF 50+ matin (crucial!)
    - Acide azélaïque 15% matin et soir pour mélasma
    
    DÉLAI D'EFFET
    - 3-6 mois pour amélioration clinique
    - 6-12 mois pour résultats optimaux
    """
    
    # Sauvegarder les TXT
    (txt_dir / "traitement_acne.txt").write_text(txt1, encoding="utf-8")
    (txt_dir / "traitement_hyperpigmentation.txt").write_text(txt2, encoding="utf-8")
    
    print("✅ Fichiers de démonstration créés :")
    print(f"   • traitement_acne.txt ({len(txt1)} caractères)")
    print(f"   • traitement_hyperpigmentation.txt ({len(txt2)} caractères)")
    print()
    
    return str(pdf_dir), str(txt_dir)


def demo_simple():
    """Démo simple : charger → indexer → chercher."""
    
    print("\n" + "="*70)
    print("🚀 DEMO SIMPLE : Document Loading + NLP + Indexation")
    print("="*70 + "\n")
    
    from agents.document_loader_agent import DocumentLoaderAgent
    from agents.nlp_preprocessing_agent import NLPPreprocessingAgent
    from agents.embedding_vectorstore_agent import EmbeddingVectorStoreAgent
    from agents.retriever_agent import RetrieverAgent
    
    # Créer fichiers de démo
    pdf_path, txt_path = creer_fichiers_demo()
    
    # 1. Charger
    print("ÉTAPE 1 : Chargement des documents")
    print("─" * 70)
    loader = DocumentLoaderAgent()
    _, docs_pdf = loader.charger_documents(pdf_path)
    _, docs_txt = loader.charger_documents(txt_path)
    docs = docs_txt + docs_pdf
    print(f"✅ {len(docs)} document(s) chargé(s)\n")
    
    # 2. NLP
    print("ÉTAPE 2 : Preprocessing NLP")
    print("─" * 70)
    nlp = NLPPreprocessingAgent()
    tokens, docs_traites = nlp.pretraiter_documents(docs)
    print(f"✅ {len(tokens):,} tokens extraits")
    print(f"   Top 10 : {tokens[:10]}\n")
    
    # 3. Indexation
    print("ÉTAPE 3 : Création du Vector Store")
    print("─" * 70)
    embedding_agent = EmbeddingVectorStoreAgent()
    vs, retriever = embedding_agent.conditionner_pipeline(
        docs,
        reinitialiser=True
    )
    print(f"✅ Vector store créé\n")
    
    # 4. Test retriever
    print("ÉTAPE 4 : Test du Retriever")
    print("─" * 70)
    retriever_agent = RetrieverAgent(retriever)
    
    requetes_test = [
        "traitement de l'acné",
        "hyperpigmentation",
        "hydroquinone",
    ]
    
    for req in requetes_test:
        print(f"\n🔍 Requête : '{req}'")
        docs_trouvés = retriever_agent.retrouver(req, verbose=False)
        print(f"   {len(docs_trouvés)} document(s) trouvé(s)")
        for i, doc in enumerate(docs_trouvés, 1):
            source = doc.metadata.get("source", "?")
            extrait = doc.page_content[:80].replace("\n", " ")
            print(f"   [{i}] {source}: {extrait}...")
    
    print("\n✅ DÉMO SIMPLE TERMINÉE!")
    print(f"   Documents indexés dans : demo_data/")
    print(f"   Index ChromaDB : .chroma/")


def demo_eda():
    """Démo : Analyse EDA uniquement."""
    
    print("\n" + "="*70)
    print("📊 DEMO EDA : Analyse explorer des données")
    print("="*70 + "\n")
    
    from agents.document_loader_agent import DocumentLoaderAgent
    from agents.nlp_preprocessing_agent import NLPPreprocessingAgent
    from agents.eda_visualization_agent import EDAVisualizationAgent
    
    # Fichiers existants (du PATH_DATA)
    pdf_path, txt_path = creer_fichiers_demo()
    
    # Charger
    loader = DocumentLoaderAgent()
    _, docs = loader.charger_documents(txt_path)
    
    # NLP
    nlp = NLPPreprocessingAgent()
    tokens, _ = nlp.pretraiter_documents(docs)
    
    # EDA
    print("Génération des statistiques EDA...")
    eda = EDAVisualizationAgent()
    
    # Stats
    stats = eda.generer_statistiques(tokens)
    print(f"\n📊 Statistiques :")
    print(f"   Total tokens : {stats['total_tokens']:,}")
    print(f"   Unique tokens : {stats['unique_tokens']:,}")
    print(f"   Fréquence moyenne : {stats['moyenne_frequence']:.2f}")
    print(f"   Top 5 termes : {stats['top_10'][:5]}")
    
    print("\n✅ DÉMO EDA TERMINÉE!")


def demo_agents_individuels():
    """Démo : Utiliser les agents individuellement."""
    
    print("\n" + "="*70)
    print("🔧 DEMO : Agents individuels dans un workflow custom")
    print("="*70 + "\n")
    
    from agents.document_loader_agent import DocumentLoaderAgent
    from agents.nlp_preprocessing_agent import NLPPreprocessingAgent
    
    print("Exemple 1 : Document Loading")
    print("─" * 70)
    loader = DocumentLoaderAgent()
    
    # Texte d'exemple
    exemple_texte = """
    DERMATITE ATOPIQUE
    
    La dermatite atopique est une inflammation chronique de la peau.
    
    SYMPTÔMES
    - Prurit intense
    - Xerose cutanée
    - Lichenification
    
    TRAITEMENT
    Hydratation systématique avec émollients
    Corticoïdes topiques modérés
    Anthistaminiques H1 si nécessaire
    """
    
    # Créer un fichier temporaire pour tester
    test_file = Path("test_demo.txt")
    test_file.write_text(exemple_texte, encoding="utf-8")
    
    print(f"✅ Fichier créé : {test_file}\n")
    
    print("Exemple 2 : NLP Preprocessing")
    print("─" * 70)
    nlp = NLPPreprocessingAgent()
    tokens = nlp.nettoyer_nlp_fr(exemple_texte)
    print(f"✅ Tokens extraits : {tokens}\n")
    
    # Nettoyer
    test_file.unlink()
    print("✅ DÉMO AGENTS INDIVIDUELS TERMINÉE!")


def main():
    """Menu principal."""
    
    print("\n" + "🎬 "*20)
    print("DÉMONSTRATIONS DU PIPELINE RAG ORCHESTRÉ")
    print("🎬 "*20 + "\n")
    
    print("Exemples disponibles :")
    print("  1. Simple : Charger → Indexer → Chercher")
    print("  2. EDA : Analyser les données")
    print("  3. Agents individuels : Workflow custom")
    print("  0. Quitter\n")
    
    choix = input("Sélectionnez une démo (0-3) : ").strip()
    
    demos = {
        "1": demo_simple,
        "2": demo_eda,
        "3": demo_agents_individuels,
    }
    
    if choix in demos:
        try:
            demos[choix]()
        except Exception as e:
            print(f"\n❌ Erreur : {e}")
            import traceback
            traceback.print_exc()
    elif choix == "0":
        print("👋 Au revoir!")
    else:
        print("❌ Choix invalide")


if __name__ == "__main__":
    main()
