(function () {

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  ScrollTrigger.normalizeScroll(true)

  // Wait for the DOM to be ready
  const initSmoother = () => {
    const wrapper = document.getElementById('smooth-wrapper');
    const content = document.getElementById('smooth-content');
    
    if (!wrapper || !content) {
      console.warn('ScrollSmoother: Wrapper or content elements not found');
      return;
    }

    // create the smooth scroller
    let smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      wrapper: wrapper,
      content: content,
      normalizeScroll: true
    });
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoother);
  } else {
    initSmoother();
  }
})()