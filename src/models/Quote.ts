import { Section } from "./Section";

// src/models/Quote.ts

export interface Quote {
  quote_id: string;
  author: string;
  project_id?: string; // Nullable for templates
  type: 'project' | 'template';
  title: string;
  templateVersion: number;
  itemsTableVersion: number;
  sections: Section[];
  created_at: string; // Storing dates as ISO strings for DynamoDB
  created_by: string;
  updated_at?: string; // Storing dates as ISO strings for DynamoDB
  updated_by?: string;
}

export class Quote implements Quote {
  constructor(
    public quote_id: string,
    public author: string,
    public title: string,
    public type: 'project' | 'template',
    public templateVersion: number,
    public itemsTableVersion: number,
    public created_at: string,
    public created_by: string,
    public sections: Section[] = [],
    public updated_by?: string,
    public updated_at?: string,
    public project_id?: string // Nullable for templates
  ) {}

  // Update quote title
  updateTitle(newTitle: string): void {
    this.title = newTitle;
    this.updated_at = new Date().toISOString();
  }

  // Update template version
  updateTemplateVersion(newVersion: number): void {
    this.templateVersion = newVersion;
    this.updated_at = new Date().toISOString();
  }

  // Update items table version
  updateItemsTableVersion(newVersion: number): void {
    this.itemsTableVersion = newVersion;
    this.updated_at = new Date().toISOString();
  }

  // Add section to quote
  addSection(section: Section, updatedBy: string): void {
    this.sections.push(section);
    this.updated_by = updatedBy;
    this.updated_at = new Date().toISOString();
  }

  // Get section by id
  getSection(section_id: string): Section | undefined {
    return this.sections.find((section) => section.section_id === section_id);
  }

  // Update section in quote
  updateSection(updatedSection: Section, updatedBy: string): void {
    const sectionToUpdate = this.getSection(updatedSection.section_id);
    if (sectionToUpdate) {
      sectionToUpdate.name = updatedSection.name;
      sectionToUpdate.title = updatedSection.title;
      sectionToUpdate.content = updatedSection.content;
      sectionToUpdate.index = updatedSection.index;
      this.updated_by = updatedBy;
      this.updated_at = new Date().toISOString();
    } else {
      throw new Error('Section not found');
    }
  }

  // Remove section from quote
  deleteSection(section_id: string, updatedBy: string): void {
    const sectionToDelete = this.getSection(section_id);
    if (sectionToDelete) {
      this.sections = this.sections.filter((section) => section.section_id !== section_id);
      this.updated_by = updatedBy;
      this.updated_at = new Date().toISOString();
    } else {
      throw new Error('Section not found');
    }
  }
}
