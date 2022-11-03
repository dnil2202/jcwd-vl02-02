import axios from 'axios';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { API_URL } from '../../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bni from '../../assets/Bank BNI Logo (PNG-1080p) - FileVector69.png';
import bca from '../../assets/Bank BCA Logo (PNG-1080p) - FileVector69.png';
import bri from '../../assets/bri.png';
import NewAddressComponent from '../../components/NewAddressModalComp';
import EditAddressComponent from '../../components/EditAddressModalComp';
import LoadingComponent from '../../components/Loading';
import success from '../../assets/success.png';
import Currency from '../../components/CurrencyComp';
import { useSelector } from 'react-redux';
import BankInfo from '../../components/BankInfoAccordion';
import { Helmet } from 'react-helmet';

const Checkout = (props) => {

    const [loading, setLoading] = React.useState(false);
    const [showSuccessPayModal, setShowSuccessPayModal] = React.useState('');

    const [checkoutData, setCheckoutData] = React.useState([]);
    const [allAddress, setAllAddress] = React.useState([]);
    const [selectedAddress, setSelectedAddress] = React.useState(null);
    const [showAddressModal, setShowAddressModal] = React.useState('');
    const [showNewAddressModal, setShowNewAddressModal] = React.useState('');
    const [showEditAddressModal, setShowEditAddressModal] = React.useState('');
    const [showPaymentModal, setShowPaymentModal] = React.useState('');
    const [paymentMethod, setPaymentMethod] = React.useState('');

    // RAJAONGKIR
    const [courier, setCourier] = React.useState('');
    const [delivery, setDelivery] = React.useState([]);
    const [selectedDelivery, setSelectedDelivery] = React.useState('');
    const [loadDelivery, setLoadDelivery] = React.useState(false);
    const [loadCourier, setLoadCourier] = React.useState(false);
    const [weight, setWeight] = React.useState(1000); // contoh berat 1000 gram
    const [origin, setOrigin] = React.useState(153); //kode city_id Jakarta Selatan
    const [totalDelivery, setTotalDelivery] = React.useState(0)

    // INPUT EDIT ADDRESS
    const [selectedEdit, setSelectedEdit] = React.useState({});

    const { state } = useLocation();
    const navigate = useNavigate();

    const { username } = useSelector((state) => {
        return {
            username: state.userReducer.username
        }
    })

    React.useEffect(() => {
        console.log('selected', state.selected)
        setCheckoutData(state.selected);
        getAddress();
    }, [showAddressModal, showEditAddressModal, showNewAddressModal]);

    const getAddress = async () => {
        try {
            setLoading(true)
            let userToken = localStorage.getItem('medcarelog');
            let getAddress = await axios.get(API_URL + '/api/address/get', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            //console.log('user address', getAddress.data);
            if (getAddress.data.length > 0) {
                setAllAddress(getAddress.data);

                let getSelectedAddress = getAddress.data.find((val, idx) => val.selected === "true");
                let getPrimaryAddress = getAddress.data.find((val, idx) => val.status_name === "Primary");


                if (selectedAddress === {}) {
                    setSelectedAddress(getPrimaryAddress);
                } else {
                    if (getSelectedAddress === getPrimaryAddress) {
                        setSelectedAddress(getPrimaryAddress);
                    } else {
                        setSelectedAddress(getSelectedAddress);
                    }
                }
                setLoading(false);
            } else {
                setSelectedAddress(null);
                setLoading(false);
            }

        } catch (error) {
            console.log(error)
        }
    };

    const onSelectAddress = async (id) => {
        try {
            let userToken = localStorage.getItem('medcarelog');
            let select = await axios.patch(API_URL + '/api/address/update', { selected: 'true', idaddress: id }, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            })

            if (select.data.success) {
                getAddress();
            }
        } catch (error) {
            console.log(error)
        }
    };

    const printAllAddress = () => {
        return allAddress.map((val, idx) => {
            return (
                <div key={val.idaddress} className={selectedAddress === val ? 'border-2 rounded-lg flex my-3 bg-teal-50' : 'border-2 rounded-lg flex my-3'}>
                    <div key={val.idaddress} className='flex flex-col items-start p-3 w-3/4'>
                        <p className='text-main-500 font-semibold'>{val.fullname}</p>
                        <p>{val.phone_number}</p>
                        <p className='text-transform: capitalize'>{val.full_address}</p>
                        <p className='text-transform: capitalize text-start'>Kecamatan {val.district}, {val.city}, {val.province}, {val.postal_code}</p>
                        <div className='flex'>
                            <button type='button' className='text-main-600 hover:underline' onClick={() => { setShowEditAddressModal('show'); setSelectedEdit(val); setShowAddressModal('') }}>Edit Address</button>
                            {
                                selectedAddress !== val ?
                                    <>
                                        <p className='font-bold text-main-500 mx-2 sm:hidden'>|</p>
                                        <button type='button'
                                            className='sm:hidden text-main-500 hover:underline focus:underline'
                                            onClick={() => {
                                                onSelectAddress(val.idaddress);
                                                setShowAddressModal('');
                                                setLoadDelivery(true);
                                                setLoadCourier(true);
                                                setCourier('');
                                                setDelivery([]);
                                                setSelectedDelivery('');
                                                setTimeout(() => {
                                                    setLoadDelivery(false);
                                                    setLoadCourier(false);
                                                }, 1000)
                                                setTotalDelivery(0);
                                            }}>Select Address</button>
                                    </>
                                    :
                                    ""
                            }
                        </div>
                    </div>
                    {
                        selectedAddress === val ?
                            ""
                            :
                            <div className='hidden sm:w-1/4 sm:flex sm:items-center sm:justify-center'>
                                <button type='button'
                                    className='border p-3 rounded-lg bg-main-500 text-white font-semibold hover:bg-main-600 focus:ring-2 focus:ring-main-500'
                                    onClick={() => {
                                        onSelectAddress(val.idaddress);
                                        setShowAddressModal('');
                                        setLoadDelivery(true);
                                        setLoadCourier(true);
                                        setCourier('');
                                        setDelivery([]);
                                        setSelectedDelivery('');
                                        setTimeout(() => {
                                            setLoadDelivery(false);
                                            setLoadCourier(false);
                                        }, 1000)
                                        setTotalDelivery(0);
                                    }}>Select Address</button>
                            </div>
                    }
                </div>
            )
        })
    };

    const printSelectedAddress = () => {
        if (selectedAddress !== null) {
            return (
                <div>
                    <p className='text-transform: uppercase font-semibold'>{selectedAddress.fullname}</p>
                    <p className='text-transform: uppercase'>{selectedAddress.phone_number}</p>
                    <p className='text-transform: uppercase'>{selectedAddress.full_address}</p>
                    <p className='text-transform: uppercase'>Kecamatan {selectedAddress.district}, {selectedAddress.city}, {selectedAddress.province}, {selectedAddress.postal_code}</p>
                </div>
            )
        } else {
            return (
                <div>
                    You don't have any address. Please click select change address and click add new address.
                </div>
            )
        }
    };

    const printSummary = () => {
        return checkoutData.map((val, idx) => {
            return (
                <div key={val.idcart} className='flex border-b-2 border-grey-300 my-1'>
                    <div>
                        <img src={val.picture} style={{ maxWidth: '8rem' }} alt={val.product_name} />
                    </div>
                    <div className='flex flex-col w-full'>
                        <div className='flex flex-col sm:flex-row justify-between h-2/3'>
                            <div className='w-full sm:w-1/2 px-3 pt-1 text-center sm:text-start'>
                                <p className='font-medium'>{val.product_name}</p>
                            </div>
                            <div className='w-full sm:w-1/2 text-center pt-1 font-semibold flex flex-col sm:flex-row'>
                                <div className='w-full sm:w-2/5 flex justify-center'>
                                    <p>Qty:</p>
                                    <p className='mx-1'>{val.quantity}</p>
                                    <p className='transform: capitalize'>{val.default_unit}</p>
                                </div>
                                <div className='w-full sm:w-3/5 text-center sm:text-end'>
                                    <Currency price={(val.price * val.quantity)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    };

    const getDelivery = async (courier) => {
        try {
            if (courier != '') {
                setLoadDelivery(true);
                let getDeliv = await axios.get(API_URL + `/api/rajaongkir/delivery/${origin}/${selectedAddress.city_id}/${weight}/${courier}`)

                console.log(getDeliv.data);
                if (getDeliv.data.length >= 0) {
                    setDelivery(getDeliv.data);
                    setTimeout(() => {
                        setLoadDelivery(false)
                    }, 1000)
                }
            } else {
                setDelivery([]);

            }
        } catch (error) {
            console.log(error)
        }
    };

    const printDelivery = () => {
        return delivery.map((val, idx) => {
            if (courier !== 'none') {
                if (courier === 'pos') {
                    return (
                        <option key={idx} value={`${val.cost[0].value},${val.service}`}>{val.service} [Estimate {val.cost[0].etd.split(' ')[0]} Day(s)] - <Currency price={val.cost[0].value} /></option>
                    )
                } else {
                    return (
                        <option key={idx} value={`${val.cost[0].value},${val.service}`}>{val.service} [Estimate {val.cost[0].etd} Day(s)] - <Currency price={val.cost[0].value} /></option>
                    )
                }
            }
        })
    };

    const onPay = async () => {
        try {
            // userid, user_name, invoice_number, status_id = 3, useraddress, 
            // orderweight, delivery price, shipping courier, prescription pic 

            let userToken = localStorage.getItem('medcarelog');

            // INVOICE NUMBER
            let randomNumber = new Date().getTime();
            let presCode = 1; // kode invoice untuk cart
            let setInvoice = 'INV' + '/' + presCode + '/' + randomNumber;

            // DATE_ORDER
            let get = new Date().getTime();
            let date_order = new Date(get);

            // ADDRESS
            const { full_address, district, city, province, postal_code } = selectedAddress;
            let setAddress = full_address + ', ' + 'Kecamatan' + ' ' + district + ', ' + city + ', ' + province + ', ' + postal_code;

            // console.log('invoice number', setInvoice);
            // console.log('selected address', setAddress);
            // console.log('weight', weight);
            // console.log('delivery price', parseInt(selectedDelivery.split(',')[0]));
            // console.log('courier', courier);
            // console.log('total price', totalDelivery);

            let formSubmit = {
                invoice: setInvoice,
                address: setAddress,
                weight,
                delivery: parseInt(selectedDelivery.split(',')[0]),
                courier: courier + '/' + selectedDelivery.split(',')[1],
                total: state.totalPrice,
                date_order: date_order.toLocaleString('sv-SE')
            }

            console.log(checkoutData);
            console.log('form submit', formSubmit);

            // Data untuk ke transaction_detail
            // product_name, product_qty, product_qty, product_price, product_image
            let temp = [];
            checkoutData.forEach((val, idx) => {
                temp.push({
                    product_name: val.product_name,
                    product_qty: val.quantity,
                    product_price: val.price,
                    product_unit: val.default_unit,
                    product_image: val.picture,
                    product_id: val.idproduct
                })
            });
            // console.log(temp)

            setLoading(true);
            setShowPaymentModal('');
            let res = await axios.post(API_URL + '/api/transaction/add', { formSubmit, detail: temp }, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            })

            if (res.data.success) {
                state.selected.forEach(async (val, idx) => {
                    if (val.idcart) {
                        await axios.delete(API_URL + `/api/product/deletecart/${val.idcart}`)
                    }
                });

                setTimeout(() => {
                    setLoading(false);
                    setShowSuccessPayModal('show');
                }, 2500)
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div>
            <Helmet>
                <title>Checkout</title>
            </Helmet>
            <div className='sm:container sm:mx-auto py-5'>
                <div className='sm:mx-9'>
                    <div className='text-xl font-bold px-3 text-main-600'>
                        Checkout
                    </div>
                    <div className='flex flex-col lg:flex-row mt-2'>
                        <div className='basis-7/12'>
                            <div className='hidden lg:block border m-2 p-3 shadow-md rounded-md'>
                                {/* tunggu nama address dari api */}
                                <p className='text-md font-bold mb-2 border-b-2 pb-2 text-main-600 border-main-800'>Delivery Address</p>
                                <div className='my-2'>
                                    {printSelectedAddress()}
                                </div>
                                <button type='button' className='text-main-600 hover:underline' onClick={() => setShowAddressModal('show')}>Change Address</button>
                                {/* MODAL ALAMAT */}
                                {
                                    showAddressModal === 'show' ?
                                        <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-full">
                                            <div className="relative p-4 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 h-full sm:h-auto">
                                                <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                                    <div className="p-6 text-center">
                                                        <div>
                                                            <p className='text-2xl font-bold text-main-500'>Choose Delivery Address</p>
                                                        </div>
                                                        <button type='button' className='mt-3 mb-2 py-3 w-full border rounded-lg font-bold text-gray-400 text-lg hover:bg-teal-50 focus:ring-2 focus:ring-teal-100'
                                                            onClick={() => { setShowNewAddressModal('show'); setShowAddressModal('') }}>Add New Address</button>
                                                        <div>
                                                            {printAllAddress()}
                                                        </div>
                                                        <button type="button"
                                                            className="text-white bg-red-500 focus:ring-2 focus:ring-red-500 border border-gray-200 hover:bg-red-600 rounded-lg text-sm font-medium px-10 py-2.5 focus:z-10 "
                                                            onClick={() => setShowAddressModal('')}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        ""
                                }
                                {/* MODAL ALAMAT BARU */}
                                {
                                    showNewAddressModal === 'show' ?
                                        <NewAddressComponent showModal={setShowNewAddressModal} />
                                        :
                                        ""
                                }
                                {/* MODAL EDIT ALAMAT */}
                                {
                                    showEditAddressModal === 'show' ?
                                        <EditAddressComponent selected={selectedEdit} showModal={setShowEditAddressModal} />
                                        :
                                        ""
                                }
                            </div>
                            <div className='border m-2 p-3 shadow-md rounded-md '>
                                <p className='text-md font-bold mb-2 border-b-2 pb-2 text-main-600 border-main-800'>Summary</p>
                                {printSummary()}
                                <div className='w-full flex flex-row py-3 text-lg'>
                                    <div className='w-2/5 px-3 font-semibold'>
                                        Sub Total
                                    </div>
                                    <div className='w-3/5 text-center sm:text-end font-semibold'>
                                        <Currency price={state.totalPrice} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='basis-5/12'>
                            <div className='lg:hidden border m-2 p-3 shadow-md rounded-md'>
                                {/* tunggu nama address dari api */}
                                <p className='text-md font-bold mb-2 border-b-2 pb-2 text-main-600 border-main-800'>Delivery Address</p>
                                <div className='my-2'>
                                    {printSelectedAddress()}
                                </div>
                                <button type='button' className='text-main-600 hover:underline' onClick={() => setShowAddressModal('show')}>Change Address</button>
                                {/* MODAL ALAMAT */}
                                {
                                    showAddressModal === 'show' ?
                                        <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-full">
                                            <div className="relative p-4 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 h-full sm:h-auto">
                                                <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                                    <div className="p-6 text-center">
                                                        <div>
                                                            <p className='text-2xl font-bold text-main-500'>Choose Delivery Address</p>
                                                        </div>
                                                        <button type='button' className='mt-3 mb-2 py-3 w-full border rounded-lg font-bold text-gray-400 text-lg hover:bg-teal-50 focus:ring-2 focus:ring-teal-100'
                                                            onClick={() => { setShowNewAddressModal('show'); setShowAddressModal('') }}>Add New Address</button>
                                                        <div>
                                                            {printAllAddress()}
                                                        </div>
                                                        <button type="button"
                                                            className="text-white bg-red-500 focus:ring-2 focus:ring-red-500 border border-gray-200 hover:bg-red-600 rounded-lg text-sm font-medium px-10 py-2.5 focus:z-10 "
                                                            onClick={() => setShowAddressModal('')}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        ""
                                }
                                {/* MODAL ALAMAT BARU */}
                                {
                                    showNewAddressModal === 'show' ?
                                        <NewAddressComponent showModal={setShowNewAddressModal} />
                                        :
                                        ""
                                }
                                {/* MODAL EDIT ALAMAT */}
                                {
                                    showEditAddressModal === 'show' ?
                                        <EditAddressComponent selected={selectedEdit} showModal={setShowEditAddressModal} />
                                        :
                                        ""
                                }
                            </div>
                            <div className='border m-2 p-3 shadow-md rounded-md border-main-500'>
                                <p className='font-bold text-xl text-main-500 mb-3'>Checkout Summary</p>
                                <div className='w-full flex flex-col my-2'>
                                    <p>Choose Courier :</p>
                                    {
                                        loadCourier ?
                                            <div role="status" className='w-full flex items-center justify-center'>
                                                <svg className="inline mr-2 w-8 h-8 text-gray-200 animate-spin  fill-main-600 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            <select type='text' onChange={(e) => { getDelivery(e.target.value); setCourier(e.target.value) }}
                                                className='w-full border border-main-600 rounded-lg px-3 h-10 mt-2 focus:ring-2 focus:ring-main-500'>
                                                <option value=''>Select Courier</option>
                                                {
                                                    allAddress.length > 0 &&
                                                    <>
                                                        <option value='jne'>JNE</option>
                                                        <option value='tiki'>TIKI</option>
                                                        <option value='pos'>POS Indonesia</option>
                                                    </>
                                                }
                                            </select>
                                    }
                                </div>
                                <div className='w-full flex flex-col my-2'>
                                    <p>Choose Delivery Duration:</p>
                                    {
                                        loadDelivery ?
                                            <div role="status" className='w-full flex items-center justify-center'>
                                                <svg className="inline mr-2 w-8 h-8 text-gray-200 animate-spin  fill-main-600 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            <select type='text' onChange={(e) => { setSelectedDelivery(e.target.value); setTotalDelivery(parseInt(e.target.value.split(',')[0]) + parseInt(state.totalPrice)) }}
                                                className='w-full border border-main-600 rounded-lg px-3 h-10 mt-2 focus:ring-2 focus:ring-main-500'>
                                                <option value='none'>Select Duration</option>
                                                {printDelivery()}
                                            </select>
                                    }
                                </div>
                                <div className='flex justify-between py-4'>
                                    <p>Sub Total Item(s)</p>
                                    <Currency price={state.totalPrice} />
                                </div>
                                <div className='flex justify-between border-b-2 border-main-800 pb-4'>
                                    <p>Delivery</p>
                                    {
                                        selectedDelivery ?
                                            <p><Currency price={parseInt(selectedDelivery.split(',')[0])} /></p>
                                            :
                                            <p><Currency price={0} /></p>
                                    }
                                </div>
                                <div className='flex justify-between my-4'>
                                    <p className='font-bold text-2xl text-main-500'>Total Delivery</p>
                                    <p className='font-bold text-2xl text-main-500'><Currency price={totalDelivery} /></p>
                                </div>
                                <div>
                                    <button type='button'
                                        className='flex w-full bg-main-500 text-white justify-center py-3 font-bold text-2xl rounded-lg
                                hover:bg-main-600 focus:ring-offset-main-500 focus:ring-offset-2 focus:ring-2 focus:bg-main-600'
                                        onClick={() => {
                                            if (allAddress.length === 0) {
                                                toast.error('Please choose address', {
                                                    theme: "colored",
                                                    position: "top-center",
                                                    autoClose: 2000,
                                                    hideProgressBar: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: false,
                                                    progress: undefined,
                                                });
                                            } else {
                                                if (selectedAddress === {}) {
                                                    toast.error('Please select an Address', {
                                                        theme: "colored",
                                                        position: "top-center",
                                                        autoClose: 2000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: false,
                                                        progress: undefined,
                                                    });
                                                } else if (courier === '') {
                                                    toast.error('Please Choose Courier', {
                                                        theme: "colored",
                                                        position: "top-center",
                                                        autoClose: 2000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: false,
                                                        progress: undefined,
                                                    });
                                                } else if (selectedDelivery === '') {
                                                    toast.error('Please Choose Delivery', {
                                                        theme: "colored",
                                                        position: "top-center",
                                                        autoClose: 2000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: false,
                                                        progress: undefined,
                                                    });
                                                } else if (selectedAddress.phone_number.length < 4) {
                                                    toast.error('Please use a valid phone number', {
                                                        theme: "colored",
                                                        position: "top-center",
                                                        autoClose: 2000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: false,
                                                        progress: undefined,
                                                    });
                                                } else {
                                                    setShowPaymentModal('show')
                                                }
                                            }
                                        }}>Select Payment</button>
                                    {/* MODAL SELECT PAYMENT */}
                                    {
                                        showPaymentModal === 'show' ?
                                            <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-full">
                                                <div className="relative p-4 w-full md:w-2/3 lg:w-1/2 h-full sm:h-auto">
                                                    <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                                        <div className="p-6 text-center">
                                                            <div>
                                                                <p className='text-2xl font-bold text-main-500'>Select Payment Method</p>
                                                            </div>
                                                            <div className='flex w-full my-4 items-center justify-center'>
                                                                <img src={bni} className='w-20' alt="bnilogo" />
                                                                <img src={bca} className='w-20 mx-4' alt="bcalogo" />
                                                                <img src={bri} className='w-28' alt="brilogo" />
                                                            </div>
                                                            <div className='border-2 rounded-lg border-main-600 p-3 my-3'>
                                                                <div className='flex w-full items-center justify-start my-1'>
                                                                    <input type='radio' value='manual' onChange={(e) => { setPaymentMethod(e.target.value); console.log(e.target.value) }} />
                                                                    <span className='ml-2'>Bank Transfer (Manual Verification)</span>
                                                                </div>
                                                                <BankInfo />
                                                            </div>
                                                            <div className='w-full flex justify-center'>
                                                                <div className='w-1/2 flex justify-evenly items-center'>
                                                                    <button type="button" className="text-white bg-main-500 focus:ring-4 focus:outline-none hover:bg-main-600 focus:ring-main-500 rounded-lg border border-main-500 text-sm font-medium px-10 py-2.5 focus:z-10 disabled:bg-opacity-50 disabled:bg-main-500 disabled:border-0"
                                                                        onClick={() => onPay()} disabled={paymentMethod === '' ? true : false}>Pay</button>
                                                                    <button type="button"
                                                                        className="text-white bg-red-500 focus:ring-2 focus:ring-red-500 border border-gray-200 hover:bg-red-600 rounded-lg text-sm font-medium px-8 py-2.5 focus:z-10 "
                                                                        onClick={() => { setShowPaymentModal(''); setPaymentMethod('') }}>Cancel</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""
                                    }
                                    {/* MODAL SUCCESS */}
                                    {
                                        showSuccessPayModal === 'show' ?
                                            <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-modal md:h-full">
                                                <div className="relative p-4 w-1/2 h-full md:h-auto">
                                                    <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                                        <div className='flex flex-col items-center py-10'>
                                                            <img src={success} className='max-w-xl' alt='successorder' />
                                                            <p className='font-bold text-4xl text-main-500 my-2 text-center'>Checkout Success!</p>
                                                            <p className='font-bold text-2xl text-main-600 my-2 text-center'>Your order will be process until your payment complete.</p>
                                                            <div className='my-2 flex justify-around w-2/3'>
                                                                <button className='border-2 rounded-lg py-3 px-10 bg-white text-main-500 font-bold border-main-500 hover:bg-teal-50 focus:ring-2 focus:ring-main-500'
                                                                    onClick={() => {
                                                                        setShowSuccessPayModal('');
                                                                        setLoading(true);
                                                                        setTimeout(() => {
                                                                            setLoading(false);
                                                                            navigate('/', { replace: true });
                                                                        }, 3500)
                                                                    }}>Back to Homepage</button>
                                                                <button className='border-2 rounded-lg py-3 px-10 bg-main-500 text-white font-bold border-main-500 hover:bg-main-600 focus:ring-2 focus:ring-main-500'
                                                                    onClick={() => {
                                                                        setLoading(true);
                                                                        setTimeout(() => {
                                                                            setLoading(false);
                                                                            navigate(`/${username}/transaction`, { replace: true })
                                                                        }, 2000)
                                                                    }}>Go To Order Progress</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
                <LoadingComponent loading={loading} />
            </div>
        </div>
    )
};

export default Checkout;