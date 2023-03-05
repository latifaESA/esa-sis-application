/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: pages\index.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

/* eslint-disable @next/next/no-img-element */
// import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
// import { useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { ApplyNow } from '../components/ApplyNow';
import selection_data from '../utilities/selection_data';
// import axios from 'axios';
// import decrypt from '../utilities/encrypt_decrypt/decryptText';
// import { useEffect } from 'react';
// import { useUserStore } from '../context/userContext';
// import NextLink from 'next/link';
// import Link from 'next/link';

// import { useEffect} from 'react';
import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { appSetting} from '../redux/slices/appSlice';
// import LoginScreen from './user/login'
export default function Home() {

const [carousel,setCarousel]=useState([]);

useEffect(() => {
  setCarousel(selection_data.carouselList);
   }, []);

  //  const dispatch = useDispatch();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         '/api/controller/settingdata'
  //       );
  //       const incomingData = JSON.parse(decrypt(response.data.data));
        
  //       if (response.status === 200) {
        
  //         dispatch(appSetting({
  //           auto_Save_Timing: incomingData.setting[0].auto_Save_Timing * 60 * 1000,
  //           disapearing_Message_Time:incomingData.setting[0].message_disapear_timing * 1000,
  //           max_characters_count:incomingData.setting[0].max_characters_count,
  //           education_Year_of_Acquisition_Limit:incomingData.setting[0].Year_of_Acquisition_Limit,
  //           personalinfo_dob_min:incomingData.setting[0].personalinfo_dob_min.split('T')[0],
  //           personalinfo_dob_max:incomingData.setting[0].personalinfo_dob_max.split('T')[0],
  //           upload_file_single_size:incomingData.setting[0].upload_file_single_size *1024 *1024,
  //           upload_file_total_size:incomingData.setting[0].upload_file_total_size *1024 *1024,
  //           logger_expiry_day:incomingData.setting[0].logger_expiry_day + 'd',
  //           logger_max_file_size:incomingData.setting[0].logger_max_file_size + 'm',
  //           upload_file_directory_name:incomingData.setting[0].upload_file_directory_name,
  //           carouselList:incomingData.setting[0].carouselList,
  //           esa_logo:incomingData.setting[0].esa_logo,
  //           login_bg:incomingData.setting[0].login_bg,
  //           MBA_recommendation_letter:incomingData.setting[0].MBA_recommendation_letter,
  //           EMBA_recommendation_letter:incomingData.setting[0].EMBA_recommendation_letter,


  //         }));
  //         setCarousel(incomingData.setting[0].carouselList);
  //            }
      
          
  //       }
  //      catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


 
  return (
    <>
      <Head>
        <title>ESA Business School - SIS Application</title>
      </Head>
      <Carousel
        className="mt-8 rounded-xl border-8 border-gray-300 h-[200px] md:h-[600px]"
        navButtonsAlwaysVisible={true}
        activeIndicatorIconButtonProps={{
          style: {
            color: 'blue',
          },
        }}
      >
        {carousel.map((item, i) => (
          <Image key={i} src={item} alt="carousel" fill priority={true} />
        ))}
      </Carousel>
      
      <ApplyNow /> 
      {/* <LoginScreen/> */}

    </>
  );
}
