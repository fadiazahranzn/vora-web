'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCategorySchema,
  type CreateCategoryInput,
} from '@/lib/validations/category'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'
import { Trash2, AlertCircle } from 'lucide-react'

const COLORS = [
  '#FF1744',
  '#FF9100',
  '#FFD600',
  '#00C853',
  '#2979FF',
  '#D500F9',
  '#37474F',
  '#795548',
  '#FF80AB',
  '#00BFA5',
  '#B0BEC5',
  '#76FF03',
]

const EMOJIS = [
  '✨',
  '💪',
  '🏃',
  '🥗',
  '📚',
  '💼',
  '🧘',
  '😴',
  '💧',
  '💰',
  '🎨',
  '🌿',
]

interface Category {
  id: string
  name: string
  icon: string
  defaultColor: string
  isDefault: boolean
}

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
}

export function CategoryModal({
  isOpen,
  onClose,
  category,
}: CategoryModalProps) {
  const isEditing = !!category
  const queryClient = useQueryClient()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      icon: '✨',
      defaultColor: COLORS[0],
    },
  })

  const selectedColor = watch('defaultColor')
  const selectedIcon = watch('icon')

  useEffect(() => {
    if (isOpen && category) {
      reset({
        name: category.name,
        icon: category.icon,
        defaultColor: category.defaultColor,
      })
    } else if (isOpen) {
      reset({
        name: '',
        icon: '✨',
        defaultColor: COLORS[0],
      })
    }
    setShowDeleteConfirm(false)
  }, [isOpen, category, reset])

  const mutation = useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const url = isEditing
        ? `/api/categories/${category.id}`
        : '/api/categories'
      const method = isEditing ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Operation failed')
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!category) return
      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Delete failed')
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
    },
  })

  const onSubmit = (data: CreateCategoryInput) => {
    mutation.mutate(data)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'New Category'}
      footer={
        <div className="vora-modal-footer-content">
          {isEditing && !category.isDefault && (
            <Button
              variant="ghost"
              className="vora-delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
              type="button"
            >
              <Trash2 size={18} />
              <span>Delete</span>
            </Button>
          )}
          <div className="vora-spacer" />
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit as any)}
            isLoading={mutation.isPending}
          >
            {isEditing ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      }
    >
      {showDeleteConfirm ? (
        <div className="vora-delete-confirm">
          <div className="vora-alert-icon">
            <AlertCircle size={48} />
          </div>
          <h3>Delete "{category?.name}"?</h3>
          <p>
            All habits in this category will be moved to{' '}
            <strong>Personal</strong>. This action cannot be undone.
          </p>
          <div className="vora-delete-actions">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              fullWidth
            >
              Go Back
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate()}
              isLoading={deleteMutation.isPending}
              fullWidth
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      ) : (
        <form
          className="vora-category-form"
          onSubmit={handleSubmit(onSubmit as any)}
        >
          {mutation.error && (
            <div className="vora-form-error">{mutation.error.message}</div>
          )}

          <Input
            label="Category Name"
            placeholder="e.g. Fitness, Work, Hobby"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="vora-form-section">
            <label className="vora-input__label">Icon</label>
            <div className="vora-emoji-grid">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={clsx(
                    'vora-emoji-btn',
                    selectedIcon === emoji && 'vora-emoji-btn--selected'
                  )}
                  onClick={() => setValue('icon', emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="vora-form-section">
            <label className="vora-input__label">Theme Color</label>
            <div className="vora-color-grid">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={clsx(
                    'vora-color-btn',
                    selectedColor === color && 'vora-color-btn--selected'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setValue('defaultColor', color)}
                />
              ))}
            </div>
          </div>
        </form>
      )}

      <style jsx>{`
        .vora-category-form {
          display: flex;
          flex-direction: column;
          gap: var(--vora-space-6);
        }

        .vora-form-section {
          display: flex;
          flex-direction: column;
          gap: var(--vora-space-3);
        }

        .vora-emoji-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: var(--vora-space-2);
        }

        .vora-emoji-btn {
          height: 48px;
          border: 1px solid var(--vora-color-border-default);
          border-radius: var(--vora-radius-md);
          background: var(--vora-color-bg-primary);
          font-size: 20px;
          cursor: pointer;
          transition: all var(--vora-duration-fast);
        }

        .vora-emoji-btn:hover {
          background: var(--vora-color-bg-tertiary);
          border-color: var(--vora-color-accent-primary);
        }

        .vora-emoji-btn--selected {
          background: var(--vora-color-accent-subtle);
          border-color: var(--vora-color-accent-primary);
          box-shadow: 0 0 0 1px var(--vora-color-accent-primary);
        }

        .vora-color-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: var(--vora-space-2);
        }

        .vora-color-btn {
          height: 40px;
          border: 2px solid transparent;
          border-radius: var(--vora-radius-full);
          cursor: pointer;
          transition: all var(--vora-duration-fast);
        }

        .vora-color-btn:hover {
          transform: scale(1.1);
        }

        .vora-color-btn--selected {
          border-color: var(--vora-color-text-primary);
          box-shadow:
            0 0 0 2px var(--vora-color-bg-primary),
            0 0 0 4px var(--vora-color-text-primary);
        }

        .vora-modal-footer-content {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .vora-spacer {
          flex: 1;
        }

        .vora-delete-confirm {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: var(--vora-space-4);
          padding: var(--vora-space-4) 0;
        }

        .vora-alert-icon {
          color: var(--vora-color-error);
          margin-bottom: var(--vora-space-2);
        }

        .vora-delete-actions {
          display: flex;
          gap: var(--vora-space-3);
          margin-top: var(--vora-space-4);
        }

        .vora-form-error {
          padding: var(--vora-space-3);
          background: var(--vora-color-error-bg);
          color: var(--vora-color-error);
          border-radius: var(--vora-radius-md);
          font-size: var(--vora-font-size-caption);
          font-weight: var(--vora-font-weight-medium);
        }
      `}</style>
    </Modal>
  )
}
