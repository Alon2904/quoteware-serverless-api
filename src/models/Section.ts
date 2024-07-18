// src/models/Section.ts
export interface Section {
    section_id: string;
    name: string;
    title: string;
    content: string;
    index: number;
  }
  
  export class Section implements Section {
    constructor(
      public section_id: string,
      public name: string,
      public title: string,
      public index: number,
      public content: string
    ) {}
  
    // Update section title
    updateTitle(newTitle: string): void {
      this.title = newTitle;
    }
  
    // Update section content
    updateContent(newContent: string): void {
      this.content = newContent;
    }
  
    // Update section name
    updateSectionName(newName: string): void {
      this.name = newName;
    }
  
    // Update section index
    updateSectionIndex(newIndex: number): void {
      this.index = newIndex;
    }
  }
  