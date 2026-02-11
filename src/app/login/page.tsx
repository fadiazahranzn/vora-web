'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock } from 'lucide-react' // Import icons
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { loginSchema, LoginValues } from '@/lib/validations/auth'
import styles from './login.module.css'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// ... existing imports

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        // NextAuth returns generic errors usually, but we can throw what we get or
        // a generic one for security (avoiding user enumeration).
        throw new Error(
          result.error === 'CredentialsSignin'
            ? 'Invalid email or password'
            : result.error
        )
      }

      // Login successful
      router.push('/')
      router.refresh()
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
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Enter your credentials to access your account
          </p>
        </div>

        {serverError && (
          <div className={styles.errorBanner} role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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

          <Button type="submit" size="full" isLoading={isLoading}>
            Log In
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
          Don&apos;t have an account?{' '}
          <Link href="/register" className={styles.link}>
            Register
          </Link>
        </div>
      </Card>
    </div>
  )
}
