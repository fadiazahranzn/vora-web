
'use client'

import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { TaskForm } from './TaskForm'
import { Task } from '@/types/task'

interface TaskModalProps {
    isOpen: boolean
    onClose: () => void
    taskToEdit?: Task
    onSuccess: () => void
}

export const TaskModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    taskToEdit,
    onSuccess,
}) => {
    const handleSubmit = async (data: any, scope?: 'this' | 'future') => {
        try {
            const tempId = taskToEdit?.id;
            const isEdit = !!tempId;
            const url = isEdit ? `/api/tasks/${tempId}` : '/api/tasks';
            const method = isEdit ? 'PATCH' : 'POST';

            // Add scope if applicable (and if backend supports it in future)
            // For now, we just pass it in body if backend wants it, or ignore it if not.
            // We can also use query param.
            const query = scope ? `?scope=${scope}` : '';

            const res = await fetch(url + query, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to save task');
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save task:', error);
            // In a real app, show toast here
            alert('Failed to save task: ' + (error as Error).message);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={taskToEdit ? 'Edit Task' : 'Create Task'}
            size="md"
        >
            <TaskForm
                initialData={taskToEdit}
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </Modal>
    )
}
