export const SYSTEM_PROMPT = `You are an expert career coach and industry analyst. Create a concise field guide for someone preparing for a job role.

CRITICAL RULES:
1. Respond with ONLY raw JSON - NO markdown fences, NO backticks, NO preamble
2. Keep ALL text fields SHORT - max 2 sentences per prose section
3. Complete the ENTIRE JSON - finishing is more important than depth
4. If you are running long, cut content from later sections to ensure the JSON closes properly

JSON structure (follow exactly):

{
  "company": "string",
  "role": "string", 
  "industry": "string",
  "overview": "2 sentence max",
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
      "subtitle": "One line",
      "sections": [
        { "type": "prose", "heading": "Heading", "content": "2 sentences max." },
        { "type": "bullets", "heading": "Key points", "items": ["item1","item2","item3"] }
      ]
    }
  ],
  "competitorTable": {
    "competitors": ["Competitor1","Competitor2","Competitor3"],
    "rows": [
      { "category": "Category", "company": "What this company offers", "competitor1": "C1 offer", "competitor2": "C2 offer", "competitor3": "C3 offer" }
    ]
  },
  "careerTips": ["Tip 1","Tip 2","Tip 3","Tip 4"],
  "glossary": [
    { "term": "TERM", "fullForm": "Full form", "definition": "One sentence definition" }
  ]
}

RESUME ANALYSIS (only when resume provided):
- hasResume: true
- matchScore: 0-100 integer
- recommendedLevel: "beginner", "some", or "technical"
- matchLabel: "Complete beginner", "Some background knowledge", or "Experienced & technical"
- yourStrengths: 3-4 specific bullets from their resume mapping to JD
- skillGaps: 2-3 gaps
- talkingPoints: 3-4 first-person interview statements
- positioningSummary: 2 sentence elevator pitch``

export const DEPTH_INSTRUCTIONS: Record<string, string> = {
  quick: 'Create 3 courses. Each course: exactly 2 sections. Keep every text field to 1-2 sentences. Competitor table: 5 rows. Glossary: 10 terms. CareerTips: 3 tips.',
  standard: 'Create 5 courses. Each course: exactly 2-3 sections. Keep prose to 2 sentences max. Competitor table: 7 rows. Glossary: 15 terms. CareerTips: 4 tips.',
  deep: 'Create 7 courses. Each course: exactly 3 sections. Competitor table: 10 rows. Glossary: 20 terms. CareerTips: 5 tips.',
}

export const AUDIENCE_INSTRUCTIONS: Record<string, string> = {
  beginner: 'The reader is a complete beginner - define every acronym on first use, use everyday analogies (e.g. "think of it like..."), never assume prior industry knowledge.',
  some: 'The reader has general business and tech familiarity but no deep industry knowledge. Define acronyms on first use, explain specialized concepts clearly, skip explaining basics like "what is email."',
  technical: 'The reader is technically experienced. Focus on architecture decisions, spec-level detail, nuanced tradeoffs, and expert-level insights. Skip basic definitions.',
}

export const EXAMPLE_JDS = [
  {
    label: 'DriveCentric SC',
    emoji: '🚗',
    company: 'DriveCentric',
    role: 'Solutions Consultant',
    jd: `Solutions Consultant at DriveCentric - the leading AI-powered CRM platform for automotive dealerships. You will serve as the technical layer between our sales team and dealership clients (General Managers, Dealer Principals, BDC Managers). Lead deep discovery meetings, deliver custom-tailored demos of our CRM, AI engagement tools, and service scheduling platform. Answer technical questions about API integrations, DMS connectivity, and agentic AI capabilities. 5+ years in a technical customer-facing role required. Domain knowledge of dealer systems in Digital Retail, CDP, Chat, F&I, Service scheduling, Agentic AI, and reporting. Familiarity with automotive CRM competitors (VinSolutions, Elead, DealerSocket) strongly preferred.`,
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
    role: 'Account Executive - Commercial',
    jd: `Account Executive at Salesforce targeting commercial accounts (100-1000 employees) in the central US region. Full-cycle sales of Salesforce CRM (Sales Cloud, Service Cloud), Einstein AI, Marketing Cloud, and Data Cloud. Manage a book of 80-120 accounts. Quota of $2M ARR. Partner with Solution Engineers on technical demos and RFPs. Must understand Salesforce's competitive landscape vs HubSpot, Microsoft Dynamics, and Zoho. 3+ years B2B SaaS sales experience, Salesforce product knowledge preferred.`,
  },
]
