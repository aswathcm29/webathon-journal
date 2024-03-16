/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import { FaFile } from "react-icons/fa";
import {Link} from 'react-router-dom'
import hamburger from '../assets/burger-menu-svgrepo-com.svg'
import close from '../assets/close-svgrepo-com.svg'
import About from './HomePage/About';


const Navbar = () => {

   const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
        <header className='flex items-center justify-between border-b-4 border-green-400'>
             <span className='text-5xl'>J<span className='text-4xl mb-2 absolute'>F</span></span>
             <div className='flex flex-row gap-x-4 justify-center items-center'>
             <div className='flex bg-green-400 w-[15rem] h-[3rem] items-center justify-center rounded-full gap-x-3'>
                <FaFile className='text-3xl px-2'></FaFile>
                <span className='text-xl'>Publish</span>
             </div>
             
             {/* hidden lg: */}
             <div className='block relative'>
                <ul className={`
                  lg:flex flex-col lg:flex-row absolute lg:static gap-x-12 text-xl
                   top-8  ${(isMenuOpen)?'-left-12':'hidden'} px-5 lg:p-0 border-4 border-cyan-600 ring lg:ring-0 overflow-hidden
                `}>
                    <Link to='/home'><li className='p-4 lg:p-0 shadow-sm'>Home</li></Link>
                    <a href='#about'><li className='p-4 lg:p-0 transition-transform ease-in-out'>About</li></a> 
                    <Link to='/journals'><li className='p-4 lg:p-0'>Journals</li></Link>
                    <Link to='/profile'><li className='p-4 lg:p-0'>Profile</li></Link>
                </ul>
             </div>
             <button onClick={()=>{setIsMenuOpen(!isMenuOpen)}}>
               <img src={(isMenuOpen)?close:hamburger} className='h-8 lg:hidden'/>
             </button>
             </div>
        </header> 
        <hr className='h-[0.1rem] flex justify-center bg-green-500 mt-4 shadow-2xl'></hr>  
    </>
  )
}

export default Navbar