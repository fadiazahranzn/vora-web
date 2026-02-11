'use client'

import { useState, useEffect } from 'react'
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { clsx } from 'clsx'
import CategorySidebar from './CategorySidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <div className="vora-dashboard">
      {/* ── Desktop Sidebar ── */}
      <aside className="vora-sidebar vora-sidebar--desktop">
        <div className="vora-sidebar-logo">
          <span className="vora-logo-icon">✨</span>
          <span className="vora-logo-text">Vora</span>
        </div>
        <CategorySidebar />
        <div className="vora-sidebar-footer">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="vora-logout-btn"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile TopBar ── */}
      <header className="vora-topbar vora-topbar--mobile">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="vora-menu-toggle"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <div className="vora-topbar-logo">Vora</div>
        <div className="vora-topbar-user">
          <div className="vora-avatar-small">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={24}
                height={24}
              />
            ) : (
              <UserIcon size={16} />
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <div
        className={clsx(
          'vora-drawer-overlay',
          isMobileMenuOpen && 'vora-drawer-overlay--open'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <aside
          className={clsx(
            'vora-drawer',
            isMobileMenuOpen && 'vora-drawer--open'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="vora-drawer-header">
            <div className="vora-topbar-logo">Vora</div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="vora-menu-toggle"
            >
              <X size={24} />
            </button>
          </div>
          <CategorySidebar onSelectAction={() => setIsMobileMenuOpen(false)} />
        </aside>
      </div>

      {/* ── Main Content ── */}
      <main className="vora-main">
        {/* Desktop Header */}
        <header className="vora-header--desktop">
          <div className="vora-header-user">
            <div className="vora-user-profile">
              <div className="vora-avatar">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                  />
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
              <div className="vora-user-info">
                <span className="vora-user-name">
                  {session?.user?.name || 'User'}
                </span>
                <span className="vora-user-status">Free Plan</span>
              </div>
            </div>
          </div>
        </header>
        <div className="vora-content">{children}</div>
      </main>

      <style jsx>{`
        .vora-dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--vora-color-bg-primary);
        }

        /* ── Sidebar Desktop ── */
        .vora-sidebar--desktop {
          display: none;
          width: var(--vora-sidebar-width);
          border-right: 1px solid var(--vora-color-border-default);
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          background: var(--vora-color-bg-primary);
        }

        @media (min-width: 1024px) {
          .vora-sidebar--desktop {
            display: flex;
          }
        }

        .vora-sidebar-logo {
          padding: var(--vora-space-6) var(--vora-space-4);
          display: flex;
          align-items: center;
          gap: var(--vora-space-2);
        }

        .vora-logo-icon {
          font-size: 24px;
        }

        .vora-logo-text {
          font-size: 20px;
          font-weight: var(--vora-font-weight-bold);
          background: linear-gradient(
            135deg,
            var(--vora-color-accent-primary),
            var(--vora-color-info)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .vora-sidebar-footer {
          padding: var(--vora-space-4);
          border-top: 1px solid var(--vora-color-border-default);
        }

        .vora-logout-btn {
          display: flex;
          align-items: center;
          gap: var(--vora-space-3);
          width: 100%;
          padding: var(--vora-space-3);
          border: none;
          background: transparent;
          color: var(--vora-color-error);
          font-family: inherit;
          font-size: var(--vora-font-size-body);
          font-weight: var(--vora-font-weight-medium);
          cursor: pointer;
          border-radius: var(--vora-radius-md);
          transition: background var(--vora-duration-fast);
        }

        .vora-logout-btn:hover {
          background: var(--vora-color-error-bg);
        }

        /* ── Mobile TopBar ── */
        .vora-topbar--mobile {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--vora-space-4);
          height: var(--vora-topbar-height);
          border-bottom: 1px solid var(--vora-color-border-default);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: var(--vora-color-bg-primary);
          z-index: var(--vora-z-sticky);
        }

        @media (min-width: 1024px) {
          .vora-topbar--mobile {
            display: none;
          }
        }

        .vora-topbar-logo {
          font-weight: var(--vora-font-weight-bold);
          font-size: 18px;
        }

        .vora-menu-toggle {
          background: transparent;
          border: none;
          color: var(--vora-color-text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Drawer ── */
        .vora-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--vora-color-bg-overlay);
          opacity: 0;
          visibility: hidden;
          transition: all var(--vora-duration-normal);
          z-index: var(--vora-z-overlay);
          backdrop-filter: blur(4px);
        }

        .vora-drawer-overlay--open {
          opacity: 1;
          visibility: visible;
        }

        .vora-drawer {
          position: fixed;
          top: 0;
          left: -100%;
          bottom: 0;
          width: 280px;
          background: var(--vora-color-bg-primary);
          box-shadow: var(--vora-shadow-lg);
          transition: all var(--vora-duration-normal) var(--vora-easing-default);
          display: flex;
          flex-direction: column;
        }

        .vora-drawer--open {
          left: 0;
        }

        .vora-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--vora-space-4);
          border-bottom: 1px solid var(--vora-color-border-default);
        }

        /* ── Main Content ── */
        .vora-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          padding-top: var(--vora-topbar-height);
        }

        @media (min-width: 1024px) {
          .vora-main {
            padding-top: 0;
          }
        }

        .vora-header--desktop {
          display: none;
          height: var(--vora-topbar-height);
          padding: 0 var(--vora-space-6);
          align-items: center;
          justify-content: flex-end;
          border-bottom: 1px solid var(--vora-color-border-default);
        }

        @media (min-width: 1024px) {
          .vora-header--desktop {
            display: flex;
          }
        }

        .vora-user-profile {
          display: flex;
          align-items: center;
          gap: var(--vora-space-3);
        }

        .vora-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--vora-radius-full);
          background: var(--vora-color-bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .vora-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vora-user-info {
          display: flex;
          flex-direction: column;
        }

        .vora-user-name {
          font-weight: var(--vora-font-weight-semibold);
          font-size: 14px;
        }

        .vora-user-status {
          font-size: 10px;
          color: var(--vora-color-text-tertiary);
          text-transform: uppercase;
        }

        .vora-content {
          flex: 1;
          padding: var(--vora-space-4);
          max-width: var(--vora-content-max-width);
          width: 100%;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .vora-content {
            padding: var(--vora-space-8);
          }
        }
      `}</style>
    </div>
  )
}
