import React from 'react'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { API_URL } from '../../helper';
import AdminComponent from '../../components/AdminComponent'
import Loading from '../../components/Loading'
import Currency from '../../components/CurrencyComp';
import * as XLSX from 'xlsx'
import PrintDashboardComponent from '../../components/PrintDashboard'
import { Helmet } from 'react-helmet';

const DashboardPage = (props) => {
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState(true)
    const [revenueReport, setRevenueReport] = React.useState('')
    const [totalRevenue, setTotalRevenue] = React.useState(0)
    const [totalProduct, setTotalProduct] = React.useState(0)
    const [product, setProduct] = React.useState('')
    const [productOut, setProductOut] = React.useState('')
    const [transaction, setTransaction] = React.useState('')
    const [modalProduct, setModalProduct] = React.useState('')

    const getReport = () => {
        axios.get(API_URL + `/api/transaction/report`)
            .then((res) => {
                let total_revenue = 0
                let total_product = 0
                let revenueArray = res.data.revenue.slice(-12)
                setRevenueReport({
                    labels: revenueArray.map((val) => val.month),
                    datasets: [{
                        label: "Revenue",
                        data: revenueArray.map((val) => val.revenue),
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)'
                        ]
                    }]
                })
                res.data.revenue.map((val) => {
                    total_revenue = total_revenue + val.revenue
                })
                res.data.product.map((val) => {
                    total_product = total_product + val.best_seller
                })
                setTotalRevenue(total_revenue)
                setTotalProduct(total_product)
            }).catch((err) => {
                console.log(err)
            })
    }

    const getProduct = () => {
        axios.post(API_URL + `/api/product/getproduct`, { offset: '' })
            .then((res) => {
                setProduct(res.data.totalProduct)
                let array = []
                res.data.results.map((val) => {
                    if (val.stock_unit < 5 && val.isDefault == 'true') {
                        array.push(val)
                    }
                })
                setProductOut(array)
            })
            .catch((error) => {
                console.log('Print product error', error);
            })
    }

    const getTrans = () => {
        let userToken = localStorage.getItem('medcarelog');
        axios.get(API_URL + `/api/transaction/all?limit=no`, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then((res) => {
                let order = 0
                let ready = 0
                let delivery = 0
                let completed = 0
                let canceled = 0
                res.data.transaction.map((val) => {
                    if (val.status_id == 3 || val.status_id == 4 || val.status_id == 5) {
                        order += 1
                    } else if (val.status_id == 6) {
                        ready += 1
                    } else if (val.status_id == 7) {
                        canceled += 1
                    } else if (val.status_id == 8) {
                        delivery += 1
                    } else {
                        completed += 1
                    }
                })
                setTransaction([order, ready, delivery, completed, canceled])
                setTimeout(() => setLoading(false), 500)
            }).catch((err) => {
                console.log(err)
            })
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value, index, ticks) {
                        return 'Rp' + value.toLocaleString('id');
                    }
                },
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        layout: {
            padding: 20
        },
        elements: {
            line: {
                fill: true,
                borderColor: 'teal'
            }
        }
    }

    const printMed = () => {
        return productOut.map((val, idx) => {
            if (idx < 7) {
                return <div className='grid grid-cols-5'>
                    <p className='sm:text-xl text-sm font-bold my-1 text-main-500 pl-5 col-span-3'>{val.product_name}</p>
                    <p className='sm:text-xl text-sm font-bold pl-5 text-main-800 col-span-2'>{val.stock_unit} {val.unit}</p>
                </div>
            }
        })
    }

    React.useEffect(() => {
        setLoading(true)
        getTrans()
        getReport()
        getProduct()
    }, [])

    const handleExportFile = () => {
        let report1 = [{
            Revenue: `Rp${totalRevenue.toLocaleString('id')}`,
            Product_sold: totalProduct,
            Product_registered: product,
        }]
        let report2 = [{
            New_Order: transaction[0],
            Ready_To_Ship: transaction[1],
            In_Delivery: transaction[2],
            Completed: transaction[3],
            Canceled: transaction[4]
        }]

        let stock = []
        if (productOut.length > 0) {
            productOut.map((val) => {
                stock.push({
                    product: val.product_name,
                    remain_stock: `${val.stock_unit} ${val.unit}`
                })
            })
        }

        let wb = XLSX.utils.book_new()
        let ws1 = XLSX.utils.json_to_sheet(report1)
        let ws2 = XLSX.utils.json_to_sheet(report2)
        let ws3 = ''
        if (stock.length > 0) {
            ws3 = XLSX.utils.json_to_sheet(stock)
        }

        XLSX.utils.book_append_sheet(wb, ws1, 'Revenue Analysis')
        XLSX.utils.book_append_sheet(wb, ws2, 'Transaction Analysis')
        if (stock.length > 0) {
            XLSX.utils.book_append_sheet(wb, ws3, 'Low Stock Product')
        }

        XLSX.writeFile(wb, "Dashboard.xlsx")
    }

    return (
        <div >
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            {loading ?
                <Loading loading={loading} />
                :
                <div>
                    <div className='flex'>
                        <AdminComponent page={window.location.pathname} />
                        <div className='w-screen' style={{ background: "linear-gradient(155.7deg, #D6F5F3 -46%, #F7FCFC 100%, #F1F5FC 118%)" }}>
                            <div className='ml-5'>
                                <p className="sm:text-3xl font-bold mt-5 mb-3 text-txt-500">Product and Transaction Analysis</p>
                                <p className="sm:text-xl mt-2 mb-3 text-txt-500">Last Update {new Date().toLocaleString('en-CA')}</p>
                                <div className='sm:flex'>
                                    <button
                                        className='mt-3 sm:mt-0 bg-white border py-1 px-2'
                                        onClick={() => {
                                            handleExportFile()
                                        }}
                                    >
                                        Export All Data
                                    </button>
                                    <PrintDashboardComponent data={[totalRevenue, totalProduct, product, transaction, productOut, revenueReport]} />
                                </div>
                            </div>
                            <div className='mt-5 sm:grid sm:grid-cols-3'>
                                <div className='border shadow-lg h-16 sm:h-40 bg-gray-100 rounded-lg my-2 mx-5 mr-28 sm:mr-0'>
                                    <p className="sm:text-xl font-semibold sm:mt-5 mt-2 sm:mb-3 px-5">Total Revenue</p>
                                    <p className="sm:text-4xl font-bold sm:mt-3 sm:mb-3 pl-5"><Currency price={totalRevenue} /></p>
                                </div>
                                <div className='border shadow-lg h-16 sm:h-40 bg-gray-100 rounded-lg my-2 mx-5 mr-28 sm:mr-0'>
                                    <p className="sm:text-xl font-semibold sm:mt-5 mt-2 sm:mb-3 px-5">Total Product Sold</p>
                                    <p className="sm:text-4xl font-bold sm:mt-3 sm:mb-3 pl-5">{totalProduct}</p>
                                </div>
                                <div className='border shadow-lg h-16 sm:h-40 bg-gray-100 rounded-lg my-2 mx-5 mr-28 sm:mr-0'>
                                    <p className="sm:text-xl font-semibold sm:mt-5 mt-2 sm:mb-3 px-5">Total Product Registered</p>
                                    <p className="sm:text-4xl font-bold sm:mt-3 sm:mb-3 pl-5">{product}</p>
                                </div>
                            </div>
                            <div className='ml-5 grid grid-cols-2'>
                                <p className="sm:text-2xl font-bold sm:mt-5 mt-2 sm:mb-3 text-txt-500">Transaction</p>
                                <p className="sm:text-2xl font-bold sm:mt-5 mt-2 sm:mb-3 ml-3 text-txt-500 sm:block hidden">Low Stock Product</p>
                            </div>
                            <div className='sm:mt-5 mt-2 sm:grid sm:grid-cols-2'>
                                <div className='grid sm:grid-cols-3 grid-cols-2'>
                                    <div className='border shadow-lg h-16 sm:h-40 bg-gray-100 rounded-lg my-2 mx-2 sm:mx-5 cursor-pointer' type='button' onClick={() => navigate('/admin/transaction?status=waiting')}>
                                        <p className="sm:text-xl text-sm font-semibold sm:mt-5 mt-2 sm:mb-3 px-5">New Order</p>
                                        <p className="sm:text-4xl text-sm font-bold sm:mt-3 sm:mb-3 pl-5">{transaction[0]}</p>
                                    </div>
                                    <div className='border shadow-lg h-16 sm:h-40 bg-gray-100 rounded-lg my-2 mx-2 sm:mx-5 cursor-pointer' type='button' onClick={() => navigate('/admin/transaction?status=process')}>
                                        <p className="sm:text-xl text-sm font-semibold sm:mt-5 mt-2 sm:mb-3 px-5">Ready To Ship</p>
                                        <p className="sm:text-4xl text-sm font-bold sm:mt-3 sm:mb-3 pl-5">{transaction[1]}</p>
                                    </div>
                                    <div className='border shadow-lg h-16 sm:h-40 bg-gray-100 rounded-lg my-2 mx-2 sm:mx-5 cursor-pointer' type='button' onClick={() => navigate('/admin/transaction?status=on')}>
                                        <p className="sm:text-xl text-sm font-semibold sm:mt-5 mt-2 sm:mb-3 px-5">In Delivery</p>
                                        <p className="sm:text-4xl text-sm font-bold sm:mt-3 sm:mb-3 pl-5">{transaction[2]}</p>
                                    </div>
                                    <div className='border shadow-lg h-16 sm:h-40 bg-gray-100 rounded-lg my-2 mx-2 sm:mx-5 cursor-pointer' type='button' onClick={() => navigate('/admin/transaction?status=finished')}>
                                        <p className="sm:text-xl text-sm font-semibold sm:mt-5 mt-2 sm:mb-3 px-5">Order Completed</p>
                                        <p className="sm:text-4xl text-sm font-bold sm:mt-3 sm:mb-3 pl-5">{transaction[3]}</p>
                                    </div>
                                    <div className='border shadow-lg h-16 sm:h-40 bg-gray-100 rounded-lg my-2 mx-2 sm:mx-5 cursor-pointer' type='button' onClick={() => navigate('/admin/transaction?status=canceled')}>
                                        <p className="sm:text-xl text-sm font-semibold sm:mt-5 mt-2 sm:mb-3 px-5">Order Canceled</p>
                                        <p className="sm:text-4xl text-sm font-bold sm:mt-3 sm:mb-3 pl-5">{transaction[4]}</p>
                                    </div>
                                </div>
                                <div className='border shadow-lg h-80 bg-gray-100 rounded-lg mx-5 ml-2 sm:ml-5 pt-5'>
                                    <p className="sm:text-2xl font-bold sm:mt-5 mt-2 sm:mb-3 ml-5 text-txt-500 sm:hidden">Low Stock Product</p>
                                    <p className={`${productOut.length < 1 ? 'mt-24 ml-20 sm:text-5xl font-bold text-main-500' : 'hidden'}`}>All Stock Product Controlled </p>
                                    {printMed()}
                                    <button className={`${productOut.length > 7 ? 'font-bold pl-5 text-main-800 mt-4' : 'hidden'}`} onClick={() => setModalProduct(true)}>See All Low Stock Product</button>
                                </div>
                            </div>
                            <div type='button' onClick={() => navigate('/admin/report')} className='sm:ml-5 ml-2 mt-3 border border-teal-500 rounded-lg bg-white mr-5 sm:mr-10 mb-10 cursor-pointer'>
                                <p className="sm:text-3xl text-sm font-bold mt-5 mb-3 pl-5 text-main-500 flex items-center">TOTAL REVENUE <p className='ml-2 text-sm sm:text-xl'>(Only 12 Months)</p></p>
                                <Line style={{ width: 1200, maxHeight: 400 }} data={revenueReport} options={options} />
                            </div>
                        </div>
                    </div>
                    <div id="ProductModal" tabindex="-1" aria-hidden='true' className={`${modalProduct ? "sm:pl-[35%] sm:pt-[5%] backdrop-blur-sm overflow-x-hidden fixed z-30 justify-center w-full inset-0" : "hidden"} `}>
                        {modalProduct ?
                            <div className="mt-20 w-full max-w-2xl border rounded-lg max-h-[70rem]" >
                                {/* <!-- Modal content --> */}
                                <div className="bg-blue-100 rounded-lg shadow dark:bg-gray-700">
                                    {/* <!-- Modal header --> */}
                                    <div className="flex items-center p-4 rounded-t border-b dark:border-gray-600">
                                        <h3 className="sm:text-2xl font-semibold text-gray-900 dark:text-white ml-[37%]">
                                            Low Stock Product
                                        </h3>
                                        <button type="button" onClick={() => {
                                            setModalProduct('')
                                        }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="detailModal">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    {/* <!-- Modal body --> */}
                                    <div className='h-[30rem] overflow-hide-modal'>
                                        {productOut.map((val) => {
                                            return <div className='grid grid-cols-5'>
                                                <p className='sm:text-xl font-bold my-1 text-main-500 pl-5 col-span-3'>{val.product_name}</p>
                                                <p className='sm:text-xl font-bold pl-5 text-main-800 col-span-2'>{val.stock_unit} {val.unit}</p>
                                            </div>
                                        })
                                        }
                                    </div>
                                </div>
                            </div>
                            : null}
                    </div>
                    <Loading loading={loading} />
                </div>
            }
        </div>
    )
}

export default DashboardPage;
