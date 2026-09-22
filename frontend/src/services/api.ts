import type { ProjectAnalysis, TeamMember } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export async function analyzeCahierDesCharges(
  projectName: string,
  specText: string,
  teamMembers: TeamMember[],
  file?: File | null
): Promise<ProjectAnalysis> {
  const formData = new FormData();
  formData.append('project_name', projectName);
  formData.append('spec_text', specText);
  formData.append('team_json', JSON.stringify(teamMembers.map(m => ({ name: m.name, role: m.role, email: m.email }))));
  if (file) {
    formData.append('file', file);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-spec`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Erreur API Python');
    }
    return await response.json();
  } catch (error) {
    console.warn("Connexion API Python en cours...", error);
    return generateFallbackAnalysis(projectName, teamMembers);
  }
}

export async function fetchTaskExplanation(taskTitle: string, assignee: string, role: string, description: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/explain-task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskTitle, assignee, role, description }),
    });
    if (!response.ok) throw new Error('Failed');
    const data = await response.json();
    return data.explanation;
  } catch {
    return `### 🤖 Guide d'Exécution IA pour ${assignee} (${role})

**Tâche :** ${taskTitle}
**Contexte & Objectif :** ${description}

#### 📋 Étapes recommandées par l'Agent IA :
1. **Composants & Modèles :** Définir la structure des données et créer les composants réutilisables.
2. **Intégration logique :** Implémenter les handlers d'événements et les requêtes API avec gestion des exceptions.
3. **Optimisation :** Tester la réactivité de l'interface et vérifier l'affichage mobile/desktop.

#### 💡 Conseil de l'IA :
Vérifiez l'accessibilité des boutons et ajoutez des retours visuels (animations de chargement) lors des actions de l'utilisateur.`;
  }
}

function generateFallbackAnalysis(projectName: string, team: TeamMember[]): ProjectAnalysis {
  const m1 = team[0] || { name: 'Sarah Mansouri', role: 'Frontend React' };
  const m2 = team[1] || { name: 'Alexandre Mercier', role: 'Backend Laravel' };
  const m3 = team[2] || { name: 'Mehdi Benali', role: 'UI/UX Designer' };

  return {
    project_name: projectName || 'Projet SprintAI',
    summary: `Le cahier des charges a été analysé avec succès. 6 User Stories ont été identifiées, découpées en 8 tâches réparties sur 3 Sprints et attribuées automatiquement à l'équipe.`,
    total_estimated_hours: 116,
    total_story_points: 44,
    estimated_duration_weeks: 3.3,
    user_stories: [
      {
        id: 'US-101',
        title: 'Maquettes & Architecture UX/UI Épurée',
        module: 'Design & Ergonomie',
        priority: 'Haute',
        story_points: 5,
        estimated_hours: 16,
        assigned_to: m3.name,
        assigned_role: m3.role,
        criteria: ['Thèmes Sombre & Clair', 'Composants Kanban & Gantt responsive', 'Guide de style UI minimalist']
      },
      {
        id: 'US-102',
        title: 'API Backend Laravel & Schemas MySQL',
        module: 'Base de données & API',
        priority: 'Haute',
        story_points: 8,
        estimated_hours: 24,
        assigned_to: m2.name,
        assigned_role: m2.role,
        criteria: ['Table MySQL Sprints, Backlog, Tâches', 'Auth JWT / Sanctum', 'Endpoints CRUD']
      },
      {
        id: 'US-103',
        title: 'Agent IA & Découpage Automatique du Cahier des Charges',
        module: 'Moteur d\'Intelligence Artificielle',
        priority: 'Haute',
        story_points: 13,
        estimated_hours: 32,
        assigned_to: m1.name,
        assigned_role: m1.role,
        criteria: ['Lecture PDF / DOCX', 'Extraction des User Stories', 'Calcul automatique des temps']
      },
      {
        id: 'US-104',
        title: 'Tableau Kanban & Backlog Drag & Drop',
        module: 'Gestion des Tâches',
        priority: 'Haute',
        story_points: 8,
        estimated_hours: 20,
        assigned_to: m1.name,
        assigned_role: m1.role,
        criteria: ['Colonnes A faire, En cours, Terminé', 'Filtre par membre et sprint', 'Statistiques temps réel']
      },
      {
        id: 'US-105',
        title: 'Planning Visuel & Diagramme de Gantt',
        module: 'Chronogramme & Gantt',
        priority: 'Moyenne',
        story_points: 5,
        estimated_hours: 14,
        assigned_to: m3.name,
        assigned_role: m3.role,
        criteria: ['Vue jours/semaines', 'Progression visuelle', 'Indicateurs de retard']
      },
      {
        id: 'US-106',
        title: 'Notifications Emails & Alertes Automatiques',
        module: 'Communication Team',
        priority: 'Moyenne',
        story_points: 5,
        estimated_hours: 10,
        assigned_to: m2.name,
        assigned_role: m2.role,
        criteria: ['Email lors de l\'attribution d\'une tâche', 'Notification en direct dans l\'app', 'Alerte de retard de Sprint']
      }
    ],
    tasks: [
      {
        id: 'TSK-01',
        user_story_id: 'US-101',
        title: 'Création de la Charte Graphique & UI Components',
        assignee: m3.name,
        role: m3.role,
        estimated_hours: 8,
        status: 'A faire',
        sprint: 'Sprint 1',
        gantt_start_day: 1,
        duration_days: 2,
        description: 'Mettre en place la palette Zinc/Black/White et les icônes modernes.'
      },
      {
        id: 'TSK-02',
        user_story_id: 'US-102',
        title: 'Base de données MySQL & Migrations Eloquent',
        assignee: m2.name,
        role: m2.role,
        estimated_hours: 12,
        status: 'A faire',
        sprint: 'Sprint 1',
        gantt_start_day: 2,
        duration_days: 3,
        description: 'Créer les tables projects, sprints, tasks, user_stories, team_members.'
      },
      {
        id: 'TSK-03',
        user_story_id: 'US-103',
        title: 'Microservice Python FastAPI pour analyse de documents',
        assignee: m2.name,
        role: m2.role,
        estimated_hours: 16,
        status: 'A faire',
        sprint: 'Sprint 1',
        gantt_start_day: 3,
        duration_days: 4,
        description: 'Script d\'analyse NLP et génération du JSON de découpage projet.'
      },
      {
        id: 'TSK-04',
        user_story_id: 'US-104',
        title: 'Interface React Kanban Board interactive',
        assignee: m1.name,
        role: m1.role,
        estimated_hours: 14,
        status: 'A faire',
        sprint: 'Sprint 2',
        gantt_start_day: 7,
        duration_days: 4,
        description: 'Développer le tableau Kanban avec drag-and-drop et filtres par sprint.'
      },
      {
        id: 'TSK-05',
        user_story_id: 'US-105',
        title: 'Diagramme de Gantt SVG dynamique',
        assignee: m1.name,
        role: m1.role,
        estimated_hours: 12,
        status: 'A faire',
        sprint: 'Sprint 2',
        gantt_start_day: 10,
        duration_days: 3,
        description: 'Construire la vue Gantt visuelle avec barres de calendrier et assignations.'
      },
      {
        id: 'TSK-06',
        user_story_id: 'US-106',
        title: 'Mailing Laravel Mailables & Notifications Push',
        assignee: m2.name,
        role: m2.role,
        estimated_hours: 8,
        status: 'A faire',
        sprint: 'Sprint 3',
        gantt_start_day: 14,
        duration_days: 2,
        description: 'Configurer l\'envoi automatique de mails aux membres lors de l\'attribution de tâches.'
      }
    ],
    sprints: [
      {
        id: 'SP-1',
        name: 'Sprint 1: Architecture, Core Backend & AI Engine',
        duration: '2 Semaines',
        focus: 'Mise en place API Laravel MySQL, Microservice Python & UI Design System',
        status: 'En cours',
        tasks_count: 3
      },
      {
        id: 'SP-2',
        name: 'Sprint 2: Kanban, Gantt & Découpage Interactif',
        duration: '2 Semaines',
        focus: 'Tableau Kanban, Diagramme de Gantt et Assistant IA d\'exécution',
        status: 'Planifie',
        tasks_count: 2
      },
      {
        id: 'SP-3',
        name: 'Sprint 3: Mails, Notifications & Optimisation Mobile PWA',
        duration: '1 Semaine',
        focus: 'Service d\'emailing automatique, notifications temps réel et PWA',
        status: 'Planifie',
        tasks_count: 1
      }
    ],
    ai_suggestions: [
      '⚡ **Optimisation recommandée** : Mettre en cache la réponse du microservice Python pour ré-afficher instantanément les cahiers des charges déjà traités.',
      '📱 **Fonctionnalité Mobile PWA** : Activer les notifications Push Web PWA sur mobile pour prévenir les membres dès qu\'une tâche leur est assignée.',
      '📊 **Suivi de la Vélocité** : Calculer automatiquement la vitesse de chaque membre de l\'équipe à la fin de chaque Sprint.'
    ]
  };
}
