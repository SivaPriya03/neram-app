
export enum DatabaseEventTypes {
    UPGRADED = "DB_UPGRADE",
    INIT= "INIT"
}
  
export interface DatabaseEventType {
    type: DatabaseEventTypes
}

export enum TaskDBEventTypes {
    ADD_TASK = "ADD_TASK",
    UPDATE_TASK = "UPDATE_TASK",
    DELETE_TASK = "DELETE_TASK"
}




export enum TransactionTypes {
   READ_WRITE= 'readwrite',
   READ_ONLY= 'readonly'
}