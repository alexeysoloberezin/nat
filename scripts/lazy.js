// document.addEventListener('DOMContentLoaded', function() {
//     // Настройки
//     const options = {
//         root: null, // viewport
//         rootMargin: '0px',
//         threshold: 0 // 10% видимости элемента
//     };
    
//     // Находим все ленивые секции
//     const lazySections = document.querySelectorAll('.lazy-section');
    
//     // Создаем IntersectionObserver
//     const observer = new IntersectionObserver((entries, observer) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 // Когда секция становится видимой
//                 const lazySection = entry.target;
//                 const templateId = lazySection.getAttribute('data-template');
//                 const template = document.getElementById(templateId);
                
//                 if (template) {
//                     // Клонируем содержимое шаблона и добавляем в секцию
//                     const content = template.content.cloneNode(true);
//                     lazySection.innerHTML = '';
//                     lazySection.appendChild(content);
//                     lazySection.classList.add('loaded');
                    
//                     // Прекращаем наблюдение за этой секцией
//                     observer.unobserve(lazySection);
//                 }
//             }
//         });
//     }, options);
    
//     // Начинаем наблюдение за всеми ленивыми секциями
//     lazySections.forEach(section => {
//         observer.observe(section);
//     });
// });
