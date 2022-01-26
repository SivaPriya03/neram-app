import styles from '../../styles/Home.module.css';
import taskDB from '../../utils/database/services/TaskService';
import { Button, HStack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { Task } from '../../schema/Task';
import { db } from '../../utils/database';
import { DatabaseEventTypes } from '../../schema/DatabaseTypes';

interface TaskProps {
  tasks: Task[];
}
const Tasks = (props: TaskProps) => {
  const { tasks = [] } = props;
  if (tasks.length === 0) {
    return <div> No Tasks found </div>;
  }
  return (
    <ul>
      {tasks.map((task) => {
        return (
          <li key={task.id}>
            {task.title} - {task.notes}
          </li>
        );
      })}
    </ul>
  );
};

let count: number = 1;

function getTaskTitle(length: number = 10): string {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addTask = async () => {
    const title: string = getTaskTitle(10);
    const notes: string = 'Bye';
    const id = await taskDB.addTask({
      title,
      notes,
      createdTime: new Date(),
      startTime: new Date(),
      type: 'repeat',
    });
    console.log(id);
  };

  async function getAllTasks() {
    const tasks: Task[] = await taskDB.getAllTasks();
    setTasks(tasks);
  }

  const afterDBInit = useCallback(async () => {
    setIsLoading(false);
    getAllTasks();
  }, []);

  const triggerSampleNotification = () => {
    if (window.Notification) {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          setTimeout(randomNotification, 5000);
        }
      });
    }
  };

  function randomNotification() {
    const notifImg = 'images/logo.png';
    const options = {
      body: 'Am just testing this notification with smileyss 😅😛😍😡',
      icon: notifImg,
    };
    new Notification('Sample Notification', options);
    if (count > 2) {
    } else {
      count++;
      setTimeout(randomNotification, 5000);
    }
  }

  useEffect(() => {
    db.openDB();
    db.addEventListener(DatabaseEventTypes.INIT, afterDBInit);
    return () => {
      db.removeEventListener(afterDBInit);
    };
  }, []);

  if (isLoading) {
    return <div> Loading ...</div>;
  }
  return (
    <div className={styles.container}>
      <HStack spacing="24px">
        <Button colorScheme="blue" onClick={addTask}>
          Add Task
        </Button>
        <Button colorScheme="red" onClick={triggerSampleNotification}>
          Enable Notification
        </Button>
      </HStack>
      <Tasks tasks={tasks} />
    </div>
  );
};
export default App;
