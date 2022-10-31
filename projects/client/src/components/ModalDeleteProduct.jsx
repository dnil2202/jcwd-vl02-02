import React from "react";
import axios from "axios";
import { API_URL } from "../helper";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SpinnerComp from "./Spinner";

const ModalDeleteProduct = ({ setModalDeleteOn, idproduct, nameDeleted, setLoading, setAllChecked, setProductChecked, onClose }) => {

    const [spinner, setSpinner] = React.useState(false);

    const handleOKClick = () => {
        setSpinner(true);
        if (idproduct.length > 1) {
            setAllChecked(false);
            setProductChecked([]);
            onClose("false");
            return idproduct.map((val, idx) => {
                onDelete(val, idx)
            })
        } else {
            onDelete(idproduct, 0);
            setAllChecked(false);
            setProductChecked([]);
            onClose("false");
        }
    }
    const handleCancelClick = () => {
        setModalDeleteOn(false)
    }

    const onDelete = (id, idx) => {
        axios.delete(API_URL + `/api/product/delete/${id}`)
            .then((res) => {
                setTimeout(() => {
                    if (res.data.message) {
                        if (idx + 1 == idproduct.length) {
                            toast.success('Delete data success', {
                                position: "bottom-center",
                                autoClose: 2000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            })
                        }
                        setSpinner(false);
                        setLoading(false);
                        setModalDeleteOn(false);
                    }
                }, 3000);
            })
            .catch((error) => {
                console.log('on delete product gagal :', error)
                toast.error('Delete data failed', {
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

    const printName = () => {
        if (idproduct.length > 1) {
            return nameDeleted.map((val, idx) => {
                return <>
                    <p className="py-0.5">{val} </p>
                    {
                        idx + 1 != 10 ?
                            <hr className="flex bg-white border-1" />
                            :
                            <></>
                    }
                </>
            })
        } else {
            return <p>{nameDeleted}</p>
        }
    }

    return (

        <div className="bg-black bg-opacity-50 fixed inset-0 z-50">
            <div className="flex h-screen justify-center items-center">
                <div className="flex-col justify-center bg-white py-5 px-16 rounded-xl w-fit">

                    {/* <!-- Modal content --> */}
                    <div className="pt-6 text-center">
                        <h3 className="mb-5 text-xl font-bold text-gray-900">Delete Product?</h3>
                        {/* <input disabled defaultValue={nameDeleted} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Anjuran dosis penggunaan obat" required /> */}
                        <div className="text-left bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg py-2.5 px-3">
                            {printName()}
                        </div>
                        <p className="text-gray-500 mt-3">Delete action cannot be undone</p>
                        <div className="mt-5 flex">
                            <button onClick={handleCancelClick} className="w-28 rounded-lg px-4 py-2 text-btn-500 bg-white border border-btn-500 font-bold">Cancel</button>

                            {
                                !spinner ?
                                    <button onClick={handleOKClick} className="w-28 ml-4 rounded-lg px-4 py-2 text-white bg-btn-500 font-bold">
                                        Delete
                                    </button>

                                    :
                                    <SpinnerComp width="112px" height={"42px"}/>
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ModalDeleteProduct;