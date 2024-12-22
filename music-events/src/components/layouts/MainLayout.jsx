import React from 'react'
import Navbar1 from '../navbar/navbar'
import { Outlet } from 'react-router-dom'

// stupid error was due to navbar and navbar  being the same name oh my my my 

export default function MainLayout() {
  return (
    <div>
        <Navbar1/>

        <div style={{display: "flex"}}>
                <Outlet/> 
        </div>
    </div>
  )
}
