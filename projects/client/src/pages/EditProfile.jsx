import React, { useState, useRef, useEffect } from 'react'
import Tabs  from '../components/Tabs'
import { useSelector, useDispatch } from 'react-redux'
import { API_URL } from '../helper'
import { UpdateProfile } from '../action/useraction';
import PhoneInput from 'react-phone-number-input'
import Avatar from '../components/Avatar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { format } from 'date-fns'
import Loading from '../components/Loading';
import { Helmet } from 'react-helmet';



const EditProfile = () => {

    // DanielHS APKG2-13 dan APKG2-14
    
    const dispatch = useDispatch()
    const hiddenFileInput = useRef(null)

    const [disabled,setDisabled]=useState(true)
    const [loading, setLoading]=useState(false)

    
    let{fullname,username,email,phone_number, profile_pic, gender, birthdate}=useSelector((state)=>{
        return{
            fullname:state.userReducer.fullname,
            username:state.userReducer.username,
            email:state.userReducer.email,
            phone_number:state.userReducer.phone_number,
            gender:state.userReducer.gender,
            birthdate:state.userReducer.birthdate,
            profile_pic:state.userReducer.profile_pic,
        }
    })
    

    const [input, setInput]=useState({
        fullname:'',
        username:'',
        email:'',
        gender:'',
        birthdate:'',
        phone_number: ''
    })
    const[newProfilPict, setNewProfilPict]=useState('')


    useEffect(()=>{
            setInput({
                fullname: fullname,
                username:username,
                email:email,
                gender:gender?gender:'select gender',
                birthdate:format(new Date(birthdate), 'yyyy-MM-dd'),
                phone_number: phone_number,
            })
    },[fullname,username,email,phone_number, gender, birthdate])

    const updateProfile = ()=>{
        setLoading(true)
        if(input.fullname.length > 0 && input.username.length > 0 && input.email.length>0 && input.phone_number !== 'undefined' && input.birthdate.length>0 &&input.email.includes('@') && input.email.includes('.com')){

            let medcarelog = localStorage.getItem('medcarelog')
            let formData = new FormData()
    
            // if(input.email === email){
                formData.append('data',JSON.stringify(input))
                formData.append('images',newProfilPict)
                axios.patch(API_URL+`/api/user/edit-profile`,formData,{
                    headers:{
                        'Authorization': `Bearer ${medcarelog}`
                    }
                })
                .then((res)=>{
                    setLoading(false)
                    dispatch(UpdateProfile(res.data))
                    if(email!= input.email){
                        toast.info('Success to change your email cek your inbox ', {
                            theme: "colored",
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                        })
                    }else{
                        toast.success('Success', {
                            theme: "colored",
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                        })
                    }
                    setDisabled(true)
                    if(email != input.email){
                        setInput({
                            fullname: fullname,
                            username:username,
                            email:email,
                            gender:gender?gender:'select gender',
                            birthdate:format(new Date(birthdate), 'yyyy-MM-dd'),
                            phone_number: phone_number,
                        })
                        setLoading(false)
                    }
                })
                .catch((err)=>{
                    setLoading(false)
                    toast.error(`${err.response.data.message}`, {
                        theme: "colored",
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    })
                })
        }else{
            toast.error(`${'Wrong input format'}`, {
                theme: "colored",
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            })
            setLoading(false)
        }
    }

    const onChange = (e)=>{
        const {value,name}=e.target
        setInput({...input, [name]:value})
    }

    const onCancel = ()=>{
        setInput({
            fullname:fullname,
            username:username,
            email:email,
            gender:gender,
            birthdate:format(new Date(birthdate), 'yyyy-MM-dd'),
            phone_number: phone_number
        })
        setNewProfilPict('')
        setDisabled(true)
    }

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const onChangeNewProfilePic = (files) => {
        if(files.size>=1000000 ){
            return toast.error(`File size max 1 Mb`, {
                theme: "colored",
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            })
        }
        switch(files.type.split('/')[1].toLowerCase()){
            case 'jpg':
                case'png':
                    case'gif':
                return setNewProfilPict(files)
            }
            return toast.error(`Format file must jpg,png,gif`, {
                theme: "colored",
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            })
    }

    return (
        <div>
            <Helmet>
                <title>Profile</title>
                <meta name="description" content="Edit your profile" />
            </Helmet>
                <Tabs/>
            <div className='container mx-auto px-16'>
                <div className='container mx-auto lg:px-96'>
                            <div className='flex justify-center mt-5'>
                                {
                                    profile_pic || newProfilPict ?
                                    <>
                                    <Avatar
                                        onClick={handleClick}
                                        src={newProfilPict ? URL.createObjectURL(newProfilPict) :API_URL + profile_pic}
                                        w={20}
                                        h={20}
                                        b={1}
                                        width={6}
                                        height={6}
                                    />
                                    </>
                                    :
                                    <>
                                    <Avatar
                                        onClick={handleClick}
                                        src={'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                        w={20}
                                        h={20}
                                        b={1}
                                        width={6}
                                        height={6}
                                    />
                                    </>
                                }
                                <input onChange={(e) => onChangeNewProfilePic(e.target.files[0])} type='file' ref={hiddenFileInput} style={{ display: 'none' }} disabled={disabled} className='disabled:cursor-not-allowed' />
                            </div>
                            <form>
                                
                                {/* fullname */}
                                <label className=' block mb-3 '>
                                    <span className='block text-sm font-medium text-slate-700 mb-1'>Fullname</span>
                                    <input className='border border-gray-400 w-full rounded-md px-2 h-10 font-Public disabled:text-gray-600 disabled:cursor-not-allowed' name='fullname' onChange={onChange} disabled={disabled}  value={input.fullname} />
                                </label>
                                {/* Username */}
                                <label className=' block mb-3 '>
                                    <span className='block text-sm font-medium text-slate-700 mb-1 font-Public'>Username</span>
                                    <input className='border border-gray-400 w-full rounded-md px-2 h-10 font-Public disabled:text-gray-600 disabled:cursor-not-allowed' name='username' value={input.username.trim()} disabled={disabled}  onChange={onChange} />
                                </label>
                                {/* Email */}
                                <label className='block mb-3'>
                                    <span className='block text-sm font-medium text-slate-700 mb-1 font-Public'>Email</span>
                                    <input className='border border-gray-400 w-full rounded-md px-2 h-10 font-Public disabled:text-gray-600 disabled:cursor-not-allowed' name='email' value={input.email} disabled={disabled}  onChange={onChange} />
                                </label>
                                {/* Phone */}
                                <label className='block mb-3'>
                                    <span className='block text-sm font-medium text-slate-700 mb-1 font-Public'>Phone Number</span>
                                    <PhoneInput international defaultCountry='ID' type='tel' value={input.phone_number} name='phone_number' onChange={(a) => setInput({ ...input, phone_number: a+'' })} disabled={disabled} className='disabled:text-gray-600'  />
                                </label>
                                {/* Birth date */}
                                <label className='block mb-3'>
                                    <span className='block text-sm font-medium text-slate-700 mb-1 font-Public'>Birth Date</span>
                                    <input className='border border-gray-400 w-2/6 rounded-md px-2 h-10 font-Public disabled:text-gray-600 disabled:cursor-not-allowed' value={input.birthdate} name='birthdate' onChange={onChange} disabled={disabled}  type='date' />
                                </label>
                                {/* gender*/}
                                <label className='block mb-3'>
                                    <span className='block text-sm font-medium text-slate-700 mb-1 font-Public'>Gender</span>
                                    <select onChange={onChange} value={input.gender} disabled={disabled}  name='gender' className='h-10 rounded-md font-Public disabled:text-gray-600 disabled:cursor-not-allowed'>
                                        <option disabled value='select gender' className='font-Public'>Select Gender</option>
                                        <option value='male' className='font-Public'>Male</option>
                                        <option value='female' className='font-Public'>Female</option>
                                    </select>
                                </label>
                            </form>
                            {
                                disabled ?
                                <button className=' mt-5 border bg-teal-500 hover:bg-teal-700 rounded-md py-2 text-white px-10 font-Public' onClick={()=>setDisabled(false)}>Edit</button>
                                :
                                <>
                                <button className=' mt-5 border bg-teal-500 hover:bg-teal-700 rounded-md py-2 text-white px-10 font-Public' onClick={updateProfile}>Save</button>
                                <button className=' mt-5 border bg-red-500 hover:bg-red-700 rounded-md py-2 ml-2 text-white px-10 font-Public' onClick={onCancel}>Cancel</button>
                                </>
                            }
                        </div>
                {
                loading &&
            <div className='absolute top-1/3 right-[45%]'>
                <Loading loading={loading}/>
            </div>
            }
                <ToastContainer />
            </div>
        </div>
    )
}

export default EditProfile;