document.addEventListener('DOMContentLoaded', function() {
    const tabsContainer = document.querySelector('.tabsPortfolio');
    const tabButtons = tabsContainer.querySelectorAll('.tabsPortfolio-tabs button');
    const contentContainer = tabsContainer.querySelector('.tabsPortfolio-content');
    
    const data = {
        "tabsPortfolio-1": {
            "title": "Детские",
            "cols": {
                "desktop": 4,
                "mobile": 2
            },
            "images": [
                "./images/wid/001.jpg",
                "./images/wid/002.jpg",
                "./images/wid/004.jpg",
                "./images/wid/005.jpg",
                "./images/wid/011.jpg",
                "./images/wid/040.jpg",
                "./images/wid/066.jpg",
                "./images/wid/088.jpg",
                "./images/wid/112.jpg",
                "./images/wid/142.jpg",
                "./images/wid/145.jpg",
                "./images/wid/198.jpg",
                "./images/wid/202.jpg",
                "./images/wid/215.jpg",
            ]
        },
        "tabsPortfolio-2": {
            "title": "Свадьбы",
            "cols": {
                "desktop": 4,
                "mobile": 2
            },
            "images": [
                "./images/wid/004.jpg",
                "./images/wid/005.jpg",
                "./images/wid/011.jpg",
                "./images/wid/066.jpg",
                "./images/wid/112.jpg",
                "./images/wid/145.jpg",
                "./images/wid/198.jpg",
                "./images/wid/202.jpg",
                "./images/wid/215.jpg",
            ]
        },
        "tabsPortfolio-3": {
            "title": "Гендер пати",
            "cols": {
                "desktop": 3,
                "mobile": 2
            },
            "images": [
                "./images/gender/img1.jpg",
                "./images/gender/img2.jpg",
                "./images/gender/img3.jpg",
                "./images/gender/img4.jpg",
                "./images/gender/img5.jpg",
            ]
        }
    }

    function createTemplate(images, title, cols) {
        const template = document.createElement('div');
        template.classList.add('tabsPortfolio-item');
        template.innerHTML = `
            <div class="masonry-images masonry" style="--cols-desktop: ${cols.desktop}; --cols-mobile: ${cols.mobile};">
                ${images.map(image => `<a href="${image}" data-fancybox="${title}" class="brick"><img src="${image}" /></a>`).join('')}
            </div>
        `;
        return template;
    }

    // Функция для активации таба
    function activateTab(tabId) {
        const templates = data[tabId];

        if (!templates) return;
       
        // Очищаем контейнер с контентом
        contentContainer.innerHTML = '';
        
        // Клонируем содержимое template и добавляем в контейнер
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
