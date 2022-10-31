import React from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillEdit } from "react-icons/ai";
import AdminComponent from "../../components/AdminComponent";
import { useLocation, useNavigate } from "react-router";
import { IoMdArrowDropright } from "react-icons/io";
import { API_URL } from "../../helper";
import ModalAddMainUnit from "../../components/ModalAddMainUnit";
import ModalAddNettoUnit from "../../components/ModalAddNettoUnit";
import ModalSettingCategory from "../../components/ModalSettingCategory";
import SpinnerComp from "../../components/Spinner";
import { Helmet } from "react-helmet";

const AddProductPage = () => {
    const navigate = useNavigate();
    const { state, search } = useLocation();
    const [spinner, setSpinner] = React.useState(false);

    const [product_name, setProduct_Name] = React.useState('');
    const [price, setPrice] = React.useState(null);
    const [category_id, setCategory_Id] = React.useState(null);
    const [netto_stock, setNetto_Stock] = React.useState(null);
    const [netto_unit, setNetto_Unit] = React.useState('');
    const [default_unit, setDefault_Unit] = React.useState('');
    const [picture, setPicture] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [dosis, setDosis] = React.useState('');
    const [aturan_pakai, setAturan_Pakai] = React.useState('');
    const [stock_unit, setStock_Unit] = React.useState('');
    const [category, setCategory] = React.useState([]);
    const [isDisable, setIsDisable] = React.useState(false);

    // Add new netto unit & main unit
    const [all_netto, setAll_Netto] = React.useState([]);
    const [all_main, setAll_Main] = React.useState([]);

    const [modalAddMainUnitOn, setModalAddMainUnitOn] = React.useState(false);
    const [unit_type, setUnit_Type] = React.useState('');

    const [modalAddNettoUnitOn, setModalAddNettoUnitOn] = React.useState(false);

    // Add, edit, delete category 
    const [modalSetCategoryOn, setModalSetCategoryOn] = React.useState(false);

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

    const printCategory = () => {
        return category.map((val, idx) => {
            return <option key={val.idcategory} value={`${val.idcategory}`}>{val.category_name}</option>
        })
    }

    const getNetto = () => {
        axios.get(API_URL + `/api/product/getunit?unit_type=netto`)
            .then((res) => {
                setAll_Netto(res.data)
            })
            .catch((error) => {
                console.log('getNetto error :', error)
            })
    }

    const getMain = () => {
        axios.get(API_URL + `/api/product/getunit?unit_type=main`)
            .then((res) => {
                setAll_Main(res.data)
            })
            .catch((error) => {
                console.log('getMain error :', error)
            })
    }

    React.useEffect(() => {
        getNetto()
        getMain()
    })

    const prtintNetto = () => {
        return all_netto.map((val, idx) => {
            return <option key={val.idunit} value={val.unit}>{val.unit}</option>
        })
    }

    const printMain = () => {
        return all_main.map((val, idx) => {
            return <option key={val.idunit} value={val.unit}>{val.unit}</option>
        })
    }

    const addProduct = () => {
        setSpinner(true);
        let formData = new FormData();
        formData.append('data', JSON.stringify({
            product_name,
            price,
            category_id,
            netto_stock,
            netto_unit,
            default_unit,
            description,
            dosis,
            aturan_pakai,
            stock_unit
        }));
        formData.append('images', picture);
        axios.post(API_URL + `/api/product/add`, formData)
            .then((res) => {
                setTimeout(() => {
                    if (res.data.success) {
                        toast.success('Add product berhasil', {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                        setSpinner(false);
                        navigate('/admin/product', { replace: true }); 
                    };
                }, 3000);
            }).catch((err) => {
                console.log(`Axios post (newpost) failed : ${err}`)
            })
    }

    return (
        <div>
            <Helmet>
                <title>Add Product</title>
            </Helmet>
            {/* <div className={`${loading ? 'overflow-hide scroll ' : ""}`}  > */}
            <div className='flex'>
                {/* <DashboardPage page={window.location.pathname} /> */}

                <AdminComponent page={window.location.pathname} />
                <div style={{ background: "linear-gradient(155.7deg, #D6F5F3 -46%, #F7FCFC 100%, #F1F5FC 118%)", width: "85vw", height: "63vw" }}>
                    <div className="ml-5">
                        <div className="mr-5">

                            <div className="py-6" style={{ height: "620px" }}>
                                <div className="flex items-center text-btn-500 font-bold text-sm mb-4">
                                    <button onClick={() => navigate('/admin/dashboard')}>Home</button>
                                    <IoMdArrowDropright className="text-gray-500" size={22} />
                                    <button onClick={() => navigate('/admin/product')}>Product List</button>
                                    <IoMdArrowDropright className="text-gray-500" size={22} />
                                    <span className="text-txt-500" >Add Product</span>
                                </div>
                                <div className="max-w-full mr-5 px-8 pt-7 pb-6 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden mb-5 h-fit">
                                    <h3 className="mb-7 text-xl font-bold text-txt-500">Add New Product</h3>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <div className="block">
                                                <label className="mb-2 text-sm font-medium text-gray-900 flex after:content-['*'] after:text-red-500 after:ml-0.5">
                                                    Category  <button type="button" className="w-6 text-btn-500 rounded-md font-bold">
                                                        {<AiFillEdit onClick={() => setModalSetCategoryOn(true)} size={13} className="mx-2" />}
                                                    </button>
                                                </label>
                                                {/* <select onChange={(e) => setCategory_Id(e.target.value)} className={`border block w-full p-2.5 mb-2 text-sm rounded-lg ${category_id ? 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500' : 'border-red-600 text-gray-500'}`}> */}
                                                <select onChange={(e) => setCategory_Id(e.target.value)} className={`border block w-full p-2.5 mb-2 text-sm rounded-lg bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500`}>

                                                    <option defaultValue='Choose category'>Choose category</option>
                                                    {printCategory()}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="product_name" className="block mt-4 mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:text-red-500 after:ml-0.5">
                                                    Product Name
                                                </label>
                                                {/* <input type="text" onChange={(e) => setProduct_Name(e.target.value)} name="product_name" id="product_name" className={`border block w-full p-2.5 text-sm rounded-lg ${product_name ? 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500' : 'border-red-600 text-gray-500'}`} placeholder="Contoh : Sanmol 6 Kapsul" required /> */}
                                                <input type="text" onChange={(e) => setProduct_Name(e.target.value)} name="product_name" id="product_name" className={`border block w-full p-2.5 text-sm rounded-lg bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500`} placeholder="Contoh : Sanmol 6 Kapsul" required />
                                            </div>
                                            <div>
                                                <label htmlFor="description" className="block mt-4 mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:text-red-500 after:ml-0.5">
                                                    Price
                                                </label>
                                                <div className="flex">
                                                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300">
                                                        Rp
                                                    </span>
                                                    {/* <input type="number" onChange={(e) => setPrice(e.target.value)} name="description" id="description" className={`rounded-none rounded-r-lg block flex-1 min-w-0 w-full text-sm p-2.5 ${price ? 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500' : 'border-red-600 text-gray-500'}`} placeholder="Masukkan harga" required /> */}
                                                    <input type="number" onChange={(e) => setPrice(e.target.value)} name="description" id="description" className={`rounded-none rounded-r-lg block flex-1 min-w-0 w-full text-sm p-2.5 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500`} placeholder="Masukkan harga" required />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="description" className="block mt-4 mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:text-red-500 after:ml-0.5">
                                                    Description
                                                </label>
                                                {/* <textarea onChange={(e) => setDescription(e.target.value)} className={`text-sm rounded-lg block w-full p-2.5 ${description ? 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500' : 'border-red-600 text-gray-500'}`} placeholder="Tulis deskripsi singkat dari obat untuk inhtmlFormasi pembeli" type='text' /> */}
                                                <textarea onChange={(e) => setDescription(e.target.value)} className={`text-sm rounded-lg block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500`} placeholder="Tulis deskripsi singkat dari obat untuk inhtmlFormasi pembeli" type='text' />
                                            </div>
                                            <div>
                                                <label htmlFor="dosis" className="block mt-4 mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:text-red-500 after:ml-0.5">
                                                    Dosis
                                                </label>
                                                {/* <input type="text" onChange={(e) => setDosis(e.target.value)} name="dosis" id="dosis" className={`border text-sm rounded-lg block w-full p-2.5 ${dosis ? "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500" : 'border-red-600 text-gray-500'}`} placeholder="Anjuran dosis penggunaan obat" required /> */}
                                                <input type="text" onChange={(e) => setDosis(e.target.value)} name="dosis" id="dosis" className={`border text-sm rounded-lg block w-full p-2.5 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500`} placeholder="Anjuran dosis penggunaan obat" required />
                                            </div>
                                        </div>
                                        <div className="ml-8">
                                            <div>
                                                <div>
                                                    <label htmlFor="aturan_pakai" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:text-red-500 after:ml-0.5">
                                                        Aturan Pakai
                                                    </label>
                                                    {/* <input type="text" onChange={(e) => setAturan_Pakai(e.target.value)} name="aturan_pakai" id="aturan_pakai" className={`border text-sm rounded-lg block w-full p-2.5 mb-4 ${aturan_pakai ? 'bg-gray-50 border-gray-300 text-gray-900  focus:ring-blue-500 focus:border-blue-500' : 'border-red-600 text-gray-500'}`} placeholder="Anjuran aturan pemakaian obat" required /> */}
                                                    <input type="text" onChange={(e) => setAturan_Pakai(e.target.value)} name="aturan_pakai" id="aturan_pakai" className={`border text-sm rounded-lg block w-full p-2.5 mb-4 bg-gray-50 border-gray-300 text-gray-900  focus:ring-blue-500 focus:border-blue-500`} placeholder="Anjuran aturan pemakaian obat" required />
                                                </div>
                                                <div className="columns-2">
                                                    <div>
                                                        <div>
                                                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:text-red-500 after:ml-0.5">
                                                                Main Stock
                                                            </label>
                                                            {/* <input type="number" onChange={(e) => setStock_Unit(e.target.value)} name="category" id="category" className={`border block w-full p-2.5 text-sm rounded-lg ${stock_unit ? ' bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500' : 'border-red-600 text-gray-500'}`} placeholder="Jumlah stok obat" required /> */}
                                                            <input type="number" onChange={(e) => setStock_Unit(e.target.value)} name="category" id="category" className={`border block w-full p-2.5 text-sm rounded-lg bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500`} placeholder="Jumlah stok obat" required />
                                                        </div>
                                                        <div>
                                                            <label className="mt-4 mb-2 text-sm font-medium text-gray-900 flex after:content-['*'] after:text-red-500 after:ml-0.5">
                                                                Main Unit  <button type="button" className="w-6 text-btn-500 rounded-md font-bold">
                                                                    {<AiFillEdit onClick={() => { setModalAddMainUnitOn(true); setUnit_Type('main') }} size={13} className="mx-2" />}
                                                                </button>
                                                            </label>
                                                            {/* <select onChange={(e) => setDefault_Unit(e.target.value)} className={`border block w-full p-2.5 mb-2 text-sm rounded-lg ${default_unit ? 'bg-gray-50 border-gray-300 text-gray-500 focus:ring-blue-500 focus:border-blue-500' : 'border-red-600 text-gray-500'}`}> */}
                                                            <select onChange={(e) => setDefault_Unit(e.target.value)} className={`border block w-full p-2.5 mb-2 text-sm rounded-lg bg-gray-50 border-gray-300 text-gray-500 focus:ring-blue-500 focus:border-blue-500`}>
                                                                <option defaultValue='Pilih Unit Utama'>Pilih unit utama obat</option>
                                                                {printMain()}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div>
                                                            <label htmlFor="description" className="block mt-4 mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:text-red-500 after:ml-0.5">
                                                                Netto Stock
                                                            </label>
                                                            {/* <input defaultValue={netto_stock} type="number" onChange={(e) => setNetto_Stock(e.target.value)} name="description" id="description" className={`border block w-full p-2.5 text-sm rounded-lg ${netto_stock ? 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500' : 'border-red-600 text-gray-500'}`} placeholder="Isi per obat" required /> */}
                                                            <input defaultValue={netto_stock} type="number" onChange={(e) => setNetto_Stock(e.target.value)} name="description" id="description" className={`border block w-full p-2.5 text-sm rounded-lg bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500`} placeholder="Isi per obat" required />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="description" className="block mt-4 mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:text-red-500 after:ml-0.5">
                                                                Netto Unit  <button type="button" className="w-6 text-btn-500 rounded-md font-bold">
                                                                    {<AiFillEdit onClick={() => { setModalAddNettoUnitOn(true); setUnit_Type('netto') }} size={13} className="mx-2" />}
                                                                </button>
                                                            </label>
                                                            {/* <select onChange={(e) => setNetto_Unit(e.target.value)} className={`border block w-full p-2.5 mb-2 text-sm rounded-lg ${netto_unit ? 'bg-gray-50 border-gray-300 text-gray-500 focus:ring-blue-500 focus:border-blue-500' : 'border-red-600 text-gray-500'}`}> */}
                                                            <select onChange={(e) => setNetto_Unit(e.target.value)} className={`border block w-full p-2.5 mb-2 text-sm rounded-lg bg-gray-50 border-gray-300 text-gray-500 focus:ring-blue-500 focus:border-blue-500`}>
                                                                <option defaultValue='Pilih Unit Netto'>Pilih unit isi obat</option>
                                                                {prtintNetto()}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="description" className="block mt-4 mb-2 text-sm font-medium text-gray-900 after:content-['*'] after:text-red-500 after:ml-0.5">Product Image</label>

                                                <div className="flex justify-center items-center w-full">
                                                    {/* <label htmlFor="dropzone-file" className={`flex flex-col justify-center items-center w-full h-30 rounded-lg border-2 border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100 ${picture ? 'border-gray-300' : 'border-red-400'}`}> */}
                                                    <label htmlFor="dropzone-file" className={`flex flex-col justify-center items-center w-full h-30 rounded-lg border-2 border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300`}>
                                                        <div className="flex">
                                                            <div className="flex flex-col justify-center items-center mx-2.5 py-6">
                                                                {
                                                                    picture ?
                                                                        <img className="w-40 pt-1 mb-2" src={URL.createObjectURL(picture)} alt="new product" />
                                                                        :
                                                                        <>
                                                                            <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to edit product picture</span> or drag and drop</p>
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                                        </>
                                                                }
                                                            </div>
                                                        </div>
                                                        <input id="dropzone-file" type="file" onChange={(e) => setPicture(e.target.files[0])} className="hidden" />
                                                    </label>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end text-sm mt-5">
                                        <button className="rounded-lg px-4 py-2 text-btn-500 bg-white border border-btn-500 font-bold" onClick={() => navigate('/admin/product')}>Cancel</button>
                                        {
                                            !spinner ?

                                                product_name && category_id && price && description && aturan_pakai && dosis && netto_stock && netto_unit && default_unit && stock_unit && picture ?
                                                    <button className=" rounded-lg px-4 py-2 ml-4 text-white bg-btn-500 font-bold" onClick={() => addProduct() }>Submit</button>
                                                    :
                                                    <button className=" rounded-lg px-4 py-2 ml-4 text-white bg-btn-500 bg-opacity-60 font-bold cursor-not-allowed" disabled>Submit</button>

                                                :
                                                <SpinnerComp width={"81px"} height={"38px"}/>
                                        }
                                        {/* {
                                            product_name && category_id && price && description && aturan_pakai && dosis && netto_stock && netto_unit && default_unit && stock_unit && picture ?
                                                <button className=" rounded-lg px-4 py-2 ml-4 text-white bg-btn-500 font-bold" onClick={() => { addProduct(); navigate('/admin/product') }}>Submit</button>
                                                :
                                                <button className=" rounded-lg px-4 py-2 ml-4 text-white bg-btn-500 bg-opacity-60 font-bold cursor-not-allowed" disabled>Submit</button>
                                        } */}
                                    </div>
                                </div>


                            </div>
                        </div>


                    </div>
                </div>
            </div>

            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {modalAddMainUnitOn && <ModalAddMainUnit setModalAddMainUnitOn={setModalAddMainUnitOn} unit_type={unit_type} />}
            {modalAddNettoUnitOn && <ModalAddNettoUnit setModalAddNettoUnitOn={setModalAddNettoUnitOn} unit_type={unit_type} />}
            {modalSetCategoryOn && <ModalSettingCategory setModalSetCategoryOn={setModalSetCategoryOn} category={category} />}
        </div>
    )
}

export default AddProductPage;