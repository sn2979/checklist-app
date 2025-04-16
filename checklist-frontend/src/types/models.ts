export interface File {
    id: number;
    file_url: string;
  }
  
  export interface Item {
    id: number;
    name: string;
    files: File[];
  }
  
  export interface Category {
    id: number;
    name: string;
    items: Item[];
    files: File[];
  }
  
  export interface Checklist {
    id: number;
    name: string;
    public_url: string;
    categories: Category[];
  }
  