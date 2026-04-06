"use client"

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query"
import { registerUser } from "@/features/auth/api/register.api"
import type { RegisterRequest, RegisterResponse } from "@/features/auth/types/register-api.types"

type RegisterMutationOptions = Omit<
  UseMutationOptions<RegisterResponse, Error, RegisterRequest>,
  "mutationFn"
>

export function useRegister(
  options?: RegisterMutationOptions
): UseMutationResult<RegisterResponse, Error, RegisterRequest> {
  return useMutation({
    mutationFn: registerUser,
    ...options,
  })
}
