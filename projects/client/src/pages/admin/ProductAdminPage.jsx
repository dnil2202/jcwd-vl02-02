import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { BiDownload } from "react-icons/bi";
import axios from "axios";
import { API_URL } from "../../helper";
import 'react-toastify/dist/ReactToastify.css';
import { AiFillEdit, AiFillDelete, AiFillCloseCircle } from "react-icons/ai";
import ModalDetailProduct from "../../components/ModalDetailProduct";
import ModalDeleteProduct from "../../components/ModalDeleteProduct";
import AdminComponent from "../../components/AdminComponent";
import { useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet";

const ProductAdminPage = (props) => {
    const navigate = useNavigate();

    // APKG2-23 : product list
    const [data, setData] = React.useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const [drop, setDrop] = React.useState(true);
    const [defaultSort, setDefaultSort] = React.useState('Urutkan');
    const [defaultFilterCategory, setDefaultFilterCategory] = React.useState('Kategori');
    const [sort, setSort] = React.useState('');
    const [category, setCategory] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [categoryChecked, setCategoryChecked] = React.useState([]);
    const [dataStock, setDataStock] = React.useState([]);

    // const [filterName, setFilterName] = React.useState('');
    const { state, search } = useLocation();
    let id = search.split('=');
    // console.log('ini id', id)
    // console.log('ini id[id.length - 1]', id[id.length - 1])
    // console.log('id[id.length - 1].length', id[id.length - 1].length)


    const [filterName, setFilterName] = React.useState(id[id.length - 1].length > 1 ? id[id.length - 1] : '');
    // console.log('ini filterName', filterName)

    const [filterNameOn, setFilterNameOn] = React.useState(filterName ? true : false);
    // const [filterName, setFilterName] = React.useState(typeof id[id.length - 1] == typeof 'string' ? id[id.length - 1] : '');

    // console.log('ini id', id[id.length - 1])
    // console.log('ini typeof id', typeof id[id.length - 1])
    // const [idactive, setIdactive] = React.useState(typeof id[id.length - 1] == typeof 1 ? id[id.length - 1] : 1);
    
    // const [idactive, setIdactive] = React.useState(id[id.length - 1].length == 1 ? id[id.length - 1] : 1);
    const [idactive, setIdactive] = React.useState(search.includes('&') ? id[1].charAt(0) : 1);

    // console.log('ini idactive', idactive)
    // console.log('ini Boolean(idactive>1)', Boolean(idactive>1))


    // const [offset, setOffset] = React.useState(0);
    // const [offset, setOffset] = React.useState(typeof id[id.length - 1] == typeof 1 ? 10 * ((id[id.length - 1]) - 1) : 0);
    const [offset, setOffset] = React.useState(idactive > 1 ? (10 * (idactive - 1)) : 0);

    // const [offset, setOffset] = React.useState(id[id.length - 1].length == 1 ? 10 * ((id[id.length - 1]) - 1) : 0);
    const [pagination, setPagination] = React.useState([1, 2, 3, 4, 5]);
    const [totalProduct, setTotalProduct] = React.useState('');
    const [totalProductFilter, setTotalProductFilter] = React.useState('');

    // Add, edit, delete product
    const [modalDetailProductOn, setModalDetailProductOn] = React.useState(false);
    const [modalDeleteOn, setModalDeleteOn] = React.useState(false);
    const [idproduct, setIdproduct] = React.useState('');
    const [nameDeleted, setNameDeleted] = React.useState('');
    const [dataproduct, setDataproduct] = React.useState('');
    const [productChecked, setProductChecked] = React.useState([]);
    const [allChecked, setAllChecked] = React.useState(false);
    const [totalChecked, setTotalChecked] = React.useState('');
    // const [doc, setDoc] = React.useState(allChecked ? document.getElementById(`selectall`).checked = true : document.getElementById(`selectall`).checked = false);

    const getProduct = () => {
        // let newID = '';

        // if (search.includes('&')) {
        //     let a = search.split('&');
        //     let b = a[0].split('=');
        //     newID = b[b.length - 1];
        //     setIdactive(newID);
        // }

        if (categoryChecked.length > 0) {
            setDefaultFilterCategory(categoryChecked.length + ' kategori terpilih')
        } else {
            setDefaultFilterCategory('Kategori')
        }

        let tes = '';
        let filter = '';

        if (categoryChecked.length > 1) {
            let banyakCategory = categoryChecked.map((val, idx) => {
                return `category_id=${val}`
            })

            tes = banyakCategory.join('&')

        } else if (categoryChecked.length == 1) {

            tes = `category_id=${categoryChecked}`

        }

        if (tes && filterName) {
            filter = tes.concat('&', `product_name=${filterName}`)
        } else if (tes) {
            filter = tes
        } else {
            filter = `product_name=${filterName}`
        }

        axios.post(API_URL + `/api/product/getproduct?${filter ? filter : ''}`, {
            limit: "",
            sort,
            offset
        })
            .then((res) => {
                if (res.data.results) {
                    setData(res.data.results);
                    setTotalProduct(res.data.totalProduct);
                    setDataStock(res.data.dataStock);

                    if (res.data.totalProductFilter) {
                        setTotalProductFilter(res.data.totalProductFilter);

                        let pagination = []

                        for (let i = 1; i <= Math.ceil(res.data.totalProductFilter / 10); i++) {
                            pagination.push(i)
                        }

                        setPagination(pagination);

                    } else {
                        let pagination = []

                        for (let i = 1; i <= Math.ceil(res.data.totalProduct / 10); i++) {
                            pagination.push(i)
                        }

                        setPagination(pagination);
                    }
                }


            })
            .catch((error) => {
                console.log('Print product error', error);
            })
    }

    React.useEffect(() => {
        setTimeout(() => { setLoading(true) }, 1000)
        getProduct()
        return () => {
            setTimeout(() => { setLoading(true) }, 1000)
        }
    }, [loading, categoryChecked])

    const onDelete = (val) => {
        if (val.idproduct) {
            setModalDeleteOn(true);
            setIdproduct([val.idproduct]);
            setNameDeleted(val.product_name);
        } else {
            // alert('yoi');
            setModalDeleteOn(true);
            let resultID = [];
            let resultName = [];

            productChecked.forEach((val, idx) => {
                data.forEach((value, index) => {
                    if (value.idproduct == val) {
                        resultID.push(value.idproduct);
                        resultName.push(value.product_name);
                    }
                })
            })

            setIdproduct(resultID);
            setNameDeleted(resultName);

        }
    }

    const printProduct = () => {
        return data.map((val, idx) => {
            if (loading) {
                return <tr key={val.idproduct} className="bg-white border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                        <input id={`selectproduct-${val.idproduct}`} onClick={() => checkedProduct(val.idproduct)} type="checkbox" className="checked:bg-btn-500 rounded border-gray-300 focus:ring-btn-500" />
                    </td>
                    <th scope="row" className="w-96 py-4 px-6 font-bold text-gray-900 whitespace-nowrap flex items-center">
                        {
                            val.picture.includes('http') ?
                                <img className="pt-1 w-24 mr-4" src={val.picture} alt="imgHome" />
                                :
                                <img className="pt-1 w-24 mr-4" src={API_URL + val.picture} alt="imgHome" />
                        }
                        <button onClick={() => { setModalDetailProductOn(true); setDataproduct(val) }}>
                            {val.product_name}
                        </button>
                    </th>
                    <td className="py-4 px-3 border border-x-1 text-gray-700 text-center">
                        {val.category_name}
                    </td>
                    <td className="py-4 px-3 border border-x-1 text-gray-700 text-center">
                        Rp {val.price.toLocaleString("id")}
                    </td>
                    <td className="py-4 px-3 border border-x-1 text-gray-700 text-center">
                        {val.stock_unit}
                        <span> </span>
                        {val.default_unit}
                    </td>
                    <td className="py-4 px-3 border border-x-1 text-gray-700 text-center">
                        {val.netto_stock}
                        <span> </span>
                        {val.netto_unit}
                    </td>
                    <td className="py-4 px-3 border border-x-1 text-gray-700 text-center">
                        {
                            // dataStock.map((v, i) => {
                            //     if (val.idproduct == v.product_id) {
                            //         return val.netto_stock * val.stock_unit + v.stock_unit
                            //     } 
                            //     else {
                            //         return val.netto_stock * val.stock_unit
                            //     }
                            // })
                        }
                        {val.netto_stock * val.stock_unit}
                        <span> </span>
                        {val.netto_unit}
                    </td>
                    <td className="py-4 px-2 text-center">
                        <button type="button" onClick={() => {
                            setDataproduct(val);
                            navigate('/admin/product/edit', {
                                state: {
                                    dataproduct: val,
                                    category
                                }
                            })
                        }} className="w-8 border border-btn-500 text-btn-500 rounded-md py-1 font-bold">
                            {<AiFillEdit size={16} className="mx-2" />}
                        </button>
                        <button type="button" onClick={() => onDelete(val)} className="ml-3 w-8 bg-btn-500 text-white rounded-md py-1 font-bold">
                            {<AiFillDelete size={16} className="mx-2" />}
                        </button>
                    </td>
                </tr>
            } else if (!loading) {
                return <tr key={val.idproduct} className="bg-white border-b h-32 hover:bg-gray-50">
                    <td className="py-4 px-6">
                        <input type="checkbox" className="checked:bg-btn-500 rounded border-gray-300 focus:ring-btn-500" />
                    </td>
                    <th scope="row" className="mt-7 py-4 font-bold text-gray-900 whitespace-nowrap flex items-center">
                        <div className="flex justify-center items-center w-10 h-10 bg-gray-300 rounded">
                            <svg className="w-3 h-3 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                        </div>
                        <div className="h-2 ml-3 bg-gray-300 rounded-full w-12 mb-2.5"></div>
                    </th>
                    <td className="py-4">
                        <div className="h-2 bg-gray-300 rounded-full w-16 mb-2.5"></div>
                    </td>
                    <td className="py-4">
                        <div className="h-2 bg-gray-300 rounded-full w-16 mb-2.5"></div>
                    </td>
                    <td className="py-4">
                        <div className="h-2 bg-gray-300 rounded-full w-16 mb-2.5"></div>
                    </td>
                    <td className="py-4">
                        <div className="h-2 bg-gray-300 rounded-full w-16 mb-2.5"></div>
                    </td>
                    <td className="py-4">
                        <div className="h-2 bg-gray-300 rounded-full w-16 mb-2.5"></div>
                    </td>
                    <td className="py-4 px-2 text-center">
                        <button type="button" className="w-8 border border-btn-500 text-btn-500 rounded-md py-1 font-bold">
                            {<AiFillEdit size={16} className="mx-2" />}
                        </button>
                        <button type="button" className="ml-3 w-8 bg-btn-500 text-white rounded-md py-1 font-bold">
                            {<AiFillDelete size={16} className="mx-2" />}
                        </button>
                    </td>
                </tr>
            }
        })
    }

    const onPagination = (idx) => {
        setLoading(false);
        setIdactive(idx + 1);
        setOffset(10 * idx);

        if (!filterName) {
            setFilterName('');
        }

        if (idx + 1 != 1) {
            if (filterName) {
                navigate(`/admin/product?page=${idx + 1}&search=${filterName}`)
            } else {
                navigate(`/admin/product?page=${idx + 1}`)
            }
        } else {
            if(!filterName){
                navigate(`/admin/product`)
            } else {
                navigate(`/admin/product?search=${filterName}`)
            }
        }
    }

    const printPagination = () => {
        return pagination.map((val, idx) => {
            return <li>
                <button type="button" onClick={() => onPagination(idx)} aria-current="page"
                    className={(idx + 1) == idactive ?
                        "z-10 py-2 px-3 leading-tight text-btn-500 bg-green-50 border border-green-300 hover:bg-green-100 hover:text-btn-500"
                        : "py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"}>
                    {/* <button type="button" onClick={() => { setLoading(false); setFilterName(''); setIdactive(idx + 1); setOffset(10 * idx) }} aria-current="page" className="z-10 py-2 px-3 leading-tight text-btn-500 bg-green-50 border border-green-300 hover:bg-green-100 hover:text-btn-500"> */}
                    {idx + 1}
                </button>
            </li>
        })
    }

    const getCategory = () => {
        axios.get(API_URL + '/api/product/getcategory')
            .then((res) => {
                setCategory(res.data)
            })
            .catch((error) => {
                console.log('getCategory error :', error)
            })
    }

    React.useEffect(() => {
        getCategory()
    }, [category])

    const checkedCategory = (idcategory) => {
        if (document.getElementById(`select-${idcategory}`).checked) {
            setLoading(false)
            if (categoryChecked.length > 0) {
                setCategoryChecked([...categoryChecked, idcategory])

                // let result = [...categoryChecked, idcategory];
                // let tes = '';

                // if (result.length > 1) {
                //     let banyakCategory = result.map((val, idx) => {
                //         return `category=${val}`
                //     })

                //     tes = banyakCategory.join('&')

                // } else if (result.length == 1) {

                //     tes = `category=${result}`

                // }

                // navigate(`/admin/product?${tes}`)

            } else {
                setCategoryChecked([idcategory])
                // let tes = `category=${idcategory}`
                // navigate(`/admin/product?${tes}`)
            }
        } else {
            if (categoryChecked.length > 0) {
                categoryChecked.forEach((val, idx) => {
                    if (val == idcategory) {
                        let idxAlready = categoryChecked.findIndex(v => v == idcategory)
                        categoryChecked.splice(idxAlready, 1)
                        setLoading(false)
                    }
                })
            }
        }
    }

    const checkedProduct = (idproduct) => {
        if (document.getElementById(`selectproduct-${idproduct}`).checked) {
            if (productChecked.length > 0) {
                let checked = [...productChecked, idproduct]
                setProductChecked([...productChecked, idproduct])
                setTotalChecked(checked.length)

                if (checked.length == data.length) {
                    document.getElementById("selectall").checked = true
                }

            } else {
                setProductChecked([idproduct])
                let checked = [idproduct]
                setTotalChecked(checked.length)
            }
        } else {
            document.getElementById(`selectall`).checked = false

            if (productChecked.length > 0) {
                productChecked.forEach((val, idx) => {
                    if (val == idproduct) {
                        let idxAlready = productChecked.findIndex(v => v == idproduct)
                        productChecked.splice(idxAlready, 1)
                        setTotalChecked(productChecked.length)
                    }
                })
            } else if (productChecked.length == 0) {
                setAllChecked(false);
            }
        }
    }

    const checkedAllProduct = () => {
        if (document.getElementById('selectall').checked) {
            setAllChecked(true);
            setTotalChecked(data.length);

            let checked = []

            data.forEach((val, idx) => {
                document.getElementById(`selectproduct-${val.idproduct}`).checked = true
                checked.push(val.idproduct);
                setProductChecked(checked);

            })

        } else {
            setAllChecked(false);

            data.map((val, idx) => {
                document.getElementById(`selectproduct-${val.idproduct}`).checked = false

                if (productChecked.length > 0) {
                    productChecked.forEach((value, index) => {
                        if (value == val.idproduct) {
                            let idxAlready = productChecked.findIndex(v => v == val.idproduct)
                            productChecked.splice(idxAlready, 1)
                        }
                    })
                }
            })
        }
    }

    const printCategory = () => {
        return category.map((val, idx) => {
            return <li key={val.idcategory} className="flex items-center mt-2">
                <input id={`select-${val.idcategory}`} onClick={() => checkedCategory(val.idcategory)} type="checkbox" className="ml-3 checked:bg-btn-500 rounded border-gray-300 focus:ring-btn-500" />
                <label className="ml-2">{val.category_name}</label>
            </li>
        })
    }

    const printFilterCategory = () => {
        if (categoryChecked.length > 1) {
            return categoryChecked.map((val, idx) => {
                return <button className="flex text-xs items-center text-gray-500 border rounded-lg pl-2 ml-3">
                    {category[val - 1].category_name}
                    <AiFillCloseCircle onClick={() => { categoryChecked.splice(idx, 1); setLoading(false) }} size={15} className="w-8 h-8 py-2 ml-3.5 rounded-r-lg text-sm hover:bg-gray-400 hover:text-white" />
                </button>
            })
        } else if (categoryChecked.length = 1) {
            return <button className="flex text-xs items-center text-gray-500 border rounded-lg pl-2 ml-3">
                {category[categoryChecked - 1].category_name}
                <AiFillCloseCircle onClick={() => { setCategoryChecked([]); setTotalProductFilter('');; setLoading(false) }} size={15} className="w-8 h-8 py-2 ml-3.5 rounded-r-lg text-sm hover:bg-gray-400 hover:text-white" />
            </button>
        }
    }

    const onClose = (info) => {
        if (info == "false") {
            document.getElementById(`selectall`).checked = false
        }
    }

    const onReset = () => {
        setCategoryChecked([]);
        setTotalProductFilter('');
        setLoading(false);
        setFilterName('');
        setIdactive(1);
        setOffset(0);
        setSort('');
        setDefaultSort('Urutkan');
        setFilterNameOn(false);
        document.getElementById("search").value = null;

        categoryChecked.map((value, index) => {
            category.map((val, idx) => {
                if (val.idcategory == value) {
                    document.getElementById(`select-${val.idcategory}`).checked = false
                }
            })
        })

        navigate('/admin/product');

    }

    const onSearch = () => {
        setLoading(false);
        document.getElementById("search").value = null;
        navigate(`/admin/product?search=${filterName}`);
        setFilterNameOn(true)
        setOffset(0);
    }

    return (
        // <div className={`${loading ? 'overflow-hide scroll ' : ""}`}  >
        
        <div>
            <Helmet>
                <title>Admin Product</title>
            </Helmet>
            <div className='flex'>
                {/* <DashboardPage page={window.location.pathname} /> */}

                <AdminComponent page={window.location.pathname} />
                <div style={{ background: "linear-gradient(155.7deg, #D6F5F3 -46%, #F7FCFC 100%, #F1F5FC 118%)", width: "85vw" }}>
                    <div className="ml-5">
                        {/* <div> */}
                        <p className="text-xl font-bold mt-5 mb-3 text-txt-500">Daftar Obat</p>
                        <div className="max-w-full mr-5 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden my-5 h-fit">
                            <div className="px-4 py-6">
                                <div id="header" className="flex justify-between items-center">
                                    <div id="filter" className="flex">
                                        <div className="relative">
                                            {/* <input id="search" type="form" onChange={(e) => setFilterName(`product_name=${e.target.value}`)} placeholder="Cari nama obat" className="border rounded-lg py-1 px-2 text-sm w-80" /> */}

                                            <input id="search" type="form" onChange={(e) => setFilterName(e.target.value)} placeholder="Cari nama obat" className="border rounded-lg py-1 px-2 text-sm w-80" />
                                            <button type="button" onClick={onSearch} className="absolute right-0 p-1.5 rounded-r-lg text-gray-400">
                                                <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                            </button>
                                        </div>

                                        <div className="topnav" id="myTopnav">
                                            <div className="dropdown">
                                                <button className="dropbtn flex text-xs border rounded-lg pl-2 ml-3">
                                                    {defaultFilterCategory}
                                                    <IoIosArrowDown size={13} className="w-7 h-7 py-2 ml-3.5 rounded-r-lg bg-gray-200 text-sm hover:bg-gray-400 hover:text-white" />
                                                </button>
                                                <div className="dropdown-content w-44 pt-5 pb-5 mr-2">
                                                    {printCategory()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="topnav" id="myTopnav">
                                            <div className="dropdown">
                                                <button className="dropbtn flex text-xs border rounded-lg pl-2 ml-3">
                                                    {defaultSort}
                                                    <IoIosArrowDown size={13} className="w-7 h-7 py-2 ml-3.5 rounded-r-lg bg-gray-200 text-sm hover:bg-gray-400 hover:text-white" />
                                                </button>
                                                <div className="dropdown-content w-44 py-3 mr-2">
                                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                                                        <li>
                                                            <button onClick={() => { setLoading(false); setDefaultSort('Nama : A - Z'); setSort('product_name'); setDrop(!drop) }} className="block py-2 pl-4 pr-16 hover:bg-gray-100">Nama : A - Z</button>
                                                        </li>
                                                        <li>
                                                            <button onClick={() => { setLoading(false); setDefaultSort('Harga Terendah'); setSort('price'); setDrop(!drop) }} className="block py-2 pl-4 pr-12 hover:bg-gray-100">Harga Terendah</button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="button obat">
                                        <button type="button" onClick={() => navigate('/admin/product/add')} className="text-white bg-btn-500 hover:bg-btn-600 w-32 font-bold rounded-lg place-content-center text-xs h-7 mr-1 flex items-center">
                                            <BiDownload size={13} className="mr-2" />
                                            Tambah Obat
                                        </button>
                                    </div>
                                </div>

                                {
                                    categoryChecked.length != 0 || sort || filterNameOn ?
                                        <>
                                            <div className="flex my-7">
                                                <button className="text-btn-500 font-bold text-sm mx-2" onClick={onReset}>Reset Semua Filter</button>
                                                {
                                                    categoryChecked.length == 0 ?
                                                        <></>
                                                        :
                                                        printFilterCategory()
                                                }
                                                {
                                                    sort ?
                                                        <button className="flex text-xs items-center text-gray-500 border rounded-lg pl-2 ml-3">
                                                            {defaultSort}
                                                            <AiFillCloseCircle onClick={() => { setSort(''); setDefaultSort('Urutkan'); setLoading(false) }} size={15} className="w-8 h-8 py-2 ml-3.5 rounded-r-lg text-sm hover:bg-gray-400 hover:text-white" />
                                                        </button>
                                                        :
                                                        <>
                                                        </>
                                                }
                                                {
                                                    filterNameOn ?
                                                        <button className="flex text-xs items-center text-gray-500 border rounded-lg pl-2 ml-3">
                                                            {filterName}
                                                            <AiFillCloseCircle onClick={() => { setFilterName(''); setLoading(false); setFilterNameOn(false) }} size={15} className="w-8 h-8 py-2 ml-3.5 rounded-r-lg text-sm hover:bg-gray-400 hover:text-white" />
                                                        </button>
                                                        :
                                                        <>
                                                        </>
                                                }
                                            </div>
                                            <hr className="hidden md:flex bg-gray-200 border-0" />
                                        </>
                                        :
                                        <>
                                            <hr className="hidden md:flex my-3 bg-gray-200 border-0" />
                                        </>
                                }

                                <div id="tabel obat">
                                    {data.length > 0
                                        ?
                                        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                                            <table className="w-full text-sm text-left text-gray-500">
                                                <thead className="text-xs text-gray-600 uppercase border-b border-t">
                                                    <tr>
                                                        <th scope="col" className="py-3 px-6">
                                                            <input id="selectall" onClick={checkedAllProduct} type="checkbox" className="checked:bg-btn-500 rounded border-gray-300 focus:ring-btn-500" />
                                                        </th>
                                                        {
                                                            allChecked || productChecked.length > 0 ?
                                                                <>
                                                                    <th scope="col" className="py-3 pl-6 w-96 flex items-center lowercase">
                                                                        <p className="font-bold mx-2">
                                                                            {totalChecked} / {data.length} produk dipilih
                                                                        </p>
                                                                        <button className="font-bold mx-2">
                                                                            {<AiFillDelete onClick={() => onDelete(productChecked)} size={16} className="mx-2" />}
                                                                        </button>
                                                                    </th>
                                                                </>
                                                                :
                                                                <>
                                                                    <th scope="col" className="py-3 pl-6 w-96">
                                                                        Nama Obat
                                                                    </th>
                                                                    <th scope="col" className="py-3 px-3 border border-x-1 text-center">
                                                                        Kategori
                                                                    </th>
                                                                    <th scope="col" className="py-3 px-3 border border-x-1 text-center">
                                                                        Harga
                                                                    </th>
                                                                    <th scope="col" className="py-3 px-3 border border-x-1 text-center">
                                                                        Stok Utama
                                                                    </th>
                                                                    <th scope="col" className="py-3 px-3 border border-x-1 text-center">
                                                                        Stok Netto
                                                                    </th>
                                                                    <th scope="col" className="py-3 px-3 border border-x-1 text-center">
                                                                        Total Stok
                                                                    </th>
                                                                    <th scope="col" className="py-3 px-3 text-center">
                                                                        Atur
                                                                    </th>
                                                                </>
                                                        }
                                                        {/* <th scope="col" className="py-3 pl-6 w-96">
                                                            Nama Obat
                                                        </th>
                                                        <th scope="col" className="py-3 px-3 border border-x-1 text-center">
                                                            Kategori
                                                        </th>
                                                        <th scope="col" className="py-3 px-3 border border-x-1 text-center">
                                                            Harga
                                                        </th>
                                                        <th scope="col" className="py-3 px-3 border border-x-1 text-center">
                                                            Stok Utama
                                                        </th>
                                                        <th scope="col" className="py-3 px-3 border border-x-1 text-center">
                                                            Stok Netto
                                                        </th>
                                                        <th scope="col" className="py-3 px-3 border border-x-1 text-center">
                                                            Total Stok
                                                        </th>
                                                        <th scope="col" className="py-3 px-3 text-center">
                                                            Atur
                                                        </th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {printProduct()}
                                                </tbody>
                                            </table>
                                        </div>
                                        :
                                        <div className="text-center text-txt-500 font-bold text-lg">
                                            Data Not Found
                                            <img src={require('./NoData.png')} className='w-96 text-center mx-auto' alt='medcare.com' />
                                        </div>
                                    }
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="ml-4 mt-4">
                                        {
                                            categoryChecked.length != 0 || sort || filterName ?
                                                `Menampilkan ${(idactive - 1) * 10 + 1} - ${data.length < 10 ? totalProductFilter : idactive * 10} dari ${totalProductFilter} data`
                                                :
                                                `Menampilkan ${(idactive - 1) * 10 + 1} - ${data.length < 10 ? totalProduct : idactive * 10} dari ${totalProduct} data`
                                        }
                                    </div>
                                    <div id="pagination" className="mt-5 text-center">
                                        <nav aria-label="Page navigation example">
                                            <ul className="inline-flex items-center -space-x-px">
                                                <li>
                                                    <button disabled={idactive == 1 ? true : false} onClick={() => { setLoading(false); setIdactive(idactive - 1); setOffset((idactive - 2) * 10) }} type="button" className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                                        <span className="sr-only">Previous</span>
                                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                                    </button>
                                                </li>
                                                {printPagination()}
                                                <li>
                                                    <button disabled={idactive == 4 ? true : false} onClick={() => { setLoading(false); setIdactive(idactive + 1); setOffset((idactive) * 10) }} type="button" className="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                                                        <span className="sr-only">Next</span>
                                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {modalDetailProductOn && <ModalDetailProduct setModalDetailProductOn={setModalDetailProductOn} dataproduct={dataproduct} setLoading={setLoading} />}
                        {modalDeleteOn && <ModalDeleteProduct setModalDeleteOn={setModalDeleteOn} idproduct={idproduct} nameDeleted={nameDeleted} setLoading={setLoading} setAllChecked={setAllChecked} setProductChecked={setProductChecked} onClose={onClose} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductAdminPage;