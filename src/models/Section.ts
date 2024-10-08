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
  private _createdAt: string;
  private _updatedAt: string;
  private _quoteId?: string;

  constructor(
    id: string,
    author: string,
    type: 'project' | 'template',
    name: string,
    title: string,
    content: string,
    index: number,
    updatedAt?: string,
    quoteId?: string
  ) {
    this._id = id;
    this._author = author;
    this._type = type;
    this._name = name;
    this._title = title;
    this._content = content;
    this._index = index;
    this._quoteId = quoteId;
    this._createdAt = currentISODate();
    this._updatedAt = updatedAt || this._createdAt;
  }

  toItem(): Record<string, any> {
    return {
      id: this._id,
      author: this._author,
      type: this._type,
      name: this._name,
      title: this._title,
      content: this._content,
      index: this._index,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      quoteId: this._quoteId,
    };
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

  get quoteId(): string | undefined {
    return this._quoteId;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
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

  set quoteId(quoteId: string | undefined) {
    this._quoteId = quoteId;
  }

  set createdAt(createdAt: string) {
    this._createdAt = createdAt;
  }

  set updatedAt(updatedAt: string) {
    this._updatedAt = updatedAt;
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
        createdAt: this._createdAt,
        updatedAt: this._updatedAt,
        quoteId: this._quoteId,
      };
    }


    // Static method to create a Section instance from a plain object
    static fromItem(item: any): Section {
      return new Section(
        item.id,
        item.author,
        item.type,
        item.name,
        item.title,
        item.content,
        item.index,
        item.updatedAt,
        item.quoteId
      );
    }
}
