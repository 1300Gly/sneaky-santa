export type Language = 'nl' | 'en';

export interface Translations {
  [key: string]: string | Translations;
}

