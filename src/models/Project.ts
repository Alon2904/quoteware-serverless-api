// src/models/Project.ts
export interface Project {
    id: string;
    title: string;
    lastUpdated: string; // Storing dates as ISO strings for DynamoDB
  }
  
  export class Project implements Project {
    



    constructor(
      public id: string,
      public title: string,
      public lastUpdated: string = new Date().toISOString() // Convert Date to ISO string
    ) {
        this.id = id;
        this.title = title;
        this.lastUpdated = lastUpdated;
    }
  
    // Update the project title
    updateTitle(newTitle: string): void {
      this.title = newTitle;
      this.lastUpdated = new Date().toISOString();
    }
  }
  