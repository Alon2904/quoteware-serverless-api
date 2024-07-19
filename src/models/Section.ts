import { ISection } from "../interfaces/ISection";

// src/models/Section.ts

export class Section implements ISection {
  private _id: string;
  private _author: string;
  private _type: 'project' | 'template';
  private _name: string;
  private _title: string;
  private _content: string;
  private _index: number;
  private _quote_id?: string;

  constructor(
    id: string,
    author: string,
    type: 'project' | 'template',
    name: string,
    title: string,
    content: string,
    index: number,
    quote_id?: string // Optional parameter
  ) {
    this._id = id;
    this._author = author;
    this._type = type;
    this._name = name;
    this._title = title;
    this._content = content;
    this._index = index;
    this._quote_id = quote_id;
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

  // Setters
  set id(id: string) {
    this._id = id;
  }

  set author(author: string) {
    this._author = author;
  }

  set type(type: 'project' | 'template') {
    this._type = type;
  }

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
}
