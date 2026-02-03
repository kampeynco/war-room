import WarRoomDashboard from "@/app/components/WarRoomDashboard";
import { ORGANIZESD_DIR } from "@/lib/paths";

export default async function OrganizeSdPage() {
  return (
    <WarRoomDashboard
      project="organizesd"
      title="Organize SD War Room"
      docsDir={ORGANIZESD_DIR}
      docsBasePath="/organizesd/docs"
    />
  );
}
