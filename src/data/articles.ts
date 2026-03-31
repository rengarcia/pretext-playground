export interface Article {
  id: number
  title: string
  author: string
  body: string
  category: string
}

export const articles: Article[] = [
  {
    id: 1,
    title: 'The Future of Web Performance',
    author: 'Sarah Chen',
    category: 'Engineering',
    body: 'Modern web applications face increasing demands for instant responsiveness. Users expect sub-second load times and smooth interactions regardless of device capability or network conditions. The traditional approach of measuring layout through DOM operations creates a fundamental tension: you need measurements to lay out content, but getting those measurements requires rendering to the DOM first. This creates a chicken-and-egg problem that leads to layout shifts, flickering, and poor Core Web Vitals scores. New approaches like canvas-based text measurement offer a way to break this cycle by computing dimensions through pure arithmetic.',
  },
  {
    id: 2,
    title: 'Building Accessible Component Libraries',
    author: 'Marcus Rodriguez',
    category: 'Design',
    body: 'Accessibility is not an afterthought — it should be woven into every component from the start. When building a component library, consider keyboard navigation patterns, screen reader announcements, focus management, and color contrast ratios as first-class requirements. A well-designed system of atoms and molecules, inspired by Atomic Design principles, creates composable building blocks where accessibility features are inherited automatically. The key insight is that accessible components are simply better-engineered components: they handle edge cases, they have clear interaction models, and they degrade gracefully.',
  },
  {
    id: 3,
    title: 'Virtualization Deep Dive',
    author: 'Priya Sharma',
    category: 'Engineering',
    body: 'Virtual scrolling is essential for rendering large datasets efficiently, but implementing it correctly requires knowing item heights before they render. Most virtualization libraries either assume fixed heights or require an expensive initial measurement pass. The former limits design flexibility while the latter causes visible layout shifts as the scrollbar adjusts. A promising alternative is using text measurement libraries to pre-compute heights through pure arithmetic — no DOM needed. This means you can calculate the total scrollable height and every item\'s position before a single pixel is painted, enabling perfect scrollbar behavior and instant jump-to-position navigation.',
  },
  {
    id: 4,
    title: 'Design Systems at Scale',
    author: 'James Park',
    category: 'Design',
    body: 'Running a design system across multiple product teams requires more than a component library. It demands governance processes, contribution guidelines, versioning strategies, and clear communication channels. We learned this the hard way when our flagship product migrated to a new design token structure. The migration affected 200+ components across 12 teams. What saved us was our investment in automated codemods and a thorough deprecation workflow that gave teams 6 months of warnings before breaking changes landed.',
  },
  {
    id: 5,
    title: 'The Rise of Edge Computing in Frontend',
    author: 'Elena Volkov',
    category: 'Infrastructure',
    body: 'Edge functions are reshaping how we think about frontend architecture. By moving computation closer to users, we can reduce latency for personalized content, implement A/B testing without client-side flicker, and handle authentication at the network edge. The practical implications for component development are significant: server components, streaming SSR, and edge-side personalization all change the trade-offs in how we structure our applications. Teams are discovering that the line between "frontend" and "backend" is becoming increasingly blurred as more logic moves to the edge.',
  },
  {
    id: 6,
    title: 'State Management in 2025',
    author: 'Tom Nakamura',
    category: 'Engineering',
    body: 'The state management landscape has evolved dramatically. We\'ve moved from global stores to more granular, co-located state solutions. Server state libraries handle cache synchronization, URL state captures navigation context, and local component state handles UI interactions. The proliferation of options can be overwhelming, but the key principle remains simple: put state as close to where it\'s used as possible, and lift it only when sharing is necessary. The best state management is the least state management — derive what you can, cache what you must, and synchronize only what changes.',
  },
  {
    id: 7,
    title: 'Masonry Layouts Without CSS Grid',
    author: 'Lisa Andersen',
    category: 'CSS',
    body: 'True masonry layouts — where items flow into columns like bricks in a wall — remain surprisingly difficult to implement efficiently on the web. CSS Grid\'s masonry proposal is still experimental and not widely supported. JavaScript-based solutions work but require knowing item heights upfront, which typically means a DOM measurement pass that causes layout thrash. The performance cost compounds with item count: 100 items means 100 forced reflows. Pre-computing text heights through canvas measurement eliminates this bottleneck entirely, making masonry layouts with hundreds of items feel instantaneous.',
  },
  {
    id: 8,
    title: 'Responsive Typography That Works',
    author: 'David Kim',
    category: 'Design',
    body: 'Typography makes or breaks a design. Responsive type isn\'t just about scaling font sizes — it\'s about maintaining readability, rhythm, and hierarchy across viewports. A robust type scale uses CSS clamp() for fluid sizing, but the hard part is predicting how text will reflow at different breakpoints. Will that headline wrap to two lines on tablet? Will the product description need truncation on mobile? These questions are typically answered after the fact through media queries and overflow hidden. But with pre-layout text measurement, you can answer them before rendering and adapt the UI proactively.',
  },
  {
    id: 9,
    title: 'CMS Integration Patterns',
    author: 'Rachel Thompson',
    category: 'Architecture',
    body: 'Integrating a headless CMS with a modern frontend framework involves more than connecting an API. You need to consider content modeling, preview workflows, personalization, multi-site support, and editorial flexibility. Sitecore\'s field-based data binding pattern, where components declare their data requirements and the CMS resolves them at build time, creates a clean separation of concerns. Webflow\'s code island approach takes this further by allowing React components to exist as isolated boundaries within CMS-managed pages. Both patterns demonstrate that the best CMS integration is one where content authors and developers can work independently.',
  },
  {
    id: 10,
    title: 'Testing Strategies for Complex UIs',
    author: 'Alex Okafor',
    category: 'Engineering',
    body: 'Testing component-heavy applications requires a layered strategy. Unit tests verify pure logic and hooks in isolation. Integration tests check component composition and user interaction flows. Visual regression tests catch unintended styling changes. End-to-end tests validate critical user paths through the real application. The mistake teams make most often is over-indexing on one layer — typically unit tests that mock everything and prove nothing about real behavior. A healthier ratio tilts toward integration tests that render real component trees and assert on what users actually see and do. Mock the network boundary, not your own code.',
  },
]
