// src/models/Project.ts
 import {IProject } from '../interfaces/IProject'





  export class Project implements IProject {  
 
  constructor(
    private _id: string,
    private _title: string,
    private _updatedAt?: string
  ) {}
  
  // Getters
  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get updatedAt(): string | undefined {
    return this._updatedAt;
  }

  // Setters
  set id(id: string) {
    this._id = id;
  }

  set title(title: string) {
    this._title = title;
  }

  set updatedAt(updatedAt: string) {
    this._updatedAt = updatedAt;
  }

}