import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './BottomSheet.module.css';

export interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const content = (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div
                className={styles.sheet}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'sheet-title' : undefined}
            >
                <div className={styles.handle} />
                <div className={styles.header}>
                    {title && <h2 id="sheet-title" className={styles.title}>{title}</h2>}
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close sheet"
                        style={{ background: 'none', border: 'none', fontSize: '1.25rem', padding: '0.5rem' }}
                    >
                        &times;
                    </button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};
