'use client'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'briefed_credits'
const FREE_PERSONALIZED = 3
const FREE_STANDARD = 999

interface CreditState {
  personalizedUsed: number
  standardUsed: number
  lastReset: string
}

function getMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}`
}

function loadState(): CreditState {
  if (typeof window === 'undefined') return { personalizedUsed: 0, standardUsed: 0, lastReset: getMonthKey() }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { personalizedUsed: 0, standardUsed: 0, lastReset: getMonthKey() }
    const parsed: CreditState = JSON.parse(raw)
    // Reset monthly
    if (parsed.lastReset !== getMonthKey()) {
      return { personalizedUsed: 0, standardUsed: 0, lastReset: getMonthKey() }
    }
    return parsed
  } catch {
    return { personalizedUsed: 0, standardUsed: 0, lastReset: getMonthKey() }
  }
}

function saveState(state: CreditState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useCredits() {
  const [state, setState] = useState<CreditState>({ personalizedUsed: 0, standardUsed: 0, lastReset: getMonthKey() })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setState(loadState())
    setMounted(true)
  }, [])

  const personalizedRemaining = Math.max(0, FREE_PERSONALIZED - state.personalizedUsed)
  const canUsePersonalized = personalizedRemaining > 0
  const canUseStandard = state.standardUsed < FREE_STANDARD

  const consume = (isPersonalized: boolean) => {
    const next = { ...state }
    if (isPersonalized) {
      next.personalizedUsed = state.personalizedUsed + 1
    } else {
      next.standardUsed = state.standardUsed + 1
    }
    setState(next)
    saveState(next)
  }

  return {
    mounted,
    personalizedUsed: state.personalizedUsed,
    personalizedRemaining,
    canUsePersonalized,
    canUseStandard,
    freePersonalized: FREE_PERSONALIZED,
    consume,
  }
}
