export interface IPaginate {
  page?: number;
  page_size?: number;
}

export interface ISort<T extends string> {
  sort_by?: T;
  sort_order?: 'asc' | 'desc';
}

export interface IPaginateResult<T extends object> {
  results: T[];
  total: number;
}

export interface IResultSuccess {
  result: 'success'
}

export interface IOTPQuery {
  otp: string;
}

export interface ISoftDeleteModel {
  is_deleted: boolean;
  updated_at: string;
}

export interface ITimingModel {
  created_at: string;
  updated_at: string;
}