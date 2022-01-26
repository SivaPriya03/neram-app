import { db } from '..';
import {
  DatabaseEventTypes,
  TaskDBEventTypes,
  TransactionTypes,
} from '../../../schema/DatabaseTypes';
import { Task } from '../../../schema/Task';
import { bindClassMethods } from '../../common';
import EventListener from '../../common/EventService';

class TaskService extends EventListener<TaskDBEventTypes> {
  wrappedIdbPromise: any;
  tableName: string;

  constructor() {
    super();
    this.tableName = 'tasks';
    this.wrappedIdbPromise = null;
    /* Declare all async functions */
    bindClassMethods(this, [
      'getTransactionFromDb',
      'getObjectStore',
      'createTable',
      'addTask',
      'getAllTasks',
    ]);
    db.addEventListener(DatabaseEventTypes.UPGRADED, this.createTable);
  }

  getTransactionFromDb(db: any, mode: TransactionTypes): any {
    return db.transaction(this.tableName, mode);
  }

  getObjectStore(transaction: any): any {
    return transaction.objectStore(this.tableName);
  }

  async createTable(upgradeDB: any) {
    let taskObjectStore: any = upgradeDB.createObjectStore(this.tableName, {
      keyPath: 'id',
      autoIncrement: true,
    });
    taskObjectStore.createIndex('title', 'title', { unique: true });
    taskObjectStore.createIndex('notes', 'notes');
    taskObjectStore.createIndex('time', 'time');
  }

  async addTask(task: Task) {
    try {
      const idb = db.getIDBInstance();
      let transaction: any = this.getTransactionFromDb(
        idb,
        TransactionTypes.READ_WRITE
      );
      let store: any = this.getObjectStore(transaction);
      await store.put(task);
      return transaction.done.then(() => {
        this.emitEvent(TaskDBEventTypes.ADD_TASK, task);
        return {
          status: 200,
          message: 'Task added',
        };
      });
    } catch (e) {
      console.log(e);
      return new Promise((res) =>
        res({
          status: 500,
          message: 'An error occurred',
        })
      );
    }
  }

  async getAllTasks() {
    try {
      const idb = db.getIDBInstance();
      if (idb) {
        let transaction: any = this.getTransactionFromDb(
          idb,
          TransactionTypes.READ_ONLY
        );
        let store: any = this.getObjectStore(transaction);
        return store.getAll();
      }
    } catch (e) {
      return new Promise((res) =>
        res({
          status: 500,
          message: 'An error occurred',
        })
      );
    }
  }
}
const taskDB = new TaskService();
export default taskDB;
