'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Layers, Plus, Settings2, GripVertical, LayoutDashboard, CheckSquare } from 'lucide-react'
import Link from 'next/link'
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

import styles from './CategorySidebar.module.css'

interface Category {
  id: string
  name: string
  icon: string
  defaultColor: string
  isDefault: boolean
  habitCount: number
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

  interface SortableItemProps {
    category: Category
    activeCategoryId: string
    onSelect: (id: string, e: React.MouseEvent) => void
    onEdit: (category: Category) => void
  }

  // Inner component for style scoping
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
    }

    const isActive = activeCategoryId === category.id

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={clsx(styles.itemWrapper, isDragging && styles.dragging)}
      >
        <div className={clsx(styles.item, isActive && styles.itemActive)}>
          <div className={styles.dragHandle} {...attributes} {...listeners}>
            <GripVertical size={14} />
          </div>

          <div
            className={styles.clickArea}
            onClick={(e) => onSelect(category.id, e)}
          >
            <div
              className={styles.iconWrapper}
              style={{
                backgroundColor: isActive ? category.defaultColor : undefined,
                color: isActive ? '#fff' : undefined,
              }}
            >
              {category.icon}
            </div>
            <span className={styles.name}>{category.name}</span>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              onClick={() => onEdit(category)}
              aria-label={`Edit ${category.name}`}
            >
              <Settings2 size={14} />
            </button>
            {category.habitCount > 0 && (
              <span className={styles.count}>{category.habitCount}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    // ... (rest of query and mutation logic)
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
        distance: 8,
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

      if (previousCategories) {
        const newCategories = [...(previousCategories as Category[])].sort(
          (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
        )
        queryClient.setQueryData(['categories'], newCategories)
      }

      return { previousCategories }
    },
    onError: (err, _newOrder, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories'], context.previousCategories)
      }
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

  const handleCategorySelect = (id: string, _e: React.MouseEvent) => {
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
    <div className={styles.content}>
      <div className={styles.header}>
        <h2 className={styles.title}>Categories</h2>
        <button
          className={styles.addBtn}
          onClick={handleAddCategory}
          aria-label="Add category"
        >
          <Plus size={18} />
        </button>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <Link
            href="/"
            className={clsx(
              styles.item,
              pathname === '/' && styles.itemActive
            )}
          >
            <div className={styles.iconWrapper}>
              <LayoutDashboard size={18} />
            </div>
            <span className={styles.name}>Dashboard</span>
          </Link>

          <Link
            href="/tasks"
            className={clsx(
              styles.item,
              pathname === '/tasks' && styles.itemActive
            )}
          >
            <div className={styles.iconWrapper}>
              <CheckSquare size={18} />
            </div>
            <span className={styles.name}>Tasks</span>
          </Link>
        </div>

        <div className={styles.navDivider} />

        <button
          onClick={(e) => handleCategorySelect('all', e)}
          className={clsx(
            styles.item,
            styles.allHabitsBtn,
            pathname === '/' && activeCategoryId === 'all' && styles.itemActive
          )}
        >
          <div className={styles.iconWrapper}>
            <Layers size={18} />
          </div>
          <span className={styles.name}>All Habits</span>
        </button>

        {isLoading ? (
          <div className={styles.loading}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.skeleton} />
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
    </div>
  )
}
