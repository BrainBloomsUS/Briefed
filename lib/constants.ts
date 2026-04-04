export const SYSTEM_PROMPT = `You are an expert career coach and industry analyst. Create a concise field guide for someone preparing for a job role.

CRITICAL RULES:
1. Respond with ONLY raw JSON. NO backticks. NO markdown. NO preamble. Start your response with { and end with }
2. Keep ALL text fields SHORT - max 2 sentences per prose section
3. Complete the ENTIRE JSON - finishing is more important than depth
4. If running long, cut content from later sections to ensure JSON closes properly

JSON structure to follow exactly:

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
- positioningSummary: 2 sentence elevator pitch`

export const DEPTH_INSTRUCTIONS: Record<string, string> = {
  quick: 'Create 3 courses. Each course: exactly 2 sections. Competitor table: 5 rows. Glossary: 10 terms. CareerTips: 3 tips.',
  standard: 'Create 5 courses. Each course: exactly 2-3 sections. Competitor table: 7 rows. Glossary: 15 terms. CareerTips: 4 tips.',
  deep: 'Create 7 courses. Each course: exactly 3 sections. Competitor table: 10 rows. Glossary: 20 terms. CareerTips: 5 tips.',
}

export const AUDIENCE_INSTRUCTIONS: Record<string, string> = {
  beginner: 'The reader is a complete beginner. Define every acronym, use everyday analogies, never assume prior industry knowledge.',
  some: 'The reader has general business familiarity but no deep industry knowledge. Define specialized terms, skip basic concepts.',
  technical: 'The reader is technically experienced. Focus on architecture decisions, spec-level detail, and expert-level insights.',
}

export const EXAMPLE_JDS = [
  {
    label: 'DriveCentric SC',
    emoji: 'car',
    company: 'DriveCentric',
    role: 'Solutions Consultant',
    jd: `Solutions Consultant at DriveCentric, the leading AI-powered CRM platform for automotive dealerships. You will serve as the technical layer between our sales team and dealership clients including General Managers, Dealer Principals, and BDC Managers. Lead deep discovery meetings, deliver custom-tailored demos of our CRM, AI engagement tools, and service scheduling platform. Answer technical questions about API integrations, DMS connectivity, and agentic AI capabilities. 5+ years in a technical customer-facing role required. Domain knowledge of dealer systems in Digital Retail, CDP, Chat, F&I, Service scheduling, Agentic AI, and reporting. Familiarity with automotive CRM competitors VinSolutions, Elead, DealerSocket strongly preferred.`,
  },
  {
    label: 'Supermicro Sales',
    emoji: 'desktop',
    company: 'Supermicro',
    role: 'Field Sales Representative',
    jd: `Field Sales Representative at Super Micro Computer (SMCI). Sell server, storage, GPU, and networking solutions to enterprise data centers, AI/HPC research labs, and cloud providers in the Midwest territory. Must understand Supermicro server product families including SuperBlade, BigTwin, and HGX GPU servers, storage systems, cooling infrastructure including DLC and liquid cooling, and management software including IPMI, SSM, and SAA. Comfortable presenting to both technical architects discussing PCIe, NVMe, and InfiniBand and C-level buyers discussing TCO, ROI, and supply chain. Will compete against Dell PowerEdge, HPE ProLiant, and Lenovo ThinkSystem.`,
  },
  {
    label: 'AWS Solutions Architect',
    emoji: 'cloud',
    company: 'Amazon Web Services',
    role: 'Solutions Architect',
    jd: `Solutions Architect at Amazon Web Services. Help customers design and build scalable, reliable, and secure cloud architectures on AWS. Partner with enterprise sales teams to understand customer technical requirements and propose AWS solutions. Deep expertise in EC2, S3, RDS, Lambda, VPC, IAM, and CloudFormation required. Experience with container orchestration using EKS and ECS. Ability to lead technical workshops and proof-of-concept engagements. Must be able to translate complex technical concepts for non-technical executives. Will compete against Microsoft Azure and Google Cloud Platform.`,
  },
  {
    label: 'CrowdStrike Territory',
    emoji: 'shield',
    company: 'CrowdStrike',
    role: 'Territory Account Manager',
    jd: `Territory Account Manager at CrowdStrike. Drive new business and expand existing accounts within an assigned territory selling the Falcon platform including endpoint protection, threat intelligence, identity protection, and cloud security. Build relationships with CISOs, IT Directors, and Security Operations teams. Must understand cybersecurity frameworks including MITRE ATT&CK, NIST, and SOC2. Experience selling against Palo Alto Cortex, SentinelOne, and Microsoft Defender. 5+ years enterprise security sales experience required. Strong understanding of incident response, managed detection and response, and zero trust architecture.`,
  },
  {
    label: 'Tesla Energy Sales',
    emoji: 'bolt',
    company: 'Tesla',
    role: 'Energy Advisor',
    jd: `Energy Advisor at Tesla Energy. Sell residential and commercial solar and energy storage solutions including Powerwall and Powerpack. Conduct in-home consultations and site assessments. Educate customers on solar economics, net metering, utility rate structures, and available tax incentives including the federal ITC. Design custom solar systems using Tesla design tools. Must understand electrical fundamentals, roof types, and shading analysis. Compete against SunPower, Sunrun, and local installers. Strong consultative sales skills required with ability to manage a pipeline of 50+ leads monthly.`,
  },
  {
    label: 'Salesforce AE',
    emoji: 'cloud',
    company: 'Salesforce',
    role: 'Account Executive',
    jd: `Account Executive at Salesforce selling the Customer 360 platform including Sales Cloud, Service Cloud, Marketing Cloud, and Data Cloud to mid-market companies with 200-1000 employees. Own full sales cycle from prospecting through close. Partner with solution engineers to deliver compelling demos and business value assessments. Must understand CRM workflows, Apex development basics, and Salesforce integration patterns. Experience with multi-stakeholder deals involving IT, Sales Operations, and C-suite required. Will compete against HubSpot, Microsoft Dynamics, and Oracle CX. Quota of 1.2M annually.`,
  },
]
