import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import '@/../css/swiper.css';

// import required modules
import {Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';


import { defaultTheme } from './DefaultThemeProvider';

export default function ImageCaroucel({ imageUrls }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const palette = defaultTheme().palette

  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': 'rgba(255,255,255, 2)',
          '--swiper-pagination-color': palette.info.main,
        }}
        loop={true}
        // autoplay={{
        //   delay: 3000,
        //   disableOnInteraction: true,
        // }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Autoplay, FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
      { imageUrls.map( (imageUrl, i) => (
        <SwiperSlide key={i}>
          <img src={imageUrl} />
        </SwiperSlide>
      ) ) }
      </Swiper>


      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
      { imageUrls.map( (imageUrl, i) => (
        <SwiperSlide key={i}>
          <img src={imageUrl} />
        </SwiperSlide>
      ) ) }
      </Swiper>
    </>
  );
}
