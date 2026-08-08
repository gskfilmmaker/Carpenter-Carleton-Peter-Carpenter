import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { HeroPathway } from "@/components/home/HeroPathway";
import { CanadaMapWatermark } from "@/components/ui/CanadaMapWatermark";
import { MapleLeafIcon } from "@/components/ui/MapleLeafIcon";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <CanadaMapWatermark className="pointer-events-none absolute -right-24 -top-20 hidden h-[560px] w-[560px] text-sage opacity-[0.06] blur-[1px] sm:block" />
      <Container className="relative grid items-center gap-10 py-12 sm:py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-12 lg:py-20">
      <div>
        <Eyebrow>
          <MapleLeafIcon className="h-3.5 w-3.5 text-copper" />
          GTA-based Canadian immigration guidance
        </Eyebrow>
        <h1 className="max-w-[15ch] font-serif text-[clamp(2.3rem,5.2vw,3.6rem)] font-normal leading-[1.08] tracking-[-0.01em] text-ink">
          A clearer path to Canada starts with the{" "}
          <em className="font-normal not-italic text-copper-dark italic">right question.</em>
        </h1>
        <p className="mt-5 max-w-[32rem] text-lg text-ink-soft">
          Explore your next step with careful, accountable guidance — built around your goals, your
          documents, and the rules that apply today.
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <ButtonLink href="/start-here" variant="primary">
            Find Your Starting Point
          </ButtonLink>
          <ButtonLink href="/book" variant="secondary">
            Book a Confidential Consultation
          </ButtonLink>
        </div>
        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
          {["Licensed representative verification", "Secure-first intake", "No outcome guarantees"].map(
            (item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span aria-hidden className="h-1 w-1 rounded-full bg-sage" />
                {item}
              </li>
            )
          )}
        </ul>
      </div>
      <HeroPathway />
      </Container>
    </div>
  );
}
