import React, {useState} from 'react'
import "../styles/Login.css"
import "../styles/headline.css"
import "../styles/inputField.css"
import { motion } from "framer-motion";
import PasswordChecklist from "react-password-checklist"
import * as yup from "yup"
import {
  MdFastfood,
  MdCloudUpload,
  MdDelete,
  MdFoodBank,
  MdAttachMoney,
} from "react-icons/md";

import Loader from "./Loader";
import { app } from "../firebase.config";
import { Link, Navigate } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { NavLink , useNavigate} from "react-router-dom";
import img1 from '../img/logo.png'
import { FaFile,FaTextWidth,FaLaptopCode } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { GoEllipsis } from "react-icons/go";
import { IoIosEyeOff } from "react-icons/io";
import { storage } from "../firebase.config";
import {saveUser,getAllUser } from "../utils/firebaseFunctions";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where 
} from "firebase/firestore";
import { firestore } from "../firebase.config";

import InputField from '../components/InputField';
import Avatar from "../img/avatar.png";
import { useEffect } from 'react';

const EditUser = () => {
  const [{ user, cartShow, cartItems }] = useStateValue();
  const [imageAsset, setImageAsset] = useState(null);
  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [userData, setuserData] = useState([]);
    const [emailupdate, setEmailupdate] = useState('');
    const [nameupdate, setNameupdate] = useState('');
   const [getemailupdate, setgetemailupdate]=useState('');
   const [err, setErr] = useState(false);
    const [passwordupdate, setPasswordupdate] = useState('');
    const getemails= [];
    var data = userData?.filter(val => val.email === user.email)
    console.log(data); 
    getemails.push(data[0])
    console.log(getemails[0]); 
    const addrefUser = query(collection(firestore, "User"), where("email", "==", user.email));;
    const updateuser = async (uid) => {
     
      let userArray = {};
      if (emailupdate !== "" && passwordupdate !== "" && nameupdate !== "") {
        userArray = {
          email: emailupdate,
          password: passwordupdate,
          name: nameupdate,
        };
      }
      if (emailupdate !== "" && passwordupdate === "" && nameupdate === "") {
        userArray = {
          email: emailupdate,
        };
      }
      if (emailupdate === "" && passwordupdate !== "" && nameupdate === "") {
        userArray = {
          password: passwordupdate,
        };
      }
      if (emailupdate === "" && passwordupdate === "" && nameupdate !== "") {
        userArray = {
          name: nameupdate,
        };
      }
      if (emailupdate === "" && passwordupdate !== "" && nameupdate !== "") {
        userArray = {
          name: nameupdate,
          password: passwordupdate,
        };
      }
      if (emailupdate !== "" && passwordupdate === "" && nameupdate !== "") {
        userArray = {
          name: nameupdate,
          email: emailupdate,
        };
      }
      if (emailupdate !== "" && passwordupdate !== "" && nameupdate === "") {
        userArray = {
          password: passwordupdate,
          email: emailupdate,
        };
      }
       const updatedocument = doc(firestore, "User", uid);
      await updateDoc(updatedocument, userArray);
      navigate("/login")
      // window.location.reload(true);
      console.log("updated",userArray,uid)
    };
    const getUser = async () => {
      const getData = await getDocs(addrefUser);
      console.log(getData);
      setuserData(getData.docs.map((doc) => ({ id: doc.id })));
      console.log(userData);
    };
    useEffect(() => {
      getUser();
    }, []);
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className=''>
     {/* <div className="container">
       
        <img src={img1} alt="" className='login-logo' />
     
     </div> */}
     <div>
     <div className="headline" >
      {/* <div className="center-container">
        Welcome Back
       
      </div> */}
      {fields && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
              alertStatus === "danger"
                ? "bg-red-400 text-red-800"
                : "bg-emerald-400 text-emerald-800"
            }`}
          >
            {msg}
          </motion.p>
        )}
      {/* <p className="paraLine" >
      Login to continue using account
      </p> */}
    </div>
    </div>
        <div className="login_container lg:w-[900px] lg:max-h-fit">

            
            
              <div>
            
              <div className="upload group flex justify-center lg:ml-40 md:ml-40 sm:ml-40 items-center flex-col border-2 border-solid  w-44 h-40 cursor-pointer rounded-lg border-[#ea580c]">
         
            <>
              {!user ? (
                <>
                  <label className="w-full h-40 flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700 color-[#ea580c]" />
                      <p className="text-gray-500 hover:text-gray-700">
                    Upload your image
                      </p>
                    </div>
                    <input
                      type="file"
                      name="uploadimage"
                      accept="image/*"
                      // onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="relative h-full">

                    <img
                    src={ user.photoURL || user.imageURL}
                      // src={imageAsset}
                      alt="uploaded image"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                      // onClick={deleteImage}
                    >
                      <MdDelete className="text-white" />
                    </button>
                  </div>
                </>
              )}
            </>
         
        </div>  
              {/* <InputField
            icon={FaFile}
            name="image"
            type="file"
         
            placeholder="Select image"
            value={imageAsset}
            changeHandler={uploadImage}
            
          /> */}

          <InputField
            icon={FaEnvelope}
            name="Name"
            type="Name"
            placeholder={user?.name} 
            value={nameupdate}
             changeHandler={e=>setNameupdate(e.target.value)}
          />   
          
                <InputField
            icon={FaEnvelope}
            name="email"
            type="email"
            placeholder="Change email"
            value={emailupdate}
             changeHandler={e=>setEmailupdate(e.target.value)}
          />   
                
                <InputField
            icon={GoEllipsis}
            icon2={IoIosEyeOff}
            name="password"
            type="password"
            placeholder="Change password"
            value={passwordupdate}
            changeHandler={e => setPasswordupdate(e.target.value)}
           
          />
           <PasswordChecklist
                rules={["minLength","specialChar",
                        "number","capital"]}
                minLength={8}
                value={passwordupdate}
               
            />
                
                </div>
               
                {/* {userData.map((val,id)=>{ */}

               
                {/* <button type='submit' onClick={() => updateuser(getemails[0])}   className='login_signinButton'>Update</button> */}
                  
              {/* })} */}

                 {userData.map((val,id)=>(

               
                 <button type='submit' onClick={() => updateuser(val.id)}   className='login_signinButton'> Update</button>
                  
                  ))}

              
            
           
        </div>
    </div>
    </div>
  );
};

export default EditUser;
