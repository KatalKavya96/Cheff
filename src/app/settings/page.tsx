import { PageHeader } from "@/components/shared/page-header";
import { SettingsClient } from "@/components/settings/settings-client";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        badge="Cycle configuration"
        title="Settings"
        description="Set or reset the plan start date that controls the repeating 7-day diet cycle."
      />
      <SettingsClient />
    </>
  );
}
