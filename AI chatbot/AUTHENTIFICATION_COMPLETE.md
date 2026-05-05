# 🔐 AUTHENTIFICATION GOOGLE DRIVE - GUIDE COMPLET

## ⚠️ Problème

```
❌ ERREUR D'AUTHENTIFICATION
   Détail: Please specify client config backend
```

---

## 🎯 Cause Racine

L'authentification OAuth2 nécessite des **credentials Google valides**. Sans elles, PyDrive2 ne peut pas créer une session authentifiée.

---

##  ✅ Solutions (du plus facile au plus complexe)

### 1️⃣ **SOLUTION RAPIDE - Google Colab** ⭐ (Recommandé)

Si vous n'avez pas de configuration OAuth locale, utilisez Google Colab gratuitement :

1. Ouvrez: https://colab.research.google.com/
2. Créez un nouveau notebook
3. Exécutez ces cellules :

```python
# Cellule 1 - Installer les dépendances
!pip install pydrive2 langchain chromadb

# Cellule 2 - Authentification
from google.colab import auth
auth.authenticate_user()

# Cellule 3 - Télécharger les fichiers (PDFs, TXTs, etc.)
from google.colab import drive
drive.mount('/content/drive')

# Vous pouvez ensuite exécuter votre code RAG complet dans Colab
```

**Avantages**:
- ✅ Gratuit
- ✅ Aucune configuration locale
- ✅ Accès automatique à votre Google Drive
- ✅ Pas d'erreurs d'authentification

**Inconvénients**:
- 🔹 Dépend d'internet
- 🔹 Sessions limitées à 12 heures

---

### 2️⃣ **Créer des Credentials OAuth2 Réelles**

#### Étape 1: Créer un projet Google Cloud

1. Allez sur: https://console.cloud.google.com/
2. Créez un nouveau projet (nomez-le "RENYOU-RAG")
3. Attendez la création

#### Étape 2: Activer Google Drive API

1. Cherchez "Google Drive API"
2. Cliquez "Enable" (Activer)

#### Étape 3: Créer les credentials

1. Allez à "Credentials" (Identifiants)
2. Cliquez "Create Credentials" → "OAuth client ID"
3. Type: "Desktop application"
4. Cliquez "Create"

#### Étape 4: Télécharger le fichier JSON

1. Trouvez votre credential dans la liste
2. Cliquez sur l'icône "Download" (💾)
3. **Renommez le fichier en `client_secrets.json`**
4. **Placez-le dans votre dossier** `C:\Users\Tliba\Documents\RENYOUAPP\Sprint 2\`

#### Étape 5: Exécuter l'authentification

```bash
cd "C:\Users\Tliba\Documents\RENYOUAPP\Sprint 2"
python auth_oauth.py
```

**Résultat attendu**:
```
✅ AUTHENTIFICATION RÉUSSIE !
✅ Credentials sauvegardées : mycreds.txt
```

---

### 3️⃣ **Utiliser PyDrive2 avec settings.yaml**

Créez un fichier `settings.yaml` dans votre dossier:

```yaml
client_config_backend: settings
client_config:
  client_id: YOUR_CLIENT_ID.apps.googleusercontent.com
  client_secret: YOUR_CLIENT_SECRET
  auth_uri: https://accounts.google.com/o/oauth2/auth
  token_uri: https://oauth2.googleapis.com/token
  redirect_uri: http://localhost:8080/
  scope:
    - https://www.googleapis.com/auth/drive
save_credentials: True
save_credentials_backend: file
save_credentials_file: mycreds.txt
```

Puis exécutez:

```bash
python auth_simple.py
```

---

## 🚀 Après l'Authentification

Une fois que vous avez `mycreds.txt`, vous pouvez utiliser le Mode Direct Drive:

```bash
python main.py
# Choisir: Mode 4 (Direct Drive)
# ✅ Les données viennent directement du Google Drive !
```

---

## 🧪 Vérifier que l'Authentification Fonctionne

```bash
# Vérifier que mycreds.txt existe
dir mycreds.txt

# Tester la connexion
python -c "from google_drive_manager import GoogleDriveManager; m = GoogleDriveManager(); print('✅ OK' if m.authenticate() else '❌ Erreur')"
```

---

## 📋 Checklist Finale

- [ ] Créer un projet Google Cloud (ou utiliser Google Colab)
- [ ] Télécharger `client_secrets.json`
- [ ] Placer le fichier dans le dossier du projet
- [ ] Exécuter `python auth_oauth.py`
- [ ] Autoriser l'accès dans le navigateur
- [ ] Vérifier que `mycreds.txt` a été créé
- [ ] Tester `python main.py` → Mode 4
- [ ] ✅ Direct Drive fonctionne !

---

## 🆘 Troubleshooting

### "Port 8080 déjà utilisé"

```bash
# Windows - Trouver le processus
netstat -ano | findstr :8080

# Puis tuer le processus (remplacer PID)
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### "mycreds.txt invalide"

```bash
# Supprimer et recommencer
del mycreds.txt   # Windows
rm mycreds.txt    # Linux/Mac

# Puis réauthentifier
python auth_oauth.py
```

### "Erreur: Unauthorized"

Cela signifie que les credentials ont expiré ou ne sont pas valides:

```bash
# Option 1: Régénérer
rm mycreds.txt
python auth_oauth.py

# Option 2: Utiliser Google Colab (plus simple)
```

---

## 📞 Support

Pour plus d'informations sur l'authentification OAuth2:
- https://developers.google.com/identity/protocols/oauth2
- https://github.com/gsuitedevs/PyDrive2

Pour questions sur Google Cloud:
- https://cloud.google.com/docs
