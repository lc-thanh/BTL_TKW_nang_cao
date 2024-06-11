$(document).ready(function () {
    // Thiết lập DataTable để tạo bảng Vật tư
    var nhanSusTable = $('#nhanSusTable').DataTable({
        ajax: {
            url: 'http://localhost:3000/nhanSus?_expand=phongBan',
            dataType: "json",
            dataSrc: '',
        },
        columns: [
            { data: 'tenNhanSu' },
            { data: 'phongBan.tenPhongBan' },
            {
                data: 'ngaySinh',
                render: function (data) {
                    function convertDateFormat(oldFormat) {
                        try {
                            // Chuyển đổi chuỗi sang Date object
                            const dateObject = new Date(oldFormat);
                            // Lấy các phần ngày, tháng, năm
                            const year = dateObject.getFullYear();
                            const month = dateObject.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
                            const day = dateObject.getDate();
                            // Tạo chuỗi định dạng ngày mới
                            const newFormat = `${pad(day)}/${pad(month)}/${year}`;
                            return newFormat;
                        } catch (err) {
                            // Xử lý lỗi nếu định dạng ngày không hợp lệ
                            console.error(`Lỗi định dạng ngày: ${oldFormat}`, err);
                            return null;
                        }
                    }
                    // Hàm bổ sung để định dạng số có một chữ số
                    function pad(num) {
                        return num.toString().padStart(2, "0");
                    }
                    return convertDateFormat(data)
                }
            },
            { data: 'gioiTinh' },
            { data: 'soDienThoai' },
            { data: 'email' },
            { data: 'chucVu' },
            { data: 'queQuan' },
            {
                data: 'id',
                orderable: false,
                render: function (data, type, row) {
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
            lengthMenu: '_MENU_ nhân sự trong 1 trang',
            zeroRecords: 'Không có nhân sự nào',
            processing: 'Đang tải...',
            loadingRecords: 'Không có nhân sự nào'
        },
    });

    $.ajax({ url: 'http://localhost:3000/phongBans' })
        .done(function (data) {
            var selector_html = '<option selected>Chọn phòng ban</option>';

            data.forEach(phongBan => {
                selector_html += `<option value="${phongBan.id}">${phongBan.tenPhongBan}</option>`
            });
            $('#phongBanSelector').html(selector_html)
        })

    $('#nhanSusTable tbody').on('click', 'button', function () {
        var data_NS = nhanSusTable.row($(this).parents('tr')).data();
        console.log(data_NS);

        // Làm mới trạng thái nút Lưu
        $('#save-form-btn').removeAttr('disabled')
        $('#save-form-btn').html('Lưu')

        // Set giá trị mặc định cho các trường input
        $('#tenNhanSuInput').val(data_NS.tenNhanSu)
        $(`#phongBanSelector option`).removeAttr("selected");
        $(`#phongBanSelector option[value="${data_NS.phongBanId}"]`).attr("selected", true);
        if (data_NS.gioiTinh === 'Nam') {
            $("#nam").prop("checked", true)
        }
        else {
            $("#nu").prop("checked", true)
        }
        $('#ngaySinhInput').val(data_NS.ngaySinh)
        $('#soDienThoaiInput').val(data_NS.soDienThoai)
        $('#emailInput').val(data_NS.email)
        $('#chucVuInput').val(data_NS.chucVu)
        $('#queQuanInput').val(data_NS.queQuan)

        // Khi nhấn nút Lưu
        $('#save-form-btn').on('click', function () {
            $('#save-form-btn').attr('disabled', 'disabled')
            $('#save-form-btn').html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>')

            let gioiTinhRadio = ''
            if ($("#nam").prop("checked")) {
                gioiTinhRadio = 'Nam'
            }
            else {
                gioiTinhRadio = 'Nữ'
            }

            // Dùng ajax gọi API
            $.ajax({
                url: `http://localhost:3000/nhanSus/${data_NS.id}`,
                type: 'PATCH',
                data: {
                    tenNhanSu: $('#tenNhanSuInput').val(),
                    phongBanId: $(`#phongBanSelector`).val(),
                    gioiTinh: gioiTinhRadio,
                    ngaySinh: $('#ngaySinhInput').val(),
                    soDienThoai: $('#soDienThoaiInput').val(),
                    email: $('#emailInput').val(),
                    chucVu: $('#chucVuInput').val(),
                    queQuan: $('#queQuanInput').val()
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
                    nhanSusTable.ajax.reload(null, false);
                })
        })
    });

    $('.nav-item-child').show()
})