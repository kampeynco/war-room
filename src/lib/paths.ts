import path from "node:path";

// war-room app lives at: kambot/war-room
// docs live at: kambot/kampeyn-war-room
export const KAMPEYN_DOCS_DIR = path.join(process.cwd(), "..", "kampeyn-war-room");

// Organize SD docs live under: kambot/organizesd
export const ORGANIZESD_DIR = path.join(process.cwd(), "..", "organizesd");
