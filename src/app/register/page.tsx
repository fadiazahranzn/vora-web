'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { registerSchema, RegisterValues } from '@/lib/validations/auth'
import styles from './register.module.css'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Enable real-time validation for password strength
  })

  const password = watch('password')

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password?.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password || '') },
    { label: 'One lowercase letter', met: /[a-z]/.test(password || '') },
    { label: 'One number', met: /\d/.test(password || '') },
  ]

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      // Auto-login after successful registration
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (signInResult?.error) {
        // If auto-login fails, redirect to login page anyway
        router.push('/login?registered=true')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message)
      } else {
        setServerError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch {
      setServerError('Google sign-in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Join Vora to start tracking your goals
          </p>
        </div>

        {serverError && (
          <div className={styles.errorBanner} role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            leadingIcon={<User size={16} />}
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="name@example.com"
            leadingIcon={<Mail size={16} />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            leadingIcon={<Lock size={16} />}
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Password Strength Indicator */}
          {password && (
            <div className={styles.passwordRequirements}>
              {passwordRequirements.map((req, index) => (
                <div
                  key={index}
                  className={`${styles.requirementItem} ${
                    req.met
                      ? styles.requirementItemMet
                      : styles.requirementItemUnmet
                  }`}
                >
                  {req.met ? (
                    <Check size={12} />
                  ) : (
                    <div style={{ width: 12 }} />
                  )}
                  <span>{req.label}</span>
                </div>
              ))}
            </div>
          )}

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            leadingIcon={<Lock size={16} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" size="full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className={styles.divider}>Or ensure with</div>

        <Button
          variant="secondary"
          size="full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          leftIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18"
              viewBox="0 0 24 24"
              width="18"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
          }
        >
          Continue with Google
        </Button>

        <div className={styles.footer}>
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>
            Log In
          </Link>
        </div>
      </Card>
    </div>
  )
}
