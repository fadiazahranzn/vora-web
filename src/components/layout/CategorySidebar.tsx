'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Layers } from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: string
  defaultColor: string
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

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      return res.json()
    },
  })

  const handleCategorySelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id === 'all') {
      params.delete('category')
    } else {
      params.set('category', id)
    }
    router.push(`${pathname}?${params.toString()}`)
    if (onSelectAction) onSelectAction()
  }

  return (
    <div className="vora-sidebar-content">
      <div className="vora-sidebar-header">
        <h2 className="vora-sidebar-title">Categories</h2>
      </div>

      <nav className="vora-sidebar-nav">
        <button
          onClick={() => handleCategorySelect('all')}
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
          categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={clsx(
                'vora-sidebar-item',
                activeCategoryId === category.id && 'vora-sidebar-item--active'
              )}
            >
              <span className="vora-sidebar-item-icon">{category.icon}</span>
              <span className="vora-sidebar-item-name">{category.name}</span>
              {category.habitCount > 0 && (
                <span className="vora-sidebar-item-count">
                  {category.habitCount}
                </span>
              )}
            </button>
          ))
        )}
      </nav>

      <style jsx>{`
        .vora-sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: var(--vora-space-6) var(--vora-space-4);
        }

        .vora-sidebar-header {
          margin-bottom: var(--vora-space-6);
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
          transition: all var(--vora-duration-fast);
          text-align: left;
          width: 100%;
        }

        .vora-sidebar-item:hover {
          background: var(--vora-color-bg-tertiary);
          color: var(--vora-color-text-primary);
        }

        .vora-sidebar-item--active {
          background: var(--vora-color-accent-subtle);
          color: var(--vora-color-accent-primary);
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
        }

        .vora-sidebar-item-count {
          font-size: var(--vora-font-size-caption);
          font-weight: var(--vora-font-weight-bold);
          background: var(--vora-color-bg-tertiary);
          color: var(--vora-color-text-secondary);
          padding: 2px 8px;
          border-radius: var(--vora-radius-full);
        }

        .vora-sidebar-item--active .vora-sidebar-item-count {
          background: var(--vora-color-accent-primary);
          color: var(--vora-color-text-inverse);
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
