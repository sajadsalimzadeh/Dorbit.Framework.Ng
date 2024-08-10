import {Subject} from "rxjs";
export interface ITableConfig {
  autoIncrement?: boolean;
  key: string;
  keyGenerator?: () => any;
}

export interface IDatabase {
  open(): Promise<boolean>;
  close(): Promise<void>;

  create(name: string, creationInfo: ITableConfig): void;

  table(name: string): ITable;

  get(tableName: string, id: any): Promise<any>;

  getAll(tableName: string): Promise<any[]>;

  add(tableName: string, value: any): Promise<any>;

  addAll(tableName: string, values: any[]): Promise<any[]>;

  put(tableName: string, value: any): Promise<any>;

  putAll(tableName: string, values: any[]): Promise<any[]>;

  delete(tableName: string, id: any): Promise<void>;

  deleteAll(tableName: string, keys?: any[]): Promise<void>;

  findAll(tableName: string, query: (key: any, value: any) => boolean, count: number): Promise<any[]>;

  findAllKey(tableName: string, query: (key: any) => boolean, count: number): Promise<any[]>;
}

export interface ITableChangeEvent<T = any> {
  value?: T,
  action?: 'add' | 'add-all' | 'put' | 'put-all' | 'delete' | 'delete-all';
}

export interface ITable<T = any, TP = any> {
  $change: Subject<ITableChangeEvent<T>>;

  get(key: TP): Promise<T | null>;

  getAll(): Promise<T[]>;

  put(value: T): Promise<T>;

  add(value: T | {}): Promise<T>;

  addAll(value: T[]): Promise<T[]>;

  putAll(values: T[]): Promise<T[]>;

  delete(key: TP): Promise<void>;

  deleteAll(keys?: TP[]): Promise<void>;

  findAll(query: (key: TP, value: T) => boolean | undefined, count?: number): Promise<T[]>;

  count(query?: (key: TP, value: T) => boolean | undefined): Promise<number>;

  findAllKey(query: (key: TP) => boolean, count: number): Promise<TP[]>;
}
