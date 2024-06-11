$(document).ready(function () {
    // Thiết lập DataTable để tạo bảng Vật tư
    var vatTusTable = $('#vatTusTable').DataTable({
        ajax: {
            url: 'http://localhost:3000/vatTus?_expand=danhMuc',
            dataType: "json",
            dataSrc: '',
        },
        columns: [
            { data: 'tenVatTu' },
            {
                data: 'anhVatTu',
                orderable: false,
                render: function (data, type, row) {
                    return `<img src="${data}" alt="Ảnh của ${row.tenVatTu}" width="100px" />`;
                }
            },
            { data: 'danhMuc.tenDanhMuc' },
            { data: 'moTaVatTu' },
            { data: 'soLuongTonKho' },
            { data: 'thuongHieu' },
            { data: 'mauSac' },
            {
                data: 'id',
                orderable: false,
                render: function () {
                    return `<button 
                      type="button" 
                      class="btn btn-outline-primary btn-edit" 
                      data-bs-toggle="modal"
                      data-bs-target="#editVatTuModal"
                    ><i class="fa-solid fa-pen-to-square"></i></button>`
                }
            }
        ],
        retrieve: true,
        processing: true,
        language: {
            info: 'Trang _PAGE_/_PAGES_',
            search: 'Tìm kiếm:',
            lengthMenu: '_MENU_ vật tư trong 1 trang',
            zeroRecords: 'Không có vật tư nào',
            processing: 'Đang tải...',
            loadingRecords: 'Không có vật tư nào'
        },
    });

    $('#vatTusTable tbody').on('click', 'button', function () {
        var data_VT = vatTusTable.row($(this).parents('tr')).data();
        console.log(data_VT);

        // Làm mới trạng thái nút Lưu
        $('#save-form-btn').removeAttr('disabled')
        $('#save-form-btn').html('Lưu')

        // Set giá trị mặc định cho các trường input
        $('#tenVatTuInput').val(data_VT.tenVatTu)
        $('#moTaTextarea').val(data_VT.moTaVatTu)
        $(`#danhMucSelector option`).removeAttr("selected");
        $(`#danhMucSelector option[value="${data_VT.danhMucId}"]`).attr("selected", true);
        $('#soLuongInput').val(data_VT.soLuongTonKho)
        $('#thuongHieuInput').val(data_VT.thuongHieu)
        $('#mauSacInput').val(data_VT.mauSac)
        $('#selectedImage').attr('src', `${data_VT.anhVatTu}`)

        // Nhấn nút Xóa ảnh
        $('#reset_img_btn').on('click', function () {
            $('#selectedImage').attr('src', `../../scr/images/khong_co_anh.png`)
            // var filename = $('#uploadImg[type=file]').val().split('\\').pop();
            // console.log(filename == '')
        })

        $('#uploadImg').on('change', function () {
            var filename = $('#uploadImg[type=file]').val().split('\\').pop()
            if (filename)
                $('#selectedImage').attr('src', `../../scr/images/${filename}`)

        })
        // Khi nhấn nút Lưu
        $('#save-form-btn').on('click', function () {
            $('#save-form-btn').attr('disabled', 'disabled')
            $('#save-form-btn').html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>')

            // Dùng ajax gọi API
            $.ajax({
                url: `http://localhost:3000/vatTus/${data_VT.id}`,
                type: 'PUT',
                data: {
                    tenVatTu: $('#tenVatTuInput').val(),
                    moTaVatTu: $('#moTaTextarea').val(),
                    danhMucId: $(`#danhMucSelector`).val(),
                    soLuongTonKho: $('#soLuongInput').val(),
                    thuongHieu: $('#thuongHieuInput').val(),
                    mauSac: $('#mauSacInput').val(),
                    anhVatTu: $('#selectedImage').attr('src')
                }
            })
                .done(function (ketqua) {
                    console.log(ketqua)
                })
                .fail(function () {
                    console.log('failed')
                    $('#save-form-btn').removeAttr('disabled')
                    $('#save-form-btn').html('Lưu')
                })
                .always(function () {
                    vatTusTable.ajax.reload(null, false);
                })
        })
    });
})
