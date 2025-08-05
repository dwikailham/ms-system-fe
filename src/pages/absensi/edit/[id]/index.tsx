import type { GetServerSideProps, NextComponentType, NextPageContext } from 'next/types'
import { AttendanceEditPage } from '@modules/absensi'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

type IProps = {
  id: string
}

const MainComponent: NextComponentType<NextPageContext, {}, IProps> = props => {
  const { id } = props

  return <AttendanceEditPage id={id} />
}

export default MainComponent

export const getServerSideProps: GetServerSideProps = async context => {
  const { locale, query } = context
  if (!locale) {
    throw new Error('locale not found')
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      id: query.id
    }
  }
}
