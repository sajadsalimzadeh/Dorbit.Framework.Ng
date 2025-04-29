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

    getAll(tableName: string, query?: IDBValidKey | IDBKeyRange | null | undefined, count?: number | undefined): Promise<any[]>;

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

export interface ITable<TEntity = any, TKey = any> {
    $change: Subject<ITableChangeEvent<TEntity>>;

    get(key: TKey): Promise<TEntity | null>;

    getWithCache(key: TKey): Promise<TEntity | null>;

    getAll(query?: IDBValidKey | IDBKeyRange | null | undefined, count?: number | undefined): Promise<TEntity[]>;

    put(value: TEntity): Promise<TKey>;

    add(value: TEntity | {}): Promise<TKey>;

    addAll(value: TEntity[]): Promise<TKey[]>;

    putAll(values: TEntity[]): Promise<TKey[]>;

    delete(key: TKey): Promise<void>;

    deleteAll(keys?: TKey[]): Promise<void>;

    findAll(query: (key: TKey, value: TEntity) => boolean | undefined, count?: number): Promise<TEntity[]>;

    count(query?: (key: TKey, value: TEntity) => boolean | undefined): Promise<number>;

    findAllKey(query: (key: TKey) => boolean, count: number): Promise<TKey[]>;
}
