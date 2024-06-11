$(document).ready(function () {
    $('#nav-toggle-btn').click(function () {
        $('#nav').toggleClass('invisible')
        $('section').toggleClass('nav-disabled')
        $('header').toggleClass('nav-disabled')
    })

    // $('.nav-item-child').hide()
    $('.nav-item-parent').on('click', function() {
        $('.nav-item-child').slideToggle();

        if ($('.fa-caret-up').length) {
            $('.caret').html('<i class="fa-solid fa-caret-down" style="align-content: center;"></i>')
        }
        else {
            $('.caret').html('<i class="fa-solid fa-caret-up" style="align-content: center;"></i>')
        }
    })
})