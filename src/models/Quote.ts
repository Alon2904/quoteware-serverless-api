import { IQuote } from "../interfaces/IQuote";
import { currentISODate } from "../utils/dateUtils";
import { Section } from "./Section";

// src/models/Quote.ts
export class Quote implements IQuote {
  constructor(
    private _quote_id: string,
    private _author: string,
    private _name: string,
    private _title: string,
    private _type: 'project' | 'template',
    private _templateVersion: number,
    private _itemsTableVersion: number,
    private _created_at: string,
    private _created_by: string,
    private _sections: Section[],
    private _updated_by?: string,
    private _updated_at?: string,
    private _project_id?: string
  ) {}

  toItem(): Record<string, any> {
    return {
      quote_id: this._quote_id,
      author: this._author,
      name: this._name,
      title: this._title,
      type: this._type,
      templateVersion: this._templateVersion,
      itemsTableVersion: this._itemsTableVersion,
      created_at: this._created_at,
      created_by: this._created_by,
      updated_by: this._updated_by,
      updated_at: this._updated_at,
      project_id: this._project_id,
      sections: this._sections.map(section => section.toItem()),
    };
  }

  // Getters and Setters
  get quote_id(): string {
    return this._quote_id;
  }

  get author(): string {
    return this._author;
  }

  get name(): string {
    return this._name;
  }

  get title(): string {
    return this._title;
  }

  get type(): 'project' | 'template' {
    return this._type;
  }

  get templateVersion(): number {
    return this._templateVersion;
  }

  get itemsTableVersion(): number {
    return this._itemsTableVersion;
  }

  get created_at(): string {
    return this._created_at;
  }

  get created_by(): string {
    return this._created_by;
  }

  get updated_by(): string | undefined {
    return this._updated_by;
  }

  get updated_at(): string | undefined {
    return this._updated_at;
  }

  get project_id(): string | undefined {
    return this._project_id;
  }

  get sections(): Section[] {
    return this._sections;
  }

  set name(name: string) {
    this._name = name;
  }

  set title(title: string) {
    this._title = title;
  }

  set templateVersion(templateVersion: number) {
    this._templateVersion = templateVersion;
  }

  set itemsTableVersion(itemsTableVersion: number) {
    this._itemsTableVersion = itemsTableVersion;
  }

  set updated_by(updatedBy: string | undefined) {
    this._updated_by = updatedBy;
  }

  set updated_at(updatedAt: string | undefined) {
    this._updated_at = updatedAt;
  }

  set project_id(projectId: string | undefined) {
    this._project_id = projectId;
  }

  set sections(sections: Section[]) {
    this._sections = sections;
  }

  

  // Update methods
  /**
   * Updates the properties of the quote.
   * @param name - The name of the quote.
   * @param title - The title of the quote.
   * @param templateVersion - The version of the template.
   * @param itemsTableVersion - The version of the items table.
   * @param updatedBy - The name of the user who updated the quote.
   */
  updateQuote(
    name: string,
    title: string,
    templateVersion: number,
    itemsTableVersion: number,
    updatedBy: string
  ): void {
    this.name = name;
    this.title = title;
    this.templateVersion = templateVersion;
    this.itemsTableVersion = itemsTableVersion;
    this.updated_by = updatedBy;
    this.updated_at = currentISODate();
  }

  // Section management methods
  /**
   * Adds a section to the quote.
   * 
   * @param section - The section to be added.
   * @param updatedBy - The name of the user who updated the quote.
   */
  addSection(section: Section, updatedBy: string): void {
    this._sections.push(section);
    this.updated_by = updatedBy;
    this.updated_at = currentISODate();
  }

  /**
   * Retrieves a section from the quote by its ID.
   * @param section_id - The ID of the section to retrieve.
   * @returns The section with the specified ID, or undefined if not found.
   */
  getSection(section_id: string): Section | undefined {
    return this._sections.find((section) => section.id === section_id);
  }

  updateSection(updatedSection: Section, updatedBy: string): void {
    const sectionToUpdate = this.getSection(updatedSection.id);
    if (sectionToUpdate) {
      sectionToUpdate.name = updatedSection.name;
      sectionToUpdate.title = updatedSection.title;
      sectionToUpdate.content = updatedSection.content;
      sectionToUpdate.index = updatedSection.index;
      this.updated_by = updatedBy;
      this.updated_at = currentISODate();
    } else {
      throw new Error('Section not found');
    }
  }

  deleteSection(section_id: string, updatedBy: string): void {
    const sectionToDelete = this.getSection(section_id);
    if (sectionToDelete) {
      this._sections = this._sections.filter((section) => section.id !== section_id);
      this.updated_by = updatedBy;
      this.updated_at = currentISODate();
    } else {
      throw new Error('Section not found');
    }
  }
}
