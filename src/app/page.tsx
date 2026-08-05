import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { DecisionStatement } from "@/components/home/DecisionStatement";
import { PathwayCardGrid } from "@/components/home/PathwayCardGrid";
import { CarefulSupportPanel } from "@/components/home/CarefulSupportPanel";
import { ReadinessBriefTeaser } from "@/components/home/ReadinessBriefTeaser";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { PolicyDeskFeed } from "@/components/home/PolicyDeskFeed";
import { ClientExperienceProof } from "@/components/home/ClientExperienceProof";
import { FinalConversionBand } from "@/components/home/FinalConversionBand";

export const metadata: Metadata = {
  title: "A clearer path to Canada starts with the right question",
  description:
    "GTA-based Canadian immigration guidance from a licensed RCIC. Explore your pathway, organize your documents, and book a confidential consultation.",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <DecisionStatement />
      <PathwayCardGrid />
      <CarefulSupportPanel />
      <ReadinessBriefTeaser />
      <ProcessTimeline />
      <PolicyDeskFeed />
      <ClientExperienceProof />
      <FinalConversionBand />
    </>
  );
}
