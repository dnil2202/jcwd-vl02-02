import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../helper'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { updateCart } from '../action/useraction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ProductCategory = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [productByCategory, setProductByCategory] = useState([])
    const [userCartData, setUserCartData] = React.useState([]);
    let { iduser, status } = useSelector((state) => {
        return {
            iduser: state.userReducer.iduser,
            status: state.userReducer.status_name,
        }
    })

    // console.log(props)

    const getCategoryProduct = () => {
        // Tika Change #1 : mengganti mw api
        // Before : getproductadmin
        // After : getproduct

        axios.post(API_URL + `/api/product/getproduct?${props.id}`, {
            limit: 5,
            sort: '',
            offset: ''
        })
            .then((res) => {
                // Tika Change #2 : mengganti setProductByCategory
                // Before : setProductByCategory(res.data)
                // After : setProductByCategory(res.data.results)

                // console.log(res.data.results)
                setProductByCategory(res.data.results)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getCategoryProduct();
        let userToken = localStorage.getItem('medcarelog');
        if (userToken !== null) {
            getUserCartData();
        }
    }, []);

    // kemal add to cart APKG2-26
    const getUserCartData = async () => {
        try {
            let userToken = localStorage.getItem('medcarelog');
            let get = await axios.get(API_URL + '/api/product/getcartdata', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            console.log('user cart', get.data);
            setUserCartData(get.data);
            dispatch(updateCart(get.data));
        } catch (error) {
            console.log(error)
        }
    };


    // kemal add to cart APKG2-26
    const onAddToCart = async (id) => {

        if (iduser) {
            if (status === 'Verified') {
                try {

                    let userToken = localStorage.getItem('medcarelog');
                    let findIndex = userCartData.find(val => val.idproduct === id);


                    if (findIndex === undefined) {
                        console.log(true);

                        let data = {
                            idproduct: id,
                            newQty: 1
                        };

                        let res = await axios.post(API_URL + '/api/product/addcart', data, {
                            headers: {
                                'Authorization': `Bearer ${userToken}`
                            }
                        });


                        if (res.data.success) {
                            toast.success('Item Added to Cart', {
                                theme: "colored",
                                position: "top-center",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: false,
                                progress: undefined,
                            });
                            getUserCartData();
                        }
                    } else {

                        let checkStockQty = 0;
                        let checkCartQty = 0;

                        productByCategory.forEach((val, idx) => {
                            if (val.idproduct === id) {
                                checkStockQty = val.stock_unit
                            }
                        });

                        userCartData.forEach((val, idx) => {
                            if (val.product_id === id) {
                                checkCartQty = val.quantity
                            }
                        });

                        if (checkCartQty < checkStockQty) {
                            let data = {
                                idcart: findIndex.idcart,
                                newQty: findIndex.quantity + 1
                            };

                            let res = await axios.patch(API_URL + '/api/product/updatecart', data, {
                                headers: {
                                    'Authorization': `Bearer ${userToken}`
                                }
                            });

                            if (res.data.success) {
                                toast.success('Item Added to Cart', {
                                    theme: "colored",
                                    position: "top-center",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: false,
                                    progress: undefined,
                                });
                                getUserCartData();
                            }
                        } else {
                            toast.error('Stock has been reach maximum', {
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
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                toast.info('Verified your account first', {
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
        } else {
            toast.info('You need to login first', {
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
    };

    const printData = () => {
        return productByCategory.map((val, idx) => {
            return (
                <div className='w-48 h-[350px] rounded-lg shadow-[16px] mx-4 my-4 bg-white grid-cols-8 hover:-translate-y-1 hover:scale-110 duration-500 delay-300 hover:shadow-2xl hover:shadow-main-500' key={val.idproduct} >
                    <Link to={`/product/detail?product_name=${val.product_name}&category_id=${val.category_id}`}>
                        <div className=''>
                            <div className='flex justify-center min-w-full h-[147px] object-none mt-2'>
                                {/* <img src={val.picture} alt='medcare.com' className='object-cover h-[147px]' /> */}
                                {
                                    val.picture.includes('http') ?
                                        <img src={val.picture} alt='medcare.com'  className='object-cover h-[147px]' />
                                        :
                                        <img src={API_URL + val.picture} alt='medcare.com'  className='object-cover h-[147px]' />
                                }
                            </div>
                            <div className='py-2 h-28'>
                                <div className='w-full h-10'>
                                    <p className=' px-5 text-txt-500 font-bold leading-5 text-sm font-Public'>{val.product_name}</p>
                                </div>
                                <div className='w-20 my-3 px-5 flex '>
                                    <p className='border border-red-400 text-xs text-red-300 font-bold text-center font-Public'>17%</p>
                                    <p className='pl-1 text-gray-400 text-xs line-through font-Public'>Rp.6.000</p>
                                </div>
                                <div className='px-5 flex justify-between'>
                                    <div className='w-24 h-5'>
                                        <p className='text-txt-500 font-bold text-base leading-[18.8px]'>Rp.{val.price.toLocaleString('id')}</p>
                                    </div>
                                    <p className='text-sm text-gray-400 font-normal font-Public'>/{val.netto_unit}</p>
                                </div>
                            </div>
                        </div>
                    </Link >
                    <div className='px-5 py-5'>
                        <button type='button' className='border-2 border-main-500 text-main-500 px-10 text-base leading-[14px] rounded-lg py-2 font-bold hover:bg-main-500 hover:text-white font-Public'
                            onClick={() => onAddToCart(val.idproduct)}>Keranjang</button>
                    </div>
                </div >

            )
        })
    }

    return (
        <div className=''>
            <div className='overflow-x-auto w-full h-[400px]'>
                <div className=' flex'>
                    {printData()}
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ProductCategory