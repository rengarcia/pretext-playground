export interface Email {
  id: number
  from: string
  subject: string
  body: string
  date: string
  read: boolean
}

const senders = [
  'Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eva Martinez',
  'Frank Lee', 'Grace Kim', 'Henry Chen', 'Iris Patel', 'Jack Wilson',
  'Karen Davis', 'Leo Garcia', 'Maria Rodriguez', 'Nathan Taylor', 'Olivia Moore',
]

const subjects = [
  'Q4 Sprint Planning Update',
  'Re: Design system migration',
  'Urgent: Production incident',
  'Weekly standup notes',
  'New component library proposal',
  'Customer feedback summary',
  'API deprecation timeline',
  'Re: Performance review prep',
  'Launch checklist for v3.0',
  'Team offsite planning',
  'Re: Code review feedback',
  'Infrastructure cost analysis',
  'New hire onboarding schedule',
  'Security audit findings',
  'Re: Feature flag rollout plan',
  'Third-party integration update',
  'Accessibility compliance report',
  'Re: Database migration strategy',
  'Marketing campaign assets needed',
  'Re: Mobile app crash report',
]

const bodySnippets = [
  'Just wanted to follow up on our discussion from the last meeting. I think we should prioritize the refactoring work before adding new features.',
  'The deployment went smoothly last night. All metrics are looking healthy and we haven\'t seen any error spikes.',
  'I\'ve been reviewing the component library and found several opportunities to reduce bundle size. The main culprits are the unused icon imports and the legacy date picker.',
  'Can we schedule a quick sync to discuss the API changes? I have some concerns about backward compatibility that I\'d like to address before we merge.',
  'Great news! The performance improvements we shipped last week resulted in a 40% reduction in Time to Interactive across our main landing pages.',
  'Here are the key takeaways from the customer feedback session: users love the new search functionality but are struggling with the navigation between sections.',
  'Reminder: please update your local environment to Node 22 before the end of the week. The CI pipeline will be updated on Monday.',
  'The design team has finalized the new color palette and typography scale. I\'ve attached the Figma link for reference.',
  'We need to migrate the remaining legacy endpoints by end of Q1. I\'ve created tickets for each service that needs updating.',
  'The A/B test results are in and variant B significantly outperformed the control. Recommending we roll it out to 100% of users.',
  'I noticed some flaky tests in the integration suite. Looks like they\'re timing-dependent. I\'ll create a fix PR today.',
  'Please review the proposed architecture for the new notification system. I\'ve outlined three approaches with trade-offs in the RFC document.',
  'The monitoring dashboard is showing elevated latency on the search endpoint. Investigating whether it\'s related to the index rebuild.',
  'Heads up: the third-party analytics SDK released a major version with breaking changes. We should pin our current version until we can test the upgrade.',
  'I\'ve completed the accessibility audit for the settings page. Found 12 issues, mostly related to keyboard navigation and screen reader announcements.',
  'The data pipeline has been running stable for the past two weeks since we fixed the memory leak. No more OOM crashes.',
  'Quick update on the mobile release: we\'re targeting next Tuesday for the App Store submission. All critical bugs have been resolved.',
  'The GraphQL schema changes are ready for review. I\'ve also updated the generated TypeScript types and the Storybook stories.',
  'Can someone take a look at the Sentry error for null pointer in the checkout flow? It started appearing after yesterday\'s deploy.',
  'The load testing results look promising. We can handle 3x our current peak traffic with the new caching layer in place.',
]

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generateBody(rand: () => number): string {
  const paragraphCount = Math.floor(rand() * 4) + 1
  const paragraphs: string[] = []
  for (let i = 0; i < paragraphCount; i++) {
    const snippetCount = Math.floor(rand() * 3) + 1
    const sentences: string[] = []
    for (let j = 0; j < snippetCount; j++) {
      sentences.push(bodySnippets[Math.floor(rand() * bodySnippets.length)])
    }
    paragraphs.push(sentences.join(' '))
  }
  return paragraphs.join('\n\n')
}

function generateEmails(count: number): Email[] {
  const rand = seededRandom(42)
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    from: senders[Math.floor(rand() * senders.length)],
    subject: subjects[Math.floor(rand() * subjects.length)],
    body: generateBody(rand),
    date: new Date(2025, 0, 1 + Math.floor(rand() * 90)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    read: rand() > 0.3,
  }))
}

export const emails = generateEmails(500)
