'use client';
import React, { useState, useEffect } from 'react';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { api } from '../../services/api';

// Default data to use as fallback
const defaultTestimonialsData = [
  {
    _id: '1',
    name: 'John Doe',
    company: 'Tech Corp',
    position: 'Founder',
    testimonial: 'Amazing service and outstanding results!',
    imageUrl: '/assets/imgs/testim/t1.jpg',
  },
  {
    _id: '2',
    name: 'Jane Smith',
    company: 'Design Studio',
    position: 'Creative Director',
    testimonial: 'Exceptional quality and professional team.',
    imageUrl: '/assets/imgs/testim/t2.jpg',
  },
];

function Testimonials() {
  const [testimonials, setTestimonials] = useState(defaultTestimonialsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await api.getTestimonials();
        // Ensure we always have an array with at least the default data
        const data = Array.isArray(response.data) && response.data.length > 0 
          ? response.data.map(testimonial => ({
              ...testimonial,
              // Ensure imageUrl exists and has the correct format
              imageUrl: testimonial.imageUrl || testimonial.image || '/assets/imgs/testim/placeholder.jpg'
            }))
          : defaultTestimonialsData;
        setTestimonials(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        setError('Failed to load testimonials');
        setTestimonials(defaultTestimonialsData);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const swiperOptions = {
    modules: [Pagination, Navigation],
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: '.testimonials-minim .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.testimonials-minim .swiper-button-next',
      prevEl: '.testimonials-minim .swiper-button-prev',
    },
  };

  if (loading) {
    return (
      <section className="testimonials">
        <div className="container section-padding bord-top-grd">
          <div className="text-center">Loading testimonials...</div>
        </div>
      </section>
    );
  }

  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="testimonials">
      <div className="container section-padding bord-top-grd">
        {error && (
          <div className="alert alert-warning text-center mb-4">
            {error}
          </div>
        )}
        <div className="row">
          <div className="col-lg-4 md-mb50">
            <div className="img-full">
              <div className="fit-img">
                <img src="/assets/imgs/testim/bg.jpg" alt="" />
              </div>
              <div className="fix-img">
                <img src="/assets/imgs/arw1.png" alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="cont-full">
              <div
                className="testim-swiper"
                data-carousel="swiper"
                data-loop="true"
                data-space="30"
              >
                <Swiper
                  {...swiperOptions}
                  id="content-carousel-container-unq-testim"
                  className="swiper-container"
                  data-swiper="container"
                >
                  {testimonials.map((testimonial) => (
                    <SwiperSlide key={testimonial._id}>
                      <div className="item">
                        <div className="content">
                          <div className="text">
                            <p className="fz-30">{testimonial.testimonial}</p>
                          </div>
                          <div className="info d-flex align-items-center pt-40 mt-40 bord-thin-top">
                            <div>
                              <div className="fit-img circle">
                                <img 
                                  src={testimonial.imageUrl} 
                                  alt={testimonial.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/imgs/testim/placeholder.jpg';
                                  }}
                                />
                              </div>
                            </div>
                            <div className="ml-20">
                              <h5>{testimonial.name}</h5>
                              <span className="sub-title main-color">
                                {testimonial.position} {testimonial.company && `at ${testimonial.company}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="256.721"
                  height="208.227"
                  viewBox="0 0 256.721 208.227"
                  className="qout-svg"
                >
                  <path
                    d="M-1609.279,1705.773v-92.4q0-45.751,26.474-74.742t73.52-28.991v37.886q-29.762,0-42.771,18.216t-13.009,47.754v13.009h55.78v79.269Zm147.585,0v-92.4q0-45.751,26.474-74.742t73.52-28.991v37.886q-29.762,0-42.771,18.216t-13.009,47.754v13.009h55.78v79.269Z"
                    transform="translate(1609.279 -1509.636)"
                    fill="#fff"
                    opacity="0.04"
                  />
                </svg>
              </div>
              <div className="swiper-arrow-control control-abslout">
                <div className="swiper-button-prev">
                  <span className="ti-arrow-left"></span>
                </div>
                <div className="swiper-button-next">
                  <span className="ti-arrow-right"></span>
                </div>
              </div>
              <div className="circle-blur">
                <img src="/assets/imgs/patterns/blur1.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
