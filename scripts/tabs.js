document.addEventListener('DOMContentLoaded', function() {
    const data = {
        "tabsPortfolio-1": {
            "title": "The Trends",
            "subtitle": "The Trends",
            "cols": {
                "desktop": 4,
                "mobile": 2
            },
            "images": [
                "./images/trends/**/img_1.jpg",
                "./images/trends/**/img_2.jpg",
                "./images/trends/**/img_3.jpg",
                "./images/trends/**/img_4.jpg",
                "./images/trends/**/img_5.jpg",
                "./images/trends/**/img_6.jpg",
                "./images/trends/**/img_7.jpg",
                "./images/trends/**/img_8.jpg",
                "./images/trends/**/img_9.jpg",
                "./images/trends/**/img_10.jpg",
                "./images/trends/**/img_11.jpg",
                "./images/trends/**/img_12.jpg",
                "./images/trends/**/img_13.jpg",
                "./images/trends/**/img_14.jpg",
                "./images/trends/**/img_15.jpg",
                "./images/trends/**/img_16.jpg",
                "./images/trends/**/img_17.jpg",
                "./images/trends/**/img_18.jpg",
                "./images/trends/**/img_19.jpg",
            ]
            
        },
        "tabsPortfolio-2": {
            "title": "Свадьба в стиле вечеринки Sunset  - координация",
            "subtitle": "Свадьба в стиле вечеринки Sunset  - координация",
            "cols": {
                "desktop": 4,
                "mobile": 2
            },
            "images": [
                "./images/wid/**/001.jpg",
                "./images/wid/**/002.jpg",
                "./images/wid/**/004.jpg",
                "./images/wid/**/005.jpg",
                "./images/wid/**/011.jpg",
                "./images/wid/**/040.jpg",
                "./images/wid/**/041.jpg",
                "./images/wid/**/066.jpg",
                "./images/wid/**/081.jpg",
                "./images/wid/**/088.jpg",
                "./images/wid/**/112.jpg",
                "./images/wid/**/142.jpg",
                "./images/wid/**/145.jpg",
                "./images/wid/**/198.jpg",
                "./images/wid/**/202.jpg",
                "./images/wid/**/210.jpg",
                "./images/wid/**/215.jpg",
            ]
        },
     
        "tabsPortfolio-3": {
            "title": "День рождение в Русском стиле",
            "subtitle": "День рождение в Русском стиле",
            "cols": {
                "desktop": 4,
                "mobile": 2
            },
            "images": [
                "./images/drnat/**/img_1.JPG",
                "./images/drnat/**/img_2.JPG",
                "./images/drnat/**/img_3.JPG",
                "./images/drnat/**/img_4.JPG",
                "./images/drnat/**/img_5.JPG",
                "./images/drnat/**/img_6.JPG",
                "./images/drnat/**/img_7.JPG",
                "./images/drnat/**/img_8.JPG",
                "./images/drnat/**/img_9.JPG",
                "./images/drnat/**/img_10.JPG",
                "./images/drnat/**/img_11.JPG",
                "./images/drnat/**/img_12.JPG",
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
            "images": [
                "./images/lambo/**/img_1.jpg",
                "./images/lambo/**/img_2.jpg",
                "./images/lambo/**/img_3.jpg",
                "./images/lambo/**/img_4.jpg",
                "./images/lambo/**/img_5.jpg",
                "./images/lambo/**/img_6.jpg",
                "./images/lambo/**/img_7.jpg",
                "./images/lambo/**/img_8.jpg",
                "./images/lambo/**/img_9.jpg",
                "./images/lambo/**/img_10.jpg",
                "./images/lambo/**/img_11.jpg",
                "./images/lambo/**/img_12.jpg",
                "./images/lambo/**/img_13.jpg",
                "./images/lambo/**/img_14.jpg",
                "./images/lambo/**/img_15.jpg",
            ]
        },
    }

    const tabsWrapper = document.querySelector('.tabsPortfolio-tabs');

    const keys = Object.keys(data);

    keys.forEach((key, index) => {
        tabsWrapper.innerHTML += `<button data-tab="${key}" class="btn  ${index === 0 ? 'btn-primary' : 'btn-gray'}">${data[key].title}</button>`;
    });

    const tabsContainer = document.querySelector('.tabsPortfolio');
    const tabButtons = tabsContainer.querySelectorAll('.tabsPortfolio-tabs button');
    const contentContainer = tabsContainer.querySelector('.tabsPortfolio-content');
    const isDesktop = window.innerWidth > 768;

    function createTemplate(images, title, cols) {
        const template = document.createElement('div');
        template.classList.add('tabsPortfolio-item');
        function getImageUrl(image){
            if(isDesktop){
                return image.replace('/**/', '/compress/');
            }else{
                return image.replace('/**/', '/mobile/');
            }
        }
        function getImageUrlOriginal(image){
            return image.replace('/**/', '/init/');
        }

        template.innerHTML = `
            <div class="masonry-images masonry" style="--cols-desktop: ${cols.desktop}; --cols-mobile: ${cols.mobile};">
                ${images.map(image => `<a href="${getImageUrlOriginal(image)}" data-fancybox="${title}" class="brick"><img src="${getImageUrl(image)}" /></a>`).join('')}
            </div>
        `;
        return template;
    }

    // Функция для активации таба
    function activateTab(tabId) {
        const templates = data[tabId];

        if (!templates) return;
       
        contentContainer.innerHTML = '';
        
        const content = createTemplate(templates.images, templates.title, templates.cols);
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
});
