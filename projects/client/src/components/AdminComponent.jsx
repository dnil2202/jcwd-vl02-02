import React from 'react'
import { IoIosArrowBack } from 'react-icons/io';
import logo from '../assets/medical-logo-removebg-preview.png'
import { FcSalesPerformance, FcInTransit, FcTemplate, FcClock, FcBriefcase } from 'react-icons/fc'
import { useNavigate } from 'react-router';

const AdminComponent = (page) => {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(true)
  return (<div>
    <div className='hidden sm:block'>
      <div className={`${open ? "w-60" : "w-20"} p-5 pt-8 h-screen bg-white relative duration-500`}>
        <IoIosArrowBack size={30}
          className={`absolute -right-3 rounded-full cursor-pointer top-9 border-2 duration-300 bg-white  ${!open && "rotate-180"} ring-2 ring-teal-200`}
          onClick={() => setOpen(!open)} />
        <div className='flex gap-x-3 items-center' onClick={() => navigate('/admin/dashboard')}>
          <img src={logo} className={`h-10 rounded-full cursor-pointer duration-300 ${open && "rotate-[360deg]"}`} alt='medcare.com' />
          <span className={`cursor-pointer origin-center bg-gradient-to-r from-green-500 to-blue-600 text-2xl text-transparent font-extrabold bg-clip-text ${!open && "hidden"}`}>MedCare</span>
        </div>
        <ul className='pt-16 mx-1'>
          <li className={`${page.page == '/admin/dashboard' ? 'underline' : 'no-underline'} font-semibold text-xl flex items-center gap-x-4 cursor-pointer hover:bg-slate-300 rounded-md mt-5`}
            onClick={() => navigate('/admin/dashboard')}
          >
            <FcTemplate size={30} className={`duration-300 ${open && "rotate-[360deg]"}`} />
            <span className={`${!open && 'hidden'}`}>Dashboard</span>
          </li>
          <li className={`${page.page == '/admin/product' ? 'underline' : 'no-underline'} font-semibold text-xl flex items-center gap-x-4 cursor-pointer hover:bg-slate-300 rounded-md mt-10`}
            onClick={() => navigate('/admin/product')}
          >
            <FcBriefcase size={30} className={`duration-300 ${open && "rotate-[360deg]"}`} />
            <span className={`${!open && 'hidden'}`}>Product</span>
          </li>
          <li className={`${page.page == '/admin/transaction' ? 'underline' : 'no-underline'} font-semibold text-xl flex items-center gap-x-4 cursor-pointer hover:bg-slate-300 rounded-md mt-10`}
            onClick={() => navigate('/admin/transaction')}
          >
            <FcInTransit size={30} className={`duration-300 ${open && "rotate-[360deg]"}`} />
            <span className={`${!open && 'hidden'}`}>Transaction</span>
          </li>
          <li className={`${page.page == '/admin/report' ? 'underline' : 'no-underline'} font-semibold text-xl flex items-center gap-x-4 cursor-pointer hover:bg-slate-300 rounded-md mt-10`}
            onClick={() => navigate('/admin/report')}
          >
            <FcSalesPerformance size={30} className={`duration-300 ${open && "rotate-[360deg]"}`} />
            <span className={`${!open && 'hidden'}`}>Sales Report</span>
          </li>
          <li className={`${page.page == '/admin/stock_log' ? 'underline' : 'no-underline'} font-semibold text-xl flex items-center gap-x-4 cursor-pointer hover:bg-slate-300 rounded-md mt-10`}
            onClick={() => navigate('/admin/stock_log')}
          >
            <FcClock size={30} className={`duration-300 ${open && "rotate-[360deg]"}`} />
            <span className={`${!open && 'hidden'}`}>Product History</span>
          </li>
        </ul>
      </div>
    </div>
    <div className='sm:hidden w-10'>
      <div className={`pt-8 h-screen bg-whiterelative`}>
        <img src={logo} className={`h-10 rounded-full cursor-pointer`} alt='medcare.com' />
        <ul className='pt-10 mx-1'>
          <li className={`font-semibold text-xl flex items-center gap-x-4 cursor-pointer hover:bg-slate-300 rounded-md mt-5`} onClick={() => navigate('/admin/dashboard')}>
            <FcTemplate size={30} />
          </li>
          <li className={`font-semibold text-xl flex items-center gap-x-4 cursor-pointer hover:bg-slate-300 rounded-md mt-5`} onClick={() => navigate('/admin/product')}>
            <FcBriefcase size={30} />
          </li>
          <li className={`font-semibold text-xl flex items-center gap-x-4 cursor-pointer hover:bg-slate-300 rounded-md mt-5`} onClick={() => navigate('/admin/transaction')}>
            <FcInTransit size={30} />
          </li>
          <li className={`font-semibold text-xl flex items-center gap-x-4 cursor-pointer hover:bg-slate-300 rounded-md mt-5`} onClick={() => navigate('/admin/report')}>
            <FcSalesPerformance size={30} />
          </li>
          <li className={`font-semibold text-xl flex items-center gap-x-4 cursor-pointer hover:bg-slate-300 rounded-md mt-5`} onClick={() => navigate('/admin/stock_log')}>
            <FcClock size={30} />
          </li>
        </ul>
      </div>
    </div>
  </div>
  )
}

export default AdminComponent