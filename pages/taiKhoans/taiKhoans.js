$(document).ready(function () {
    // Thiết lập DataTable để tạo bảng Vật tư
    var taiKhoansTable = $('#taiKhoansTable').DataTable({
        ajax: {
            url: 'http://localhost:3000/nhanSus?_expand=phongBan',
            dataType: "json",
            dataSrc: '',
        },
        columns: [
            {
                data: 'tenTaiKhoan',
                render: function (data) {
                    return `<div style="color: #005792; font-weight: bolder;">${data}</div>`
                }
            },
            {
                data: 'matKhau',
                orderable: false,
                render: function (data) {
                    let str = ''
                    for (let i = 0; i < data.toString().length; i++) {
                        str += '*'
                    }

                    return `<div style="display: flex; justify-content: space-between;">
                                <span class="matKhauToggle" style="align-content: center; font-weight: bolder">${str}</span>
                                <button type="button" class="btn password-toggle-btn"><i class="fa-regular fa-eye"></i></button>
                            </div>`;
                }
            },
            {
                data: 'role',
                render: function (data) {
                    if (data === 'user')
                        // return '<span style="color: #198754">Người dùng</span>'
                        return '<span class="badge bg-success">Người dùng</span>'
                    if (data === 'admin')
                        // return '<span style="color: #FF0000">Quản trị viên</span>'
                        return '<span class="badge bg-danger">Quản trị viên</span>'
                }
            },
            { data: 'tenNhanSu' },
            { data: 'phongBan.tenPhongBan' },
            { data: 'chucVu' },
            {
                data: 'id',
                orderable: false,
                render: function () {
                    return `<button 
                        type="button" 
                        class="btn btn-outline-primary btn-edit" 
                        data-bs-toggle="modal"
                        data-bs-target="#editTaiKhoanModal"
                    ><i class="fa-solid fa-pen-to-square"></i></button>`
                }
            },
        ],
        retrieve: true,
        processing: true,
        language: {
            info: 'Trang _PAGE_/_PAGES_',
            search: 'Tìm kiếm:',
            lengthMenu: '_MENU_ tài khoản trong 1 trang',
            zeroRecords: 'Không có tài khoản nào',
            processing: 'Đang tải...',
            loadingRecords: 'Không có tài khoản nào'
        },
    });

    // $('#editTaiKhoanModal').modal('show');
    $('#taiKhoansTable tbody').on('click', 'button', function () {
        // Lấy dữ liệu trong hàng
        var data_NS = taiKhoansTable.row($(this).parents('tr')).data();

        // Lấy class để xem xem nút nào đã được bấm
        const buttonClass = $(this).attr('class');
        switch (buttonClass) {
            //  Trường hợp là nút Chỉnh sửa trong bảng
            case 'btn btn-outline-primary btn-edit':
                console.log(data_NS);

                // Làm mới trạng thái nút Lưu
                $('#save-form-btn').removeAttr('disabled')
                $('#save-form-btn').html('Lưu')

                // Set giá trị mặc định cho các trường input
                $('#tenNhanSuJumbo').text(data_NS.tenNhanSu)
                switch (data_NS.role) {
                    case 'user':
                        $('#roleBadge').text('Người dùng')
                        $('#roleBadge').attr('class', 'badge bg-success')
                        break;

                    case 'admin':
                        $('#roleBadge').text('Quản trị viên')
                        $('#roleBadge').attr('class', 'badge bg-danger')
                        break;

                    default:
                        break;
                }
                $('#tenTaiKhoanInput').attr('class', 'form-control')
                $('#tenTaiKhoanInput').val(data_NS.tenTaiKhoan)
                $("#tenTaiKhoanInput").on("keyup", function () {
                    if ($(this).val().length < 3) {
                        $(this).attr('class', 'form-control is-invalid')
                    }
                    else {
                        $(this).attr('class', 'form-control')
                    }
                });
                $("#matKhauInput").attr('class', 'form-control')
                $('#matKhauInput').val(data_NS.matKhau)
                $("#matKhauInput").on("keyup", function () {
                    if ($(this).val().length < 3) {
                        $(this).attr('class', 'form-control is-invalid')
                    }
                    else {
                        $(this).attr('class', 'form-control')
                    }
                });
                $("#matKhau2Input").attr('class', 'form-control')
                $('#matKhau2Input').val('')
                $("#matKhau2Input").on("keyup", function () {
                    if ($('#matKhau2Input').val() !== $('#matKhauInput').val()) {
                        $("#matKhau2Input").attr('class', 'form-control is-invalid')
                    }
                    else {
                        $("#matKhau2Input").attr('class', 'form-control')
                    }
                });
                if (data_NS.role === 'user') {
                    $("#user").prop("checked", true)
                }
                else {
                    $("#admin").prop("checked", true)
                }

                // Khi nhấn nút Lưu
                $('#save-form-btn').on('click', function () {
                    // Validate dữ liệu
                    if (($('#tenTaiKhoanInput').val().length < 3)
                        || ($('#matKhauInput').val().length < 3)
                        || ($('#matKhau2Input').val() !== $('#matKhauInput').val())) {

                        if ($('#tenTaiKhoanInput').val().length < 3) {
                            $('#tenTaiKhoanInput').attr('class', 'form-control is-invalid')
                        }
                        if ($('#matKhauInput').val().length < 3) {
                            $('#matKhauInput').attr('class', 'form-control is-invalid')
                        }
                        if ($('#matKhau2Input').val() !== $('#matKhauInput').val()) {
                            $("#matKhau2Input").attr('class', 'form-control is-invalid')
                        }

                        console.log('Validate Failed')
                        return
                    }

                    // Loading nút Lưu
                    $('#save-form-btn').attr('disabled', 'disabled')
                    $('#save-form-btn').html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>')

                    let roleRadio = ''
                    if ($("#user").prop("checked")) {
                        roleRadio = 'user'
                    }
                    else {
                        roleRadio = 'admin'
                    }
                    // Dùng ajax gọi API
                    $.ajax({
                        url: `http://localhost:3000/nhanSus/${data_NS.id}`,
                        type: 'PATCH',
                        data: {
                            tenTaiKhoan: $('#tenTaiKhoanInput').val(),
                            matKhau: $('#matKhauInput').val(),
                            role: roleRadio,
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
                            taiKhoansTable.ajax.reload(null, false);
                        })
                })
                break;

            // Trường hợp là nút Hiển thị mật khẩu trong bảng
            case 'btn password-toggle-btn':
                if ($(this).children('i').attr('class').includes('fa-eye-slash')) {
                    $(this).html('<i class="fa-regular fa-eye"></i>')
                    let pass = data_NS.matKhau.toString()
                    let str = ''
                    for (let i = 0; i < pass.length; i++) {
                        str += '*'
                    }
                    $(this).prev('.matKhauToggle').text(str)
                }
                else {
                    $(this).html('<i class="fa-regular fa-eye-slash"></i>')
                    $(this).prev('.matKhauToggle').text(data_NS.matKhau)
                }
                break;

            default:
                break
        }
    });

    // Hiển thị menu Con ở Sidebar
    $('.nav-item-child').show()
})