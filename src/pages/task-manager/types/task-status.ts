import { TaskColor } from './task-color';

export type TaskStatus = {
  id: string;
  name: string;
  color: TaskColor;
  isCustom: boolean;
};
