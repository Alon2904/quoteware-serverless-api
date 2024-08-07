// src/models/Section.ts
export interface ISection {
    id: string;
    author: string;
    quoteId?: string;
    type: 'project' | 'template';
    name: string;
    title: string;
    content: string;
    index: number;
    createdAt: string;
    updatedAt?: string;
  }