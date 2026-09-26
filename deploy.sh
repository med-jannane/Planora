#!/bin/bash
echo "🚀 Déploiement de Planora (SprintAI) sur le VPS vps3645121..."

# Arrêt des conteneurs existants
docker compose down

# Construction et lancement des services en arrière-plan
docker compose up -d --build

echo "--------------------------------------------------------"
echo "✅ Déploiement terminé avec succès !"
echo "🌐 Frontend React    : http://$(hostname -I | awk '{print $1}'):80"
echo "⚙️ Backend API       : http://$(hostname -I | awk '{print $1}'):8080"
echo "🧠 Microservice IA   : http://$(hostname -I | awk '{print $1}'):8000"
echo "--------------------------------------------------------"
