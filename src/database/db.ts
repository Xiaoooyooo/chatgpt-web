type DefineTableCallback = (store: IDBDatabase) => void;
class Database {
  db: IDBDatabase;
  tables: Map<string, DefineTableCallback> = new Map();
  databaseName: string;
  constructor(name = "database") {
    this.databaseName = name;
  }
  defineTable(name: string, fn: DefineTableCallback) {
    this.tables.set(name, fn);
  }
  initialize() {
    return new Promise<Database>((resolve, reject) => {
      const openRequest = indexedDB.open(this.databaseName);
      const _this = this;
      openRequest.onsuccess = function () {
        _this.db = this.result;
        __DEV__ && console.log("open success");
        resolve(_this);
      };
      openRequest.onblocked = function () {
        console.error("open failed");
      };
      openRequest.onerror = function () {
        console.error("Unhandle error:", this.error);
      };
      openRequest.onupgradeneeded = function () {
        const db = this.result;
        for (let table of _this.tables.entries()) {
          const [name, cb] = table;
          cb(db);
        }
      };
    });
  }
  destory() {
    const destoryRequest = indexedDB.deleteDatabase(this.databaseName);
    destoryRequest.onsuccess = function () {
      __DEV__ && console.log("delete success");
    }
    destoryRequest.onblocked = function () {
      __DEV__ && console.log("delete was blocked");
    }
    destoryRequest.onerror = function () {
      console.error(this.error);
    }
  }
  table(name: string) {
    return new DataTable({
      database: this.db,
      databaseName: this.databaseName,
      tableName: name,
    });
  }
}

type DataTableOptions = {
  database: IDBDatabase;
  tableName: string;
  databaseName: string;
}

type QueryOptions = {
  where: IDBKeyRange;
  key?: string;
}

type OffsetOptions = {
  offset: number;
  limit?: number;

}
type OrderOptions = {
  orderBy?: string;
  order?: "asc" | "desc";
}

class DataTable {
  database: IDBDatabase;
  tableName: string;
  databaseName: string;
  constructor(options: DataTableOptions) {
    this.database = options.database;
    this.tableName = options.tableName;
    this.databaseName = options.databaseName;
  }
  insert<T = any>(value: T) {
    return new Promise((resolve, reject) => {
      const transaction = this.database.transaction(this.tableName, "readwrite");
      const store = transaction.objectStore(this.tableName);
      const request = store.add(value);
      request.onsuccess = function () {
        resolve(this.result);
      };
      request.onerror = function () {
        reject(this.error);
      };
    });
  }

  find<T = any>(options: QueryOptions & OffsetOptions & OrderOptions) {
    return new Promise<T[]>((resolve, reject) => {
      const transaction = this.database.transaction(this.tableName, "readonly");
      let store: IDBObjectStore | IDBIndex = transaction.objectStore(this.tableName);
      if (options.key) {
        store = store.index(options.key);
      }
      const request = store.getAll(options.where);
      request.onerror = function () {
        reject(this.error);
      }
      request.onsuccess = function () {
        const res = options.orderBy ? sort(this.result, options.orderBy, options.order) : this.result;
        if (!options.limit) {
          resolve(res);
        } else {
          resolve(res.slice(options.offset, options.offset + options.limit));
        }
      }
    });
  }
  findOne<T = any>(options: QueryOptions) {
    return new Promise<T>((resolve, reject) => {
      const transaction = this.database.transaction(this.tableName, "readonly");
      let store: IDBObjectStore | IDBIndex = transaction.objectStore(this.tableName);
      if (options.key) {
        store = store.index(options.key);
      }
      const request = store.get(options.where);
      request.onsuccess = function () {
        resolve(this.result);
      };
      request.onerror = function () {
        reject(this.error);
      };
    });
  }
  findAll<T = any>(options: Partial<QueryOptions & OrderOptions> = {}) {
    return new Promise<T[]>((resolve, reject) => {
      const transaction = this.database.transaction(this.tableName, "readonly");
      let store: IDBObjectStore | IDBIndex = transaction.objectStore(this.tableName);
      if (options.key) {
        store = store.index(options.key);
      }
      const request = store.getAll(options.where);
      request.onsuccess = function () {
        const res = options.orderBy ? sort(this.result, options.orderBy, options.order) : this.result;
        resolve(res);
      };
      request.onerror = function () {
        reject(this.error);
      };
    });
  }
  update(options: QueryOptions & { value: Record<string, string> }) {
    return new Promise(async (resolve, reject) => {
      const record = await this.findOne({
        where: options.where,
        key: options.key,
      });
      if (!record) return;
      const transaction = this.database.transaction(this.tableName, "readwrite");
      const store = transaction.objectStore(this.tableName);
      const request = store.put({ ...record, ...options.value });
      request.onsuccess = function () {
        resolve(this.result);
      };
      request.onerror = function () {
        reject(this.error);
      };
    });
  }

  delete(options: QueryOptions) {
    return new Promise(async (resolve, reject) => {
      const record = await this.findOne(options);
      if (!record) return;
      const transaction = this.database.transaction(this.tableName, "readwrite");
      const store = transaction.objectStore(this.tableName);
      const request = store.delete(record[store.keyPath as string]);
      request.onsuccess = function () {
        resolve(this.result);
      };
      request.onerror = function () {
        reject(this.error);
      };
    });
  }
  async deleteAll(options?: QueryOptions) {
    const records = await this.findAll(options);
    if (!records.length) return;
    const transaction = this.database.transaction(this.tableName, "readwrite");
    const store = transaction.objectStore(this.tableName);
    const requests: Promise<unknown>[] = [];
    records.forEach((record) => {
      requests.push(
        new Promise((resolve, reject) => {
          const request = store.delete(record[store.keyPath as string]);
          request.onsuccess = function () {
            resolve(this.result);
          };
          request.onerror = function () {
            reject(this.error);
          };
        })
      );
    });
    return Promise.allSettled(requests).then((res) => {
      let failed = 0;
      res.forEach((item) => {
        if (item.status === "rejected") {
          failed++;
        }
      });
      if (failed > 0) {
        return Promise.reject(`Failed to delete ${failed} records.`);
      }
    });
  }
}

function sort(data: any[], orderBy: string, order?: "asc" | "desc") {
  return data.sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] - b[orderBy]
    } else if (orderBy === "desc") {
      return b[orderBy] - a[orderBy];
    } else return a - b
  })
}

export default Database;
