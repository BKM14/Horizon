import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

const Home = async () => {
  const user: User = await getLoggedInUser();

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox 
            type='greeting' 
            title='Welcome' 
            user={`${user.name}` || "Guest"}
            subtext="Access and manage your account and transactions efficiently"  
          />
          <TotalBalanceBox 
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>

        Recent Transactions
      </div>
      <RightSidebar user={user} transactions={[]} banks={[{currentBalance: 1234}, {currentBalance: 123456}]}></RightSidebar>
    </section>
  )
}

export default Home
