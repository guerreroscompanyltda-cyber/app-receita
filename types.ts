
export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack' | 'Postre';
  time: string;
  timeValue: number;
  calories: number;
  ingredients: string[];
  instructions: string[];
  image: string;
  difficulty: 'Fácil' | 'Media' | 'Avanzada';
  dietaryRestrictions: string[];
  rating: number;
  reviews: number;
}

export interface Gift {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  type: 'PDF' | 'Video' | 'Guía' | 'Software';
  value: string;
  tag: string;
}

export interface UserProfile {
  name: string;
  age: string;
  gender: 'Masculino' | 'Femenino' | 'Otro';
  goal: Goal;
}

export type Goal = 'Perder Peso' | 'Ganar Músculo' | 'Desintoxicación' | 'Mantenerse Sano';

export interface FilterState {
  search: string;
  categories: string[];
  restrictions: string[];
  maxTime: number;
}
