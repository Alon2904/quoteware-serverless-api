// src/models/Project.ts
 import {IProject } from '../interfaces/IProject'





  export class Project implements IProject {

    private _id: string;
    private _title: string;
    private _lastUpdated: string;

  
    constructor(
      id: string,
      title: string,
      lastUpdated: string = new Date().toISOString() // Convert Date to ISO string
    ) {
        this._id = id;
        this._title = title;
        this._lastUpdated = lastUpdated;
    }
  
  // Getters
  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get lastUpdated(): string {
    return this._lastUpdated;
  }

  // Setters
  set id(id: string) {
    this._id = id;
  }

  set title(title: string) {
    this._title = title;
  }

  set lastUpdated(lastUpdated: string) {
    this._lastUpdated = lastUpdated;
  }

}