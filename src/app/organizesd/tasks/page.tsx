import { listTasks } from "@/lib/db/warroom";
import { TasksScreen } from "@/app/components/TasksScreen";

export default async function OrganizeSDTasksPage() {
    const tasks = await listTasks("organizesd");

    return <TasksScreen project="organizesd" title="Organize SD Tasks" tasks={tasks} />;
}
