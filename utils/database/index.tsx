import { openDB } from 'idb';
import { DatabaseEventTypes } from '../../schema/DatabaseTypes';
import { bindClassMethods } from '../common';
import EventListener from '../common/EventService';

class DatabaseService extends EventListener<DatabaseEventTypes> {
  name: string;
  currentVersion: number;
  idb: any;
  tableName: string;

  constructor() {
    super();
    this.name = 'Neram';
    this.tableName = 'tasks';
    this.currentVersion = 1;
    this.idb = null;
    /* Declare all async functions */
    bindClassMethods(this, [
      'openDB',
      'onDBUprade',
      'onDBinitialised',
      'getIDBInstance',
    ]);
  }

  async openDB() {
    this.idb = await openDB(this.name, this.currentVersion, {
      upgrade: this.onDBUprade,
    });
    this.onDBinitialised();
  }

  onDBUprade(...args: any[]) {
    this.emitEvent(DatabaseEventTypes.UPGRADED, ...args);
  }

  onDBinitialised(...args: any[]) {
    this.emitEvent(DatabaseEventTypes.INIT, ...args);
  }

  getIDBInstance(): any {
    if (this.idb) {
      return this.idb;
    } else {
      console.log('Some error occurred while fetching db'); // Logs error or throw alert here
    }
  }
}
export const db = new DatabaseService();
