'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api, ApiError } from './api'
import { deriveKeypairFromSeed, createPresentation } from './crypto'
import type { UserProfile, AuthChallenge, AuthVerifyResponse } from '../types/api'

interface AuthContextValue {
  user: UserProfile | null
  token: string | null
  did: string | null
  isLoading: boolean
  loginWithSeed: (seedPhrase: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [did, setDid] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('identityToken')
    const storedDid = localStorage.getItem('identityDid')
    if (!stored) {
      setIsLoading(false)
      return
    }
    setToken(stored)
    if (storedDid) setDid(storedDid)

    api.get<UserProfile>('/v1/auth/me')
      .then((profile) => setUser(profile))
      .catch(() => {
        localStorage.removeItem('identityToken')
        localStorage.removeItem('identityDid')
        setToken(null)
        setDid(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const loginWithSeed = useCallback(async (seedPhrase: string) => {
    // 1. Derive keypair from seed
    const { privateKey, publicKey } = await deriveKeypairFromSeed(seedPhrase)

    // 2. We need the DID for this public key — try to resolve it
    //    The DID format is did:solidus:stub:<uuid>, so we can't derive it from the key alone.
    //    Instead, look up by requesting a challenge with a placeholder, or
    //    query the user by public key.
    //    For now: use the stored DID if available, or try the /me endpoint.
    //    Actually, the simplest approach: the backend needs a "resolve DID by public key" endpoint.
    //    Since that doesn't exist yet, we'll store the DID locally after onboarding.
    const storedDid = localStorage.getItem('identityDid')
    if (!storedDid) {
      throw new ApiError(400, 'No DID found', 'Please complete onboarding first or enter your DID.')
    }

    // 3. Request challenge
    const challenge = await api.post<AuthChallenge>('/v1/auth/challenge', { did: storedDid })

    // 4. Sign challenge — create Verifiable Presentation
    const presentation = await createPresentation({
      did: storedDid,
      nonce: challenge.nonce,
      privateKey,
    })

    // 5. Verify and get token
    const res = await api.post<AuthVerifyResponse>('/v1/auth/verify', {
      challengeId: challenge.id,
      presentation,
    })

    localStorage.setItem('identityToken', res.token)
    setToken(res.token)
    setDid(storedDid)

    const profile = await api.get<UserProfile>('/v1/auth/me')
    setUser(profile)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('identityToken')
    localStorage.removeItem('identityDid')
    setToken(null)
    setUser(null)
    setDid(null)
    router.push('/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ user, token, did, isLoading, loginWithSeed, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
