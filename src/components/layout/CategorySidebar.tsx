'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Layers, Plus, Settings2, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import { CategoryModal } from './CategoryModal'

interface Category {
  id: string
  name: string
  icon: string
  defaultColor: string
  isDefault: boolean
  habitCount: number
}

interface SortableItemProps {
  category: Category
  activeCategoryId: string
  onSelect: (id: string, e: React.MouseEvent) => void
  onEdit: (category: Category) => void
}

function SortableCategoryItem({
  category,
  activeCategoryId,
  onSelect,
  onEdit,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'vora-sidebar-item-wrapper',
        isDragging && 'vora-sidebar-item-wrapper--dragging'
      )}
    >
      <button
        onClick={(e) => onSelect(category.id, e)}
        className={clsx(
          'vora-sidebar-item',
          'vora-sidebar-item--has-actions',
          activeCategoryId === category.id && 'vora-sidebar-item--active'
        )}
      >
        <div
          className="vora-sidebar-item-drag-handle"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={14} />
        </div>
        <span className="vora-sidebar-item-icon">{category.icon}</span>
        <span className="vora-sidebar-item-name">{category.name}</span>

        <div className="vora-category-actions">
          <button
            className="vora-category-edit-btn"
            onClick={() => onEdit(category)}
            aria-label={`Edit ${category.name}`}
          >
            <Settings2 size={14} />
          </button>
          {category.habitCount > 0 && (
            <span className="vora-sidebar-item-count">
              {category.habitCount}
            </span>
          )}
        </div>
      </button>
    </div>
  )
}

export default function CategorySidebar({
  onSelectAction,
}: {
  onSelectAction?: () => void
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const activeCategoryId = searchParams.get('category') || 'all'
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      return res.json()
    },
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const reorderMutation = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const res = await fetch('/api/categories/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      })
      if (!res.ok) throw new Error('Failed to reorder categories')
      return res.json()
    },
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] })
      const previousCategories = queryClient.getQueryData(['categories'])

      // Optimistically update the cache
      if (previousCategories) {
        const newCategories = [...(previousCategories as Category[])].sort(
          (a, b) => {
            return orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
          }
        )
        queryClient.setQueryData(['categories'], newCategories)
      }

      return { previousCategories }
    },
    onError: (err, newOrder, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories'], context.previousCategories)
      }
      // In a real app, show a toast here
      console.error('Reorder failed:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id)
      const newIndex = categories.findIndex((c) => c.id === over.id)

      const newCategories = arrayMove(categories, oldIndex, newIndex)
      reorderMutation.mutate(newCategories.map((c) => c.id))
    }
  }

  const categoryIds = useMemo(() => categories.map((c) => c.id), [categories])

  const handleCategorySelect = (id: string, e: React.MouseEvent) => {
    // Prevent selection if clicking edit button
    if ((e.target as HTMLElement).closest('.vora-category-edit-btn')) return

    const params = new URLSearchParams(searchParams.toString())
    if (id === 'all') {
      params.delete('category')
    } else {
      params.set('category', id)
    }
    router.push(`${pathname}?${params.toString()}`)
    if (onSelectAction) onSelectAction()
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  return (
    <div className="vora-sidebar-content">
      <div className="vora-sidebar-header">
        <h2 className="vora-sidebar-title">Categories</h2>
        <button
          className="vora-add-category-btn"
          onClick={handleAddCategory}
          aria-label="Add category"
        >
          <Plus size={18} />
        </button>
      </div>

      <nav className="vora-sidebar-nav">
        <button
          onClick={(e) => handleCategorySelect('all', e)}
          className={clsx(
            'vora-sidebar-item',
            activeCategoryId === 'all' && 'vora-sidebar-item--active'
          )}
        >
          <span className="vora-sidebar-item-icon">
            <Layers size={18} />
          </span>
          <span className="vora-sidebar-item-name">All Habits</span>
        </button>

        {isLoading ? (
          <div className="vora-sidebar-loading">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="vora-sidebar-skeleton" />
            ))}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <SortableContext
              items={categoryIds}
              strategy={verticalListSortingStrategy}
            >
              {categories.map((category) => (
                <SortableCategoryItem
                  key={category.id}
                  category={category}
                  activeCategoryId={activeCategoryId}
                  onSelect={handleCategorySelect}
                  onEdit={handleEditCategory}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </nav>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
      />

      <style jsx>{`
        .vora-sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: var(--vora-space-6) var(--vora-space-4);
        }

        .vora-sidebar-header {
          margin-bottom: var(--vora-space-6);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vora-sidebar-title {
          font-size: var(--vora-font-size-overline);
          font-weight: var(--vora-font-weight-bold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--vora-color-text-tertiary);
        }

        .vora-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: var(--vora-space-2);
        }

        .vora-sidebar-item {
          display: flex;
          align-items: center;
          gap: var(--vora-space-3);
          padding: var(--vora-space-3);
          border: none;
          background: transparent;
          border-radius: var(--vora-radius-md);
          color: var(--vora-color-text-secondary);
          font-family: inherit;
          font-size: var(--vora-font-size-body);
          font-weight: var(--vora-font-weight-medium);
          cursor: pointer;
          transition:
            background var(--vora-duration-fast),
            color var(--vora-duration-fast);
          text-align: left;
          width: 100%;
          position: relative;
        }

        .vora-sidebar-item:hover {
          background: var(--vora-color-bg-tertiary);
          color: var(--vora-color-text-primary);
        }

        .vora-sidebar-item--active {
          background: var(--vora-color-accent-subtle);
          color: var(--vora-color-accent-primary);
        }

        .vora-sidebar-item-drag-handle {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--vora-color-text-tertiary);
          cursor: grab;
          padding: 2px;
          margin-left: -4px;
          border-radius: 4px;
          opacity: 0;
          transition: all var(--vora-duration-fast);
        }

        .vora-sidebar-item:hover .vora-sidebar-item-drag-handle {
          opacity: 1;
        }

        .vora-sidebar-item-drag-handle:active {
          cursor: grabbing;
        }

        .vora-sidebar-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          font-size: 18px;
        }

        .vora-sidebar-item-name {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vora-category-actions {
          display: flex;
          align-items: center;
          gap: var(--vora-space-2);
        }

        .vora-sidebar-item-count {
          font-size: var(--vora-font-size-caption);
          font-weight: var(--vora-font-weight-bold);
          background: var(--vora-color-bg-tertiary);
          color: var(--vora-color-text-secondary);
          padding: 2px 8px;
          border-radius: var(--vora-radius-full);
          transition: all var(--vora-duration-fast);
        }

        .vora-sidebar-item--active .vora-sidebar-item-count {
          background: var(--vora-color-accent-primary);
          color: var(--vora-color-text-inverse);
        }

        .vora-add-category-btn,
        .vora-category-edit-btn {
          background: transparent;
          border: none;
          color: var(--vora-color-text-tertiary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
          transition: all var(--vora-duration-fast);
        }

        .vora-add-category-btn:hover,
        .vora-category-edit-btn:hover {
          background: var(--vora-color-bg-tertiary);
          color: var(--vora-color-accent-primary);
        }

        /* Edit button only visible on hover or active */
        .vora-category-edit-btn {
          opacity: 0;
        }

        .vora-sidebar-item:hover .vora-category-edit-btn,
        .vora-sidebar-item--active .vora-category-edit-btn {
          opacity: 1;
        }

        .vora-sidebar-loading {
          display: flex;
          flex-direction: column;
          gap: var(--vora-space-2);
        }

        .vora-sidebar-skeleton {
          height: 44px;
          background: var(--vora-color-bg-tertiary);
          border-radius: var(--vora-radius-md);
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}
