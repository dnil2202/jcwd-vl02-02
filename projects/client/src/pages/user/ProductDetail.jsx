import React, { useState, useEffect } from 'react'
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { ImMinus, ImPlus } from 'react-icons/im';
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../helper';
import { Tabs } from 'flowbite-react';
import ProductCategory from '../../components/ProductCategory';
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateCart } from '../../action/useraction';
import { useDispatch, useSelector } from 'react-redux';
import LoadingComponent from '../../components/Loading';
import { Helmet } from 'react-helmet';


const ProductDetail = () => {

    const { search } = useLocation()

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);
    const [counter, setCounter] = React.useState(1);
    const [productDetail, setProductDetail] = React.useState([]);
    const [userCartData, setUserCartData] = React.useState([]);

    const { status } = useSelector((state) => {
        return {
            status: state.userReducer.status_name
        }
    })
    console.log(search)

    const getDetailProduct = () => {
        // Tika Change #1 : mengganti mw api
        // Before : getproductadmin
        // After : getproduct
        axios.post(API_URL + `/api/product/getproduct${search.split('&')[0]}`, {
            limit: 1,
            sort: "",
            offset: ""
        })
            .then((res) => {
                // Tika Change #2 : mengganti setProductDetail
                // Before : setProductDetail(res.data)
                // After : setProductDetail(res.data.results)

                console.log(res.data.results)
                setProductDetail(res.data.results)
            })
            .catch((err) => {
                console.log(err)
            })
            // .then((res) => {
            //     // Tika Change #3 : mengganti setProductDetail
            //     // Before : setProductDetail(res.data)
            //     // After : setProductDetail(res.data.results)
                
            //     setProductDetail(res.data.results)
            // })
            // .catch((err) => {
            //     console.log(err)
            // })
    }

    useEffect(() => {
        getDetailProduct();
        let userToken = localStorage.getItem('medcarelog');
        if (userToken !== null) {
            getUserCartData();
        }
    }, [search])

    const printProductDetail = () => {
        return productDetail.map((val, idx) => {
            return (
                <div key={val.idproduct}>
                    <Helmet>
                        <title>{val.product_name}</title>
                        <meta name="description" content={val.description}/>
                    </Helmet>
                    <div className='py-5 divide-y divide-[#F8F8F8] md:grid md:grid-cols-3' >
                        <div className='bg-white  max-w-full max-h-[184-x] lg:px-20'>
                            <div className='w-full h-[200px] top-[100px] shadow-lg rounded-2xl mb-5'>
                                {/* <img src={val.picture} className='w-[206.52px] h-[159.34px] mx-auto ' /> */}
                                {
                                    val.picture.includes('http') ?
                                        <img src={val.picture} className='w-[206.52px] h-[159.34px] mx-auto ' />
                                        :
                                        <img src={API_URL + val.picture} className='w-[206.52px] h-[159.34px] mx-auto ' />
                                }
                            </div>
                            <div className='hidden mx-auto md:flex justify-start'>
                                <button className='bg-main-500 hover:bg-main-700 focus:ring-main-500 text-white rounded-full py-[5px] w-36 h-12 font-Public text-sm leading-4'>Chat admin</button>
                                <button className='bg-main-500 hover:bg-main-700 focus:ring-main-500 text-white rounded-full py-[5px] w-36 h-12 ml-2 font-Public text-sm leading-4'>Bagikan</button>
                            </div>
                        </div>
                        <div className=' px-5 text-xs divide-y divide-[#F8F8F8] md:col-span-2 md:px-10'>
                            <div>
                                <p className='font-Public text-txt-500 text-sm leading-5 font-bold '>{val.product_name}</p>
                                <p className='text-xl text-txt-500 font-Public font-normal leading-7'>{val.product_name}</p>
                                <p className='text-2xl leading-7 font-bold bg-gradient-to-t from-[#000C36] via-[#2B4179] to-[#7987BC] bg-clip-text text-transparent font-Public'>Rp. {val.price.toLocaleString('ID')}</p>
                                {/* <p className='font-Public text-txt-500'>Available Stock = {val.stock_unit}</p> */}
                            </div>
                            <div className='flex'>
                                <div className=' bg-[#F6FAFB]  w-32 h-9 mt-5 rounded-sm mb-3'>
                                    <div className='flex justify-between px-2'>
                                        <ImMinus size={20} className='fill-main-500 my-2' onClick={() => {
                                            if (counter >= 2) {
                                                setCounter(counter - 1)
                                            }
                                        }} />
                                        <div className='font-Public text-base leading-5 text-center w-14 h-8 text-main-500 my-2 font-bold'>{counter}</div>
                                        <ImPlus size={20} className='fill-main-500 my-2' onClick={() => {
                                            if (counter < val.stock_unit) {
                                                setCounter(counter + 1)
                                            }
                                        }} />
                                    </div>
                                </div>
                                <div className='mt-7 font-normal text-xs leading-5 text-[#737A8D] ml-2 '> Available Stock {val.stock_unit}</div>

                            </div>
                            <div className='hidden md:flex'>
                                <button type='button' onClick={() => {
                                    if (status !== 'Unverified') {
                                        onAddToCart(val.idproduct)
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
                                }}
                                    className='w-32 border bg-white border-main-600 hover:bg-gray-100 focus:ring-main-500 text-white rounded-lg flex justify-center py-2'>
                                    <AiOutlineShoppingCart size={20} className='fill-main-500' />
                                    <p className='text-sm text-main-500 font-Public'>Cart</p>
                                </button>
                                <button type='button' onClick={() => {
                                    if (status !== 'Unverified') {
                                        setLoading(true);
                                        setTimeout(() => {
                                            setLoading(false);
                                            let selected = [];
                                            selected.push({ ...val, quantity: counter });
                                            let totalPrice = val.price * counter;
                                            let state = { selected, totalPrice };
                                            navigate('/checkout', { state })
                                        }, 2000)
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
                                }}
                                    className='w-32 mx-3 bg-main-500 hover:bg-main-700 focus:ring-main-500 text-white rounded-lg font-Public'
                                >Buy</button>
                                <button type='button' className='w-10 pl-2 border  border-main-600 bg-white rounded-lg hover:bg-gray-100'><AiOutlineHeart size={20} className='fill-teal-500' /></button>
                            </div>
                            <div className='px-7  pt-10 md:px-0'>
                                <Tabs.Group
                                    aria-label="Tabs"
                                    style="underline"
                                >
                                    <Tabs.Item title='Description'>
                                        <div className='text-justify text-sm font-normal leading-5 text-[#4F618E]'>
                                            {val.description}
                                        </div>
                                    </Tabs.Item>
                                    <Tabs.Item title='How To Use'>
                                        <div className='text-justify text-sm font-normal leading-5 text-[#4F618E]'>
                                            {val.aturan_pakai}
                                        </div>
                                    </Tabs.Item>
                                    <Tabs.Item title='Dosis'>
                                        <div className='text-justify text-sm font-normal leading-5 text-[#4F618E]'>
                                            {val.dosis}
                                        </div>
                                    </Tabs.Item>
                                </Tabs.Group>
                            </div>
                        </div>
                        <div className='w-full h-24 bg-gray-100 mt-24 md:hidden'>
                            <div className='flex py-10 justify-center '>
                                <button className='px-2 py-2 mr-3 border  border-main-600 bg-white rounded-lg hover:bg-gray-100'><AiOutlineHeart className='fill-teal-500' /></button>
                                <button className='px-2 py-2 mr-3 border  border-main-600 bg-white rounded-lg hover:bg-gray-100'><AiOutlineShoppingCart className='fill-teal-500' /></button>
                                <button className='px-20 bg-main-500 hover:bg-main-700 focus:ring-main-500 text-white rounded-lg font-Public'>Buy</button>
                            </div>
                        </div>

                    </div>
                </div>
            )
        })
    }

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
        try {
            console.log('idproduct', id);

            let userToken = localStorage.getItem('medcarelog');

            if (userToken === null) {
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
                navigate('/login');
            } else {

                let findIndex = userCartData.find(val => val.idproduct === id);

                // console.log(findIndex)

                if (findIndex === undefined) {
                    console.log(true);

                    let data = {
                        idproduct: id,
                        newQty: counter
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

                    productDetail.forEach((val, idx) => {
                        if (val.idproduct === id) {
                            checkStockQty = val.stock_unit
                        }
                    });

                    userCartData.forEach((val, idx) => {
                        if (val.product_id === id) {
                            checkCartQty = val.quantity
                        }
                    });

                    if ((checkCartQty + counter) <= checkStockQty){
                        
                        let data = {
                            idcart: findIndex.idcart,
                            newQty: findIndex.quantity + counter
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
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div>

            <div className=' container mx-auto md:px-10'>
                {printProductDetail()}
                <p className='mt-28 text-sm font-Public font-bold text-txt-500'>Product Terkait</p>
                <div className='bg-gradient-to-t from-teal-50 to-white'>
                    <ProductCategory
                        id={search.split('&')[1]}
                        limit={10}
                    />
                </div>
            </div>
            <LoadingComponent loading={loading} />
        </div>
    )
}

export default ProductDetail
