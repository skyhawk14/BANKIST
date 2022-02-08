'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//button scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', (e) => {
  //1st method
  // const s1coords = section1.getBoundingClientRect();
  // window.scrollTo({ left:s1coords.left + window.scrollX,top: s1coords.top + window.scrollY ,behavior:'smooth'});

  //2nd method
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page navigation
//without eent delegation
// document.querySelectorAll('.nav__link').forEach(node => {
//   let ab = node;
//   node.addEventListener('click', (e) => {
//     e.preentDefault();
//     const id = ab.getAttribute('href');
//     document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//with eent delegation
//1. Add eent listener to common parent
//2. determine what elements originated the eent
//3.
//eent delegation is a good way to handle the eents on the element which has not been rendered on the screen
//default behavior of addEventListener is bubble up
document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) { 
    e.preentDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
  }
});


//tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabs.forEach(t => { 
  t.addEventListener('click',function (e) {
    //find the current active tab
    let activeTab = tabsContainer.querySelector('.operations__tab--active');
    if (activeTab && activeTab == e.target) return;
    activeTab.classList.remove('operations__tab--active');
    this.classList.add('operations__tab--active');
    let tab = Number.parseInt(this.dataset.tab);
    //show the active tab
    tabsContent.forEach((elem, i) => { 
      elem.classList.remove('operations__content--active')
      if (tab == i + 1) {
        elem.classList.add('operations__content--active');
      }
    })
  });
})

//menu fade animation
// const menuItems = document.querySelectorAll('.nav__item');
// console.log(menuItems);
// menuItems.forEach(function (el) {
//   el.addEventListener('mouseover', function () {
//     console.log(this);
//   });
// });


const handleHover = function(e){ 
  let opacityVal = this;
  if (e.target.classList.contains('nav__link')) { 
    const link = e.target;
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');
    siblings.forEach(elem => {
      if (elem !== link) {
        elem.style.opacity = opacityVal;
      }
    });

    logo.style.opacity = opacityVal;
  }
}
//this type of function binding can have only one argument
document.querySelector('.nav').addEventListener('mouseover', handleHover.bind(0.5));
document.querySelector('.nav').addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation
const intialCoord = section1.getBoundingClientRect();

//not efficient and this event must be avoided
//M-1
// window.addEventListener('scroll', function (ev) {
//   if (window.scrollY >= intialCoord.top) {
//     //add sticky class
//     document.querySelector('.nav').classList.add('sticky');
//   } else { 
//     //remove sticky class
//     document.querySelector('.nav').classList.remove('sticky');
//   }
// });

//sticky navigation : Intersection observer  api
//M-2
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

let stickyNavigationOptions = {
  root: null,
  rootMargin: `${navHeight}px`,
  threshold: 0
}
let stickyNavigationObserver = new IntersectionObserver((entries) => { 
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else { 
    nav.classList.remove('sticky');
  }
}, stickyNavigationOptions);

stickyNavigationObserver.observe(header);

// Reveal sections
const sections = document.querySelectorAll('.section');
//section--hidden

let sectionsReveal = new IntersectionObserver((entries,observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}, {
  root: null,
  threshold: 0.20,
});

sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionsReveal.observe(section);
});

//image lazy loading
const imagesForLazyLoading = document.querySelectorAll('.features__img');
let imageLazyLoading = new IntersectionObserver((entries, observer) => {
  const [entry] = entries;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    this.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
  // console.log(entry,entry.target);
}, {
  root: null,
  threshold: 0.5,
  rootMargin:'-200px',
});

imagesForLazyLoading.forEach(img => {
  imageLazyLoading.observe(img);
});

//slider
const slider = () => {
  
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.dots');
  let totalSlides = slides.length;
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i)}%)`;
  });
  
  const showSlide = function (slideNumber) { 
    slides.forEach((slide,i) => {
      slide.style.transform = `translateX(${100 * (i - slideNumber)}%)`;
    });
  }
  const showDotsActive = function (currentDot) { 
    slides.forEach((_, i) => { 
      console.log(i);
      document.querySelector(`button[data-slide='${i}']`).classList.remove('dots__dot--active');
    })
    console.log(currentDot);
    document.querySelector(`button[data-slide='${currentDot}']`).classList.add('dots__dot--active');
  }
  const goToNext = function () { 
    currentSlide++;
    if (currentSlide >= totalSlides) {
      currentSlide = 0;
    }
    showSlide(currentSlide);
    showDotsActive(currentSlide);
  }
  const goToPrev = function () { 
    currentSlide--;
    if (currentSlide < 0) { 
      currentSlide = totalSlides - 1;
    }
    showSlide(currentSlide);
    showDotsActive(currentSlide);
  }
  const goToSlideFromDot = function () {
    currentSlide = this.dataset.slide;
    showSlide(currentSlide);
    showDotsActive(currentSlide);
  }  
  
  function init() { 
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i)}%)`;
    });
    slides.forEach((_,i) => {
      dotsContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide=${i}></button>`);
      document.querySelector(`button[data-slide='${i}']`).addEventListener('click',goToSlideFromDot);
    });
    showSlide(0);
    showDotsActive(0);
    document.querySelector('.slider__btn--left').addEventListener('click', goToPrev);
    document.querySelector('.slider__btn--right').addEventListener('click', goToNext);
  }
  init();
}
slider();