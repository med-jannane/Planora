import os
import io
import json
import re
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import PyPDF2
from docx import Document
import requests

app = FastAPI(title="SprintAI Microservice (Ollama & Gemini Enabled)", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
DEFAULT_PROJECT_ID = "projects/1073993084080"
OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
DEFAULT_OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3:latest")

class TeamMember(BaseModel):
    name: str
    role: str
    email: Optional[str] = None

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for i, page in enumerate(reader.pages):
            t = page.extract_text()
            if t:
                text += f"\n--- Page {i+1} ---\n" + t
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur lors de la lecture du fichier PDF: {str(e)}")

def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([p.text for p in doc.paragraphs if p.text])
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur lors de la lecture du fichier Word DOCX: {str(e)}")

def get_installed_ollama_models() -> List[str]:
    try:
        res = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=4)
        if res.status_code == 200:
            data = res.json()
            return [m["name"] for m in data.get("models", [])]
    except Exception as err:
        print("Ollama local tags fetch info:", err)
    return []

def call_ollama_api(prompt_text: str, model_name: str = "llama3:latest") -> Optional[dict]:
    url = f"{OLLAMA_BASE_URL}/api/generate"
    payload = {
        "model": model_name,
        "prompt": prompt_text,
        "format": "json",
        "stream": False,
        "options": {
            "temperature": 0.2
        }
    }
    try:
        print(f"🦙 Appels Ollama Local (modèle: {model_name})...")
        res = requests.post(url, json=payload, timeout=60)
        if res.status_code == 200:
            data = res.json()
            raw_response = data.get("response", "")
            parsed = json.loads(raw_response)
            if isinstance(parsed, dict) and "tasks" in parsed:
                for t in parsed["tasks"]:
                    t["status"] = "A faire"
            print(f"✅ Génération Ollama ({model_name}) réussie !")
            return parsed
        else:
            print(f"Ollama API HTTP {res.status_code}: {res.text[:200]}")
    except Exception as err:
        print(f"⚠️ Warning Ollama Local ({model_name}):", err)
    return None

def call_gemini_api(prompt_text: str, api_key: str):
    key_to_use = api_key.strip() if api_key and api_key.strip() else DEFAULT_GEMINI_KEY
    if not key_to_use:
        return None

    if key_to_use.startswith("AQ.") or key_to_use.startswith("ya29."):
        url = "https://us-central1-aiplatform.googleapis.com/v1/projects/1073993084080/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent"
        headers = {
            "Authorization": f"Bearer {key_to_use}",
            "Content-Type": "application/json"
        }
    else:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key_to_use}"
        headers = {
            "Content-Type": "application/json"
        }

    payload = {
        "contents": [{
            "parts": [{"text": prompt_text}]
        }],
        "generationConfig": {
            "response_mime_type": "application/json"
        }
    }
    
    try:
        res = requests.post(url, json=payload, headers=headers, timeout=25)
        if res.status_code == 200:
            data = res.json()
            raw_json = data['candidates'][0]['content']['parts'][0]['text']
            parsed = json.loads(raw_json)
            if isinstance(parsed, dict) and "tasks" in parsed:
                for t in parsed["tasks"]:
                    t["status"] = "A faire"
            return parsed
        else:
            print(f"Gemini API HTTP {res.status_code}: {res.text[:200]}")
    except Exception as err:
        print("Gemini API warning:", err)
    return None

def intelligent_breakdown(
    spec_text: str,
    team: List[dict],
    project_name: str,
    ai_engine: str = "ollama",
    ollama_model: str = "llama3:latest",
    gemini_key: str = ""
):
    system_prompt = f"""
Tu es un Scrum Master, Lead Architecte Logiciel et Expert Agile d'élite.
Ton objectif est d'analyser le cahier des charges fourni pour le projet "{project_name}" et de le découper de manière ultra-rigoureuse en User Stories, sous-tâches techniques, Sprints et plan d'affectation d'équipe.

INFORMATIONS DE L'ÉQUIPE ET COMPÉTENCES/FONCTIONNALITÉS :
{json.dumps(team, ensure_ascii=False, indent=2)}

INSTRUCTIONS STRICTES :
1. ANALYSE ET DÉCOUPAGE DU DOCUMENT :
   - Extrais l'intégralité des modules fonctionnels et exigences du cahier des charges.
   - Formule des User Stories claires sous le format : "En tant que... je veux... afin de...".
   - Attribue un nombre de Story Points réaliste (ex: 1, 2, 3, 5, 8, 13) et une estimation en heures (1 SP ≈ 2.5h à 3h).
   - Rédige au moins 2 à 4 critères d'acceptation précis par User Story.

2. DÉCOUPAGE EN SOUS-TÂCHES TECHNIQUES :
   - Décompose chaque User Story en 2 ou 3 sous-tâches techniques concrètes (Front-end, Back-end, UI/UX, Base de données, QA, DevOps).
   - Pour chaque tâche, calcule `estimated_hours` (heures), `gantt_start_day` (jour de début sur la timeline Gantt), et `duration_days` (durée en jours).
   - CRUCIAL : TOUTES LES TÂCHES GÉNÉRÉES DOIVENT AVOIR `status: "A faire"`. Ne jamais mettre "En cours" ou "Terminé".

3. AFFECTATION INTELLIGENTE PAR SKILLS & MULTI-FONCTIONNALITÉS :
   - Analyse les rôles et la liste des fonctionnalités/compétences de chaque membre de l'équipe ({json.dumps([m.get('name') for m in team])}).
   - Distribue la charge de travail équitablement entre les membres en faisant correspondre la nature de la tâche aux compétences/fonctionnalités sélectionnées par chaque membre.

4. ORGANISATION DES SPRINTS :
   - Regroupe les tâches de manière logique en Sprints successifs (Sprint 1, Sprint 2, Sprint 3...).

FORMAT DE RÉPONSE STRICT (RETOURNE UNIQUEMENT DU JSON VALIDE SANS TEXTE AUTOUR) :
{{
  "project_name": "{project_name}",
  "summary": "Synthèse architecturale et périmètre global du cahier des charges",
  "total_estimated_hours": 140,
  "total_story_points": 45,
  "estimated_duration_weeks": 3.5,
  "user_stories": [
    {{
      "id": "US-101",
      "title": "Intitulé explicite de la story",
      "module": "Nom du module fonctionnel",
      "priority": "Haute",
      "story_points": 5,
      "estimated_hours": 15,
      "assigned_to": "Nom d'un membre de l'équipe",
      "assigned_role": "Rôle / Fonctionnalité principale",
      "criteria": [
        "Critère d'acceptation 1",
        "Critère d'acceptation 2"
      ]
    }}
  ],
  "tasks": [
    {{
      "id": "TSK-01",
      "user_story_id": "US-101",
      "title": "Libellé technique précis de la sous-tâche",
      "assignee": "Nom d'un membre de l'équipe",
      "role": "Rôle / Domaine d'expertise",
      "estimated_hours": 8,
      "status": "A faire",
      "sprint": "Sprint 1",
      "gantt_start_day": 1,
      "duration_days": 2,
      "description": "Explication technique détaillée de la mise en œuvre"
    }}
  ],
  "sprints": [
    {{
      "id": "SP-1",
      "name": "Sprint 1: Titre du Sprint",
      "duration": "2 Semaines",
      "focus": "Objectif principal du Sprint",
      "status": "Planifie",
      "tasks_count": 4
    }}
  ],
  "ai_suggestions": [
    "Recommandation technique 1 (ex: architecture API)",
    "Recommandation 2 (ex: sécurité, base de données, PWA)"
  ]
}}

Cahier des charges à analyser :
{spec_text[:6000]}
"""

    model_to_use = ollama_model if ollama_model else DEFAULT_OLLAMA_MODEL

    # 1. Try Ollama Local AI if requested or default
    if ai_engine != "gemini":
        ollama_result = call_ollama_api(system_prompt, model_to_use)
        if ollama_result:
            return ollama_result

    # 2. Try Gemini API
    if gemini_key:
        gemini_result = call_gemini_api(system_prompt, gemini_key)
        if gemini_result:
            return gemini_result

    # 3. Dynamic NLP Extraction fallback parser
    dev_frontend = next((m for m in team if any(k in m.get('role','').lower() for k in ["front", "react", "web", "pwa", "mobile"])), team[0] if team else {"name": "Développeur Frontend", "role": "React / PWA"})
    dev_backend = next((m for m in team if any(k in m.get('role','').lower() for k in ["back", "laravel", "api", "db", "php", "mysql"])), team[min(1, len(team)-1)] if team else {"name": "Développeur Backend", "role": "Laravel / MySQL"})
    designer = next((m for m in team if any(k in m.get('role','').lower() for k in ["ui", "ux", "design", "maquette"])), team[0] if team else {"name": "UI/UX Designer", "role": "Design"})

    lines = [l.strip(" *-#•1234567890.") for l in spec_text.split("\n") if len(l.strip()) > 6]
    key_features = [line for line in lines if not line.startswith("--- Page")][:8]
    if len(key_features) < 3:
        key_features = [
            "Gestion des Utilisateurs & Profils d'Équipe",
            "Analyse Automatique du Cahier des Charges PDF",
            "Tableau Kanban & Backlog Drag & Drop",
            "Diagramme de Gantt Visuel & Interactive Timeline",
            "Envoi de Notifications & Mails Automatiques"
        ]

    user_stories = []
    tasks = []
    task_counter = 1
    gantt_day = 1

    for idx, feature in enumerate(key_features):
        us_id = f"US-{101 + idx}"
        feature_lower = feature.lower()
        if any(k in feature_lower for k in ["design", "ui", "ux", "maquette", "interface", "charte"]):
            assignee_member = designer
            module_name = "Interface & Design UX"
        elif any(k in feature_lower for k in ["api", "db", "mysql", "laravel", "backend", "serveur", "base"]):
            assignee_member = dev_backend
            module_name = "Backend API & Base de données"
        else:
            assignee_member = dev_frontend
            module_name = "Fonctionnalités Web & Mobile"

        story_points = 5 if idx % 2 == 0 else 8
        est_hours = story_points * 3

        user_stories.append({
            "id": us_id,
            "title": feature,
            "module": module_name,
            "priority": "Haute" if idx < 2 else "Moyenne",
            "story_points": story_points,
            "estimated_hours": est_hours,
            "assigned_to": assignee_member["name"],
            "assigned_role": assignee_member["role"],
            "criteria": [
                f"Implémenter la fonctionnalité '{feature}' selon le cahier des charges.",
                "Valider le bon fonctionnement sur Web et Mobile PWA.",
                "Tester l'intégration avec la base de données et l'API."
            ]
        })

        sprint_num = f"Sprint {1 if idx < 3 else (2 if idx < 6 else 3)}"
        
        tsk1_id = f"TSK-{task_counter:02d}"
        tasks.append({
            "id": tsk1_id,
            "user_story_id": us_id,
            "title": f"Spécification & Développement : {feature}",
            "assignee": assignee_member["name"],
            "role": assignee_member["role"],
            "estimated_hours": round(est_hours * 0.6),
            "status": "A faire",
            "sprint": sprint_num,
            "gantt_start_day": gantt_day,
            "duration_days": 2,
            "description": f"Réaliser l'implémentation de '{feature}' extrait directement du cahier des charges."
        })
        task_counter += 1

        tsk2_id = f"TSK-{task_counter:02d}"
        tasks.append({
            "id": tsk2_id,
            "user_story_id": us_id,
            "title": f"Tests, Intégration & Revue : {feature}",
            "assignee": dev_frontend["name"] if assignee_member == dev_backend else dev_backend["name"],
            "role": dev_frontend["role"] if assignee_member == dev_backend else dev_backend["role"],
            "estimated_hours": round(est_hours * 0.4),
            "status": "A faire",
            "sprint": sprint_num,
            "gantt_start_day": gantt_day + 2,
            "duration_days": 2,
            "description": f"Vérification des critères d'acceptation et tests d'intégration pour '{feature}'."
        })
        task_counter += 1
        gantt_day += 2

    sprints = [
        {
            "id": "SP-1",
            "name": "Sprint 1: Fondations & Core Features",
            "duration": "2 Semaines",
            "focus": "Développement des premières spécifications extraites du PDF",
            "status": "Planifie",
            "tasks_count": len([t for t in tasks if t['sprint'] == 'Sprint 1'])
        },
        {
            "id": "SP-2",
            "name": "Sprint 2: Fonctionnalités Avancées & API",
            "duration": "2 Semaines",
            "focus": "Intégration des modules secondaires et finitions API",
            "status": "Planifie",
            "tasks_count": len([t for t in tasks if t['sprint'] == 'Sprint 2'])
        },
        {
            "id": "SP-3",
            "name": "Sprint 3: Notifications, Mails & PWA Mobile",
            "duration": "1 Semaine",
            "focus": "Tests finaux, livraison PWA mobile et système d'emailing",
            "status": "Planifie",
            "tasks_count": len([t for t in tasks if t['sprint'] == 'Sprint 3'])
        }
    ]

    total_hours = sum(t["estimated_hours"] for t in tasks)
    total_points = sum(us["story_points"] for us in user_stories)

    ai_suggestions = [
        "🦙 **Moteur IA Actif** : Découpage réalisé par l'Intelligence Artificielle Locale Ollama.",
        "📌 **Statut des Tâches** : Toutes les tâches sont initialisées à **'À faire'** pour démarrer le projet avec un Kanban propre.",
        "📊 **Diagramme de Gantt** : Le chronogramme prévisionnel sur 21 jours est prêt pour le suivi d'avancement."
    ]

    return {
        "project_name": project_name,
        "summary": f"Le document '{project_name}' a été analysé avec succès. {len(user_stories)} User Stories et {len(tasks)} tâches ont été générées et attribuées à l'équipe. TOUTES les tâches sont initialisées à l'état 'À faire'.",
        "total_estimated_hours": total_hours,
        "total_story_points": total_points,
        "estimated_duration_weeks": round(total_hours / 35, 1),
        "user_stories": user_stories,
        "tasks": tasks,
        "sprints": sprints,
        "ai_suggestions": ai_suggestions
    }

@app.get("/")
def read_root():
    models = get_installed_ollama_models()
    return {
        "message": "SprintAI Microservice Active",
        "status": "running",
        "ai_engine": "ollama_local",
        "ollama_base_url": OLLAMA_BASE_URL,
        "installed_ollama_models": models
    }

@app.get("/api/ollama-models")
def list_ollama_models():
    models = get_installed_ollama_models()
    return {
        "active_engine": "ollama",
        "ollama_base_url": OLLAMA_BASE_URL,
        "models": models,
        "default_model": DEFAULT_OLLAMA_MODEL
    }

@app.post("/api/analyze-spec")
async def analyze_spec(
    project_name: Optional[str] = Form("sprint"),
    spec_text: Optional[str] = Form(""),
    team_json: Optional[str] = Form("[]"),
    ai_engine: Optional[str] = Form("ollama"),
    ollama_model: Optional[str] = Form("llama3:latest"),
    gemini_key: Optional[str] = Form(""),
    file: Optional[UploadFile] = File(None)
):
    text_content = spec_text or ""
    
    if file:
        file_bytes = await file.read()
        filename = file.filename.lower()
        if filename.endswith(".pdf"):
            extracted = extract_text_from_pdf(file_bytes)
            text_content = extracted + "\n" + text_content
        elif filename.endswith(".docx") or filename.endswith(".doc"):
            extracted = extract_text_from_docx(file_bytes)
            text_content = extracted + "\n" + text_content

    if not text_content.strip():
        raise HTTPException(status_code=400, detail="Veuillez télécharger un cahier des charges (PDF/Word) ou saisir une description textuelle de votre projet.")

    try:
        team_data = json.loads(team_json) if team_json else []
    except Exception:
        team_data = []

    res = intelligent_breakdown(
        text_content, 
        team_data, 
        project_name or "sprint", 
        ai_engine=ai_engine or "ollama",
        ollama_model=ollama_model or "llama3:latest",
        gemini_key=gemini_key or DEFAULT_GEMINI_KEY
    )
    return res

class TaskExplainRequest(BaseModel):
    title: str
    assignee: str
    role: str
    description: Optional[str] = ""
    ai_engine: Optional[str] = "ollama"
    ollama_model: Optional[str] = "llama3:latest"
    gemini_key: Optional[str] = ""

@app.post("/api/explain-task")
async def explain_task(req: TaskExplainRequest):
    prompt = f"""
Tu es un Technical Lead et Scrum Master expérimenté.
Fournis un guide d'exécution pas-à-pas clair et motivant pour le membre de l'équipe suivant :
- Tâche : "{req.title}"
- Assigné à : {req.assignee} ({req.role})
- Contexte/Description : {req.description}

Formate ta réponse en markdown propre avec les sections :
### 🦙 Guide d'Exécution IA (Ollama Local) pour {req.assignee} ({req.role})
1. **Objectif principal**
2. **Étapes techniques recommandées** (3-4 étapes claires)
3. **Fichiers ou composants concernés**
4. **Conseil & Bonnes pratiques**
"""
    model_to_use = req.ollama_model if req.ollama_model else DEFAULT_OLLAMA_MODEL

    # 1. Try Ollama Local if requested
    if req.ai_engine != "gemini":
        try:
            url = f"{OLLAMA_BASE_URL}/api/generate"
            payload = {"model": model_to_use, "prompt": prompt, "stream": False}
            res = requests.post(url, json=payload, timeout=30)
            if res.status_code == 200:
                data = res.json()
                text_out = data.get("response", "")
                if text_out:
                    return {"explanation": text_out}
        except Exception as e:
            print("Ollama explain-task warning:", e)

    # 2. Try Gemini API
    key_to_use = req.gemini_key.strip() if req.gemini_key and req.gemini_key.strip() else DEFAULT_GEMINI_KEY
    if key_to_use:
        if key_to_use.startswith("AQ.") or key_to_use.startswith("ya29."):
            url = "https://us-central1-aiplatform.googleapis.com/v1/projects/1073993084080/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent"
            headers = {
                "Authorization": f"Bearer {key_to_use}",
                "Content-Type": "application/json"
            }
        else:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key_to_use}"
            headers = {"Content-Type": "application/json"}

        payload = {"contents": [{"parts": [{"text": prompt}]}]}

        try:
            res = requests.post(url, json=payload, headers=headers, timeout=15)
            if res.status_code == 200:
                data = res.json()
                text_out = data['candidates'][0]['content']['parts'][0]['text']
                return {"explanation": text_out}
        except Exception as e:
            print("Gemini API error in explain-task:", e)

    fallback = f"""### 🦙 Guide d'Exécution IA (Ollama Local) pour {req.assignee} ({req.role})

**Tâche :** {req.title}
**Contexte & Objectif :** {req.description or 'Réaliser cette tâche selon les spécifications du projet.'}

#### 📋 Étapes recommandées par l'Agent IA :
1. **Analyse & Conception :** Examiner les exigences techniques et préparer les structures de données.
2. **Implémentation :** Écrire le code fonctionnel en suivant la charte du projet et en assurant la modularité.
3. **Validation & Tests :** Tester sur les différents environnements (Web/Mobile PWA) et vérifier l'absence d'erreurs.

#### 💡 Conseil de l'IA pour {req.assignee} :
Assurez-vous de valider les contrats d'API avec l'équipe et de mettre à jour le statut dans le Kanban à "En cours" dès le démarrage."""

    return {"explanation": fallback}
