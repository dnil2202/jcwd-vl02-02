import React, { useState } from 'react'
import logo from '../assets/medical-logo-removebg-preview.png'
import { BiSearchAlt2 } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../action/useraction';
import Avatar from './Avatar';
import { RiShoppingCartLine } from "react-icons/ri";
import LoadingComponent from './Loading';
import { API_URL } from '../helper';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const NavbarComponent = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [dropdown, setDropdown] = useState(false)
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false)

  const { status, email } = useSelector((state) => {
    return {
      status: state.userReducer.status_name,
      email: state.userReducer.email
    }
  })

  let { username, role, profile_pic } = useSelector((state) => {
    return {
      username: state.userReducer.username,
      role: state.userReducer.role,
      profile_pic: state.userReducer.profile_pic,
    }
  })

  const onLogout = () => {
    dispatch(logoutAction())
    navigate('/', { replace: true })
  }

  // kemal tambah fitur logo cart

  const { cart } = useSelector((state) => {
    return {
      cart: state.userReducer.cart
    }
  })

  // Update Verification

  const resendVerif = async () => {
    setDisable(true)
    try {
      await axios.get(`${API_URL}/api/user/resend-verif?email=${email}`)
        .then((res) => {
          toast.success('Please check your email', {
            theme: "colored",
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          })
        })
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
        theme: "colored",
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      })
    }
  }
  

  return (
    <div>
      {
        status === 'Unverified' &&
        <button className='w-full bg-red-700 hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-700' onClick={resendVerif} disabled={disable}>
          <p className='text-center font-Public'>Click here to verified your account</p>
        </button>
      }
      <div className='shadow-md shadow-teal-50 mb-8'>
        <div className='container md:px-14 md:mx-auto'>
          <div className='flex py-3 justify-between'>
            <div className='flex-none'>
              <div className='hidden sm:flex' onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setDropdown(false);
                  setLoading(false);
                  navigate('/');
                }, 1000)
              }}>
                <img src={logo} className='h-9' alt='medcare.com' />
                <span className='text-sm bg-gradient-to-r from-green-500 to-blue-600 text-transparent font-extrabold bg-clip-text mt-2 cursor-pointer'>MedCare</span>
              </div>
            </div>
            <div className='flex grow relative'>
              <input placeholder='Search' className='grow mx-10 w-1/2 border border-slate-600 rounded-lg px-10' />
              <BiSearchAlt2 className='absolute left-12 top-2 fill-slate-500' size={25} />
            </div>
            <div className='flex-none'>
              {
                props.loading ? (
                  <Spinner
                    aria-label="Extra large spinner example"
                    size="xl"
                  />)
                  : username && !props.loading ? (
                    <div className='relative flex items-center w-24 justify-between'>
                      {/* kemal tambah button cart */}
                      <button type='button' onClick={() => {
                        if (status !== 'Unverified') {
                          setLoading(true);
                          setTimeout(() => {
                            setLoading(false);
                            navigate('/cart');
                          }, 1500)
                        } else if (status === 'Unverified') {
                          toast.info('Verified your account first!', {
                            theme: "colored",
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                          });
                        }
                      }}>
                        <RiShoppingCartLine className='w-7 h-7 mr-3 text-main-500' />
                        <div className='border-0 bg-red-600 font-bold text-white text-xs rounded-full w-fit p-1 px-2 z-10 absolute left-5 bottom-5'>{cart.length}</div>
                      </button>
                      <Avatar
                        onClick={() => setDropdown(!dropdown)}
                        src={profile_pic ? API_URL + profile_pic : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                        w={10}
                        h={10}
                        b={1}
                        width={3}
                        height={3}
                      />
                      {
                        dropdown &&
                        <div>
                          {
                            role === 'User' ?
                              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                                <div className="py-1" role="none">
                                  <button href="#" className="text-gray-700 block px-4 py-2 text-sm" onClick={() => {
                                    setLoading(true);
                                    setTimeout(() => {
                                      setDropdown(false);
                                      setLoading(false);
                                      {
                                        status === 'Verified'?
                                        navigate('/profile')
                                        :
                                        navigate('/')
                                      }
                                    }, 1500)
                                  }}>Account settings</button>
                                  <button href="#" className="text-gray-700 block px-4 py-2 text-sm" onClick={() => {
                                    setLoading(true);
                                    setTimeout(() => {
                                      setDropdown(false);
                                      setLoading(false);
                                      navigate('/product');
                                    }, 1500)
                                  }}>Product</button>
                                  <button href="#" className="text-gray-700 block px-4 py-2 text-sm" onClick={() => {
                                    if (status !== 'Unverified') {
                                      setLoading(true);
                                      setTimeout(() => {
                                        setDropdown(false);
                                        setLoading(false);
                                        navigate(`/${username}/transaction`);
                                      }, 1500)
                                    } else if (status === 'Unverified') {
                                      toast.info('Verified your account first!', {
                                        theme: "colored",
                                        position: "top-center",
                                        autoClose: 2000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: false,
                                        progress: undefined,
                                      });
                                    }
                                  }}>Transaction</button>
                                  <form method="POST" action="#" role="none">
                                    <button type="submit" className="text-gray-700 block w-full px-4 py-2 text-left text-sm" onClick={onLogout}>Sign out</button>
                                  </form>
                                </div>
                              </div>
                              :
                              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                                <div className="py-1" role="none">
                                  <button href="#" className="text-gray-700 block px-4 py-2 text-sm" onClick={() => {
                                    setLoading(true);
                                    setTimeout(() => {
                                      setDropdown(false);
                                      setLoading(false);
                                      navigate('/profile');
                                    }, 1500)
                                  }}>Account settings</button>
                                  <button href="#" className="text-gray-700 block px-4 py-2 text-sm" onClick={() => {
                                    setLoading(true);
                                    setTimeout(() => {
                                      setDropdown(false);
                                      setLoading(false);
                                      navigate('/admin/product/add');
                                    }, 1500)
                                  }}>Add Product</button>
                                  <button href="#" className="text-gray-700 block px-4 py-2 text-sm" onClick={() => {
                                    setLoading(true);
                                    setTimeout(() => {
                                      setDropdown(false);
                                      setLoading(false);
                                      navigate('/admin/product');
                                    }, 1500)
                                  }}>Product</button>
                                  <button href="#" className="text-gray-700 block px-4 py-2 text-sm" onClick={() => {
                                    setLoading(true);
                                    setTimeout(() => {
                                      setDropdown(false);
                                      setLoading(false);
                                      navigate('/admin/transaction');
                                    }, 1500)
                                  }}>Detail Transaction</button>
                                  <form method="POST" action="#" role="none">
                                    <button type="submit" className="text-gray-700 block w-full px-4 py-2 text-left text-sm" onClick={onLogout}>Sign out</button>
                                  </form>
                                </div>
                              </div>
                          }
                        </div>
                      }
                    </div>
                  ) : (
                    // Update Button
                    <div className='flex '>
                      <button className='transition mr-4 bg-white border border-main-500 focus:ring-main-500 text-main-500 font-bold text-sm rounded-lg w-20 md:w-28 h-11 hover:-translate-y-1 ' onClick={() => navigate('/login')}>Sign In</button>
                      <button className='transition mr-4 bg-main-500 hover:bg-main-700 focus:ring-main-500 text-white rounded-lg font-bold text-sm w-20 md:w-28 h-11 hover:-translate-y-1 ' onClick={() => navigate('/register')} >Sign Up</button>
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <LoadingComponent loading={loading} className='z-50' />
    </div>
  )
}

export default NavbarComponent