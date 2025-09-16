import React from 'react'
import Menubar from '../components/Menubar';
import Header from '../components/Header';

const Home = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
        <Menubar />
    <Header/>
    </div>
    
  )
}

export default Home