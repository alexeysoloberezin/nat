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
        this.sendFormInit();
    }

    sendFormInit(){
        const BOT_TOKEN = '7932502640:AAHF71xR1Mk3sKrlJ3OMY6nIP_P93n7jocw';
        const CHAT_ID = '-4939865516';
        const WHATSAPP_NUMBER = '79833634604';
      
        document.addEventListener('submit', async (e) => {
          const form = e.target.closest('.tg-form');
          if (!form) return;
      
          e.preventDefault();
      
          const formData = new FormData(form);
          const msg = [...formData.entries()]
            .filter(([key, val]) => key !== 'whatsapp' && val.toString().trim() !== '')
            .map(([key, val]) => `${key}: ${val}`)
            .join('\n');
      
          const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&parse_mode=HTML&text=${encodeURIComponent(msg)}`;
          await fetch(tgUrl);
      
          const sendToWhatsapp = form.querySelector('input[name="whatsapp"]')?.checked;
          if (sendToWhatsapp) {
            const waText = `Здравствуйте, хочу заказать у вас организацию мероприятия`;
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
          }
      
          form.reset();
          alert('Отправлено!');
        });
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
                const tabId = link.getAttribute('data-tab');

                await this.handleSectionNavigation(targetId);

                if(tabId){
                    setTimeout(() => {
                        InitTabs(tabId);
                    }, 100);
                }
            }
        });
    }

    initImages(){
        // const grid = document.querySelector('.masonry');
        // imagesLoaded(grid, () => {
        //   new Masonry(grid, {
        //     itemSelector: '.brick',
        //     columnWidth: 200,
        //     gutter: 16,
        //     percentPosition: true
        //   });
        // });
    }

    portfolioSwiperInit() {
        if (typeof Swiper === 'undefined') return;
        
        new Swiper('.swiper-portfolio', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            autoHeight: true,
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

    addStyles(){
        const stylesCheck = document.querySelector('#styles-script');
        if(stylesCheck) return;

        const styles = document.createElement('link');
        styles.href = 'newStyles.css';
        styles.rel = 'stylesheet';
        styles.id = 'styles-script';
        document.head.appendChild(styles);
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

                this.initFancyBox();
                this.addStyles();

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

                if(templateId === 'tabsPortfolio'){
                    InitTabs();
                }

                if(templateId === 'images'){
                    this.initImages();
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

const data = {
    "tabsPortfolio-1": {
        "title": "Конференция",
        "subtitle": "Конференция",
        "cols": {
            "desktop": 4,
            "mobile": 2
        },
        "classes": [
            "",
            "",
            "tall",
            "tall",
            "",
            "",
            "",
            "",
            "",
            "",
            "big",
            "big",
            "big",
            "tall",
            "tall",
        ],
        "classesMob": [
            "",
            "",
            "",
            "tall",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "big",
            "",
            "tall",
            "",
        ],
        "images": [
            "./images/trends/**/img_new_1.jpg",
            "./images/trends/**/img_new_2.jpg",
            "./images/trends/**/img_new_3.jpg",
            "./images/trends/**/img_new_4.jpg",
            "./images/trends/**/img_new_5.jpg",
            "./images/trends/**/img_new_6.jpg",
            "./images/trends/**/img_new_7.jpg",
            "./images/trends/**/img_new_8.jpg",
            "./images/trends/**/img_new_9.jpg",
            "./images/trends/**/img_new_10.jpg",
            "./images/trends/**/img_new_11.jpg",
            "./images/trends/**/img_new_12.jpg",
            "./images/trends/**/img_new_13.jpg",
            "./images/trends/**/img_new_14.jpg",
            "./images/trends/**/img_new_16.jpg",
        ]
        
    },
    "tabsPortfolio-2": {
        "title": "Свадьба в стиле вечеринки Sunset  - координация",
        "subtitle": "Свадьба в стиле вечеринки Sunset  - координация",
        "cols": {
            "desktop": 4,
            "mobile": 2
        },
        "classes": [
            "big",
            "",
            "",
            "",
            "",
            "big",
            "",
            "big",
            "",
            "",
            "",
            "",
            "",
            "",
            "tall",
            "tall",
            "big",
        ],
        "classesMob": [
            "big",
            "",
            "",
            "",
            "",
            "big",
            "",
            "big",
            "",
            "",
            "",
            "",
            "",
            "",
            "tall",
            "",
            "big",
        ],
        "images": [
            "./images/wid/**/001.jpg",
            "./images/wid/**/215.jpg",
            "./images/wid/**/002.jpg",
            "./images/wid/**/004.jpg",
            "./images/wid/**/005.jpg",
            "./images/wid/**/040.jpg",
            "./images/wid/**/198.jpg",
            "./images/wid/**/041.jpg",
            "./images/wid/**/210.jpg",
            "./images/wid/**/202.jpg",
            "./images/wid/**/066.jpg",
            "./images/wid/**/081.jpg",
            "./images/wid/**/088.jpg",
            "./images/wid/**/112.jpg",
            "./images/wid/**/142.jpg",
            "./images/wid/**/145.jpg",
            "./images/wid/**/011.jpg",
        ]
    },
 
    "tabsPortfolio-3": {
        "title": "День рождения в Русском стиле",
        "subtitle": "День рождения в Русском стиле",
        "cols": {
            "desktop": 4,
            "mobile": 2
        },
        "classes": [
            "tall",
            "big",
            "",
            "",
            "",
            "",
            "",
            "",
            "big",
            "",
            "",
            "tall",
            "tall",
        ],
        "classesMob": [
            "wide",
            "wide",
            "",
            "",
            "",
            "",
            "",
            "",
            "wide",
            "",
            "",
            "big",
            "big",
        ],
        "images": [
            "./images/drnat/**/img_1.jpg",
            "./images/drnat/**/img_2.jpg",
            "./images/drnat/**/img_3.jpg",
            "./images/drnat/**/img_4.jpg",
            "./images/drnat/**/img_5.jpg",
            "./images/drnat/**/img_6.jpg",
            "./images/drnat/**/img_7.jpg",
            "./images/drnat/**/img_8.jpg",
            "./images/drnat/**/img_9.jpg",
            "./images/drnat/**/img_10.jpg",
            "./images/drnat/**/img_11.jpg",
            "./images/drnat/**/img_12.jpg",
            "./images/drnat/**/img_13.jpg",
            "./images/drnat/**/img_14.jpg",
            "./images/drnat/**/img_15.jpg",
        ]
    },
    "tabsPortfolio-4": {
        "title": "Ламборгини вечеринки",
        "subtitle": "Интеграция travel-компании на закрытом мероприятии Lamborghini",
        "cols": {
            "desktop": 4,
            "mobile": 2
        },
        "classes": [
            "tall",
            "tall",
            "tall",
            "tall",
            "",
            "",
            "",
            "",
            "big",
            "tall",
            "tall",
            "big",
            "big",
        ],
        "classesMob": [
            "tall",
            "tall",
            "tall",
            "tall",
            "",
            "",
            "big",
            "",
            "",
            "big",
            "tall",
            "",
            "",
        ],
        "images": [
            "./images/lambo/**/img_1.jpg",
            "./images/lambo/**/img_2.jpg",
            "./images/lambo/**/img_3.jpg",
            "./images/lambo/**/img_4.jpg",
            "./images/lambo/**/img_5.jpg",
            "./images/lambo/**/img_8.jpg",
            "./images/lambo/**/img_9.jpg",
            "./images/lambo/**/img_10.jpg",
            "./images/lambo/**/img_11.jpg",
            "./images/lambo/**/img_6.jpg",
            "./images/lambo/**/img_7.jpg",
            "./images/lambo/**/img_12.jpg",
            "./images/lambo/**/img_15.jpg",
        ]
    },
    "tabsPortfolio-5": {
        "title": "Интеграция Neverend, открытие гольф сезона",
        "subtitle": "Интеграция Neverend, открытие гольф сезона",
        "cols": {
            "desktop": 4,
            "mobile": 2
        },
        "classes": [
            "tall",
            "big",
            "tall",
            "big",
            "wide",
            "wide",
            "",
            "",
            "",
            "",
        ],
        "classesMob": [
            "tall",
            "big",
            "tall",
            "big",
            "wide",
            "wide",
            "",
            "",
            "",
            "",
        ],
        "images": [
            "./images/neverend/**/img_1.jpg",
            "./images/neverend/**/img_2.jpg",
            "./images/neverend/**/img_3.jpg",
            "./images/neverend/**/img_4.jpg",
            "./images/neverend/**/img_6.jpg",
            "./images/neverend/**/img_7.jpg",
        ]
    },
    "tabsPortfolio-6": {
        "title": "Воздушный Бал — пространство вне времени.",
        "subtitle": "Воздушный Бал — пространство вне времени.",
        "cols": {
            "desktop": 4,
            "mobile": 2
        },
        "classes": [
            "",
            "big",
            "tall",
            "tall",
            "tall",
            "big",
            "",
            "tall",
            "tall",
            "big",
            "tall",
            "tall",
            "tall",
            "tall",
        ],
        "classesMob": [
            "",
            "big",
            "tall",
            "tall",
            "tall",
            "big",
            "",
            "tall",
            "tall",
            "big",
            "tall",
            "tall",
            "tall",
            "big",
        ],
        "images": [
            "./images/air/**/img_15.jpg",
            "./images/air/**/img_1.jpg",
            "./images/air/**/img_2.jpg",
            "./images/air/**/img_4.jpg",
            "./images/air/**/img_5.jpg",
            "./images/air/**/img_6.jpg",
            "./images/air/**/img_7.jpg",
            "./images/air/**/img_8.jpg",
            "./images/air/**/img_9.jpg",
            "./images/air/**/img_10.jpg",
            "./images/air/**/img_11.jpg",
            "./images/air/**/img_12.jpg",

            "./images/air/**/img_13.jpg",
            "./images/air/**/img_14.jpg",
        ]
    }
}

function InitTabs(tabId){
    const tabsWrapper = document.querySelector('.tabsPortfolio-tabs');

    const keys = Object.keys(data);

    if(!tabId){
        keys.forEach((key, index) => {
            tabsWrapper.innerHTML += `<button data-tab="${key}" class="btn  ${index === 0 ? 'btn-primary' : 'btn-gray'}">${data[key].title}</button>`;
        });
    }

    const tabsContainer = document.querySelector('.tabsPortfolio');
    const tabButtons = tabsContainer.querySelectorAll('.tabsPortfolio-tabs button');
    const contentContainer = tabsContainer.querySelector('.tabsPortfolio-content');
    const isDesktop = window.innerWidth > 768;

    if(tabId){
        activateTab(tabId);
        return
    }

    function createTemplate(images, title, cols, classes, classesMob) {
        const template = document.createElement('div');
        template.classList.add('tabsPortfolio-item');
      
        const getImageUrl = (image) =>
          isDesktop ? image.replace('/**/', '/compress/') : image.replace('/**/', '/mobile/');
        const getImageUrlOriginal = (image) => image.replace('/**/', '/init/');
      
        const cls = isDesktop ? classes : classesMob

        const masonryHTML = `
          <div class="masonry-images masonry" style="--cols-desktop: ${cols.desktop}; --cols-mobile: ${cols.mobile};">
            ${images.map((image, index) => `<a href="${getImageUrlOriginal(image)}" data-fancybox="${title}" class="brick ${cls[index]}"><img src="${getImageUrl(image)}" /></a>`).join('')}
          </div>
        `;
        
        // оборачиваем html в DOM-элемент
        const wrapper = document.createElement('div');
        wrapper.innerHTML = masonryHTML;
        const masonry = wrapper.querySelector('.masonry-images');
      
        // ждём загрузку всех img внутри masonry
        const imgElements = [...masonry.querySelectorAll('img')];
        const promises = imgElements.map(img => {
          return new Promise((resolve) => {
            if (img.complete) resolve();
            else img.onload = img.onerror = () => resolve();
          });
        });
      
        Promise.all(promises).then(() => {
          masonry.classList.add('loaded'); // плавно покажем после загрузки
        });
      
        template.appendChild(masonry);
        return template;
      }
      

    // Функция для активации таба
    function activateTab(tabId) {
        const templates = data[tabId];

        if (!templates) return;
       
        contentContainer.innerHTML = '';
        
        const content = createTemplate(templates.images, templates.title, templates.cols, templates.classes, templates.classesMob);
        contentContainer.appendChild(content);
        
        // var msnry = new Masonry( '.masonry-images', {
        //     itemSelector: '.brick',
        //     columnWidth: 200
        // });

        // Обновляем активные кнопки
        tabButtons.forEach(button => {
            if (button.dataset.tab === tabId) {
                button.classList.remove('btn-gray');
                button.classList.add('btn-primary');
            } else {
                button.classList.remove('btn-primary');
                button.classList.add('btn-gray');
            }
        });
    }
    
 

    // Вешаем обработчики клика на кнопки
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            activateTab(tabId);
        });
    });

   

    // Активируем первый таб по умолчанию
    if (tabButtons.length > 0) {
        activateTab(tabButtons[0].dataset.tab);
    }
}
