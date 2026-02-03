import { listNotes } from "@/lib/db/warroom";
import { NotesScreen } from "@/app/components/NotesScreen";

export default async function KampeynNotesPage() {
    const notes = await listNotes("kampeyn");

    return <NotesScreen project="kampeyn" title="Kampeyn Notes" notes={notes} />;
}
