import { IQuote } from "../interfaces/IQuote";
import { currentISODate } from "../utils/dateUtils";
import { Section } from "./Section";

// src/models/Quote.ts
export class Quote implements IQuote {
  constructor(
    private _quoteId: string,
    private _author: string,
    private _name: string,
    private _title: string,
    private _type: 'project' | 'template',
    private _templateVersion: number,
    private _itemsTableVersion: number,
    private _createdAt: string,
    private _createdBy: string,
    private _sections: Section[],
    private _updatedBy?: string,
    private _updatedAt?: string,
    private _projectId?: string
  ) {}

  toItem(): Record<string, any> {
    return {
      quoteId: this._quoteId,
      author: this._author,
      name: this._name,
      title: this._title,
      type: this._type,
      templateVersion: this._templateVersion,
      itemsTableVersion: this._itemsTableVersion,
      createdAt: this._createdAt,
      createdBy: this._createdBy,
      updatedBy: this._updatedBy,
      updatedAt: this._updatedAt,
      projectId: this._projectId,
      sections: this._sections.map(section => section.toItem()),
    };
  }

  // Getters and Setters
  get quoteId(): string {
    return this._quoteId;
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

  get createdAt(): string {
    return this._createdAt;
  }

  get createdBy(): string {
    return this._createdBy;
  }

  get updatedBy(): string | undefined {
    return this._updatedBy;
  }

  get updatedAt(): string | undefined {
    return this._updatedAt;
  }

  get projectId(): string | undefined {
    return this._projectId;
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

  set updatedBy(updatedBy: string | undefined) {
    this._updatedBy = updatedBy;
  }

  set updatedAt(updatedAt: string | undefined) {
    this._updatedAt = updatedAt;
  }

  set projectId(projectId: string | undefined) {
    this._projectId = projectId;
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
    this.updatedBy = updatedBy;
    this.updatedAt = currentISODate();
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
    this.updatedBy = updatedBy;
    this.updatedAt = currentISODate();
  }

  /**
   * Retrieves a section from the quote by its ID.
   * @param sectionId - The ID of the section to retrieve.
   * @returns The section with the specified ID, or undefined if not found.
   */
  getSection(sectionId: string): Section | undefined {
    return this._sections.find((section) => section.id === sectionId);
  }

  updateSection(updatedSection: Section, updatedBy: string): void {
    const sectionToUpdate = this.getSection(updatedSection.id);
    if (sectionToUpdate) {
      sectionToUpdate.name = updatedSection.name;
      sectionToUpdate.title = updatedSection.title;
      sectionToUpdate.content = updatedSection.content;
      sectionToUpdate.index = updatedSection.index;
      this.updatedBy = updatedBy;
      this.updatedAt = currentISODate();
    } else {
      throw new Error('Section not found');
    }
  }

  deleteSection(sectionId: string, updatedBy: string): void {
    const sectionToDelete = this.getSection(sectionId);
    if (sectionToDelete) {
      this._sections = this._sections.filter((section) => section.id !== sectionId);
      this.updatedBy = updatedBy;
      this.updatedAt = currentISODate();
    } else {
      throw new Error('Section not found');
    }
  }
}
