export const SYSTEM_PROMPT = `You are an expert technical writer, industry analyst, and career coach. Your job is to create a comprehensive "zero to expert" field guide for someone preparing for a specific job role.

When given a job description (and optionally a resume), you will:
1. Identify the company, industry, and role
2. Structure the guide like university courses (101, 102, 103, 201, 202, etc.)
3. Cover all products, services, software, tools, and competitors relevant to the role
4. Include a competitor analysis with specific replacement/equivalent products
5. Write in plain English with analogies — be genuinely insightful, not generic
6. If a resume is provided, perform a deep personalized analysis

You MUST respond with ONLY valid JSON — absolutely no markdown fences, no preamble, no trailing text. Structure exactly:

{
  "company": "Company name",
  "role": "Job title",
  "industry": "Industry name",
  "overview": "2-3 sentences describing the company and why this role matters",
  "keySkills": ["skill1","skill2","skill3","skill4","skill5"],
  "resumeAnalysis": {
    "hasResume": false,
    "matchScore": 0,
    "recommendedLevel": "some",
    "matchLabel": "Some background knowledge",
    "yourStrengths": [],
    "skillGaps": [],
    "talkingPoints": [],
    "positioningSummary": ""
  },
  "courses": [
    {
      "code": "101",
      "title": "Course title",
      "subtitle": "One-line subtitle describing what this course covers",
      "sections": [
        { "type": "prose", "heading": "Section heading", "content": "Detailed paragraph with real industry depth — not generic filler." },
        { "type": "bullets", "heading": "Section heading", "items": ["specific item 1","specific item 2","specific item 3"] },
        { "type": "termsBold", "heading": "Key terms", "items": [{"term":"ACRONYM","definition":"Plain English definition with context"}] },
        { "type": "table", "heading": "Table title", "columns": ["Column 1","Column 2","Column 3"], "rows": [["r1c1","r1c2","r1c3"]] },
        { "type": "callout", "heading": "Pro tip", "content": "A specific, non-obvious insight an insider would know.", "calloutType": "tip" }
      ]
    }
  ],
  "competitorTable": {
    "competitors": ["Competitor 1","Competitor 2","Competitor 3"],
    "rows": [
      { "category": "Product/feature category", "company": "What this company offers specifically", "competitor1": "What C1 offers", "competitor2": "What C2 offers", "competitor3": "What C3 offers" }
    ]
  },
  "careerTips": [
    "Specific, actionable tip for this exact role — not generic career advice"
  ],
  "glossary": [
    { "term": "ACRONYM", "fullForm": "Full form or brand name", "definition": "Plain English definition someone new to the industry can understand" }
  ]
}

RESUME ANALYSIS RULES (only when resume text is provided):
- hasResume: set to true
- matchScore: integer 0-100 representing how well resume aligns with JD (skills, experience, industry, seniority level)
- recommendedLevel: MUST be one of exactly: "beginner", "some", or "technical" — based on matchScore (0-35 = beginner, 36-69 = some, 70-100 = technical)
- matchLabel: human-friendly label ("Complete beginner", "Some background knowledge", "Experienced & technical")
- yourStrengths: 4-6 specific bullet strings — real experiences from their resume that directly map to the JD requirements. Reference actual job titles, companies, accomplishments from their resume. Be specific, not generic.
- skillGaps: 3-5 specific things the JD requires that are NOT evident in their resume — be honest and constructive
- talkingPoints: 4-6 ready-to-use interview talking points written in first person ("I led...", "My experience at X...") that connect their background to this role
- positioningSummary: 2-3 sentence paragraph they could use as their elevator pitch for this exact role, written in first person, drawing from their actual resume

WITHOUT RESUME: set hasResume to false, matchScore to 0, recommendedLevel to the user-selected audience level, empty arrays for strengths/gaps/talkingPoints, empty positioningSummary.

Quality requirements:
- Each course: 4-6 sections, genuine depth, real product names and specs
- competitorTable: 10-15 rows, specific product names in every cell
- careerTips: 5-7 tips, role-specific and immediately actionable
- glossary: 30-50 entries covering every acronym and jargon term used in the guide`

export const DEPTH_INSTRUCTIONS: Record<string, string> = {
  quick: 'Create exactly 4 courses: 101 foundations, 102 core products/services, 201 key tools and software, 301 competitors and strategy.',
  standard: 'Create 6-8 courses covering: industry foundations, major product categories, software and tools, services and support, competitor landscape, and career strategy.',
  deep: 'Create 10-12 courses going deep on every product family, each major software tool, services, technical architecture, sales methodology, competitor analysis with product-by-product tables, and detailed career strategy.',
}

export const AUDIENCE_INSTRUCTIONS: Record<string, string> = {
  beginner: 'The reader is a complete beginner — define every acronym on first use, use everyday analogies (e.g. "think of it like..."), never assume prior industry knowledge.',
  some: 'The reader has general business and tech familiarity but no deep industry knowledge. Define acronyms on first use, explain specialized concepts clearly, skip explaining basics like "what is email."',
  technical: 'The reader is technically experienced. Focus on architecture decisions, spec-level detail, nuanced tradeoffs, and expert-level insights. Skip basic definitions.',
}

export const EXAMPLE_JDS = [
  {
    label: 'DriveCentric SC',
    emoji: '🚗',
    company: 'DriveCentric',
    role: 'Solutions Consultant',
    jd: `Solutions Consultant at DriveCentric — the leading AI-powered CRM platform for automotive dealerships. You will serve as the technical layer between our sales team and dealership clients (General Managers, Dealer Principals, BDC Managers). Lead deep discovery meetings, deliver custom-tailored demos of our CRM, AI engagement tools, and service scheduling platform. Answer technical questions about API integrations, DMS connectivity, and agentic AI capabilities. 5+ years in a technical customer-facing role required. Domain knowledge of dealer systems in Digital Retail, CDP, Chat, F&I, Service scheduling, Agentic AI, and reporting. Familiarity with automotive CRM competitors (VinSolutions, Elead, DealerSocket) strongly preferred.`,
  },
  {
    label: 'Supermicro Sales',
    emoji: '🖥️',
    company: 'Supermicro',
    role: 'Field Sales Representative',
    jd: `Field Sales Representative at Super Micro Computer (SMCI). Sell server, storage, GPU, and networking solutions to enterprise data centers, AI/HPC research labs, and cloud providers in the Midwest territory. Must understand Supermicro's server product families (SuperBlade, BigTwin, HGX GPU servers), storage systems, cooling infrastructure (DLC, liquid cooling), and management software (IPMI, SSM, SAA). Comfortable presenting to both technical architects (discussing PCIe, NVMe, InfiniBand) and C-level buyers (TCO, ROI, supply chain). Will compete against Dell PowerEdge, HPE ProLiant, and Lenovo ThinkSystem.`,
  },
  {
    label: 'AWS Solutions Architect',
    emoji: '☁️',
    company: 'Amazon Web Services',
    role: 'Solutions Architect',
    jd: `Solutions Architect at Amazon Web Services supporting Fortune 500 enterprise accounts in the Midwest. Help clients design and migrate workloads to AWS across compute (EC2, ECS, Lambda), storage (S3, EFS, EBS), databases (RDS, Aurora, DynamoDB, Redshift), networking (VPC, Direct Connect, Route 53), and AI/ML (SageMaker, Bedrock). Lead technical discovery, architecture reviews (Well-Architected Framework), and proof-of-concept builds. 5+ years cloud or infrastructure engineering required. AWS Solutions Architect Professional preferred. Must compete against Azure and GCP.`,
  },
  {
    label: 'CrowdStrike Territory',
    emoji: '🛡️',
    company: 'CrowdStrike',
    role: 'Territory Manager',
    jd: `Territory Manager at CrowdStrike Cybersecurity. Own and grow a geographic territory selling the Falcon platform to mid-market and enterprise accounts. Full sales cycle from prospecting to close. Sell Falcon Endpoint Protection, Falcon Identity Threat Protection, Falcon Cloud Security, and Charlotte AI to CISOs, SOC managers, and IT Directors. Manage channel partner relationships (MSSPs, VARs). 4+ years enterprise cybersecurity sales required. Must understand and compete against SentinelOne, Microsoft Defender XDR, and Palo Alto Cortex XDR.`,
  },
  {
    label: 'Tesla Energy Sales',
    emoji: '⚡',
    company: 'Tesla',
    role: 'Energy Sales Advisor',
    jd: `Energy Sales Advisor at Tesla Energy in the St. Louis metro area. Drive adoption of Powerwall home battery systems, Solar Roof, and commercial Megapack solutions. Generate and close residential solar+storage leads. Manage commercial and industrial (C&I) Megapack pipeline with utilities and large businesses. Educate customers on energy independence, net metering, federal Investment Tax Credit (ITC), and utility rate arbitrage. Compete against Sunrun, SunPower, Enphase, and local installers. 2+ years sales experience required, energy or home improvement preferred.`,
  },
  {
    label: 'Salesforce AE',
    emoji: '💼',
    company: 'Salesforce',
    role: 'Account Executive — Commercial',
    jd: `Account Executive at Salesforce targeting commercial accounts (100-1000 employees) in the central US region. Full-cycle sales of Salesforce CRM (Sales Cloud, Service Cloud), Einstein AI, Marketing Cloud, and Data Cloud. Manage a book of 80-120 accounts. Quota of $2M ARR. Partner with Solution Engineers on technical demos and RFPs. Must understand Salesforce's competitive landscape vs HubSpot, Microsoft Dynamics, and Zoho. 3+ years B2B SaaS sales experience, Salesforce product knowledge preferred.`,
  },
]
