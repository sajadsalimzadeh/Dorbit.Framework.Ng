import {Subject} from "rxjs";

export interface ITableConfig {
  autoIncrement?: boolean;
  key: string;
  keyGenerator?: () => any;
}

export interface IDatabase {
  open(): Promise<boolean>;

  create(name: string, creationInfo: ITableConfig): void;

  table(name: string): ITable;

  get(tableName: string, id: any): Promise<any>;

  getAll(tableName: string): Promise<any[]>;

  set(tableName: string, value: object): Promise<any>;

  putBulk(tableName: string, values: object[]): Promise<any[]>;

  delete(tableName: string, id: any): Promise<void>;

  deleteAll(tableName: string): Promise<void>;

  findAll(tableName: string, query: (key: any, value: any) => boolean, count: number): Promise<any[]>;

  findAllKey(tableName: string, query: (key: any) => boolean, count: number): Promise<any[]>;
}

export interface ITable<T = any, TP = any> {
  onSet: Subject<{ key: string, value: T }>;

  get(key: TP): Promise<T | null>;

  getAll(): Promise<T[]>;

  set(value: T): Promise<T>;

  add(value: T): Promise<T>;

  putBulk(values: T[]): Promise<T[]>;

  delete(key: TP): Promise<void>;

  deleteAll(): Promise<void>;

  findAll(query: (key: any, value: any) => boolean, count: number): Promise<any[]>;

  findAllKey(query: (key: TP) => boolean, count: number): Promise<TP[]>;
}
