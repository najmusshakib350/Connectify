
export type RegisterRequest = {
  firstName: string
  lastName?: string
  email: string
  password: string
  repeatPassword: string
  agreeToTerms: boolean
}

export type RegisterResponse = {
  id: string
  firstName: string
  lastName: string | null
  email: string
  agreeToTerms: boolean
  createdAt: string
  updatedAt: string
}
