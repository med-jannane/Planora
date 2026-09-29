import type { TeamMember } from '../types';

export const PREDEFINED_USERS: TeamMember[] = [
  {
    id: '1',
    user_code: 'USR-8942-PK',
    name: 'Sarah Mansouri',
    role: 'Développeuse Frontend React',
    functionalities: ['Développeur Frontend React / Web', 'UI/UX Design & Ergonomie'],
    email: 'sarah@projet.com',
    avatar: 'SM'
  },
  {
    id: '2',
    user_code: 'USR-7391-PK',
    name: 'Alexandre Mercier',
    role: 'Développeur Backend & Data',
    functionalities: ['Développeur Backend API', 'Base de Données & Modélisation'],
    email: 'alexandre@projet.com',
    avatar: 'AM'
  },
  {
    id: '3',
    user_code: 'USR-6102-PK',
    name: 'Mehdi Benali',
    role: 'UI/UX Designer & Mobile',
    functionalities: ['UI/UX Design & Ergonomie', 'Mobile App Native'],
    email: 'mehdi@projet.com',
    avatar: 'MB'
  },
];

export function registerUserInList(user: { id?: string; user_code?: string; name: string; email: string; functionalities?: string[]; avatar?: string; role?: string }) {
  try {
    if (!user.user_code) return;
    const savedListStr = localStorage.getItem('sprintai_users_list');
    let usersList: any[] = savedListStr ? JSON.parse(savedListStr) : [];
    
    // Add default users if list is empty
    if (usersList.length === 0) {
      usersList = [...PREDEFINED_USERS];
    }

    const targetCode = user.user_code.toUpperCase();
    const index = usersList.findIndex(u => u.user_code?.toUpperCase() === targetCode);
    if (index >= 0) {
      usersList[index] = { ...usersList[index], ...user };
    } else {
      usersList.push(user);
    }

    localStorage.setItem('sprintai_users_list', JSON.stringify(usersList));
  } catch (err) {
    console.error('Error saving user to registry:', err);
  }
}

export function findUserByCode(code: string): TeamMember | null {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) return null;

  // 1. Search in localStorage users list
  try {
    const savedListStr = localStorage.getItem('sprintai_users_list');
    if (savedListStr) {
      const usersList: any[] = JSON.parse(savedListStr);
      const match = usersList.find(u => u.user_code?.toUpperCase() === cleanCode);
      if (match) {
        return {
          id: match.id || Date.now().toString(),
          user_code: match.user_code,
          name: match.name,
          role: match.role || (match.functionalities?.[0] ? match.functionalities[0].replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim() : 'Développeur Multi-Compétences'),
          functionalities: (match.functionalities || []).map((f: string) => f.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()),
          email: match.email,
          avatar: match.avatar && !/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu.test(match.avatar) 
            ? match.avatar 
            : match.name.split(' ').map((n: string) => n.charAt(0)).join('').substring(0, 2).toUpperCase()
        };
      }
    }

    // 2. Search in current logged in user
    const savedUserStr = localStorage.getItem('sprintai_user');
    if (savedUserStr) {
      const current = JSON.parse(savedUserStr);
      if (current.user_code?.toUpperCase() === cleanCode) {
        return {
          id: current.id || Date.now().toString(),
          user_code: current.user_code,
          name: current.name,
          role: current.role || (current.functionalities?.[0] ? current.functionalities[0].replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim() : 'Développeur Multi-Compétences'),
          functionalities: (current.functionalities || []).map((f: string) => f.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()),
          email: current.email,
          avatar: current.avatar && !/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu.test(current.avatar) 
            ? current.avatar 
            : current.name.split(' ').map((n: string) => n.charAt(0)).join('').substring(0, 2).toUpperCase()
        };
      }
    }
  } catch (err) {
    console.error('Error searching user registry:', err);
  }

  // 3. Search in hardcoded predefined users list
  const predefined = PREDEFINED_USERS.find(u => u.user_code?.toUpperCase() === cleanCode);
  if (predefined) {
    return predefined;
  }

  // 4. Dynamic Fallback for hosted / multi-device environment:
  // If user code is not found in local browser cache (e.g. registered on another device),
  // construct a valid member profile from the code so addition never fails!
  const generatedMember: TeamMember = {
    id: `usr_${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    user_code: cleanCode,
    name: `Collaborateur ${cleanCode}`,
    role: 'Développeur Multi-Compétences',
    functionalities: ['Développeur Frontend React', 'Développeur Backend & API'],
    email: `${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '')}@projet.com`,
    avatar: cleanCode.substring(0, 2).toUpperCase()
  };

  registerUserInList(generatedMember);
  return generatedMember;
}
