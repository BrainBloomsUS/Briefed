export interface GuideSection {
  type: 'prose' | 'bullets' | 'termsBold' | 'table' | 'callout'
  heading: string
  content?: string
  items?: Array<{ term: string; definition: string } | string>
  columns?: string[]
  rows?: string[][]
  calloutType?: 'tip' | 'warning' | 'info'
}

export interface GuideCourse {
  code: string
  title: string
  subtitle: string
  sections: GuideSection[]
}

export interface CompetitorRow {
  category: string
  company: string
  competitor1?: string
  competitor2?: string
  competitor3?: string
}

export interface GlossaryEntry {
  term: string
  fullForm: string
  definition: string
}

export interface GuideData {
  company: string
  role: string
  industry: string
  overview: string
  keySkills: string[]
  courses: GuideCourse[]
  competitorTable: {
    competitors: string[]
    rows: CompetitorRow[]
  }
  careerTips: string[]
  glossary: GlossaryEntry[]
}

export type GenerationStatus =
  | 'idle'
  | 'loading'
  | 'streaming'
  | 'done'
  | 'error'
