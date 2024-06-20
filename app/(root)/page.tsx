import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'
RightSidebar

const Home = () => {
  const loggedIn = {firstName: "Balaji", lastName: "Krishnamurthy", email: "bkm@gmail.com"}


  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox 
            type='greeting' 
            title='Welcome' 
            user={loggedIn?.firstName || "Guest"}
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
      <RightSidebar user={loggedIn} transactions={[]} banks={[{currentBalance: 1234}, {currentBalance: 123456}]}></RightSidebar>
    </section>
  )
}

export default Home
