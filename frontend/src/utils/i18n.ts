export type LanguageCode = 'fr' | 'en' | 'es';

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES_LIST: CountryOption[] = [
  { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
];

export const TRANSLATIONS = {
  fr: {
    specs: 'Cahier des Charges',
    kanban: 'Tableau Kanban',
    gantt: 'Diagramme de Gantt',
    planning: 'Planning Sprints',
    team: 'Équipe Projet',
    resources: 'Ressources & Congés',
    reports: 'Rapports Client',
    ai_insights: 'Conseils IA',
    settings: 'Paramètres',
    profile: 'Mon Profil',
    new_project: 'Nouveau Projet',
    switch_project: 'Changer de Projet',
    logout: 'Déconnexion',
    country: 'Pays',
    language: 'Langue',
    currency: 'Devise',
  },
  en: {
    specs: 'Specifications',
    kanban: 'Kanban Board',
    gantt: 'Gantt Chart',
    planning: 'Sprint Planning',
    team: 'Project Team',
    resources: 'Resources & Leaves',
    reports: 'Client Reports',
    ai_insights: 'AI Insights',
    settings: 'Settings',
    profile: 'My Profile',
    new_project: 'New Project',
    switch_project: 'Switch Project',
    logout: 'Logout',
    country: 'Country',
    language: 'Language',
    currency: 'Currency',
  },
  es: {
    specs: 'Pliego de Condiciones',
    kanban: 'Tablero Kanban',
    gantt: 'Diagrama de Gantt',
    planning: 'Planificación de Sprints',
    team: 'Equipo del Proyecto',
    resources: 'Recursos y Licencias',
    reports: 'Informes de Clientes',
    ai_insights: 'Sugerencias IA',
    settings: 'Configuración',
    profile: 'Mi Perfil',
    new_project: 'Nuevo Proyecto',
    switch_project: 'Cambiar de Proyecto',
    logout: 'Cerrar Sesión',
    country: 'País',
    language: 'Idioma',
    currency: 'Moneda',
  },
};
