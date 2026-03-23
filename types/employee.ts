export interface Employee {
  id: string;
  name: string;
  job: string;
  location: string;
  category: string;
  subcategory: string;
  contact: string;
  remarks: string;
}

export interface FilterState {
  search: string;
  category: string ;
  subcategory: string;
  location: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}