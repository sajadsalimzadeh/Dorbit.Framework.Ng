import {IDatabase, ITable, ITableChangeEvent, ITableConfig} from "./database";
import {Subject} from "rxjs";

export class IndexedDB implements IDatabase {
  private db!: IDBDatabase;
  private tables: { [name: string]: ITableConfig } = {};

  constructor(private options: { name: string, version: number }) {

  }

  open() {
    if (this.db) return Promise.resolve(true);
    return new Promise<boolean>((resolve, reject) => {
      const request = indexedDB.open(this.options.name, this.options.version);
      request.onupgradeneeded = () => {
        this.db = request.result;
        for (const name in this.tables) {
          const config = this.tables[name];
          if (!this.db.objectStoreNames.contains(name)) {
            this.db.createObjectStore(name, {
              autoIncrement: config.autoIncrement,
              keyPath: config.key
            });
          }
        }
      }
      request.onerror = (e) => {
        reject(request.error);
      }
      request.onsuccess = (e: any) => {
        this.db = e.target.result;
        resolve(true);
      };
    })

    // request.onupgradeneeded = (event) => {
    //   this.db = request.result;
    //   switch (event.oldVersion) { // existing db version
    //     case 0:
    //     // version 0 means that the client had no database
    //     // perform initialization
    //     case 1:
    //     // client had version 1
    //     // callback
    //   }
    // };
  }

  private toPromise<T = any>(action: () => IDBRequest) {
    return new Promise<T>((resolve, reject) => {
      const request = action();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  create(name: string, config: ITableConfig) {
    this.tables[name] = config;
  }

  table<T = any, TP = string>(name: string): ITable<T, TP> {
    const config = this.tables[name];

    const table = {
      onChange: new Subject<ITableChangeEvent>(),
      get: (id: TP) => this.get(name, id),
      getAll: () => this.getAll(name),
      add: async (value: T) => {
        if (config.keyGenerator) {
          (value as any)[config.key] = config.keyGenerator();
        }
        const result = await table.put(value);
        table.onChange.next({value: result, action: 'add'});
        return result;
      },
      delete: async (key: TP) => {
        await this.delete(name, key);
        table.onChange.next({action: 'delete'});
      },
      deleteAll: async (keys: TP[]) => {
        await this.deleteAll(name, keys);
        table.onChange.next({action: 'delete-all'});
      },
      put: async (value: T) => {
        const result = await this.put(name, value);
        table.onChange.next({value: result, action: 'put'});
        return result;
      },
      putAll: async (values: T[]) => {
        const result = await this.putAll(name, values);
        table.onChange.next({value: result, action: 'put-all'});
        return result;
      },
      findAll: (query: (key: TP, value: T) => boolean, count: number = 10000000) => {
        return this.findAll(name, query, count)
      },
      findAllKey: (query: (key: TP) => boolean, count: number) => {
        return this.findAllKey(name, query, count)
      },
      count: async (query?: (key: TP, value: T) => boolean | undefined) => {
        return (await table.findAll(query ?? (() => true))).length
      },
    } as ITable;
    return table;
  }

  public get(tableName: string, id: any) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    return this.toPromise(() => store.get(id));
  }

  public getAll(tableName: string) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    return this.toPromise(() => store.getAll());
  }

  public findAll(tableName: string, query: (key: any, value: any) => boolean, count: number) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    return new Promise<any[]>((resolve, reject) => {
      const cursorRequest = store.openCursor();
      const items: any[] = [];
      cursorRequest.onsuccess = (e) => {
        const cursor = cursorRequest.result;
        if (items.length >= count) {
          resolve(items);
          return;
        }
        if (cursor) {
          if (query(cursor.key, cursor.value)) {
            items.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(items)
        }
      }
    });
  }

  public findAllKey(tableName: string, query: (key: any) => boolean, count: number) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    return new Promise<any[]>((resolve, reject) => {
      const cursorRequest = store.openKeyCursor();
      const items: any[] = [];
      cursorRequest.onsuccess = (e) => {
        const cursor = cursorRequest.result;
        if (items.length >= count) {
          resolve(items);
          return;
        }
        if (cursor) {
          if (query(cursor.key)) {
            items.push(cursor.key);
          }
          cursor.continue();
        } else {
          resolve(items)
        }
      }
    });
  }

  public put(tableName: string, value: any) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    return this.toPromise(() => store.put(value));
  }

  public async putAll(tableName: string, values: any[]) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    for (const value of values) {
      await this.toPromise(() => store.put(value));
    }
    return await this.getAll(tableName);
  }

  public delete(tableName: string, id: any) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    return this.toPromise(() => store.delete(id));
  }

  public async deleteAll(tableName: string, keys?: any[]) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    keys ??= await this.toPromise(() => store.getAllKeys()) ?? [];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      await this.toPromise(() => store.delete(key));
    }
  }
}
