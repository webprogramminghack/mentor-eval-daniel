export interface todo {
  id: string;
  title: string;
  completed: boolean;
  date:Date;
}

export interface todoReq {
  title: string;
  completed: boolean;
}

export interface queryParams {
  completed?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  nextCursor?: number;
}
