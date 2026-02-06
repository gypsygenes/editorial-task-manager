import { Priority } from '../types'

interface PriorityConfig {
  label: string
  color: string
  bg: string
}

export const priorityConfig: Record<Priority, PriorityConfig> = {
  urgent: {
    label: 'Urgent',
    color: 'text-red-400',
    bg: 'bg-red-500/20',
  },
  high: {
    label: 'High',
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
  },
  low: {
    label: 'Low',
    color: 'text-sage',
    bg: 'bg-sage/20',
  },
}
