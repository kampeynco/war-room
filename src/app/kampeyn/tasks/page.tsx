import TasksScreen from '@/app/components/TasksScreen'
import readTasks from '@/lib/tasks/md'

export default async function Page() {
  const tasks = readTasks().filter(t => t && t.status !== undefined);
  return <TasksScreen project="kampeyn" title="Kampeyn Tasks" tasks={tasks} />;
}
