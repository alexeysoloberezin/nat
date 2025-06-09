document.addEventListener('DOMContentLoaded', function() {

    const popupForm = document.getElementById('popup-form')
    const template = document.getElementById('popup-form-template')
    const openPopupForm = document.querySelectorAll('.open-popup-form')

    openPopupForm.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault()
            const clone = template.content.cloneNode(true)
            // clone.querySelector('.popup-form').classList.add('active')

            popupForm.innerHTML = ''
            popupForm.appendChild(clone)
            popupForm.classList.add('active')
        })
    })

    popupForm.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup-form')) {
            popupForm.classList.remove('active')
        }
    })
})
