import {IDatabase, IndexedDB, ITable, ITableConfig} from "@framework";

type StoreTableConfig = { [key: string]: ITableConfig };

export class StoreDb<T extends StoreTableConfig> {
  private db: IDatabase;
  private tables: { [key: string]: ITable } = {};

  constructor(name: string, version: number, private configs: T) {
    this.db = new IndexedDB({name: name, version: version});
    this.init().catch(console.error);
  }

  async init() {
    for (const configsKey in this.configs) {
      this.db.create(configsKey, this.configs[configsKey]);
    }
    await this.db.open();
    for (const configsKey in this.configs) {
      this.tables[configsKey] = this.db.table(configsKey);
    }
  }

  getTable<TR = any, TK = any>(name: keyof T) {
    return this.tables[name as string] as ITable<TR, TK>;
  }

  async close() {
    await this.db.close();
  }
}
