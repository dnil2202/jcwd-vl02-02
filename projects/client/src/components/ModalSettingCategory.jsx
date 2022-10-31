import React from "react";
import axios from "axios";
import { API_URL } from "../helper";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillEdit, AiFillDelete, AiFillPlusCircle, AiOutlineClose } from "react-icons/ai";
import SpinnerComp from "./Spinner";
import ModalDeleteCategory from "./ModalDeleteCategory";

const ModalSettingCategory = ({ setModalSetCategoryOn, category }) => {

    const [id, setId] = React.useState('');
    const [newCategory, setNewCategory] = React.useState('');
    const [addCat, setAddCat] = React.useState('');
    const [spinner, setSpinner] = React.useState(false);
    const [spinnerDelete, setSpinnerDelete] = React.useState(false);
    const [modalDeleteCategoryOn, setModalDeleteCategoryOn] = React.useState(false);
    const [deletedID, setDeletedID] = React.useState('');
    const [deletedName, setDeletedName] = React.useState('');


    const handleCancelClick = () => {
        setModalSetCategoryOn(false)
    }

    const onEdit = () => {
        setSpinner(true);
        axios.patch(API_URL + `/api/product/editcategory/${id}`, {
            category_name: newCategory
        })
            .then((res) => {
                setTimeout(() => {
                    toast.success('Edit category berhasil', {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    setId(null);
                    setSpinner(false);
                }, 3000);

            })
            .catch((error) => {
                toast.error('Edit category gagal', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setId(null)
                console.log('Edit category gagal :', error)
            })
    }

    const printCategory = () => {
        return category.map((val, idx) => {
            return <div key={val.idcategory}>
                {id == val.idcategory ?
                    <div className="mb-3 flex">
                        <input id="search" onChange={(e) => setNewCategory(e.target.value)} type="form" defaultValue={val.category_name} className="border rounded-lg py-1 px-2 text-sm w-full" />
                        {
                            newCategory ?
                                !spinner ?
                                    <button type="button" onClick={onEdit} className="ml-2 text-xs px-1.5 bg-btn-500 text-white rounded-md py-1 font-bold">
                                        Save
                                    </button>
                                    :
                                    <SpinnerComp width="40px" height={"30px"} />
                                :
                                <button type="button" disabled className="ml-2 text-xs px-1.5 bg-btn-500 bg-opacity-80 cursor-not-allowed text-white rounded-md py-1 font-bold">
                                    Save
                                </button>
                        }
                        {/* <button type="button" onClick={onEdit} className="ml-3 text-xs px-1.5 bg-btn-500 text-white rounded-md py-1 font-bold">
                            Save
                        </button> */}
                        <button type="button" onClick={() => { setId(''); setNewCategory('') }} className="ml-1 text-xs px-1.5 bg-btn-500 text-white rounded-md py-1 font-bold">
                            Cancel
                        </button>
                    </div>
                    :
                    <div className="flex justify-between mb-3">
                        <span>{val.category_name}</span>
                        <div>
                            <button type="button" onClick={() => setId(val.idcategory)} className="w-8 border border-btn-500 text-btn-500 rounded-md py-1 font-bold">
                                {<AiFillEdit size={16} className="mx-2" />}
                            </button>
                            {/* {
                                !spinnerDelete ? */}
                            <button type="button" className="ml-3 w-8 bg-btn-500 text-white rounded-md py-1 font-bold">
                                {<AiFillDelete onClick={() => onDelete(val.idcategory, val.category_name)} size={16} className="mx-2" />}
                            </button>
                            {/* :
                                    <SpinnerComp width="32px" height={"24px"}/>
                            } */}
                        </div>
                    </div>
                }

            </div>
        })
    }

    const onAdd = () => {
        // setSpinner(true);
        axios.post(API_URL + `/api/product/addcategory`, {
            category_name: newCategory
        })
            .then((res) => {
                if (res.data.message) {
                    // setTimeout(() => {
                    toast.success('Add category berhasil', {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    setAddCat('');
                    // setSpinner(false);
                    // }, 3000);
                } else {
                    toast.error('Add category gagal, category sudah tersedia', {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    setAddCat('')
                }
            })
            .catch((error) => {
                console.log('on add category gagal :', error)
            })
    }

    const onDelete = (idcategory, category_name) => {
        // setSpinnerDelete(true);
        setModalDeleteCategoryOn(true);
        setDeletedID(idcategory);
        setDeletedName(category_name);

        // axios.delete(API_URL + `/api/product/deletecategory/${idcategory}`)
        //     .then((res) => {
        //         if (res.data.message) {
        //             setTimeout(() => {
        //                 toast.success('Delete category berhasil', {
        //                     position: "bottom-center",
        //                     autoClose: 2000,
        //                     hideProgressBar: true,
        //                     closeOnClick: true,
        //                     pauseOnHover: true,
        //                     draggable: true,
        //                     progress: undefined,
        //                 })
        //                 // setSpinnerDelete(false);
        //             }, 3000);
        //         }
        //     })
        //     .catch((error) => {
        //         console.log('on delete product gagal :', error)
        //         toast.error('Delete category gagal', {
        //             position: "bottom-center",
        //             autoClose: 2000,
        //             hideProgressBar: true,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             draggable: true,
        //             progress: undefined,
        //         })
        //     })
    }

    return (

        <div className="bg-black bg-opacity-50 fixed inset-0 z-50">
            <div className="flex h-screen justify-center items-center">
                <div className="flex-col justify-center bg-white py-5 px-12 rounded-xl" style={{ width: '470px' }}>

                    {/* <!-- Modal content --> */}
                    <div className="pt-6">
                        <div className="flex justify-between text-center">
                            <div className="flex text-center mb-1">
                                <h3 className="text-xl font-medium text-gray-900">Setting category
                                    <button className="text-white bg-btn-500 ml-2 rounded-lg">
                                        <AiFillPlusCircle onClick={() => setAddCat(true)} size={16} />
                                    </button></h3>
                            </div>
                            <div>
                                <button onClick={handleCancelClick} className='text-gray-500'><AiOutlineClose size={16} /></button>
                            </div>
                        </div>
                        {/* <input id="search" type="form" onChange={(e) => setNewMainUnit(e.target.value)} className="border rounded-lg py-2 px-2 text-sm w-full" /> */}
                        <div className="my-7">
                            {printCategory()}
                        </div>
                        {
                            addCat ?
                                <div className="mb-3 flex">
                                    <input id="search" onChange={(e) => setNewCategory(e.target.value)} type="form" placeholder="Input new category here" className="border rounded-lg py-1 px-2 text-sm w-full" />
                                    {
                                        newCategory ?
                                            // !spinner ?
                                            <button type="button" onClick={onAdd} className="ml-3 text-xs px-1.5 bg-btn-500 text-white rounded-md py-1 font-bold">
                                                Save
                                            </button>
                                            // :
                                            // <SpinnerComp width="40px" height={"30px"} />
                                            :
                                            <button type="button" disabled className="ml-3 text-xs cursor-not-allowed px-1.5 bg-opacity-80 bg-btn-500 text-white rounded-md py-1 font-bold">
                                                Save
                                            </button>
                                    }
                                    {/* <button type="button" onClick={onAdd} className="ml-3 text-xs px-1.5 bg-btn-500 text-white rounded-md py-1 font-bold">
                                        Save
                                    </button> */}
                                    <button type="button" onClick={() => { setAddCat(''); setNewCategory('') }} className="ml-1 text-xs px-1.5 bg-btn-500 text-white rounded-md py-1 font-bold">
                                        Cancel
                                    </button>
                                </div>
                                :
                                <>
                                </>
                        }
                        {/* <div className="mt-4 flex justify-center">
                            <button onClick={handleCancelClick} className="rounded-lg px-4 py-2 text-btn-500 text-sm bg-white border border-btn-500 font-bold">Cancel</button>
                            <button onClick={handleOKClick} className=" rounded-lg px-4 py-2 ml-4 text-white text-sm bg-btn-500 font-bold">Submit</button>
                        </div> */}
                    </div>
                </div>
                {modalDeleteCategoryOn && <ModalDeleteCategory setModalDeleteCategoryOn={setModalDeleteCategoryOn} idcategory={deletedID} category_name={deletedName} />}
            </div>
        </div>
    );
}

export default ModalSettingCategory;