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

        <div className='flex  mt-5 p-5 gap-8'>
            <div className='flex-2/3'> 
                <AnalyticsChart/>
            </div>
            <div className='flex-1/3'>
            <OverallProgress total={500} completed={250} delayed={20} ongoing={230}/>
            </div>
        </div>

      
    </PageLayout>
  )
}

export default Dashboard
