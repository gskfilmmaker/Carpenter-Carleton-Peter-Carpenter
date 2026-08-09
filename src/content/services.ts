import type { Service } from "@/content/types";

const REVIEWED = "2026-07-29";

const universalCaveat =
  "This is a general document-category guide, not a complete personal checklist. IRCC/ESDC/provincial forms, fees and evidence vary by route, country, status and case facts. Confirm your current requirements in the official application package before filing.";

const noOutcomeCaveat =
  "A consultation can review your facts against current program instructions. No representative can guarantee eligibility, approval, invitation or processing time — government authorities make all decisions.";

const universalProcessSteps = (routeLabel: string) => [
  {
    title: "Explore",
    body: `We explain ${routeLabel} in plain language and point you to the official program page, so you understand the route before spending time or money on it.`,
  },
  {
    title: "Assess",
    body: "A consultation reviews the basic route facts and exclusions against your situation. This is a professional discussion, not an automated eligibility decision.",
  },
  {
    title: "Prepare",
    body: "We walk through general document categories together and point you to the official, personalized document checklist for your file.",
  },
  {
    title: "Engage",
    body: "If you choose to proceed, you receive a written scope of work and fee agreement before any representation begins.",
  },
  {
    title: "Submit",
    body: "Applications are filed through the official government channel. You retain control of your account, information and electronic signature throughout.",
  },
  {
    title: "After filing",
    body: "We explain what biometrics, medical, police or additional-document requests can look like, link the official processing-time estimator, and agree on how often we will update you.",
  },
  {
    title: "Decision & next step",
    body: "We do not predict or promise an outcome. Whatever the decision, we help you understand the next available step.",
  },
];

export const services: Service[] = [
  {
    slug: "permanent-residence",
    title: "Permanent Residence & Express Entry",
    audience: ["individual"],
    hero: {
      eyebrow: "Economic pathways",
      heading: "Understand the Express Entry system before you build a profile",
      description:
        "Express Entry manages the Canadian Experience Class, Federal Skilled Worker and Federal Skilled Trades programs through a ranked pool, category-based rounds and invitations to apply. We help you read the current rules correctly and organize the evidence that matters.",
    },
    overview:
      "Express Entry is Canada's primary economic-immigration system for skilled workers seeking permanent residence. It ranks eligible profiles by the Comprehensive Ranking System and issues invitations to apply through regular and category-based rounds. Program rules, cut-offs and category priorities change; treat any score or timeline claim as dated the moment you read it, and confirm current instructions on the official IRCC page below.",
    consultationCanReview: [
      "Which Express Entry program(s) you may fit, based on your work history, education and language results",
      "How a provincial nomination could interact with your Express Entry profile",
      "Gaps in your current evidence before you submit a profile",
      "What an invitation to apply would require next",
    ],
    evidenceCategories: [
      "Passport and identity documents",
      "Language test results",
      "Educational Credential Assessment (for education outside Canada)",
      "Work experience evidence",
      "Job offer or provincial nomination documents, where relevant",
      "Proof of settlement funds",
      "Police certificates",
      "Family and relationship evidence, including translations where required",
    ],
    processSteps: universalProcessSteps("the Express Entry system"),
    caveats: [noOutcomeCaveat, universalCaveat],
    officialSources: [
      {
        label: "IRCC — Express Entry",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    ctaLabel: "Book an Express Entry consultation",
    isPublished: true,
    approval: {
      approvedBy: "GSK Productions Inc. (explicit instruction, not a documented Peter sign-off)",
      approvedAt: "2026-08-08",
      approved: true,
    },
    faqs: [
      {
        question: "Does a higher CRS score guarantee an invitation?",
        answer:
          "No. Invitation cut-offs move with every round based on the pool at that time. A consultation can review your profile realistically against current, dated rounds — not a promised score.",
      },
      {
        question: "Can a provincial nomination help my Express Entry profile?",
        answer:
          "An Express Entry-aligned provincial nomination can add significant Comprehensive Ranking System points, but each province sets its own streams and criteria independently. We can review whether a specific stream may be relevant to discuss further.",
      },
    ],
  },
  {
    slug: "provincial-nominee",
    title: "Provincial Nominee Pathways",
    audience: ["individual", "business"],
    hero: {
      eyebrow: "Regional pathways",
      heading: "Provinces run their own programs — treat each one on its own terms",
      description:
        "Every province designs its own nominee streams, criteria and intake process. We help you research the real differences before assuming one stream applies to you.",
    },
    overview:
      "Provincial Nominee Programs let provinces and territories nominate candidates who meet their own labour-market or business criteria for permanent residence. Some streams align with Express Entry; others run independently. Requirements, intent-to-reside expectations and intake windows vary by province and change without notice, so official provincial sources must be checked before acting.",
    consultationCanReview: [
      "Whether your occupation, connection or business background fits a specific province's public stream description",
      "The realistic difference between an Express Entry-aligned stream and a base (non-aligned) stream",
      "What a nomination does — and does not — guarantee at the federal stage",
    ],
    evidenceCategories: [
      "Occupation and work-history evidence",
      "Job offer documentation, where the stream requires one",
      "Language test results",
      "Education and credential evidence",
      "Evidence of genuine connection or intent to reside in the province",
      "Business ownership, investment or management evidence for entrepreneur streams",
      "Federal identity, admissibility and family documents once nominated",
    ],
    processSteps: universalProcessSteps("a provincial nominee stream"),
    caveats: [noOutcomeCaveat, universalCaveat],
    officialSources: [
      {
        label: "IRCC — Provincial Nominee Program",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    ctaLabel: "Book a provincial pathway consultation",
    isPublished: true,
    approval: {
      approvedBy: "GSK Productions Inc. (explicit instruction, not a documented Peter sign-off)",
      approvedAt: "2026-08-08",
      approved: true,
    },
  },
  {
    slug: "work-permits-employers",
    title: "Work Permits & Employers",
    audience: ["individual", "employer"],
    hero: {
      eyebrow: "Employer & worker pathways",
      heading: "Employer compliance and worker applications are two separate journeys",
      description:
        "An LMIA is an employer process run by Employment and Social Development Canada. A positive LMIA does not itself issue a work permit. We keep employer and worker scopes, consents and documents clearly separate.",
    },
    overview:
      "Work permit routes range from employer-specific permits requiring an LMIA or an LMIA exemption, to open work permits available to specific categories of applicants. Employers and workers have distinct legal processes, timelines and responsibilities. Low-wage LMIA processing can be refused in some metro areas based on the current ESDC unemployment-rate list, subject to exceptions — this changes and must be checked before marketing or accepting an engagement.",
    consultationCanReview: [
      "Whether a role likely needs an LMIA, may qualify for an LMIA exemption, or fits an open work permit category",
      "Employer-side recruitment, wage and compliance readiness",
      "Worker-side qualification, licensing and admissibility considerations",
    ],
    evidenceCategories: [
      "Employer: business legitimacy, job offer, wage and location details",
      "Employer: recruitment efforts and transition-plan records, where applicable",
      "Worker: passport and current status documents",
      "Worker: qualifications, licensing and work-history evidence",
      "Worker: LMIA or exemption-category supporting documents",
      "Family and admissibility documents where relevant",
    ],
    processSteps: universalProcessSteps("a work permit route"),
    caveats: [noOutcomeCaveat, universalCaveat],
    officialSources: [
      {
        label: "IRCC — Employer-specific work permit",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/employer-specific.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
      {
        label: "IRCC — Open work permit",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/open-work-permit.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
      {
        label: "ESDC — Temporary Foreign Worker Program",
        url: "https://www.canada.ca/en/employment-social-development/services/foreign-workers.html",
        sourceOwner: "ESDC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    ctaLabel: "Start an employer or worker enquiry",
    isPublished: true,
    approval: {
      approvedBy: "GSK Productions Inc. (explicit instruction, not a documented Peter sign-off)",
      approvedAt: "2026-08-08",
      approved: true,
    },
  },
  {
    slug: "study-permits",
    title: "Study & Post-Graduation Planning",
    audience: ["individual", "family"],
    hero: {
      eyebrow: "Students & post-graduation",
      heading: "Compliant study planning, not a promise about post-study status",
      description:
        "Study permit, PGWP and study-permit-to-PR routes have tightened and depend on your program, institution and dates. We focus on document readiness and honest, current-rule planning.",
    },
    overview:
      "A study permit requires an acceptance letter from a designated learning institution and, depending on the province and route, additional provincial attestation documents. Post-Graduation Work Permit eligibility depends on the specific program and its current rules at the time you apply — it is not automatic. Any post-study or spousal work permit claim must be checked against current, dated IRCC instructions.",
    consultationCanReview: [
      "Whether your intended program and institution fit current study-permit requirements",
      "Provincial attestation letter requirements where applicable",
      "Realistic, current PGWP conditions tied to your specific program — not a general assumption",
    ],
    evidenceCategories: [
      "Letter of acceptance from a designated learning institution",
      "Provincial attestation letter, where required",
      "Passport and identity documents",
      "Proof of sufficient funds",
      "Statement of purpose / study plan",
      "Medical or police documents where required",
      "Custodianship documents for minors, where applicable",
    ],
    processSteps: universalProcessSteps("a study permit or post-graduation route"),
    caveats: [noOutcomeCaveat, universalCaveat],
    officialSources: [
      {
        label: "IRCC — Study permit",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    ctaLabel: "Book a study-pathway consultation",
    isPublished: true,
    approval: {
      approvedBy: "GSK Productions Inc. (explicit instruction, not a documented Peter sign-off)",
      approvedAt: "2026-08-08",
      approved: true,
    },
  },
  {
    slug: "family-sponsorship",
    title: "Family Sponsorship & Super Visa",
    audience: ["family"],
    hero: {
      eyebrow: "Family reunification",
      heading: "Bring family closer with a clear, well-documented sponsorship file",
      description:
        "Spouse, partner, child, parent and grandparent sponsorships each carry their own relationship and financial evidence expectations. Super Visa is a separate, temporary-entry route, not a PR pathway.",
    },
    overview:
      "Family class sponsorship allows Canadian citizens and permanent residents to sponsor eligible relatives. Requirements differ by relationship class, and sponsors must meet residency and, in some cases, income obligations. The Super Visa is a long-validity, temporary visitor route for parents and grandparents, distinct from permanent sponsorship, with its own insurance and income conditions.",
    consultationCanReview: [
      "Which family class may fit your relationship and sponsor status",
      "Realistic evidence expectations for relationship genuineness",
      "Whether a Super Visa or a Parent and Grandparent sponsorship route better matches your timeline",
    ],
    evidenceCategories: [
      "Sponsor identity, status and residency evidence",
      "Relationship proof (marriage, common-law, birth, adoption records)",
      "Dependant and custody documentation where relevant",
      "Required forms and declarations",
      "Country-specific civil documents and certified translations",
      "Medical and police documents where required",
      "Financial and insurance evidence for Super Visa applications",
    ],
    processSteps: universalProcessSteps("a family sponsorship route"),
    caveats: [noOutcomeCaveat, universalCaveat],
    officialSources: [
      {
        label: "IRCC — Family sponsorship",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    ctaLabel: "Book a family sponsorship consultation",
    isPublished: true,
    approval: {
      approvedBy: "GSK Productions Inc. (explicit instruction, not a documented Peter sign-off)",
      approvedAt: "2026-08-08",
      approved: true,
    },
  },
  {
    slug: "business-pathways",
    title: "Business Pathway Assessment",
    audience: ["business", "individual"],
    hero: {
      eyebrow: "Entrepreneurs & investors",
      heading: "An honest feasibility screen before a business-immigration strategy",
      description:
        "Federal Start-up Visa and Self-Employed routes carry strict, current-status constraints, and provincial entrepreneur streams vary widely. We check what is actually open before recommending anything.",
    },
    overview:
      "Business immigration covers the federal Start-up Visa program, the Self-Employed Persons Program, and a range of provincial entrepreneur and investor streams. Program status, designated-organization requirements and provincial criteria change and must be verified at the time of engagement — we do not present a paused or closed program as generally open.",
    consultationCanReview: [
      "Current status of the federal route(s) that might interest you",
      "Provincial entrepreneur or investor alternatives worth researching",
      "What source-of-funds and business-experience evidence a given route generally expects",
    ],
    evidenceCategories: [
      "Identity and civil-status documents",
      "Business ownership, control and management experience evidence",
      "Source-of-funds documentation",
      "Language test results",
      "Designated-organization or provincial-nomination materials, where applicable",
      "Admissibility documents",
    ],
    processSteps: universalProcessSteps("a business immigration pathway"),
    caveats: [
      "Business pathway status changes frequently. We check the current, official program status as part of any paid assessment rather than assuming a route is open.",
      noOutcomeCaveat,
      universalCaveat,
    ],
    officialSources: [
      {
        label: "IRCC — Start-up Visa Program",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    ctaLabel: "Request a business pathway assessment",
    isPublished: true,
    approval: {
      approvedBy: "GSK Productions Inc. (explicit instruction, not a documented Peter sign-off)",
      approvedAt: "2026-08-08",
      approved: true,
    },
  },
  {
    slug: "citizenship-pr-cards",
    title: "Citizenship & PR Cards",
    audience: ["individual", "family"],
    hero: {
      eyebrow: "Lifecycle & status maintenance",
      heading: "Straightforward help for the milestones after landing",
      description:
        "PR card renewal, replacement and citizenship applications are common, high-trust services. We keep them simple, fast and focused.",
    },
    overview:
      "Permanent Residents rely on a valid PR card to travel and re-enter Canada, and can apply for citizenship once they meet current physical-presence, language and other requirements. Both are lifecycle services with clear official processes; requirements and processing times shift, so official IRCC guidance is checked at the time of every engagement.",
    consultationCanReview: [
      "Which PR card scenario applies to you (first card, renewal, lost/stolen, correction)",
      "Whether your residency history and documents look ready for a citizenship application",
      "What proof-of-citizenship services may apply to your situation",
    ],
    evidenceCategories: [
      "PR card application form and photo",
      "Proof of address and residence history",
      "Physical-presence evidence for citizenship applications",
      "Tax and residence-related items where relevant",
      "Language evidence for citizenship applicants in the required age range",
      "Name, custody or minor-specific documents where applicable",
      "Certified translations where required",
    ],
    processSteps: universalProcessSteps("a PR card or citizenship application"),
    caveats: [noOutcomeCaveat, universalCaveat],
    officialSources: [
      {
        label: "IRCC — Canadian citizenship",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/become-canadian-citizen.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
      {
        label: "IRCC — PR card",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/permanent-residents/card.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    ctaLabel: "Book a citizenship or PR card consultation",
    isPublished: true,
    approval: {
      approvedBy: "GSK Productions Inc. (explicit instruction, not a documented Peter sign-off)",
      approvedAt: "2026-08-08",
      approved: true,
    },
  },
  {
    slug: "complex-matters",
    title: "Complex / Time-Sensitive Matters",
    audience: ["individual", "family", "business"],
    hero: {
      eyebrow: "Refusals, inadmissibility & deadlines",
      heading: "When a matter is urgent, it needs a same-week conversation — and sometimes a referral",
      description:
        "Prior refusals, inadmissibility concerns, and removal or hearing deadlines are flagged immediately. If a matter falls outside current scope, we follow a documented referral protocol to appropriate counsel.",
    },
    overview:
      "Some matters — a prior refusal, an inadmissibility finding, an approaching hearing or removal deadline — need urgent, careful handling. We review these only within Peter's current competence and scope. Where a matter requires immigration counsel or falls outside scope, our practice follows an ethical, documented referral protocol rather than taking on work outside its qualifications.",
    consultationCanReview: [
      "The nature and urgency of your situation",
      "Whether this practice can assist directly, or whether a referral to immigration counsel is the appropriate next step",
    ],
    evidenceCategories: [
      "Any decision letters, refusal letters or notices received",
      "Hearing, removal or deadline correspondence",
      "Prior application history and documents",
    ],
    processSteps: [
      {
        title: "Flag immediately",
        body: "Tell us the deadline or event first. Time-sensitive matters are triaged ahead of routine intake.",
      },
      {
        title: "Case-review consultation",
        body: "We review your documents and history to understand what has happened and what options exist.",
      },
      {
        title: "Direct or refer",
        body: "If the matter is within current scope, we define next steps and a written agreement. If not, we provide a documented referral to appropriate counsel.",
      },
    ],
    caveats: [
      "This page does not offer a public blanket promise of representation for every complex matter. Scope is confirmed case by case.",
      noOutcomeCaveat,
    ],
    officialSources: [
      {
        label: "IRCC — Application forms and guides",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    ctaLabel: "Request an urgent case review",
    isPublished: true,
    approval: {
      approvedBy: "GSK Productions Inc. (explicit instruction, not a documented Peter sign-off)",
      approvedAt: "2026-08-08",
      approved: true,
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
