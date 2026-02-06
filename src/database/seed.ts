import { db } from './db'

const now = () => new Date().toISOString()

export async function seedDatabase() {
  await db.transaction(
    'rw',
    [db.projects, db.boards, db.columns, db.tasks, db.labels, db.settings],
    async () => {
      // Check inside transaction to prevent double-seeding from React StrictMode
      const settingsCount = await db.settings.where('key').equals('seeded').count()
      if (settingsCount > 0) return
      // ── Projects ──
      const proj1 = await db.projects.add({
        name: 'Brand Redesign',
        icon: '01',
        description: 'Complete brand overhaul with new visual identity',
        color: '#FF4D00',
        starred: true,
        position: 0,
        createdAt: now(),
        updatedAt: now(),
      })
      const proj2 = await db.projects.add({
        name: 'Q1 Campaign',
        icon: '02',
        description: 'First quarter marketing campaign',
        color: '#2563EB',
        starred: false,
        position: 1,
        createdAt: now(),
        updatedAt: now(),
      })
      const proj3 = await db.projects.add({
        name: 'Product Launch',
        icon: '03',
        description: 'New product launch preparation',
        color: '#059669',
        starred: false,
        position: 2,
        createdAt: now(),
        updatedAt: now(),
      })

      // ── Boards (1 per project) ──
      const board1 = await db.boards.add({
        projectId: proj1,
        name: 'Main Board',
        description: 'Primary board for Brand Redesign',
        starred: true,
        position: 0,
        createdAt: now(),
        updatedAt: now(),
      })
      const board2 = await db.boards.add({
        projectId: proj2,
        name: 'Main Board',
        description: 'Primary board for Q1 Campaign',
        starred: false,
        position: 0,
        createdAt: now(),
        updatedAt: now(),
      })
      const board3 = await db.boards.add({
        projectId: proj3,
        name: 'Main Board',
        description: 'Primary board for Product Launch',
        starred: false,
        position: 0,
        createdAt: now(),
        updatedAt: now(),
      })

      // ── Columns (3 per board) ──
      const boardIds = [board1, board2, board3]
      const colMap: Record<number, { todo: number; inProgress: number; done: number }> = {}

      for (const bid of boardIds) {
        const todo = await db.columns.add({
          boardId: bid,
          title: 'To Do',
          color: 'bg-orange-400',
          position: 0,
          limit: null,
          createdAt: now(),
          updatedAt: now(),
        })
        const inProgress = await db.columns.add({
          boardId: bid,
          title: 'In Progress',
          color: 'bg-amber-400',
          position: 1,
          limit: null,
          createdAt: now(),
          updatedAt: now(),
        })
        const done = await db.columns.add({
          boardId: bid,
          title: 'Done',
          color: 'bg-sage',
          position: 2,
          limit: null,
          createdAt: now(),
          updatedAt: now(),
        })
        colMap[bid] = { todo, inProgress, done }
      }

      // ── Labels ──
      const labelColors = [
        { name: 'Design', color: '#8B5CF6' },
        { name: 'Development', color: '#2563EB' },
        { name: 'Marketing', color: '#E11D48' },
        { name: 'Research', color: '#059669' },
        { name: 'Content', color: '#F59E0B' },
        { name: 'Review', color: '#06B6D4' },
      ]

      for (const [projId, labels] of [
        [proj1, labelColors],
        [proj2, labelColors],
        [proj3, labelColors],
      ] as [number, typeof labelColors][]) {
        for (let i = 0; i < labels.length; i++) {
          await db.labels.add({
            projectId: projId,
            name: labels[i].name,
            color: labels[i].color,
            position: i,
            createdAt: now(),
            updatedAt: now(),
          })
        }
      }

      // ── Tasks ──
      // Board 1 (Brand Redesign)
      await db.tasks.bulkAdd([
        {
          boardId: board1,
          columnId: colMap[board1].todo,
          title: 'Finalize brand guidelines document',
          description:
            'Complete the comprehensive brand guidelines including typography, color palette, spacing rules, and logo usage. Coordinate with the design team for final approval before distribution.',
          priority: 'urgent',
          position: 0,
          assignees: ['Sarah Chen'],
          dueDate: '2026-02-12',
          labelIds: [],
          coverImageId: null,
          archivedAt: null,
          completedAt: null,
          createdAt: '2026-01-28T00:00:00.000Z',
          updatedAt: now(),
        },
        {
          boardId: board1,
          columnId: colMap[board1].todo,
          title: 'Review homepage wireframes',
          description:
            'Evaluate the latest homepage wireframes for usability and visual hierarchy. Provide detailed feedback on layout, CTA placement, and responsive behavior.',
          priority: 'high',
          position: 1,
          assignees: ['Marcus Rivera'],
          dueDate: '2026-02-10',
          labelIds: [],
          coverImageId: null,
          archivedAt: null,
          completedAt: null,
          createdAt: '2026-01-30T00:00:00.000Z',
          updatedAt: now(),
        },
        {
          boardId: board1,
          columnId: colMap[board1].inProgress,
          title: 'Design social media templates',
          description:
            'Create a set of reusable social media templates for Instagram, Twitter, and LinkedIn. Ensure brand consistency and adaptability across formats.',
          priority: 'high',
          position: 0,
          assignees: ['Sarah Chen'],
          dueDate: '2026-02-08',
          labelIds: [],
          coverImageId: null,
          archivedAt: null,
          completedAt: null,
          createdAt: '2026-01-25T00:00:00.000Z',
          updatedAt: now(),
        },
        {
          boardId: board1,
          columnId: colMap[board1].inProgress,
          title: 'Audit existing color palette',
          description:
            'Review and document the current color palette usage across all digital touchpoints. Identify inconsistencies and propose a refined, accessible palette.',
          priority: 'low',
          position: 1,
          assignees: ['Marcus Rivera'],
          dueDate: '2026-02-15',
          labelIds: [],
          coverImageId: null,
          archivedAt: null,
          completedAt: null,
          createdAt: '2026-02-02T00:00:00.000Z',
          updatedAt: now(),
        },
      ])

      // Board 2 (Q1 Campaign)
      await db.tasks.bulkAdd([
        {
          boardId: board2,
          columnId: colMap[board2].todo,
          title: 'Set up analytics dashboard',
          description:
            'Configure the campaign analytics dashboard with key metrics: CTR, conversion rates, and audience engagement. Connect all data sources and set up automated reporting.',
          priority: 'medium',
          position: 0,
          assignees: ['Aisha Patel'],
          dueDate: '2026-02-14',
          labelIds: [],
          coverImageId: null,
          archivedAt: null,
          completedAt: null,
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: now(),
        },
        {
          boardId: board2,
          columnId: colMap[board2].done,
          title: 'Compile campaign performance report',
          description:
            'Gather all Q4 campaign data and compile a comprehensive performance report with insights, benchmarks, and recommendations for Q1 strategy.',
          priority: 'medium',
          position: 0,
          assignees: ['Aisha Patel'],
          dueDate: '2026-02-03',
          labelIds: [],
          coverImageId: null,
          archivedAt: null,
          completedAt: '2026-02-03T00:00:00.000Z',
          createdAt: '2026-01-20T00:00:00.000Z',
          updatedAt: now(),
        },
      ])

      // Board 3 (Product Launch)
      await db.tasks.bulkAdd([
        {
          boardId: board3,
          columnId: colMap[board3].inProgress,
          title: 'Write product announcement copy',
          description:
            'Draft compelling copy for the product launch announcement across email, blog, and press release channels. Align messaging with brand voice guidelines.',
          priority: 'urgent',
          position: 0,
          assignees: ['James Okonkwo'],
          dueDate: '2026-02-07',
          labelIds: [],
          coverImageId: null,
          archivedAt: null,
          completedAt: null,
          createdAt: '2026-01-29T00:00:00.000Z',
          updatedAt: now(),
        },
        {
          boardId: board3,
          columnId: colMap[board3].done,
          title: 'Create launch event landing page',
          description:
            'Design and build the landing page for the product launch event. Include RSVP form, countdown timer, and speaker profiles with responsive design.',
          priority: 'high',
          position: 0,
          assignees: ['James Okonkwo'],
          dueDate: '2026-02-01',
          labelIds: [],
          coverImageId: null,
          archivedAt: null,
          completedAt: '2026-02-01T00:00:00.000Z',
          createdAt: '2026-01-15T00:00:00.000Z',
          updatedAt: now(),
        },
      ])

      // Mark as seeded
      await db.settings.add({ key: 'seeded', value: 'true' })
    }
  )
}
