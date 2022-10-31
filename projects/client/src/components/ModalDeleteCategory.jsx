import React from "react";
import axios from "axios";
import { API_URL } from "../helper";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalDeleteCategory = ({ setModalDeleteCategoryOn, idcategory, category_name }) => {

    const [newMainUnit, setNewMainUnit] = React.useState('');

    const handleOKClick = () => {
        onDelete(idcategory)
        setModalDeleteCategoryOn(false)
    }
    const handleCancelClick = () => {
        setModalDeleteCategoryOn(false)
    }

    const onDelete = (idcategory) => {
        // setSpinnerDelete(true);
        axios.delete(API_URL + `/api/product/deletecategory/${idcategory}`)
            .then((res) => {
                if (res.data.message) {
                    // setTimeout(() => {
                        toast.success('Delete category berhasil', {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                        // setSpinnerDelete(false);
                    // }, 3000);
                }
            })
            .catch((error) => {
                console.log('on delete product gagal :', error)
                toast.error('Delete category gagal', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })
    }

    return (

        <div className="bg-black bg-opacity-50 fixed inset-0 z-50">
            <div className="flex h-screen justify-center items-center">
                <div className="flex-col justify-center bg-white py-5 px-12 rounded-xl w-96" style={{ height: '250px' }}>

                    {/* <!-- Modal content --> */}
                    <div className="pt-6">
                        <h3 className="mb-5 text-xl font-bold text-gray-900">Delete Category?</h3>
                        <div className="text-left bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg py-2.5 px-3">
                            {category_name}
                        </div>
                        <p className="text-gray-500 mt-3">Delete action cannot be undone</p>
                        {/* <input id="search" type="form" placeholder="Input nama baru untuk main unit" className="border rounded-lg py-2 px-2 text-sm w-full" /> */}
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleCancelClick} className="rounded-lg px-4 py-2 text-btn-500 text-sm bg-white border border-btn-500 font-bold">Cancel</button>
                            <button onClick={handleOKClick} className=" rounded-lg px-4 py-2 ml-4 text-white text-sm bg-btn-500 font-bold">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalDeleteCategory;