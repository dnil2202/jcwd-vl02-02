import React from 'react'
import { AiFillHome } from 'react-icons/ai';
import { BiCategoryAlt } from 'react-icons/bi';
import { RiBillLine } from 'react-icons/ri';
import { FaHeadset } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { IoLogoWhatsapp } from 'react-icons/io';
import { MdEmail } from 'react-icons/md';
import { BsFillTelephoneFill, BsFacebook, BsTwitter, BsInstagram } from 'react-icons/bs';
import logo from '../assets/medical-logo-removebg-preview.png'

const FooterComponent = () => {

    let contact = [
        {
            icon:IoLogoWhatsapp,
            head:'Chat Whatsapp',
            text:'+62 823-2323-0990'
        },
        {
            icon:MdEmail,
            head:'Email',
            text:'contact@medcare.com'
        },
        {
            icon:BsFillTelephoneFill,
            head:'Call Center',
            text:'+62 2323-0990'
        },
    ]

return (
    <div>
        <div className='bg-gray-300 py-5 lg:hidden'>
            <div className='container mx-auto px-5'>
                <div className='grid grid-cols-5 '>
                    <div>
                        <AiFillHome size={20} className='mx-auto fill-gray-500'/>
                        <p className='text-center text-sm text-gray-500 font-thin'>Home</p>
                    </div>
                    <div>
                        <BiCategoryAlt size={20} className='mx-auto fill-gray-500'/>
                        <p className='text-center text-sm text-gray-500 font-thin'>Category</p>
                    </div>
                    <div>
                        <RiBillLine size={20} className='mx-auto fill-gray-500'/>
                        <p className='text-center text-sm text-gray-500 font-thin'>Transaction</p>
                    </div>
                    <div>
                        <FaHeadset size={20} className='mx-auto fill-gray-500'/>
                        <p className='text-center text-sm text-gray-500 font-thin'>Help</p>
                    </div>
                    <div>
                        <CgProfile size={20} className='mx-auto fill-gray-500'/>
                        <p className='text-center text-sm text-gray-500 font-thin'>Profile</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='hidden lg:block' >
            <div className='shadow-lg'>
                <div className='container mx-auto px-[150px] mt-8 bg-white'>
                    <div className='grid grid-cols-4 gap-10 py-10'>
                        <div className=''>
                            <div className='flex'>
                                <img src={logo} className='h-12' alt='medcare.com'/>
                                <p className='bg-gradient-to-r from-green-500 to-blue-600 text-transparent font-bold bg-clip-text text-3xl pt-1'>Medcare</p>
                            </div>
                            <div className='mt-5'>
                                {
                                    contact.map(data=>(
                                        <div className='flex pl-2 mt-1' key={data.head} >
                                            <div className='w-10 h-10 pt-1'>
                                                <data.icon className='w-10 h-10 mt-1'/>
                                            </div>
                                            <div className='ml-2'>
                                                <p className='w-60 h-6 pt-2 text-sm leading-5 font-bold  text-txt-500'>{data.head}</p>
                                                <p className='w-60 h-6 pb-1 text-sm leading-5 text-txt-500'>{data.text}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className='grid grid-rows-5 mx-auto font-normal text-sm leading-5 items-center text-txt-500'>
                            <p className=''>About Us</p>
                            <p>Privacy Policy</p>
                            <p>FAQ</p>
                            <p>Terms and Conditions</p>
                            <p>Career</p>
                        </div>
                        <div className='grid grid-rows-5 mx-auto pt-3 font-normal text-sm leading-5 text-txt-500'>
                            <p>Blog</p>
                            <p>How To Shop</p>
                            <p>Promo</p>
                            <p>Diagnosis</p>
                        </div>
                        <div className='grid grid-rows-4 mx-auto pt-1 '>
                            <p className='text-2xl font-bold leading-7 text-txt-500'>Follow Us</p>
                            <div className='flex pl-2 '>
                                <div className='w-6 h-6'>
                                    <BsFacebook className='w-6 h-6'/>
                                </div>
                                <p className='text-base leading-6 text-txt-500 font-normal ml-4'>Facebook</p>
                            </div>
                            <div className='flex pl-2 '>
                                <div className='w-6 h-6'>
                                    <BsTwitter className='w-6 h-6'/>
                                </div>
                                <p className='text-base leading-6 text-txt-500 font-normal ml-4'>Twitter</p>
                            </div>
                            <div className='flex pl-2 '>
                                <div className='w-6 h-6' >
                                    <BsInstagram className='w-6 h-6' />
                                </div>
                                <p className='text-base leading-6 text-txt-500 font-normal ml-4'>Instagram</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-[#4F618E] mt-5'>
                    <p className='text-white text-xs text-center py-5'>@MedCare2022</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FooterComponent