import gsap from 'gsap';

const loadingPace = () => {
  const loadingText = document.querySelector('.loader-wrap-heading .load-text');
  const loadingCont = document.querySelector('.loader-wrap-heading .cont');
  const loaderWrap = document.querySelector('.loader-wrap');
  const header = document.querySelector('header');
  const headerContainer = document.querySelector('header .container');

  if (loadingText && loadingCont) {
    gsap.to('.loader-wrap-heading .load-text, .loader-wrap-heading .cont', {
      delay: 1,
      y: -100,
      opacity: 0,
    });
  }

  if (loaderWrap) {
    gsap.to('.loader-wrap', {
      delay: 1.5,
      y: -100,
      opacity: 0,
      display: 'none',
    });
  }

  if (header) {
    gsap.to('header', {
      delay: 1.5,
      opacity: 1,
      visibility: 'visible',
    });
  }

  if (headerContainer) {
    gsap.to('header .container', {
      delay: 1.2,
      opacity: 1,
      visibility: 'visible',
    });
  }
};

export default loadingPace; 