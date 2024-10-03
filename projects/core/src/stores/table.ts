import {IDatabase, IndexedDB, ITable, ITableConfig} from "../utils";

type StoreTableConfig = { [key: string]: ITableConfig };

export class StoreDb<T extends StoreTableConfig> {
  private db!: IDatabase;
  private tables: { [key: string]: ITable } = {};

  constructor(name: string, version: number, private configs: T) {
    try {
      this.db = new IndexedDB({name: name, version: version});
      for (const configsKey in this.configs) {
        this.db.create(configsKey, this.configs[configsKey]);
      }
      for (const configsKey in this.configs) {
        this.tables[configsKey] = this.db.table(configsKey);
      }
      this.db.open().catch(console.error).finally();
    } catch (e) {
      alert('StoreDb: ' + name + ' construct failed - ' + e)
    }
  }

  getTable<TR = any, TK = any>(name: keyof T) {
    return this.tables[name as string] as ITable<TR, TK>;
  }

  async close() {
    await this.db.close();
  }
}
