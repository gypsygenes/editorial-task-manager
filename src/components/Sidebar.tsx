import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, ChevronRight, Star, Plus, Activity, Archive, FileText } from 'lucide-react'
import type { DBProject } from '../types/database'
import { useBoards } from '../hooks/useBoards'
import { ThemePicker } from './ThemePicker'

interface SidebarProps {
  projects: DBProject[]
  activeProjectId: number | null
  activeBoardId: number | null
  onSelectProject: (id: number | null) => void
  onSelectBoard: (boardId: number, projectId: number) => void
  sidebarView: 'board' | 'activity' | 'archive' | 'templates'
  onSidebarViewChange: (view: 'board' | 'activity' | 'archive' | 'templates') => void
}

function ProjectAccordion({
  project,
  isActive,
  activeBoardId,
  onSelectProject,
  onSelectBoard,
}: {
  project: DBProject
  isActive: boolean
  activeBoardId: number | null
  onSelectProject: (id: number) => void
  onSelectBoard: (boardId: number, projectId: number) => void
}) {
  const [expanded, setExpanded] = useState(isActive)
  const { boards } = useBoards(project.id)

  const handleClick = () => {
    onSelectProject(project.id!)
    setExpanded(prev => !prev)
  }

  return (
    <div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`w-full text-left rounded-lg px-3 py-2.5 transition-all duration-150 flex items-center gap-3 ${
          isActive
            ? 'bg-text-primary/10 text-text-primary'
            : 'text-text-muted hover:text-text-secondary hover:bg-text-primary/5'
        }`}
      >
        <span className="text-[10px] font-mono text-accent/60 w-5">{project.icon}</span>
        <span className="text-sm font-medium flex-1 truncate">{project.name}</span>
        {project.starred && <Star size={11} className="text-amber-400 fill-amber-400" />}
        <motion.span
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronRight size={12} className="text-text-ghost" />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-8 py-1 space-y-0.5">
              {boards.map(board => (
                <button
                  key={board.id}
                  onClick={() => onSelectBoard(board.id!, project.id!)}
                  className={`w-full text-left rounded-md px-3 py-1.5 text-xs transition-colors flex items-center gap-2 ${
                    activeBoardId === board.id
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-hint hover:text-text-muted hover:bg-text-primary/5'
                  }`}
                >
                  <span className="flex-1 truncate">{board.name}</span>
                  {board.starred && <Star size={9} className="text-amber-400 fill-amber-400" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar({
  projects,
  activeProjectId,
  activeBoardId,
  onSelectProject,
  onSelectBoard,
  sidebarView,
  onSidebarViewChange,
}: SidebarProps) {
  return (
    <aside className="w-[280px] min-w-[280px] h-screen bg-secondary border-r border-border-subtle flex flex-col">
      {/* Branding */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-serif text-xl text-text-primary tracking-tight">Editorial</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-ghost font-medium">
              Task Manager
            </p>
          </div>
        </div>
      </div>

      <div className="mx-6 border-t border-border-subtle" />

      {/* Projects */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-ghost font-semibold">
            Projects
          </span>
        </div>

        <div className="space-y-0.5">
          {projects.map(project => (
            <ProjectAccordion
              key={project.id}
              project={project}
              isActive={activeProjectId === project.id}
              activeBoardId={activeBoardId}
              onSelectProject={onSelectProject}
              onSelectBoard={onSelectBoard}
            />
          ))}
        </div>

        {/* Navigation Links */}
        <div className="mt-6 pt-4 border-t border-border-subtle space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-ghost font-semibold block mb-3">
            Navigation
          </span>
          <button
            onClick={() => onSidebarViewChange('activity')}
            className={`w-full text-left rounded-lg px-3 py-2 text-sm flex items-center gap-3 transition-colors ${
              sidebarView === 'activity'
                ? 'bg-text-primary/10 text-text-primary'
                : 'text-text-hint hover:text-text-muted hover:bg-text-primary/5'
            }`}
          >
            <Activity size={14} />
            <span>Activity Feed</span>
          </button>
          <button
            onClick={() => onSidebarViewChange('archive')}
            className={`w-full text-left rounded-lg px-3 py-2 text-sm flex items-center gap-3 transition-colors ${
              sidebarView === 'archive'
                ? 'bg-text-primary/10 text-text-primary'
                : 'text-text-hint hover:text-text-muted hover:bg-text-primary/5'
            }`}
          >
            <Archive size={14} />
            <span>Archive</span>
          </button>
          <button
            onClick={() => onSidebarViewChange('templates')}
            className={`w-full text-left rounded-lg px-3 py-2 text-sm flex items-center gap-3 transition-colors ${
              sidebarView === 'templates'
                ? 'bg-text-primary/10 text-text-primary'
                : 'text-text-hint hover:text-text-muted hover:bg-text-primary/5'
            }`}
          >
            <FileText size={14} />
            <span>Templates</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0 space-y-4">
        <ThemePicker />
        <div className="text-[10px] text-text-ghost/50 font-mono uppercase tracking-wider">
          v2.0 — 2026
        </div>
      </div>
    </aside>
  )
}
