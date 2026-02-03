import { listNotes } from "@/lib/db/warroom";
import { NotesScreen } from "@/app/components/NotesScreen";

export default async function OrganizeSDNotesPage() {
    const notes = await listNotes("organizesd");

    return <NotesScreen project="organizesd" title="Organize SD Notes" notes={notes} />;
}
