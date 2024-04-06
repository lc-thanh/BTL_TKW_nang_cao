$(document).ready(function () {
    $('#nav-toggle-btn').click(function () {
        $('#nav').toggleClass('invisible')
        $('section').toggleClass('nav-disabled')
        $('header').toggleClass('nav-disabled')
    })

    // $('#nav-toggle-btn').toggle(
    //     function () {
    //         $('#nav').animate({ left: 0 })
    //     },
    //     function () {
    //         $('#nav').animate({ left: '200px' })
    //     }
    // )
})