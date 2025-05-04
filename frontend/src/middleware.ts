import type { APIContext, MiddlewareNext } from 'astro'
import { apiRequest } from './services/api.service'
import type { User } from './types/user.types'

export const onRequest = async (context: APIContext, next: MiddlewareNext) => {
  const token = context.cookies.get('auth_token')

  if (!token) {
    console.log('No auth token found in cookies')
    return next()
  }

  if (context.locals.user) {
    return next()
  }

  const API_URL = import.meta.env.API_URL

  try {
    const { success, data, message } = await apiRequest<User>(`${API_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    console.log('data', data)
    console.log('success', success)
    console.log('message', message)

    if (!success) {
      console.log('API request failed:', message)

      if (message?.includes('Unauthorized')) {
        console.log('Invalid token, clearing cookie')
        context.cookies.delete('auth_token')
      }

      return next()
    }

    console.log('setting user')
    context.locals.user = data
  } catch (error) {
    console.error('Error in middleware:', error)
  }

  return next()
}
