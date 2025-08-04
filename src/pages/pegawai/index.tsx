import type { GetStaticProps, NextPage } from 'next/types'
import { IndexPage } from '@modules/pegawai'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const MainComponent: NextPage = () => {
  return (
    <>
      <IndexPage />
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
