class InitAppScript {
    constructor() {
        this.observer = null;
        this.lazySections = [];
        this.isScrolling = false;
        this.stickyHeaderInit = false;


        // swiperInited 
        this.swiperInited = false;
        this.swiperInitedSections = [];
    }

    // Инициализация приложения
    init() {
        this.cacheElements();
        this.setupIntersectionObserver();
        this.bindScrollLinks();
    }

    // Кэшируем элементы
    cacheElements() {
        this.lazySections = document.querySelectorAll('.lazy-section');
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '200px',
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isScrolling) {
                    this.renderSection(entry.target);
                }
            });
        }, options);

        this.lazySections.forEach(section => {
            this.observer.observe(section);
        });
    }

    bindScrollLinks() {
        document.addEventListener('click', async (e) => {
            const link = e.target.closest('.goTo');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                await this.handleSectionNavigation(targetId);
            }
        });
    }

    portfolioSwiperInit() {
        if (typeof Swiper === 'undefined') return;
        
        new Swiper('.swiper-portfolio', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 20,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: true,
            },
            loop: false,
            pagination: {
                el: '.swiper-portfolio-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-portfolio-button-next',
                prevEl: '.swiper-portfolio-button-prev',
            },
        });
        this.swiperInitedSections.push('portfolio');
    }

    reviewsSwiperInit() {
        if (typeof Swiper === 'undefined') return;

        new Swiper('.swiper-reviews', {
            grabCursor: true,
            centeredSlides: true,
            effect: 'creative',
            creativeEffect: {
                prev: {
                shadow: true,
                translate: [0, 0, -400],
                },
                next: {
                translate: ["100%", 0, 0],
                },
            },
            slidesPerView: 1,
            spaceBetween: 20,
            loop: false,
            autoHeight: true,
            pagination: {
                el: '.swiper-reviews-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-reviews-button-next',
                prevEl: '.swiper-reviews-button-prev',
            },
        });
        this.swiperInitedSections.push('reviewsSection');
    }

    async handleSectionNavigation(targetId) {
        if (this.isScrolling) return;
        this.isScrolling = true;

        try {
            const targetSection = document.querySelector(`.lazy-section[data-template="${targetId}"]`);
            if (!targetSection) return;
            await this.renderAllSectionsUpTo(targetSection);

            await new Promise(resolve => {
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    resolve();
                }, 50);
            });
        } finally {
            this.isScrolling = false;
        }
    }

    async renderAllSectionsUpTo(targetSection) {
        const sectionsArray = Array.from(this.lazySections);
        const targetIndex = sectionsArray.indexOf(targetSection);

        for (let i = 0; i <= targetIndex; i++) {
            const section = sectionsArray[i];
            if (!section.classList.contains('loaded')) {
                await this.renderSection(section);
                await new Promise(resolve => setTimeout(resolve, 30));
            }
        }
    }

    addSwiperSrc(){
        const checkSwiperInited = document.querySelector('#swiper-script');
        if(checkSwiperInited) return;

        const swiperStyles = document.createElement('link');
        swiperStyles.href = 'lib/swiper/swiper.css';
        swiperStyles.rel = 'stylesheet';
        swiperStyles.id = 'swiper-styles';
        document.head.appendChild(swiperStyles);

        const swiperScript = document.createElement('script');
        swiperScript.src = 'lib/swiper/swiper.js';
        swiperScript.id = 'swiper-script';
        swiperScript.onload = () => {
            this.reviewsSwiperInit();
            this.portfolioSwiperInit();
        }
        document.head.appendChild(swiperScript);
    }

    initFancyBox(){
        const fancyboxScriptCheck = document.querySelector('#fancybox-script');
        if(fancyboxScriptCheck) return;

        const fancyboxStyles = document.createElement('link');
        fancyboxStyles.href = 'lib/fancybox/fancybox.css';
        fancyboxStyles.rel = 'stylesheet';
        fancyboxStyles.id = 'fancybox-styles';
        document.head.appendChild(fancyboxStyles);

        const fancyboxScript = document.createElement('script');
        fancyboxScript.src = 'lib/fancybox/fancybox.js';
        fancyboxScript.id = 'fancybox-script';
        fancyboxScript.onload = () => {
            Fancybox.bind("[data-fancybox]", {
                Thumbs: false,
                Hash: false
            });
        }
        document.head.appendChild(fancyboxScript);
    }

    async renderSection(sectionElement) {
        return new Promise(resolve => {
            const templateId = sectionElement.getAttribute('data-template');

            const template = document.getElementById(templateId);
            
            if (template) {
                const content = template.content.cloneNode(true);
                sectionElement.innerHTML = '';
                sectionElement.appendChild(content);
                sectionElement.classList.add('loaded');
                
                if (this.observer) {
                    this.observer.unobserve(sectionElement);
                }

                this.initFancyBox()

                // add swiperStyles
                if(templateId === 'reviewsSection' || templateId === 'portfolio'){
                    this.addSwiperSrc();
                }            
                
                if(templateId === 'reviewsSection'){
                    this.reviewsSwiperInit();
                }

                if(templateId === 'portfolio'){
                    this.portfolioSwiperInit();
                }

                // Даём время на отрисовку
                setTimeout(resolve, 20);
            } else {
                resolve();
            }
        });
    }


    
    initSectionObserver() {
        const headerHeight =  0;
        const options = {
            root: null,
            rootMargin: `-${headerHeight}px 0px -${window.innerHeight - headerHeight - 100}px 0px`,
            threshold: 0
        };

        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log(entry.target);
                    const sectionId = entry.target.getAttribute('data-template');
                    this.setActiveHeaderLink(sectionId);
                }
            });
        }, options);

        this.lazySections.forEach(section => {
            this.sectionObserver.observe(section);
        });
    }

    setActiveHeaderLink(sectionId) {
        const stikyHeader = document.querySelector('.stiky-header');    
        if(!stikyHeader) return;

        const headerLinks = stikyHeader.querySelectorAll('.stiky-header-link');

        headerLinks.forEach(link => {
            const linkHref = link.getAttribute('href').replace('#', '');
            if (linkHref === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new InitAppScript().init();
});
