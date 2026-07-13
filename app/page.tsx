import { AdviceRoutes } from "@/components/landing/advice-routes";
import { AdvisorProof } from "@/components/landing/advisor-proof";
import { AdvisoryProcess } from "@/components/landing/advisory-process";
import { AreaIntelligence } from "@/components/landing/area-intelligence";
import { ClientProof } from "@/components/landing/client-proof";
import {
  DeferredAdvisoryTools,
  DeferredConsultation,
} from "@/components/landing/deferred-islands";
import { Hero } from "@/components/landing/hero";
import { MarketPerspective } from "@/components/landing/market-perspective";
import { TrustLedger } from "@/components/landing/trust-ledger";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustLedger />
      <AdviceRoutes />
      <AdvisorProof />
      <ClientProof />
      <MarketPerspective />
      <AdvisoryProcess />
      <AreaIntelligence />
      <DeferredAdvisoryTools />
      <DeferredConsultation />
    </>
  );
}
