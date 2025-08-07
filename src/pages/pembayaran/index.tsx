import type { GetStaticProps, NextPage } from 'next/types'
import { FormPaydayPage } from '@modules/pembayaran'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const MainComponent: NextPage = () => {
  return (
    <>
      <FormPaydayPage />
    </>
  )
}

export default MainComponent

export const getStaticProps: GetStaticProps = async context => {
  const { locale } = context
  if (!locale) {
    throw new Error('locale not found')
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
}
