$(document).ready(function () {
    // Thiết lập DataTable để tạo bảng Phòng ban
    var phongBansTable = $('#phongBansTable').DataTable({
        ajax: {
            url: 'http://localhost:3000/phongBans',
            dataType: "json",
            dataSrc: '',
        },
        columns: [
            { data: 'tenPhongBan' },
            { data: 'chuyenNganh' },
            {
                data: 'vatTuChoMuon',
                render: function (data) {
                    return `<span style="font-weight: bolder; font-size: 15px; margin-right: 25px;">${data}</span>`
                }
            },
            {
                data: 'vatTuHienTai',
                render: function (data) {
                    return `<span style="font-weight: bolder; font-size: 15px; margin-right: 25px;">${data}</span>`
                }
            },
            {
                data: 'id',
                orderable: false,
                render: function () {
                    return `<button 
                      type="button" 
                      class="btn btn-outline-primary btn-edit mx-3" 
                      data-bs-toggle="modal"
                      data-bs-target="#editPhongBanModal"
                    ><i class="fa-solid fa-pen-to-square"></i></button>`
                }
            }
        ],
        retrieve: true,
        processing: true,
        language: {
            info: 'Trang _PAGE_/_PAGES_',
            search: 'Tìm kiếm:',
            lengthMenu: '_MENU_ phòng ban trong 1 trang',
            zeroRecords: 'Không có phòng ban nào',
            processing: 'Đang tải...',
            loadingRecords: 'Không có phòng ban nào'
        },
    });

    $('#phongBansTable tbody').on('click', 'button', function () {
        var data_PB = phongBansTable.row($(this).parents('tr')).data();
        console.log(data_PB);

        // Làm mới trạng thái nút Lưu
        $('#save-form-btn').removeAttr('disabled')
        $('#save-form-btn').html('Lưu')

        // Set giá trị mặc định cho các trường input
        $('#tenPhongBanInput').val(data_PB.tenPhongBan)
        $('#chuyenNganhInput').val(data_PB.chuyenNganh)
        $('#vatTuChoMuonInput').val(data_PB.vatTuChoMuon)
        $('#vatTuHienTaiInput').val(data_PB.vatTuHienTai)

        // Khi nhấn nút Lưu
        $('#save-form-btn').on('click', function () {
            $('#save-form-btn').attr('disabled', 'disabled')
            $('#save-form-btn').html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang lưu...</span>')

            // Dùng ajax gọi API
            $.ajax({
                url: `http://localhost:3000/phongBans/${data_PB.id}`,
                type: 'PUT',
                data: {
                    tenPhongBan: $('#tenPhongBanInput').val(),
                    chuyenNganh: $('#chuyenNganhInput').val(),
                    vatTuChoMuon: $(`#vatTuChoMuonInput`).val(),
                    vatTuHienTai: $('#vatTuHienTaiInput').val(),
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
                    phongBansTable.ajax.reload(null, false);
                })
        })
    });
})
