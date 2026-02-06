import { FileText, Plus, Trash2 } from 'lucide-react'
import { useTemplates } from '../hooks/useTemplates'

interface TemplatePickerProps {
  projectId?: number | null
}

export function TemplatePicker({ projectId }: TemplatePickerProps) {
  const { templates, deleteTemplate } = useTemplates(projectId)

  return (
    <div className="p-8 h-full overflow-auto">
      <h2 className="font-serif text-2xl text-text-primary mb-6">Templates</h2>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={40} className="mx-auto mb-4 text-text-ghost/30" />
          <p className="text-sm text-text-ghost mb-2">No templates yet</p>
          <p className="text-xs text-text-ghost/60">
            Create templates from existing tasks using the task detail panel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="bg-secondary border border-border-subtle rounded-xl p-4 hover:shadow-editorial-hover transition-shadow group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-text-primary">{template.name}</h3>
                <button
                  onClick={() => deleteTemplate(template.id!)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-text-ghost hover:text-red-400 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <p className="text-xs text-text-ghost mb-3 line-clamp-2">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-ghost/60">
                  Used {template.usageCount} time{template.usageCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
