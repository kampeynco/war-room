import WarRoomDashboard from "@/app/components/WarRoomDashboard";
import { KAMPEYN_DOCS_DIR } from "@/lib/paths";

export default async function KampeynPage() {
  return (
    <WarRoomDashboard
      project="kampeyn"
      title="Kampeyn War Room"
      docsDir={KAMPEYN_DOCS_DIR}
      docsBasePath="/kampeyn/docs"
    />
  );
}
