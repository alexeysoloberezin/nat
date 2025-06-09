class InitAppScript {
    constructor() {
        this.observer = null;
        this.lazySections = [];
        this.isScrolling = false;
        this.stickyHeaderInit = false;
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
            const link = e.target.closest('.scroll-to');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                await this.handleSectionNavigation(targetId);
            }
        });
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

    async renderSection(sectionElement) {
        return new Promise(resolve => {
            const templateId = sectionElement.getAttribute('data-template');

            const showHeaderArr = ['sobs', 'templateTLR', 'templateTLR-1', 'templateTLR-2', 'templateTLR-3'];
            if(showHeaderArr.includes(templateId)){
                this.initStikyHeader();
            }

            const template = document.getElementById(templateId);
            
            if (template) {
                const content = template.content.cloneNode(true);
                sectionElement.innerHTML = '';
                sectionElement.appendChild(content);
                sectionElement.classList.add('loaded');
                
                if (this.observer) {
                    this.observer.unobserve(sectionElement);
                }

                // Даём время на отрисовку
                setTimeout(resolve, 20);
            } else {
                resolve();
            }
        });
    }
    initStikyHeader(){
        if(this.stickyHeaderInit) return;
        this.stickyHeaderInit = true;

        this.initSectionObserver()
        document.addEventListener('scroll', () => {
            const stikyHeader = document.querySelector('.stiky-header');

            if(!stikyHeader) return;

            const sobs = document.querySelector('.lazy-section[data-template="sobs"]');
            const showPosition = sobs.getBoundingClientRect().top + window.innerHeight;

            console.log(showPosition)
            if(showPosition < 0){
                stikyHeader.style.transform = 'translateY(0)';
            }else{
                stikyHeader.style.transform = 'translateY(-100%)';
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
    Fancybox.bind("[data-fancybox]", {
        // Your custom options
    });
});
