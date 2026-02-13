'use client'

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, Settings, Bell, Shield, CreditCard } from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
    const { data: session } = useSession()

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <header style={{ marginBottom: '32px', textAlign: 'center' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--vora-color-bg-tertiary)',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '4px solid var(--vora-color-bg-primary)',
                    boxShadow: 'var(--vora-shadow-md)'
                }}>
                    {session?.user?.image ? (
                        <Image
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            width={100}
                            height={100}
                        />
                    ) : (
                        <User size={48} color="var(--vora-color-text-tertiary)" />
                    )}
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{session?.user?.name || 'User'}</h1>
                <p style={{ color: 'var(--vora-color-text-secondary)' }}>{session?.user?.email}</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <section style={{
                    backgroundColor: 'var(--vora-color-bg-primary)',
                    borderRadius: '12px',
                    padding: '8px',
                    border: '1px solid var(--vora-color-border-default)'
                }}>
                    <div style={menuItemStyle}>
                        <Settings size={20} />
                        <span>Account Settings</span>
                    </div>
                    <div style={menuItemStyle}>
                        <Bell size={20} />
                        <span>Notifications</span>
                    </div>
                    <div style={menuItemStyle}>
                        <Shield size={20} />
                        <span>Privacy & Security</span>
                    </div>
                    <div style={menuItemStyle}>
                        <CreditCard size={20} />
                        <span>Subscription Plan</span>
                    </div>
                </section>

                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    style={{
                        marginTop: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid var(--vora-color-error)',
                        backgroundColor: 'transparent',
                        color: 'var(--vora-color-error)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--vora-color-error-bg)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </div>
    )
}

const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background 0.2s',
}
