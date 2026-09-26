export interface TeamMember {
  id: string;
  user_code?: string;
  name: string;
  role: string;
  functionalities?: string[];
  email: string;
  avatar: string;
}

export interface UserProfile {
  id: string;
  user_code: string; // Clef primaire / code identité (ex: USR-8942-PK)
  name: string;
  email: string;
  functionalities: string[];
  avatar: string;
  isManager?: boolean;
  country?: string;
  language?: 'fr' | 'en' | 'es';
}

export interface ProjectRecord {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  analysis: ProjectAnalysis | null;
  team: TeamMember[];
}

export interface UserStory {
  id: string;
  title: string;
  module: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  story_points: number;
  estimated_hours: number;
  assigned_to: string;
  assigned_role: string;
  criteria: string[];
}

export interface Task {
  id: string;
  user_story_id: string;
  title: string;
  assignee: string;
  role: string;
  estimated_hours: number;
  status: 'A faire' | 'En cours' | 'En revision' | 'Termine';
  sprint: string;
  gantt_start_day: number;
  duration_days: number;
  description: string;
}

export interface Sprint {
  id: string;
  name: string;
  duration: string;
  focus: string;
  status: 'En cours' | 'Planifie' | 'Termine';
  tasks_count: number;
}

export interface ProjectAnalysis {
  project_name: string;
  summary: string;
  total_estimated_hours: number;
  total_story_points: number;
  estimated_duration_weeks: number;
  user_stories: UserStory[];
  tasks: Task[];
  sprints: Sprint[];
  ai_suggestions: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  recipient: string;
  timestamp: string;
  type: 'assignment' | 'sprint' | 'delay' | 'ai';
  read: boolean;
}

