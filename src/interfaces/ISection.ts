// src/models/Section.ts
export interface ISection {
    id: string;
    author: string;
    quote_id?: string;
    type: 'project' | 'template';
    name: string;
    title: string;
    content: string;
    index: number;
    created_at: string;
    edited_at?: string;
  }