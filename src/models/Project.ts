// src/models/Project.ts
 import {IProject } from '../interfaces/IProject'





  export class Project implements IProject {  
 
  constructor(
    private _projectId: string,
    private _title: string,
    private _lastQuoteId?: string, // will always have a value. either of last updated or default template
    private _updatedAt?: string
  ) {}
  
  // Getters
  get projectId(): string {
    return this._projectId;
  }

  get title(): string {
    return this._title;
  }
  get lastQuoteId(): string | undefined {
    return this._lastQuoteId;
  }

  get updatedAt(): string | undefined {
    return this._updatedAt;
  }

 

  // Setters
  set projectId(projectId: string) {
    this._projectId = projectId;
  }

  set title(title: string) {
    this._title = title;
  }

  set updatedAt(updatedAt: string) {
    this._updatedAt = updatedAt;
  }

  set lastQuoteId(lastQuoteId: string) {
    this._lastQuoteId = lastQuoteId;
  }

  toItem(): Record<string, any> {
    return {
      projectId: this._projectId,
      title: this._title,
      lastQuoteId: this._lastQuoteId,
      updatedAt: this._updatedAt,
    };
  }

  static fromItem(item: any): Project {
    return new Project(
      item.projectId,
      item.title,
      item.lastQuoteId,
      item.updatedAt
    );
  }
  

}