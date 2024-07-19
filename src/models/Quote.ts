import { IQuote } from "../interfaces/IQuote";
import { currentISODate } from "../utils/dateUtils";
import { Section } from "./Section";

// src/models/Quote.ts

export class Quote implements IQuote {
  private _quote_id: string;
  private _author: string;
  private _name: string;
  private _title: string;
  private _type: 'project' | 'template';
  private _templateVersion: number;
  private _itemsTableVersion: number;
  private _created_at: string;
  private _created_by: string;
  private _updated_by?: string;
  private _updated_at?: string;
  private _project_id?: string;

  constructor(
    quote_id: string,
    author: string,
    name: string,
    title: string,
    type: 'project' | 'template',
    templateVersion: number,
    itemsTableVersion: number,
    created_at: string,
    created_by: string,
    updated_by?: string,
    updated_at?: string,
    project_id?: string
  ) {
    this._quote_id = quote_id;
    this._author = author;
    this._name = name;
    this._title = title;
    this._type = type;
    this._templateVersion = templateVersion;
    this._itemsTableVersion = itemsTableVersion;
    this._created_at = created_at;
    this._created_by = created_by;
    this._updated_by = updated_by;
    this._updated_at = updated_at;
    this._project_id = project_id;
  }

  // Getters
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

  // Setters
 

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


  // Update methods
  updateName(newName: string, updatesUserName: string): void {
    this.name = newName;
    this.updated_at = currentISODate();
    this.updated_by = updatesUserName;

  }

  updateTitle(newTitle: string, updatesUserName: string): void {
    this.title = newTitle;
    this.updated_at =  currentISODate();
    this.updated_by = updatesUserName
  }

  updateTemplateVersion(newVersion: number, updatesUserName: string): void {
    this.templateVersion = newVersion;
    this.updated_at = currentISODate();
    this.updated_by = updatesUserName;

  }

  updateItemsTableVersion(newVersion: number, updatesUserName: string): void {
    this.itemsTableVersion = newVersion;
    this.updated_at = new Date().toISOString();
    this.updated_by = updatesUserName;
  }








}
