// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAppSelector } from '@hooks/useStore'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const router = useRouter()
  const authRedux = useAppSelector(state => state.auth)

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (authRedux.isLogin) {
      router.replace('/home')
    }
  }, [authRedux.isLogin, router])

  if (authRedux.isLogin) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
