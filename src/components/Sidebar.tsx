import { motion } from 'framer-motion'
import { Layers, Plus } from 'lucide-react'
import { Project } from '../types'

interface SidebarProps {
  projects: Project[]
  activeProjectId: string | null
  onSelectProject: (id: string | null) => void
}

export function Sidebar({ projects, activeProjectId, onSelectProject }: SidebarProps) {
  return (
    <aside className="w-[280px] min-w-[280px] h-screen bg-surface border-r border-border-subtle flex flex-col">
      {/* Branding */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-vermillion rounded-md flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-serif text-xl text-cream tracking-tight">Editorial</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream/30 font-medium">
              Task Manager
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-border-subtle" />

      {/* Projects */}
      <div className="flex-1 p-6 pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-cream/30 font-semibold">
            Projects
          </span>
        </div>

        {/* All Tasks option */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectProject(null)}
          className={`w-full text-left rounded-lg px-3 py-2.5 mb-1 transition-all duration-150 ${
            activeProjectId === null
              ? 'bg-cream/10 text-cream'
              : 'text-cream/50 hover:text-cream/70 hover:bg-cream/5'
          }`}
        >
          <span className="text-sm font-medium">All Tasks</span>
        </motion.button>

        <div className="space-y-0.5 mt-2">
          {projects.map((project, i) => (
            <motion.button
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectProject(project.id)}
              className={`w-full text-left rounded-lg px-3 py-2.5 transition-all duration-150 flex items-center gap-3 ${
                activeProjectId === project.id
                  ? 'bg-cream/10 text-cream'
                  : 'text-cream/50 hover:text-cream/70 hover:bg-cream/5'
              }`}
            >
              <span className="text-[10px] font-mono text-vermillion/60 w-5">
                {project.icon}
              </span>
              <span className="text-sm font-medium flex-1">{project.name}</span>
              <span className="text-[10px] text-cream/25 font-mono">{project.taskCount}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0">
        <div className="text-[10px] text-cream/15 font-mono uppercase tracking-wider">
          v1.0 — 2026
        </div>
      </div>
    </aside>
  )
}
