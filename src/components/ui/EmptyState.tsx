import React from 'react';
import styles from './EmptyState.module.css';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  mascotEmoji?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  mascotEmoji = '🎨',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.mascot} aria-hidden="true">
        {mascotEmoji}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {actionLabel && onAction && (
        <div className={styles.action}>
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
};
