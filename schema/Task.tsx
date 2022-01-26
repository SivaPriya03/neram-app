
export interface Task {
    id?: number;
    type: string;
    title: string;
    notes:  string;
    startTime: Date | string;
    endTime?: Date | string;
    duration?: string;
    repeatInterval?: string;
    createdTime: Date;
}