import React from 'react'
import axios from 'axios'
import AdminComponent from '../../components/AdminComponent'
import Loading from '../../components/Loading'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import { BiSearchAlt2, BiDetail } from 'react-icons/bi';
import { BsFillChatDotsFill, BsClock, BsChevronDown } from 'react-icons/bs'
import { MdOutlinePayments, MdOutlineHideImage, MdAdd, MdOutlineDeleteOutline, MdOutlineArrowForward } from 'react-icons/md'
import { IoIosArrowDown } from "react-icons/io";
import { API_URL } from '../../helper';
import { DateRangePicker } from 'react-date-range'
import format from 'date-fns/format'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import background from './../../assets/background.png'
import Currency from '../../components/CurrencyComp';
import accept from '../../assets/accept.png'
import cancel from '../../assets/cancel.png'
import pickup from '../../assets/pickup.png'
import { Helmet } from 'react-helmet'

const TransactionPages = () => {
  let { iduser } = useSelector((state) => {
    return {
      iduser: state.userReducer.iduser,
    }
  })
  let check = []
  const navigate = useNavigate()
  const search = useLocation().search
  const [defaultSort, setDefaultSort] = React.useState('Date')
  const [defaultStatus, setDefaultStatus] = React.useState('All Orders')
  const [loading, setLoading] = React.useState(true)
  const [drop, setDrop] = React.useState(true)
  const [dropStatus, setDropStatus] = React.useState(true)
  const [dropCancel, setDropCancel] = React.useState(true)
  const [dropMed, setDropMed] = React.useState(true)
  const [dropRecipe, setDropRecipe] = React.useState(true)
  const [filterKey, setFilterKey] = React.useState(0)
  const [transaction, setTransaction] = React.useState([])
  const [count, setCount] = React.useState(0)
  const [product, setProduct] = React.useState([])
  const [filter, setFilter] = React.useState('')
  const [status, setStatus] = React.useState('')
  const [sort, setSort] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [invoice, setInvoice] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [modalDetail, setModalDetail] = React.useState('')
  const [modalPayment, setModalPayment] = React.useState('')
  const [modalAccept, setModalAccept] = React.useState('')
  const [modalNote, setModalNote] = React.useState(false)
  const [modalCancel, setModalCancel] = React.useState('')
  const [modalRecipe, setModalRecipe] = React.useState('')
  const [modalConv, setModalConv] = React.useState('')
  const [qtyConv, setQtyConv] = React.useState(0)
  const [cancelReason, setCancelReason] = React.useState('Select One')
  const [pickMed, setPickMed] = React.useState('Search Medicine')
  const [see, setSee] = React.useState(false)
  const [showBtn, setShowBtn] = React.useState(true)
  const [showInput, setShowInput] = React.useState(false)
  const [qty, setQty] = React.useState(0)
  const [buyUnit, setBuyUnit] = React.useState('Select Unit')
  const [recipe, setRecipe] = React.useState([])
  const [range, setRange] = React.useState([
    {
      startDate: '',
      endDate: '',
      key: 'selection',
      color: 'teal'
    }
  ])

  const getTrans = (search) => {
    let userToken = localStorage.getItem('medcarelog');
    axios.get(API_URL + `/api/transaction/all${search}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    })
      .then((res) => {
        setTransaction(res.data.transaction)
        setCount(res.data.count[0].total)
        setTimeout(() => setLoading(false), 1000)
      }).catch((err) => {
        console.log(err)
      })
  }

  React.useEffect(() => {
    getTrans(search)
    if (search) {
      let first = search.split('?')
      let split = first[1].split('&')
      let firstInvoice = split.filter((val) => val.includes('invoice'))
      let firstSort = split.filter((val) => val.includes('sort'))
      let firstStatus = split.filter((val) => val.includes('status'))
      let firstPage = split.filter((val) => val.includes('page'))
      let firstStart = split.filter((val) => val.includes('start'))
      let firstEnd = split.filter((val) => val.includes('end'))
      if (firstInvoice.length != 0 || firstStart.length != 0) {
        if (firstInvoice.length != 0 && firstStart.length == 0) {
          setInvoice(firstInvoice[0].split('=')[1])
          setFilter(firstInvoice[0])
        } else if (firstInvoice.length == 0 && firstStart.length != 0) {
          setRange([
            {
              startDate: new Date(`${firstStart[0].split('=')[1]}`),
              endDate: new Date(`${firstEnd[0].split('=')[1]}`),
              key: 'selection',
              color: 'teal'
            }
          ])
          setFilter(`${firstStart[0]}&${firstEnd[0]}`)
        } else {
          setRange([
            {
              startDate: new Date(`${firstStart[0].split('=')[1]}`),
              endDate: new Date(`${firstEnd[0].split('=')[1]}`),
              key: 'selection',
              color: 'teal'
            }
          ])
          setInvoice(firstInvoice[0].split('=')[1])
          setFilter(`${firstInvoice[0]}&${firstStart[0]}&${firstEnd[0]}`)
        }
      }
      if (firstSort.length != 0) {
        setSort(`sort=2`)
        setDefaultSort('Invoice ID')
      }
      if (firstStatus.length != 0) {
        setStatus(firstStatus[0])
      }
      if (firstPage.length != 0) {
        setPage(firstPage[0].split('=')[1])
      }
    }
    getProduct()
  }, [])

  const getProduct = () => {
    axios.post(API_URL + `/api/product/getproduct`, { offset: '' })
      .then((res) => {
        setProduct(res.data.results)
      })
      .catch((error) => {
        console.log('Print product error', error);
      })
  }

  const printTrans = () => {
    return transaction.map((val, idx) => {
      return <div key={val.idtransaction} className='bg-white border border-teal-300 my-5 mr-2 sm:mr-10 rounded-2xl divide-y divide-teal-100'>
        <div className='sm:grid ml-5 mt-3 sm:grid-cols-12'>
          <p className='sm:text-xl font-bold mr-5 col-span-2'>{val.status_id == 3 || val.status_id == 4 || val.status_id == 5 ? 'New Order'
            : `${val.status_id == 6 ? 'Ready To Ship'
              : `${val.status_id == 7 ? 'Order Canceled'
                : `${val.status_id == 8 ? 'In Delivery'
                  : 'Order Completed'}`}`}`} </p>
          <p className='sm:text-xl font-semibold sm:mx-5 col-span-2'>{val.invoice_number}</p>
          <p className='sm:text-xl font-thin flex items-center col-span-2'><BsClock className='sm:block hidden mr-2 opacity-50' /> {val.dateOrder} WIB</p>
        </div>
        <div className='sm:ml-5 sm:grid sm:grid-cols-5 gap-0'>
          <div className='flex col-span-2'>
            <div className='hidden sm:block w-36 px-4 pb-3 bg-white rounded-lg border border-gray-200 overflow-hidden mt-3'>
              <img class="w-full h-auto rounded my-3" src={val.prescription_pic ? val.prescription_pic.includes('https') ? val.prescription_pic : API_URL + val.prescription_pic : val.detail[0].product_image.includes('https') ? val.detail[0].product_image : API_URL + val.detail[0].product_image} alt="image description" />
            </div>
            <div className='my-3 mx-5'>
              <p className='font-bold sm:text-lg'>{val.prescription_pic ? 'Resep Dokter' : val.detail[0].product_name}</p>
              <button type='button' className={`${val.prescription_pic ? 'text-md transition mt-3 p-1 bg-main-500 hover:bg-main-700 focus:ring-main-500 text-white rounded  hover:-translate-y-1 w-44' : 'hidden'}`} onClick={val.status_id == 3 ? () => setModalRecipe(val) : () => setModalDetail(val)}>{val.status_id == 3 ? `Make Recipe's Copy` : 'See Detail Order'}</button>
              <div className={`${val.prescription_pic ? 'hidden' : ''}`}>
                {val.status_id == 3 ? null
                  :
                  <div>
                    <p className='font-thin sm:text-lg flex'>{val.detail[0].product_qty} {val.detail[0].product_unit}  x <p className='ml-2'><Currency price={val.detail[0].product_price} /></p></p>
                    {val.detail.length > 1 ?
                      <button type='button' className='sm:my-5 text-teal-500 flex items-center sm:text-lg' onClick={() => {
                        setLoading(true)
                        setTimeout(() => setLoading(false), 1000)
                        setTimeout(() => setModalDetail(val), 1000)
                      }}>See {val.detail.length - 1} more medicine <BsChevronDown className='ml-1 mt-1' /> </button>
                      : null
                    }
                  </div>
                }
              </div>
            </div>
          </div>
          <div className='my-3 sm:ml-3 ml-5'>
            <p className='font-bold sm:text-lg'>Customer</p>
            <p className='font-thin sm:text-lg'>{val.user_name}</p>
          </div>
          <div className='my-3 sm:ml-3 ml-5'>
            <p className='font-bold sm:text-lg'>Address</p>
            <p className='font-thin sm:text-lg'>{val.user_address}</p>
          </div>
          <div className='my-3 sm:ml-3 ml-5'>
            <p className='font-bold sm:text-lg'>Courier</p>
            <p className='font-thin sm:text-lg'>{val.shipping_courier}</p>
          </div>
        </div>
        <div className='bg-teal-100 flex justify-between rounded ml-5 mr-10 my-5 h-10'>
          <p className='items-center pl-2 pt-1 font-semibold text-xl'>Total</p>
          <p className='items-center pr-2 pt-1 font-semibold text-xl'>Rp{(val.total_price + val.delivery_price).toLocaleString('id')}</p>
        </div>
        <div className='sm:flex ml-5 m-2 sm:m-5 justify-between'>
          <div className='sm:flex'>
            <p className='sm:mt-5 mt-2 sm:text-lg text-teal-500 font-semibold flex items-center'><BsFillChatDotsFill className='mr-2 sm:block hidden' /> Chat Customer</p>
            <button className={`${val.status_id == 3 ? 'hidden' : ''} sm:mt-5 mt-2 sm:text-lg text-teal-500  font-semibold flex sm:ml-10 items-center`} data-modal-toggle="detailModal" onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 1000)
              setTimeout(() => setModalDetail(val), 1000)
            }}><BiDetail className='mr-2 sm:block hidden' />Order Detail</button>
            <button className={`${val.status_id == 3 ? 'hidden' : ''} sm:mt-5 mt-2 sm:text-lg text-teal-500  font-semibold flex sm:ml-10 items-center`} data-modal-toggle="paymentModal" onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 1000)
              setTimeout(() => setModalPayment(val), 1000)
            }}><MdOutlinePayments className='mr-2 sm:block hidden' />Check Payment</button>
          </div>
          <div className='sm:flex'>
            <button className='sm:mt-5 mt-2 sm:text-lg mr-10 font-semibold text-teal-500 flex' onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 1000)
              setTimeout(() => setModalCancel(val), 1000)
            }}>{val.status_id == 3 || val.status_id == 4 || val.status_id == 5 ? 'Reject Order' : ''}</button>
            <button type='button'
              className={`${val.status_id == 7 || val.status_id == 9 ? 'hidden' : ''} ${val.status_id == 3 || val.status_id == 4 ? 'bg-gray-300' : ' bg-main-500 hover:bg-main-700 focus:ring-main-500 hover:-translate-y-1'} sm:text-lg transition mt-2 sm:mt-4 p-1 mr-5 font-semibold text-white rounded w-44`}
              disabled={val.status_id == 3 || val.status_id == 4 ? true : false}
              onClick={val.status_id == 8 ? () => {
                setLoading(true)
                setTimeout(() => setLoading(false), 1000)
                setTimeout(() => setModalDetail(val), 1000)
              } : () => {
                setLoading(true)
                setTimeout(() => setLoading(false), 1000)
                setTimeout(() => setModalAccept(val), 1000)
              }}
            >
              {val.status_id == 6 ? 'Ask For Pickup' : `${val.status_id == 8 ? 'See Detail' : 'Accept Order'}`}
            </button>
          </div>
        </div>
      </div>
    }
    )
  }

  const handleStatus = (status) => {
    setPage(1)
    setLoading(true)
    if (filter || sort) {
      if (status == 'all') {
        setStatus('')
        navigate(`/admin/transaction?${filter}&${sort}`)
        getTrans(`?${filter}&${sort}`)
      } else {
        setStatus(`status=${status}`)
        navigate(`/admin/transaction?${filter}&status=${status}&${sort}`)
        getTrans(`?${filter}&status=${status}&${sort}`)
      }
    } else {
      if (status == 'all') {
        setStatus('')
        navigate('/admin/transaction')
        getTrans('')
      } else {
        setStatus(`status=${status}`)
        navigate(`/admin/transaction?status=${status}`)
        getTrans(`?status=${status}`)
      }
    }
  }

  const handleFilter = () => {
    setPage(1)
    setLoading(true)
    let filter = ''
    if (range[0].startDate && range[0].startDate) {
      filter = {
        invoice_number: invoice,
        start: range[0].startDate.toLocaleDateString("en-CA"),
        end: range[0].endDate.toLocaleDateString("en-CA"),
      }
    } else {
      filter = {
        invoice_number: invoice
      }
    }

    let filterArray = []
    for (const key in filter) {
      if (filter[key]) {
        filterArray.push(`${key}=${filter[key]}`)
      }
    }

    console.log(filterArray)
    setFilter(filterArray.join('&'))
    if (status || sort) {
      navigate(`/admin/transaction?${filterArray.join('&')}&${status}&${sort}`)
      getTrans(`?${filterArray.join('&')}&${status}&${sort}`)
    } else {
      navigate(`/admin/transaction?${filterArray.join('&')}`)
      getTrans(`?${filterArray.join('&')}`)
    }
  }

  const handleUpdate = (val, status) => {
    setSee(false)
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
    setModalAccept('')
    if (val.status_id == 3) {
      axios.patch(API_URL + `/api/transaction/update`, {
        iduser,
        id: val.idtransaction,
        status: val.status_id,
        order: status,
        price: val.total_price,
        image: val.prescription_pic,
        recipe: recipe
      }).then((res) => {
        if (res.data.message) {
          setRecipe('')
          getTrans(search)
          setTimeout(() => setModalNote('gopayment'), 1000)
        }
      }).catch((err) => {
        console.log(err)
      })
    } else {
      axios.patch(API_URL + `/api/transaction/update`, {
        iduser,
        id: val.idtransaction,
        status: val.status_id,
        order: status
      }).then((res) => {
        if (res.data.message) {
          getTrans(search)
          if (val.status_id == 5) {
            setTimeout(() => setModalNote('success'), 1000)
          } else {
            setTimeout(() => setModalNote('pickup'), 1000)
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const handleCancel = (val, reason) => {
    setModalCancel('')
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
    setTimeout(() => setModalNote('cancel'), 1000)
    axios.patch(API_URL + `/api/transaction/update`, {
      id: val.idtransaction,
      reason
    }).then((res) => {
      getTrans(search)
    }).catch((err) => {
      console.log(err)
    })
  }

  const handleFilterMed = () => {
    let input = document.getElementById("inputMed");
    let filter = input.value.toUpperCase();
    let div = document.getElementById("dropdownMed");
    let a = div.getElementsByTagName("button");
    console.log(input)
    console.log(filter)
    console.log(a)
    for (let i = 0; i < a.length; i++) {
      let txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  const printAddRecipe = () => {
    let data = product.filter((val) => val.product_name == pickMed)
    if (data.length > 0) {
      return <div className='ml-5 mt-3'>
        <p className='font-semibold'>{pickMed}</p>
        <p className='font-semibold'>Main Stock : {data[0].stock_unit} {data[0].unit}</p>
        <p className='font-semibold'>{data[1] ? `Netto Stock : ${data[1].stock_unit} ${data[1].unit}` : 'No Netto Stock Yet'}</p>
        <div className='flex mt-3'>
          <input placeholder='Quantity' key={filterKey} className='w-20 sm:w-48 h-5 sm:h-10 border border-teal-500 rounded-lg px-3 sm:px-5' type='number' onChange={(e) => setQty(e.target.value)} />
          <div className='inline'>
            <button onClick={() => setDropRecipe(!dropRecipe)} id="dropdownRecipe" data-dropdown-toggle="dropdownRecipe"
              className="border rounded-lg text-gray-400 bg-white hover:bg-gray-400 hover:text-white w-32 ml-5 font-medium pl-2 h-5 sm:h-10 text-center inline-flex justify-between items-center" type="button">
              {buyUnit == 'Select Unit' ? 'Select Unit' : buyUnit.unit}
              <IoIosArrowDown />
            </button>
            <div id="dropdownRecipe" className={`${dropRecipe == true ? 'hidden' : 'w-32 ml-5 bg-white z-10 overflow-hide-accept scroll rounded divide-y divide-gray-100 shadow absolute'}`} >
              <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownRecipe">
                <li className='hover:bg-gray-100'>
                  <button className="block py-2 pl-4 " onClick={() => {
                    setBuyUnit(data[0])
                    setDropRecipe(true)
                  }}>{data[0].unit}</button>
                </li>
                {data[1] ?
                  <li className='hover:bg-gray-100'>
                    <button className="block py-2 pl-4 " onClick={() => {
                      setBuyUnit(data[1])
                      setDropRecipe(true)
                    }}>{data[1].unit}</button>
                  </li>
                  : null
                }
              </ul>
            </div>
          </div>
          <button className='text-teal-500 font-semibold ml-3 text-sm sm:text-lg' type='button' onClick={() => setModalConv(data)}>Need Conversion ?</button>
        </div>
        <div className='flex justify-between'>
          <p />
          <div className='flex'>
            <button className='transition h-8 bg-white border border-main-500 focus:ring-main-500 text-main-500 rounded-lg my-4 p-1 mr-5 hover:-translate-y-1 hover:bg-gray-100 w-20' onClick={() => {
              setQty(0)
              setBuyUnit('Select Unit')
              setPickMed('')
              setShowBtn(true)
            }}>Cancel</button>
            <button type='button' className={`${(!qty || buyUnit == 'Select Unit') || (qty > buyUnit.stock_unit || qty <= 0) ? 'bg-gray-300' : 'bg-main-500  hover:bg-main-700 focus:ring-main-500 hover:-translate-y-1'} h-8 transition my-4 p-1 mr-5 font-semibold text-white rounded-lg w-20 `} disabled={(!qty || buyUnit == 'Select Unit') || (qty > buyUnit.stock_unit || qty <= 0) ? true : false} onClick={handleAddRecipe} >Save</button>
          </div>
        </div>
      </div>
    }
  }

  const handleAddRecipe = () => {
    let data = []
    if (buyUnit.isDefault == 'true') {
      modalRecipe.total_price = modalRecipe.total_price + (qty * buyUnit.price)
      data = [{
        name: pickMed,
        qty: qty,
        unit: buyUnit.unit,
        price: buyUnit.price,
        idproduct: buyUnit.idproduct,
        isDefault: 'true'
      }]
    } else {
      modalRecipe.total_price = modalRecipe.total_price + (qty * buyUnit.price / buyUnit.netto_stock)
      data = [{
        name: pickMed,
        qty: qty,
        unit: buyUnit.unit,
        price: buyUnit.price / buyUnit.netto_stock,
        idproduct: buyUnit.idproduct,
        isDefault: 'false'
      }]
    }
    if (recipe.length == 0) {
      setRecipe(data)
    } else {
      setRecipe(recipe.concat(data))
    }

    setQty(0)
    setBuyUnit('Select Unit')
    setPickMed('')
    setShowBtn(true)
  }

  const printFixRecipe = () => {
    if (recipe.length > 0) {
      return recipe.map((val, idx) => {
        return <div className='sm:grid sm:grid-cols-6 ml-5 my-3'>
          <p className='font-semibold col-span-3'>{val.name}</p>
          <p className='font-semibold col-span-2 flex'>{val.qty} {val.unit} x<p className='ml-2'><Currency price={val.price} /></p><button className='items-center'><MdOutlineDeleteOutline className='border ml-5 sm:hidden' onClick={() => handleDeleteRecipe(val.idproduct)} /></button></p>
          <button className='items-center hidden sm:block'><MdOutlineDeleteOutline className='border ml-5' onClick={() => handleDeleteRecipe(val.idproduct)} /></button>
        </div>
      })
    }
  }

  const handleDeleteRecipe = (id) => {
    let index = recipe.findIndex((val) => val.idproduct == id)
    modalRecipe.total_price = modalRecipe.total_price - (recipe[index].price * recipe[index].qty)
    recipe.splice(index, 1)
    getTrans(search)
  }

  const handleConv = (val) => {
    setLoading(true)
    setModalConv('')
    if (val[1]) {
      axios.patch(API_URL + `/api/product/unitconv`, {
        iduser,
        idproduct: val[0].idproduct,
        name: val[0].product_name,
        main: val[0].stock_unit - qtyConv,
        conv: val[1].stock_unit + (qtyConv * val[0].netto_stock),
        change_main: qtyConv,
        change_conv: qtyConv * val[0].netto_stock,
        mainUnit: val[0].unit,
        convUnit: val[1].unit,
        status: 'already'
      }).then((res) => {
        getProduct()
        setQtyConv(0)
        setTimeout(() => setLoading(false), 1000)
      }).catch((err) => {
        console.log(err)
      })
    } else {
      axios.patch(API_URL + `/api/product/unitconv`, {
        iduser,
        idproduct: val[0].idproduct,
        name: val[0].product_name,
        main: val[0].stock_unit - qtyConv,
        conv: qtyConv * val[0].netto_stock,
        change_main: qtyConv,
        mainUnit: val[0].unit,
        convUnit: val[0].netto_unit,
        change: qtyConv,
        status: 'new'
      }).then((res) => {
        getProduct()
        setQtyConv(0)
        setTimeout(() => setLoading(false), 1000)
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  return (
    <div>
      <Helmet>
        <title>Admin transaction</title>
      </Helmet>
      <div className={`${loading || modalDetail || modalPayment || modalAccept || modalCancel || modalConv || modalNote || modalRecipe ? 'overflow-hide scroll ' : ""}`}  >
        <div className='flex'>
          <AdminComponent page={window.location.pathname} />
          <div className='w-screen' style={{ background: "linear-gradient(155.7deg, #D6F5F3 -46%, #F7FCFC 100%, #F1F5FC 118%)" }}>
            <div className='ml-5 '>
              <p className="sm:text-2xl font-bold mt-5 mb-3 text-txt-500">Order List</p>
              <div className='sm:flex relative mt-5 sm:mt-20'>
                <input placeholder='Invoice Number' defaultValue={invoice ? invoice : null} id='invoice' key={filterKey} className='w-60 sm:w-96 h-5sm:h-10 border border-teal-500 rounded-lg px-3 sm:px-10' onChange={(e) => setInvoice(e.target.value)} />
                <BiSearchAlt2 className='absolute left-2 top-2 fill-slate-500 hidden sm:block' size={25} />
                <div className="sm:ml-10 mt-2 sm:mt-0 sm:flex items-center">
                  <span className="sm:text-xl mr-5">Sort</span>
                  <div className='inline'>
                    <button onClick={() => setDrop(!drop)} id="dropdownDefault" data-dropdown-toggle="dropdown"
                      className="border rounded-lg text-gray-400 bg-white hover:bg-gray-400 hover:text-white font-medium w-44 pl-2 h-5 sm:h-10 text-center inline-flex justify-between items-center" type="button">
                      {defaultSort}
                      <IoIosArrowDown />
                    </button>
                    {/* <!-- Dropdown menu --> */}
                    <div id="dropdown" className={`${drop == true ? 'hidden' : 'z-10 sm:ml-0 ml-12 w-44 bg-white rounded divide-y divide-gray-100 shadow absolute'}`} >
                      <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDefault">
                        <li className='hover:bg-gray-100'>
                          <button className="block py-2 pl-4" disabled={defaultSort == 'Date' ? true : false} onClick={() => {
                            setSort('')
                            setLoading(true)
                            setDefaultSort('Date')
                            navigate(`/admin/transaction?${filter}&${status}`)
                            getTrans(`?${filter}&${status}`)
                            setDrop(true)
                          }}>Date</button>
                        </li>
                        <li className='hover:bg-gray-100'>
                          <button className="block py-2 pl-4" disabled={defaultSort == 'Invoice ID' ? true : false} onClick={search && search != '?&' ? () => {
                            setSort(`sort=2`)
                            setLoading(true)
                            setDefaultSort('Invoice ID')
                            navigate(`/admin/transaction${search}&sort=2`)
                            getTrans(`${search}&sort=2`)
                            setDrop(true)
                          }
                            : () => {
                              setSort(`sort=2`)
                              setLoading(true)
                              setDefaultSort('Invoice ID')
                              navigate(`/admin/transaction?sort=2`)
                              getTrans(`?sort=2`)
                              setDrop(true)
                            }}>Invoice ID</button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='sm:ml-5 mt-3 sm:mt-0 flex items-center'>
                    <input
                      value={range[0].startDate ? `${format(range[0].startDate, "MM/dd/yyyy")} - ${format(range[0].endDate, "MM/dd/yyyy")}` : ''}
                      className="sm:mx-3 pl-2 h-5 sm:h-10 border rounded items-center"
                      placeholder='Select Date Range'
                      onClick={() => setOpen(open => !open)}
                      id="dropdownDate"
                      data-dropdown-toggle="dropdownDate"
                    />
                    <div id="dropdownDate" className={`${open == false ? 'hidden' : 'z-10 w-10 hidden sm:block sm:w-44 bg-white rounded divide-y divide-gray-100 shadow absolute'}`} >
                      <div>
                        <DateRangePicker
                          onChange={item => setRange([item.selection])}
                          editableDateInputs={true}
                          moveRangeOnFirstSelection={false}
                          ranges={range}
                          months={2}
                          direction="horizontal"
                          className='absolute z-10 mt-5 hidden sm:block sm:ml-[-680px] border'
                        />
                        <button type='button' className='transition hidden sm:block mr-4 bg-main-500 hover:bg-main-700 focus:ring-main-500 text-white rounded-lg py-1 px-2 hover:-translate-y-1 w-36 absolute z-10 mt-[400px] ml-16 border' onClick={() => setOpen(!open)}>Set Date</button>
                      </div>
                    </div>
                    <div>
                      <div id="dropdownDate" className={`${open == false ? 'hidden' : 'z-10 w-5 sm:hidden bg-white rounded divide-y divide-gray-100 shadow absolute'}`}>
                        <DateRangePicker
                          onChange={item => setRange([item.selection])}
                          editableDateInputs={true}
                          staticRanges={[]}
                          inputRanges={[]}
                          moveRangeOnFirstSelection={false}
                          ranges={range}
                          months={1}
                          className='absolute w-5 z-10 mt-5 sm:hidden ml-[-200px] border'
                        />
                        <button type='button' className='transition sm:hidden mr-4 bg-main-500 hover:bg-main-700 focus:ring-main-500 text-white rounded-lg py-1 px-2 hover:-translate-y-1 w-36 absolute z-10 mt-[378px] ml-[-10px] border' onClick={() => setOpen(!open)}>Set Date</button>
                      </div>
                    </div>
                  </div>
                  <button type='button' className='transition mr-4 sm:mt-0 mt-3 bg-white border border-main-500 focus:ring-main-500 rounded-lg py-1 px-2 hover:-translate-y-1 hover:bg-main-500 w-20 sm:w-30 text-black' onClick={() => {
                    handleFilter()
                  }}>Filter</button>
                  <button type='button' className='transition mr-4 sm:mt-0 mt-3 bg-white border border-main-500 focus:ring-main-500 rounded-lg py-1 px-2 hover:-translate-y-1 hover:bg-main-500 w-20 sm:w-30  text-black' onClick={() => {
                    setDefaultSort('Date')
                    setFilterKey(filterKey + 1)
                    setFilter('')
                    setStatus('')
                    setSort('')
                    setInvoice('')
                    setLoading(true)
                    setRange([{
                      startDate: '',
                      endDate: '',
                      key: 'selection',
                      color: 'teal'
                    }])
                    setPage(1)
                    navigate('/admin/transaction')
                    getTrans('')
                  }}>Reset</button>
                </div>
              </div>
              <div className='flex mt-5'>
                <p className="sm:text-xl font-bold mb-3 mr-5 mt-1">Status</p>
                <div className='inline'>
                  <button onClick={() => setDropStatus(!dropStatus)} id="dropdownDefault" data-dropdown-toggle="dropdown"
                    className="border mt-2 sm:hidden rounded-lg text-gray-400 bg-white hover:bg-gray-400 hover:text-white font-medium w-44 pl-2 h-5 sm:h-10 text-center inline-flex justify-between items-center" type="button">
                    {defaultStatus}
                    <IoIosArrowDown />
                  </button>
                  {/* <!-- Dropdown menu --> */}
                  <div id="dropdown" className={`${dropStatus == true ? 'hidden' : 'z-10 sm:ml-0 w-44 bg-white rounded divide-y divide-gray-100 shadow absolute'}`} >
                    <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownDefault">
                      <li className='hover:bg-gray-100'>
                        <button
                          className={`${status == '' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg  hover:bg-main-500 hover:text-white text-sm sm:text-base font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                            handleStatus('all')
                            setDefaultStatus('All Orders')
                            setDropStatus(true)
                          }} type="button">
                          All Orders
                        </button>
                      </li>
                      <li className='hover:bg-gray-100'>
                        <button
                          className={`${status == 'status=waiting' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg  hover:bg-main-500 hover:text-white font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                            handleStatus('waiting')
                            setDefaultStatus('New Order')
                            setDropStatus(true)
                          }} type="button">
                          New Order
                        </button>
                      </li>
                      <li className='hover:bg-gray-100'>
                        <button
                          className={`${status == 'status=process' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg  hover:bg-main-500 hover:text-white font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                            handleStatus('process')
                            setDefaultStatus('Ready To Ship')
                            setDropStatus(true)
                          }} type="button">
                          Ready To Ship
                        </button>
                      </li>
                      <li className='hover:bg-gray-100'>
                        <button
                          className={`${status == 'status=on' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg  hover:bg-main-500 hover:text-white font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                            handleStatus('on')
                            setDefaultStatus('In Delivery')
                            setDropStatus(true)
                          }} type="button">
                          In Delivery
                        </button>
                      </li>
                      <li className='hover:bg-gray-100'>
                        <button
                          className={`${status == 'status=completed' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg  hover:bg-main-500 hover:text-white font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                            handleStatus('finished')
                            setDefaultStatus('Order Completed')
                            setDropStatus(true)
                          }} type="button">
                          Order Completed
                        </button>
                      </li>
                      <li className='hover:bg-gray-100'>
                        <button
                          className={`${status == 'status=canceled' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg hover:bg-main-500 hover:text-white font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                            handleStatus('canceled')
                            setDefaultStatus('Order Canceled')
                            setDropStatus(true)
                          }} type="button">
                          Order Canceled
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='w-20 hidden sm:flex sm:w-full'>
                  <button
                    className={`${status == '' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg  hover:bg-main-500 hover:text-white text-sm sm:text-base font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                      handleStatus('all')
                      setDefaultStatus('All Orders')
                    }} type="button">
                    All Orders
                  </button>
                  <button
                    className={`${status == 'status=waiting' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg  hover:bg-main-500 hover:text-white font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                      handleStatus('waiting')
                      setDefaultStatus('New Order')
                    }} type="button">
                    New Order
                  </button>
                  <button
                    className={`${status == 'status=process' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg  hover:bg-main-500 hover:text-white font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                      handleStatus('process')
                      setDefaultStatus('Ready To Ship')
                    }} type="button">
                    Ready To Ship
                  </button>
                  <button
                    className={`${status == 'status=on' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg  hover:bg-main-500 hover:text-white font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                      handleStatus('on')
                      setDefaultStatus('In Delivery')
                    }} type="button">
                    In Delivery
                  </button>
                  <button
                    className={`${status == 'status=finished' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg  hover:bg-main-500 hover:text-white font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                      handleStatus('finished')
                      setDefaultStatus('Order Completed')
                    }} type="button">
                    Order Completed
                  </button>
                  <button
                    className={`${status == 'status=canceled' ? "bg-main-500 text-white" : "bg-white text-gray-400"} border-teal-500 rounded-lg hover:bg-main-500 hover:text-white font-medium w-36 h-10 text-center items-center mx-3`} onClick={() => {
                      handleStatus('canceled')
                      setDefaultStatus('Order Canceled')
                    }} type="button">
                    Order Canceled
                  </button>
                </div>
              </div>
              <div className={`${transaction.length == 0 ? 'hidden' : "flex flex-col items-end mb-5 mr-2 sm:mr-12"}`}>
                {/* <!-- Help text --> */}
                <span className="text-large text-gray-700 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{page == 1 ? page : (page * 5) - 4}</span> to <span className="font-semibold text-gray-900 dark:text-white">{(page * 5) < count ? page * 5 : count}</span> of <span className="font-semibold text-gray-900 dark:text-white">{count}</span> Entries
                </span>
                {/* <!-- Buttons --> */}
                <div className="inline-flex mt-2 xs:mt-0 divide-x">
                  <button className={`${page == 1 ? "bg-gray-300" : ' bg-main-500 hover:bg-main-700 focus:ring-main-500'} w-20 py-2 px-4 mx-1 text-sm font-medium rounded text-white`} onClick={search && search != '?&' ? () => {
                    setLoading(true)
                    setTimeout(() => setLoading(false), 1000)
                    if (search.includes('page')) {
                      let add = search.replace(`page=${page}`, `page=${page - 1}`)
                      navigate(`/admin/transaction${add}`)
                      getTrans(add)
                    } else {
                      navigate(`/admin/transaction${search}&page=${page - 1}`)
                      getTrans(`${search}&page=${page - 1}`)
                    }
                    setPage(page - 1)
                  }
                    :
                    () => {
                      setLoading(true)
                      setTimeout(() => setLoading(false), 1000)
                      navigate(`/admin/transaction?page=${page - 1}`)
                      getTrans(`?page=${page - 1}`)
                      setPage(page - 1)
                    }}
                    disabled={page == 1 ? true : false}>
                    Prev
                  </button>
                  <button className={`${page * 5 >= count ? "bg-gray-300" : ' bg-main-500 hover:bg-main-700 focus:ring-main-500'} w-20 py-2 px-4 mx-1 text-sm font-medium rounded text-white`} onClick={search && search != '?&' ? () => {
                    setLoading(true)
                    setTimeout(() => setLoading(false), 1000)
                    if (search.includes('page')) {
                      let add = search.replace(`page=${page}`, `page=${page + 1}`)
                      navigate(`/admin/transaction${add}`)
                      getTrans(add)
                    } else {
                      navigate(`/admin/transaction${search}&page=${page + 1}`)
                      getTrans(`${search}&page=${page + 1}`)
                    }
                    setPage(page + 1)
                  }
                    :
                    () => {
                      setLoading(true)
                      setTimeout(() => setLoading(false), 1000)
                      navigate(`/admin/transaction?page=${page + 1}`)
                      getTrans(`?page=${page + 1}`)
                      setPage(page + 1)
                    }} disabled={page * 5 >= count ? true : false}>
                    Next
                  </button>
                </div>
              </div>
              <div>
                <div className={`${transaction.length == 0 ? 'items-center text-center mt-20' : 'hidden'}`}>
                  <img src={background} className='mx-auto my-auto items-center w-[50%] h-auto rounded-full' alt='backgroundimage' />
                  <p className="sm:text-3xl font-bold mt-5 mb-3 text-txt-500 mx-auto"> No Order Yet  </p>
                </div>
                {printTrans()}
              </div>
            </div>
            <div className={`${transaction.length == 0 ? 'hidden' : "flex flex-col items-end mb-5 mr-2 sm:mr-12"}`}>
              {/* <!-- Help text --> */}
              <span className="text-large text-gray-700 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{page == 1 ? page : (page * 5) - 4}</span> to <span className="font-semibold text-gray-900 dark:text-white">{(page * 5) < count ? page * 5 : count}</span> of <span className="font-semibold text-gray-900 dark:text-white">{count}</span> Entries
              </span>
              {/* <!-- Buttons --> */}
              <div className="inline-flex mt-2 xs:mt-0 divide-x">
                <button className={`${page == 1 ? "bg-gray-300" : ' bg-main-500 hover:bg-main-700 focus:ring-main-500'} w-20 py-2 px-4 mx-1 text-sm font-medium rounded text-white`} onClick={search && search != '?&' ? () => {
                  setLoading(true)
                  setTimeout(() => setLoading(false), 1000)
                  if (search.includes('page')) {
                    let add = search.replace(`page=${page}`, `page=${page - 1}`)
                    navigate(`/admin/transaction${add}`)
                    getTrans(add)
                  } else {
                    navigate(`/admin/transaction${search}&page=${page - 1}`)
                    getTrans(`${search}&page=${page - 1}`)
                  }
                  setPage(page - 1)
                }
                  :
                  () => {
                    setLoading(true)
                    setTimeout(() => setLoading(false), 1000)
                    navigate(`/admin/transaction?page=${page - 1}`)
                    getTrans(`?page=${page - 1}`)
                    setPage(page - 1)
                  }}
                  disabled={page == 1 ? true : false}>
                  Prev
                </button>
                <button className={`${page * 5 >= count ? "bg-gray-300" : ' bg-main-500 hover:bg-main-700 focus:ring-main-500'} w-20 py-2 px-4 mx-1 text-sm font-medium rounded text-white`} onClick={search && search != '?&' ? () => {
                  setLoading(true)
                  setTimeout(() => setLoading(false), 1000)
                  if (search.includes('page')) {
                    let add = search.replace(`page=${page}`, `page=${page + 1}`)
                    navigate(`/admin/transaction${add}`)
                    getTrans(add)
                  } else {
                    navigate(`/admin/transaction${search}&page=${page + 1}`)
                    getTrans(`${search}&page=${page + 1}`)
                  }
                  setPage(page + 1)
                }
                  :
                  () => {
                    setLoading(true)
                    setTimeout(() => setLoading(false), 1000)
                    navigate(`/admin/transaction?page=${page + 1}`)
                    getTrans(`?page=${page + 1}`)
                    setPage(page + 1)
                  }} disabled={page * 5 >= count ? true : false}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* MODAL DETAIL */}
        <div id="detailModal" tabindex="-1" aria-hidden='true' className={`${modalDetail ? "sm:pl-[35%] sm:pt-[5%] backdrop-blur-sm overflow-x-hidden fixed z-30 justify-center w-full inset-0" : "hidden"} `}>
          {modalDetail ?
            <div className=" overflow-y-hidden w-full max-w-3xl border rounded-lg max-h-[48rem]" >
              {/* <!-- Modal content --> */}
              <div className=" bg-white rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center p-4 rounded-t border-b dark:border-gray-600">
                  <h3 className="sm:text-2xl font-semibold text-gray-900 dark:text-white sm:ml-[37%]">
                    Order Detail
                  </h3>
                  <button type="button" onClick={() => setModalDetail('')} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="detailModal">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <div className='ml-5 mt-3 border-b'>
                  <p className='sm:text-large font-bold mr-5 my-3'>{modalDetail.status_id == 3 || modalDetail.status_id == 4 || modalDetail.status_id == 5 ? 'New Order'
                    : `${modalDetail.status_id == 6 ? 'Ready To Ship'
                      : `${modalDetail.status_id == 7 ? 'Order Canceled'
                        : `${modalDetail.status_id == 8 ? 'In Delivery'
                          : 'Order Completed'}`}`}`}  </p>
                  <div className='flex justify-between my-3 mr-3'>
                    <p className='sm:text-large font-bold'>No. Invoice</p>
                    <p className='sm:text-large text-main-500 font-bold'>{modalDetail.invoice_number}</p>
                  </div>
                  <div className='flex justify-between my-3 mr-3'>
                    <p className='sm:text-large font-bold'>Transaction Date</p>
                    <p className='sm:text-large font-thin flex items-center'> {modalDetail.dateOrder} WIB</p>
                  </div>
                </div>
                <div className='overflow-hide-modal scroll'>
                  <div className="items-center p-6 sm:space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                    <p className='sm:text-xl font-bold'>Product Detail</p>
                    {modalDetail.detail ? modalDetail.detail.map((val, idx) => {
                      return <div key={val.idtransaction_detail} className='bg-white border border-teal-300 my-5 mr-2 sm:mr-10 rounded-2xl '>
                        <div className='sm:grid sm:grid-cols-10 sm:divide-x sm:divide-dashed justify-between '>
                          <div className='flex p-1 sm:ml-2 col-span-7'>
                            <div className='sm:block hidden w-36 px-4 pb-3 bg-white rounded-lg border border-gray-200 my-3'>
                              <img className="w-full h-auto rounded my-3" src={modalDetail.prescription_pic ? modalDetail.prescription_pic.includes('https') ? modalDetail.prescription_pic : API_URL + modalDetail.prescription_pic : val.product_image.includes('https') ? val.product_image : API_URL + val.product_image} alt="image prescription" />
                            </div>
                            <div className='my-3 sm:ml-5'>
                              <p className='font-bold text-large'>{val.product_name}</p>
                              <p className='font-thin text-large flex'> {val.product_qty} {val.product_unit} x <p className='ml-2'><Currency price={val.product_price} /></p></p>
                            </div>
                          </div>
                          <div className='sm:px-10 sm:pt-3 col-span-3'>
                            <p className='text-large ml-2'>Total</p>
                            <p className='font-bold text-large ml-2'><Currency price={(val.product_qty * val.product_price)} /></p>
                          </div>
                        </div>
                      </div>
                    }) : null
                    }
                  </div>
                  <div class="items-center p-6 rounded-b border-t border-gray-200 dark:border-gray-600">
                    <p className='sm:text-xl font-bold'>Delivery Detail</p>
                    <div className='my-3 sm:grid sm:grid-cols-10'>
                      <p className='font-thin sm:text-large'>Customer</p>
                      <p className='sm:block hidden'>:</p>
                      <p className='font-bold sm:text-large sm:ml-[-50px] col-span-4'>{modalDetail.user_name}</p>
                    </div>
                    <div className='my-3 sm:grid sm:grid-cols-10'>
                      <p className='font-thin sm:text-large'>Address</p>
                      <p className='sm:block hidden'>:</p>
                      <p className='font-bold sm:text-large sm:ml-[-50px] col-span-4'>{modalDetail.user_address}</p>
                    </div>
                    <div className='my-3 sm:grid sm:grid-cols-10'>
                      <p className='font-thin sm:text-large'>Courier</p>
                      <p className='sm:block hidden'>:</p>
                      <p className='font-bold sm:text-large sm:ml-[-50px] col-span-4'>{modalDetail.shipping_courier}</p>
                    </div>
                  </div>
                  <div class="items-center p-6 rounded-b border-t border-gray-200 dark:border-gray-600 divide-y divide-dashed">
                    <p className='sm:text-xl font-bold'>Total Transaction</p>
                    <div className='my-3 pt-3 flex justify-between items-center'>
                      <p className='font-thin sm:text-large'>Payment Method</p>
                      <p className='font-semibold sm:text-large'>Transfer</p>
                    </div>
                    <div>
                      <div className='my-3 flex justify-between'>
                        <p className='font-thin sm:text-large'>Total Cart</p>
                        <p className='font-semibold sm:text-large '><Currency price={modalDetail.total_price} /></p>
                      </div>
                      <div className='my-3 flex justify-between'>
                        <p className='font-thin sm:text-large'>Delivery Price</p>
                        <p className='font-semibold sm:text-large '><Currency price={modalDetail.delivery_price} /></p>
                      </div>
                    </div>
                    <div className='my-3 pt-3 flex justify-between'>
                      <p className='font-semibold sm:text-large'>Total Price</p>
                      <p className='font-bold sm:text-large'><Currency price={(modalDetail.delivery_price + modalDetail.total_price)} /></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            : null}
        </div>
        {/* END MODAL DETAIL */}
        {/* MODAL CHECK PAYMENT */}
        <div id="PaymentModal" tabindex="-1" aria-hidden='true' className={`${modalPayment ? "sm:pl-[35%] sm:pt-[5%] backdrop-blur-sm overflow-x-hidden fixed z-30 justify-center w-full inset-0" : "hidden"} `}>
          {modalPayment ?
            <div className=" overflow-y-hidden w-full max-w-3xl border rounded-lg max-h-[48rem]" >
              {/* <!-- Modal content --> */}
              <div className="rounded-lg shadow dark:bg-gray-700 bg-gray-200">
                {/* <!-- Modal header --> */}
                <div className="flex items-center p-4 rounded-t border-b dark:border-gray-600">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white ml-[35%] sm:ml-[43%]">
                    Payment
                  </h3>
                  <button type="button" onClick={() => setModalPayment('')} className="text-gray-400 bg-white hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="detailModal">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                {modalPayment.payment_proof_pic ?
                  <div className='mt-3'>
                    <img src={modalPayment.payment_proof_pic.includes('https') ? modalPayment.payment_proof_pic : API_URL + modalPayment.payment_proof_pic} className='max-w-lg max-h-lg mx-auto' alt='user_payment' />
                    <div className='mt-5 flex justify-center border-t text-2xl'>
                      <p className='font-semibold my-5'>Total to be paid</p>
                      <p className='font-bold my-5 ml-2'><Currency price={(modalPayment.delivery_price + modalPayment.total_price)} /></p>
                    </div>
                  </div>
                  :
                  <div className='mt-36 my-auto items-center justify-center h-[20rem]'>
                    <MdOutlineHideImage className='mx-auto text-center' size={100} />
                    <p className='sm:text-3xl font-bold mt-5 mb-3 text-center'>Customer has not uploaded proof of payment</p>
                  </div>
                }
              </div>
            </div>
            : null}
        </div>
        {/* END MODAL CHECK PAYMENT */}
        {/* MODAL ACCEPT / SEND ORDER */}
        <div id="AcceptModal" tabindex="-1" aria-hidden='true' className={`${modalAccept ? `sm:pl-[37%] ${modalAccept.status_id == 5 || modalAccept.status_id == 3 ? 'sm:pt-[5%]' : 'sm:pt-[10%]'} backdrop-blur-sm overflow-x-hidden fixed z-30 justify-center w-full inset-0` : "hidden"} `}>
          {modalAccept ?
            <div className="mt-20 w-full max-w-xl border rounded-lg max-h-[48rem]" >
              {/* <!-- Modal content --> */}
              <div className=" bg-white rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center p-4 rounded-t border-b dark:border-gray-600">
                  <h3 className="sm:text-2xl font-semibold text-gray-900 dark:text-white ml-[35%] sm:ml-[37%]">
                    {modalAccept.status_id == 5 ? 'Accept Order' : modalAccept.status_id == 3 ? 'Recipe Summary' : 'Pickup Order'}
                  </h3>
                  <button type="button" onClick={modalAccept.status_id == 3 ?
                    () => {
                      setSee(false)
                      setModalAccept('')
                      setModalRecipe(modalAccept)
                    }
                    :
                    () => {
                      setSee(false)
                      setModalAccept('')
                    }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="detailModal">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                {modalAccept.status_id == 5 || modalAccept.status_id == 3 ?
                  <div>
                    <div className='border-b'>
                      <div className='ml-5 my-3'>
                        <p className='sm:text-xl font-bold my-1'>{modalAccept.user_name}</p>
                        <p className='sm:text-xl font-semibold my-1'>{modalAccept.invoice_number}</p>
                        <p className='sm:text-xl font-thin flex items-center my-1'>{modalAccept.dateOrder} WIB</p>
                      </div>
                    </div>
                    <div className='overflow-hide-accept scroll' style={see ? { height: 400 } : {}}>
                      {see ?
                        <div className='my-3 ml-5'>
                          {modalAccept.status_id == 3 ?
                            <div>
                              {recipe.map((val, idx) => {
                                return <div>
                                  <p className='font-bold sm:text-lg'>{val.name}</p>
                                  <p className='font-thin sm:text-lg flex'>{val.qty} {val.unit} x <p className='ml-2'><Currency price={val.price} /></p></p>
                                </div>
                              })}
                            </div>
                            :
                            <div>
                              {modalAccept.detail.map((val, idx) => {
                                return <div>
                                  <p className='font-bold sm:text-lg'>{val.product_name}</p>
                                  <p className='font-thin sm:text-lg flex'>{val.product_qty} {val.product_unit} x <p className='ml-2'><Currency price={val.product_price} /></p></p>
                                </div>
                              })}
                            </div>
                          }
                          <button type='button' className='mb-5 text-teal-500 flex items-center text-lg' onClick={() => setSee(false)}>Hide <BsChevronDown className='ml-1 mt-1 rotate-[180deg]' /> </button>
                        </div>
                        :
                        <div className='my-3 ml-5'>
                          {modalAccept.status_id == 3 ?
                            <div>
                              <p className='font-bold sm:text-lg'>{recipe[0].name}</p>
                              <p className='font-thin sm:text-lg flex'>{recipe[0].qty} {recipe[0].unit} x <p className='ml-2'><Currency price={recipe[0].price} /></p></p>
                            </div>
                            :
                            <div>
                              <p className='font-bold sm:text-lg'>{modalAccept.detail[0].product_name}</p>
                              <p className='font-thin sm:text-lg flex'>{modalAccept.detail[0].product_qty} {modalAccept.detail[0].product_unit} x <p className='ml-2'><Currency price={modalAccept.detail[0].product_price} /></p></p>
                            </div>
                          }
                          {recipe.length > 1 || modalAccept.detail.length > 1 ?
                            <button type='button' className='mb-5 text-teal-500 flex items-center sm:text-lg' onClick={() => setSee(true)}>See {modalAccept.status_id == 3 ? `${recipe.length - 1}` : `${modalAccept.detail.length - 1}`} more medicine <BsChevronDown className='ml-1  mt-1' /> </button>
                            : null}
                        </div>}
                    </div>
                    <div className='bg-teal-100 flex justify-between rounded ml-5 mr-5 my-5 h-10'>
                      <p className='items-center pl-2 pt-1 font-semibold sm:text-xl'>Total</p>
                      <p className='items-center pr-2 pt-1 font-semibold sm:text-xl'>Rp{(modalAccept.total_price + modalAccept.delivery_price).toLocaleString('id')}</p>
                    </div>
                  </div>
                  :
                  <div className='ml-5 mt-3'>
                    <div className='my-3 grid grid-cols-10'>
                      <p className='font-thin text-large col-span-4 sm:col-span-2'>Customer</p>
                      <p>:</p>
                      <p className='font-bold text-large sm:ml-[-40px] col-span-4'>{modalAccept.user_name}</p>
                    </div>
                    <div className='my-3 grid grid-cols-10'>
                      <p className='font-thin text-large col-span-4 sm:col-span-2'>Phone Number</p>
                      <p>:</p>
                      <p className='font-bold text-large sm:ml-[-40px] col-span-4'>{modalAccept.user_phone_number}</p>
                    </div>
                    <div className='my-3 grid grid-cols-10'>
                      <p className='font-thin text-large col-span-4 sm:col-span-2'>Address</p>
                      <p>:</p>
                      <p className='font-bold text-large sm:ml-[-40px] col-span-4'>{modalAccept.user_address}</p>
                    </div>
                    <div className='my-3 grid grid-cols-10 '>
                      <p className='font-thin text-large col-span-4 sm:col-span-2'>Courier</p>
                      <p>:</p>
                      <p className='font-bold text-large sm:ml-[-40px] col-span-4'>{modalAccept.shipping_courier}</p>
                    </div>
                    <div className='my-3 grid grid-cols-10 '>
                      <p className='font-thin text-large col-span-4 sm:col-span-2'>Delivery Price</p>
                      <p>:</p>
                      <p className='font-bold text-large sm:ml-[-40px] col-span-4'><Currency price={modalAccept.delivery_price} /></p>
                    </div>
                  </div>
                }
                <div className='flex justify-between'>
                  <p />
                  <div>
                    <button className={`${modalAccept.status_id == 3 ? 'transition mr-4 bg-white border border-main-500 focus:ring-main-500 text-main-500 rounded-lg py-1 px-2 mt-1 hover:-translate-y-1 hover:bg-gray-100 w-20' : 'hidden'}`} onClick={() => {
                      setModalRecipe(modalAccept)
                      setModalAccept('')
                    }}>Back</button>
                    <button type='button' className='bg-main-500 hover:bg-main-700 focus:ring-main-500 hover:-translate-y-1 text-lg transition my-4 p-1 mr-5 font-semibold text-white rounded w-44' onClick={() => handleUpdate(modalAccept, 'ok')}>{modalAccept.status_id == 5 ? 'Accept Order' : modalAccept.status_id == 3 ? 'Set Order' : 'Request Pickup'}</button>
                  </div>
                </div>
              </div>
            </div>
            : null}
        </div>
        {/* END MODAL ACCEPT / SEND ORDER */}
        {/* MODAL CANCEL ORDER */}
        <div id="CancelModal" tabindex="-1" aria-hidden='true' className={`${modalCancel ? "sm:pl-[35%] sm:pt-[5%] backdrop-blur-sm overflow-x-hidden fixed z-30 justify-center w-full inset-0" : "hidden"} `}>
          {modalCancel ?
            <div className="mt-20 w-full max-w-2xl border rounded-lg max-h-[70rem]" >
              {/* <!-- Modal content --> */}
              <div className="bg-blue-100 rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center p-4 rounded-t border-b dark:border-gray-600">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white ml-[37%]">
                    Cancel Order
                  </h3>
                  <button type="button" onClick={() => {
                    setCancelReason('Select One')
                    setModalCancel('')
                  }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="detailModal">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <p className='sm:text-2xl font-bold pb-3 text-center mt-10 mb-5'>Why do you want to cancel the order?</p>
                <button onClick={() => setDropCancel(!dropCancel)} id="dropdownCancel" data-dropdown-toggle="dropdownCancel"
                  className="border rounded-lg text-gray-400 bg-white hover:bg-gray-400 hover:text-white w-60 sm:w-96 ml-16 sm:ml-36 font-medium pl-2 h-5 sm:h-10 text-center inline-flex justify-between items-center" type="button">
                  {cancelReason}
                  <IoIosArrowDown />
                </button>
                {/* <!-- Dropdown menu --> */}
                <div id="dropdownCancel" className={`${dropCancel == true ? 'hidden' : 'w-60 sm:w-96 ml-16 sm:ml-36 bg-white rounded divide-y divide-gray-100 shadow'}`} >
                  <ul className="py-1 text-sm text-gray-700" aria-labelledby="dropdownCancel">
                    <li className='hover:bg-gray-100'>
                      <button className={`${modalCancel.status_id == 3 ? 'hidden' : "block py-2 pl-4 "}`} onClick={() => {
                        setCancelReason('Less Payment Amount')
                        setDropCancel(true)
                      }}>Less Payment Amount</button>
                    </li>
                    <li className='hover:bg-gray-100'>
                      <button className="block py-2 pl-4 " onClick={() => {
                        setCancelReason('Medicine Out of Stock')
                        setDropCancel(true)
                      }}>Medicine Out of Stock</button>
                    </li>
                  </ul>
                </div>
                <div className='flex justify-between'>
                  <p />
                  <div>
                    <button className='transition mr-4 bg-white border border-main-500 focus:ring-main-500 text-main-500 rounded-lg py-1 px-2 mt-1 hover:-translate-y-1 hover:bg-gray-100' onClick={() => {
                      setCancelReason('Select One')
                      setModalCancel('')
                    }}>Discard</button>
                    <button type='button' className='bg-main-500 hover:bg-main-700 focus:ring-main-500 hover:-translate-y-1 text-lg transition my-4 p-1 mr-5 font-semibold text-white rounded w-44' onClick={() => handleCancel(modalCancel, cancelReason)}>Yes, Reject Order</button>
                  </div>
                </div>
              </div>
            </div>
            : null}
        </div>
        {/* END MODAL CANCEL ORDER */}
        {/* MODAL NOTE */}
        {modalNote ?
          <div id="SuccessModal" tabindex="-1" aria-hidden='true' className="sm:pl-[32%] sm:pt-[5%] backdrop-blur-sm fixed z-30 justify-center w-full inset-0">
            <div className=" max-w-3xl mt-20 bg-white rounded-lg border-2" >
              <div className="flex justify-between p-4 dark:border-gray-600">
                <p />
                <button type="button" onClick={() => {
                  setLoading(true)
                  setTimeout(() => setLoading(false), 1000)
                  setCancelReason('Select One')
                  setModalNote(false)
                }} className="text-gray-400 bg-transparent border hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="">
                <div className='items-center justify-center'>
                  <img src={`${modalNote == 'success' || modalNote == 'gopayment' ? accept : modalNote == 'pickup' ? pickup : cancel}`} className={`${modalNote == 'pickup' ? 'sm:w-md' : 'sm:max-w-md'} h-md sm:mx-auto`} />
                  <p className='sm:text-3xl font-bold pb-3 text-center'>{`${modalNote == 'success' ? 'Order Processing Success' : modalNote == 'gopayment' ? 'Success Making Order, Waiting for User Payment' : modalNote == 'pickup' ? 'Courier Will Pickup your Order' : cancelReason == 'Less Payment Amount' ? 'Status back to WAITING FOR PAYMENT' : 'Order Has Been Canceled'}`}</p>
                </div>
              </div>
            </div>
          </div>
          : null}
        {/* END MODAL NOTE */}
        {/* MODAL MAKE RECIPE */}
        <div id="RecipeModal" tabindex="-1" aria-hidden='true' className={`${modalRecipe ? `sm:pl-[23%] pt-[5%] backdrop-blur-sm overflow-x-hidden fixed z-30 justify-center w-full inset-0` : "hidden"} `}>
          {modalRecipe ?
            <div className="w-full max-w-[1200px] border rounded-lg h-[48rem]" >
              {/* <!-- Modal content --> */}
              <div className=" bg-gray-100 rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center p-4 rounded-t border-b dark:border-gray-600">
                  <h3 className="sm:text-2xl font-semibold text-gray-900 dark:text-white sm:ml-[37%]">
                    Make Order from Recipe
                  </h3>
                  <button type="button" onClick={() => {
                    setRecipe('')
                    setModalRecipe('')
                    setShowInput(false)
                    setShowBtn(true)
                    setPickMed('Search Medicine')
                    setDropMed(true)
                  }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="RecipeModal">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <div className='sm:mt-5 mt-1 sm:grid sm:grid-cols-2 '>
                  <div className='p-3 ml-3 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden mt-3 '>
                    <img src={modalRecipe.prescription_pic.includes('https') ? modalRecipe.prescription_pic : API_URL + modalRecipe.prescription_pic} className='h-full sm:max-w-md sm:max-h-md m-auto' />
                  </div>
                  <div className=''>
                    <div className='border-b'>
                      <div className='ml-5 my-3'>
                        <div className='flex justify-between my-1 sm:my-3 mr-3'>
                          <p className='sm:text-large font-bold sm:block hidden'>Customer</p>
                          <p className='text-sm sm:text-large text-main-500 font-bold'>{modalRecipe.user_name}</p>
                        </div>
                        <div className='flex justify-between my-1 sm:my-3 mr-3'>
                          <p className='sm:text-large font-bold sm:block hidden'>No. Invoice</p>
                          <p className='text-sm sm:text-large text-main-500 font-bold'>{modalRecipe.invoice_number}</p>
                        </div>
                        <div className='flex justify-between my-1 sm:my-3 mr-3'>
                          <p className='sm:text-large font-bold sm:block hidden'>Request Date</p>
                          <p className='text-sm sm:text-large font-thin flex items-center'> {modalRecipe.dateOrder} WIB</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className={`${recipe.length > 0 ? '' : 'hidden'} border-b`}>
                        <p className='ml-5 my-3 font-bold text-lg border-b'>Medicine</p>
                        {printFixRecipe()}
                      </div>
                      {printAddRecipe()}
                      <button className={`${showBtn ? '' : 'hidden'} text-sm sm:text-large flex items-center m-4 sm:m-5`} onClick={() => setShowInput(true)} disabled={showInput ? true : false} ><MdAdd className='mr-3 border rounded-full bg-main-500 text-white' size={30} /> Add Medicine</button>
                      <input onClick={() => setDropMed(!dropMed)} id="inputMed" data-dropdown-toggle="dropdownMed" placeholder='Search Medicine' onKeyUp={handleFilterMed}
                        className={`${showInput ? '' : 'hidden'} w-32 sm:w-72 sm:h-10 border border-teal-500 rounded-lg ml-2 sm:ml-5 px-2`} type="text" />
                      {/* <!-- Dropdown menu --> */}
                      <div id="dropdownMed" className={`${dropMed == true ? 'hidden' : 'w-72 h-32 ml-2 sm:ml-5 bg-white overflow-hide-accept scroll rounded divide-y divide-gray-100 shadow'}`} >
                        <ul className="py-1 text-sm text-gray-700 " aria-labelledby="dropdownCancel">
                          {product.map((val, idx) => {
                            if (val.isDefault == "true") {
                              if (recipe.length > 0) {
                                check = recipe.filter((name) => name.name == val.product_name)
                              }
                              if (check.length == 0) {
                                return <li className='hover:bg-gray-100'>
                                  <button className="py-2 pl-4" onClick={() => {
                                    setDropMed(true)
                                    setPickMed(val.product_name)
                                    setShowInput(false)
                                    setShowBtn(false)
                                  }} value={val.product_name}>{val.product_name}</button>
                                </li>
                              }
                            }
                          })
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <p />
                  <div className='flex items-center mt-5'>
                    <p className='font-semibold mr-3 sm:block hidden'>Recipe will reset if you cancel</p>
                    <button className='transition mr-4 bg-white border border-main-500 focus:ring-main-500 text-main-500 rounded-lg py-1 px-2 mt-1 hover:-translate-y-1 hover:bg-gray-100 w-20' onClick={() => {
                      setRecipe('')
                      setModalRecipe('')
                      setShowInput(false)
                      setShowBtn(true)
                      setPickMed('Search Medicine')
                      setDropMed(true)
                    }}>Cancel</button>
                    <button type='button' className={`${recipe.length < 1 ? 'bg-gray-300' : 'bg-main-500  hover:bg-main-700 focus:ring-main-500 hover:-translate-y-1'} text-lg transition my-4 p-1 mr-5 font-semibold text-white rounded w-44`} onClick={() => {
                      setModalAccept(modalRecipe)
                      setModalRecipe('')
                    }} disabled={recipe.length > 0 ? false : true}>Make Order</button>
                  </div>
                </div>
              </div>
            </div>
            : null}
        </div>
        {/* END MODAL RECIPE */}
        {/* MODAL CONVERSION */}
        <div id="ConvModal" tabindex="-1" aria-hidden='true' className={`${modalConv ? "sm:pl-[35%] sm:pt-[5%] backdrop-blur-sm overflow-x-hidden fixed z-30 justify-center w-full inset-0" : "hidden"} `}>
          {modalConv ?
            <div className="mt-20 w-full max-w-xl border rounded-lg max-h-[70rem]" >
              {/* <!-- Modal content --> */}
              <div className="bg-blue-100 rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center p-4 rounded-t border-b dark:border-gray-600">
                  <h3 className="sm:text-2xl font-semibold text-gray-900 dark:text-white ml-[37%]">
                    Unit Conversion
                  </h3>
                  <button type="button" onClick={() => {
                    setModalConv('')
                  }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="ConvModal">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <p className='sm:text-2xl font-bold text-center mt-3 mb-1'>{pickMed}</p>
                <div className='text-center'>
                  <p className='font-semibold'>Main Stock : {modalConv[0].stock_unit} {modalConv[0].unit}</p>
                  <p className='font-semibold'>{modalConv[1] ? `Netto Stock : ${modalConv[1].stock_unit} ${modalConv[1].unit}` : 'No Netto Stock Yet'}</p>
                </div>
                <div className='flex justify-center items-center my-3'>
                  <button className='border text-lg bg-white rounded-lg mx-2 w-4 text-center' onClick={() => setQtyConv(qtyConv - 1)} disabled={qtyConv == 0 ? true : false}>-</button>
                  <p>{qtyConv}</p>
                  <button className='border text-lg bg-white rounded-lg mx-2 w-4 text-center' onClick={() => setQtyConv(qtyConv + 1)} disabled={qtyConv >= modalConv[0].stock_unit ? true : false} >+</button>
                  <p className='font-semibold ml-2'>{modalConv[0].unit}</p>
                  <MdOutlineArrowForward className='items-center ml-2' />
                  <p className='font-semibold ml-2'>{qtyConv * modalConv[0].netto_stock} {modalConv[0].netto_unit}</p>
                </div>
                <div className='text-center my-3'>
                  <p className='sm:text-xl font-bold text-center mt-3 mb-1'>After Conversion</p>
                  <p className='font-semibold'>Main Stock : {modalConv[0].stock_unit - qtyConv} {modalConv[0].unit}</p>
                  <p className='font-semibold'>{modalConv[1] ? `Netto Stock : ${modalConv[1].stock_unit + (qtyConv * modalConv[0].netto_stock)} ${modalConv[1].unit}` : `Netto Stock : ${qtyConv * modalConv[0].netto_stock} ${modalConv[0].netto_unit}`}</p>
                </div>
                <div className='flex justify-between'>
                  <p />
                  <div>
                    <button className='transition mr-4 bg-white border border-main-500 focus:ring-main-500 text-main-500 rounded-lg py-1 px-2 mt-1 hover:-translate-y-1 hover:bg-gray-100 w-20' onClick={() => {
                      setQtyConv(0)
                      setModalConv('')
                    }}>Cancel</button>
                    <button type='button' className='bg-main-500 hover:bg-main-700 focus:ring-main-500 hover:-translate-y-1 text-lg transition my-4 p-1 mr-5 font-semibold text-white rounded w-20' onClick={() => handleConv(modalConv)}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
            : null}
        </div>
        {/* END MODAL CONVERSION */}
        <Loading loading={loading} />
      </div>
    </div>
  )
}

export default TransactionPages