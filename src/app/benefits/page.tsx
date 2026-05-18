import { BenefitsContent } from "@/components/benefits/benefits-content";
import { PageHeader } from "@/components/shared/page-header";

export default function BenefitsPage() {
  return (
    <>
      <PageHeader
        badge="Muscle, energy, skin, hair"
        title="Benefits"
        description="Understand how the pure vegetarian plan supports clean weight gain, gym performance, iron, skin, hair, and recovery."
      />
      <BenefitsContent />
    </>
  );
}
