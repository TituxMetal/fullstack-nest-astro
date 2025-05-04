import type { LoginSchema, SignupSchema } from '~/schemas/auth.schema'
import { apiRequest } from '~/services/api.service'
import type { AuthMode } from '~/types/auth.types'
import type { User } from '~/types/user.types'

/**
 * Authenticates a user through the API
 * @param data - The authentication data (login or signup schema)
 * @param mode - The authentication mode (login or signup)
 * @returns API response with user data on success
 */
export const authenticateUser = async (data: LoginSchema | SignupSchema, mode: AuthMode) => {
  const endpoint = mode === 'login' ? 'login' : 'register'

  return apiRequest<User>(`http://localhost:3000/auth/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
