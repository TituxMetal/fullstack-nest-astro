import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { loginSchema, type LoginFormData } from '~/schemas/loginSchema'
import { redirect } from '~/utils/navigation'

interface LoginFormProps {
  onSuccess?: () => void
  redirectUrl?: string
}

export const LoginForm = ({ onSuccess, redirectUrl }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      redirectUrl && redirect(redirectUrl)
      onSuccess && onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='mx-auto w-full max-w-md rounded-lg bg-zinc-800 p-6'>
      <h2 className='mb-6 text-2xl font-bold text-zinc-100'>Login</h2>

      {error && (
        <div className='mb-4 rounded-md border border-red-800 bg-red-950 p-3 text-red-200'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label htmlFor='identifier' className='mb-1 block text-zinc-300'>
            Username or Email
          </label>
          <input
            id='identifier'
            type='text'
            {...register('identifier')}
            className='w-full rounded border border-zinc-600 bg-zinc-700 p-2 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.identifier && (
            <p className='mt-1 text-sm text-red-400'>{errors.identifier.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='password' className='mb-1 block text-zinc-300'>
            Password
          </label>
          <input
            id='password'
            type='password'
            {...register('password')}
            className='w-full rounded border border-zinc-600 bg-zinc-700 p-2 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.password && (
            <p className='mt-1 text-sm text-red-400'>{errors.password.message}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full rounded-md bg-blue-600 px-4 py-2 text-zinc-100 transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-blue-800 disabled:opacity-70'
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
