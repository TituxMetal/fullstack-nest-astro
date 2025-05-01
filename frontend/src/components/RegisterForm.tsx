import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { registerSchema, type RegisterFormData } from '~/schemas/registerSchema'
import { redirect } from '~/utils/navigation'

interface RegisterFormProps {
  onSuccess?: () => void
  redirectUrl?: string
}

export const RegisterForm = ({ onSuccess, redirectUrl }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
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
      <h2 className='mb-6 text-2xl font-bold text-zinc-100'>Create an Account</h2>

      {error && (
        <div className='mb-4 rounded-md border border-red-800 bg-red-950 p-3 text-red-200'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label htmlFor='firstName' className='mb-1 block text-zinc-300'>
              First Name (Optional)
            </label>
            <input
              id='firstName'
              type='text'
              {...register('firstName')}
              className='w-full rounded border border-zinc-600 bg-zinc-700 p-2 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
            {errors.firstName && (
              <p className='mt-1 text-sm text-red-400'>{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='lastName' className='mb-1 block text-zinc-300'>
              Last Name (Optional)
            </label>
            <input
              id='lastName'
              type='text'
              {...register('lastName')}
              className='w-full rounded border border-zinc-600 bg-zinc-700 p-2 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
            {errors.lastName && (
              <p className='mt-1 text-sm text-red-400'>{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor='email' className='mb-1 block text-zinc-300'>
            Email
          </label>
          <input
            id='email'
            type='email'
            {...register('email')}
            className='w-full rounded border border-zinc-600 bg-zinc-700 p-2 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.email && <p className='mt-1 text-sm text-red-400'>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor='username' className='mb-1 block text-zinc-300'>
            Username
          </label>
          <input
            id='username'
            type='text'
            {...register('username')}
            className='w-full rounded border border-zinc-600 bg-zinc-700 p-2 text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.username && (
            <p className='mt-1 text-sm text-red-400'>{errors.username.message}</p>
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
          <p className='mt-1 text-xs text-zinc-400'>
            Password must have at least 8 characters, including uppercase, lowercase, number, and
            special character.
          </p>
          {errors.password && (
            <p className='mt-1 text-sm text-red-400'>{errors.password.message}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full rounded-md bg-blue-600 px-4 py-2 text-zinc-100 transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-blue-800 disabled:opacity-70'
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}
