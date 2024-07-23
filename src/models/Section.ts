import { ISection } from "../interfaces/ISection";
import { currentISODate } from "../utils/dateUtils";

// src/models/Section.ts

export class Section implements ISection {
  private _id: string;
  private _author: string;
  private _type: 'project' | 'template';
  private _name: string;
  private _title: string;
  private _content: string;
  private _index: number;
  private _created_at: string;
  private _edited_at: string;
  private _quote_id?: string;

  constructor(
    id: string,
    author: string,
    type: 'project' | 'template',
    name: string,
    title: string,
    content: string,
    index: number,
    edited_at?: string,
    quote_id?: string
  ) {
    this._id = id;
    this._author = author;
    this._type = type;
    this._name = name;
    this._title = title;
    this._content = content;
    this._index = index;
    this._quote_id = quote_id;
    this._created_at = currentISODate();
    this._edited_at = edited_at || this._created_at;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get author(): string {
    return this._author;
  }

  get type(): 'project' | 'template' {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get index(): number {
    return this._index;
  }

  get quote_id(): string | undefined {
    return this._quote_id;
  }

  get created_at(): string {
    return this._created_at;
  }

  get edited_at(): string {
    return this._edited_at;
  }

  // Setters
  set name(name: string) {
    this._name = name;
  }

  set title(title: string) {
    this._title = title;
  }

  set content(content: string) {
    this._content = content;
  }

  set index(index: number) {
    this._index = index;
  }

  set quote_id(quoteId: string | undefined) {
    this._quote_id = quoteId;
  }

  set created_at(created_at: string) {
    this._created_at = created_at;
  }

  set edited_at(edited_at: string) {
    this._edited_at = edited_at;
  }

  // Method to convert to plain object
    toObject(): ISection {
      return {
        id: this._id,
        author: this._author,
        type: this._type,
        name: this._name,
        title: this._title,
        content: this._content,
        index: this._index,
        created_at: this._created_at,
        edited_at: this._edited_at,
        quote_id: this._quote_id,
      };
    }
}
