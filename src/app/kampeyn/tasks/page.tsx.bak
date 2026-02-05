import { listTasks } from "@/lib/db/warroom";
import { TasksScreen } from "@/app/components/TasksScreen";

export default async function KampeynTasksPage() {
    const tasks = await listTasks("kampeyn");

    return <TasksScreen project="kampeyn" title="Kampeyn Tasks" tasks={tasks} />;
}
