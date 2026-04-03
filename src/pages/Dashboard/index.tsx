import React from 'react'
import DashboardT from '@/Component/dashboard'
import AnalyticsChart from './Components/AnalyticsChart'
import PageLayout from '@/Component/Layout/PageLayout'
import OverallProgress from './Components/AnalyticsGauge'

const Dashboard = () => {
  return (
    <PageLayout
    title='Dashboard'
    showSearch= {true}
    >
 


        <DashboardT/>

            <div className='lg:flex md:block mt-5 p-5 gap-8 items-stretch'>
          <div className='flex-[2] mb-5 flex flex-col'>
            <AnalyticsChart />
          </div>
          <div className='flex-[1] flex flex-col'>
            <OverallProgress total={500} completed={250} delayed={20} ongoing={230} />
          </div>
        </div>

      
    </PageLayout>
  )
}

export default Dashboard
