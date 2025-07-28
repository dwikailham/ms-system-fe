// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAppSelector } from '@hooks/useStore'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
  if (role === 'client') return '/acl'
  else return '/home'
}

const Home = () => {
  // ** Hooks

  const router = useRouter()
  const authRedux = useAppSelector(state => state.auth)
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (authRedux.isLogin) {
      const homeRoute = getHomeRoute('admin')

      // Redirect user to Home URL
      router.replace(homeRoute)
    }
  }, [authRedux.isLogin, router])

  return <Spinner />
}

export default Home
