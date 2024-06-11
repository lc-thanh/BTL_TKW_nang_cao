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
            {
                data: 'soLuongTonKho',
                render: function (data) {
                    return `<span style="margin-right: 20px; font-size: 15px;">${data}</span>`
                }
            },
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


    // ============================================================ //
    // NHẬP VẬT TƯ
    // ============================================================ //
    var nhapVatTuTable = $('#nhapVatTuTable').DataTable({
        ajax: {
            url: 'http://localhost:3000/vatTus?_expand=danhMuc',
            dataType: "json",
            dataSrc: '',
        },
        columns: [
            {
                data: 'id',
                orderable: false,
                className: 'select-checkbox',
                render: function () {
                    return ''
                }
            },
            {
                data: 'tenVatTu',
                render: function (data) {
                    return `<span style="font-weight: bolder;">${data}</span>`
                }
            },
            {
                data: 'anhVatTu',
                orderable: false,
                render: function (data, type, row) {
                    return `<img src="${data}" alt="Ảnh của ${row.tenVatTu}" width="100px" />`;
                }
            },
            { data: 'danhMuc.tenDanhMuc' },
            { data: 'moTaVatTu' },
            {
                data: 'soLuongTonKho',
                render: function (data) {
                    return `<span style="margin-right: 20px; font-weight: bold; font-size: 15px;">${data}</span>`
                }
            },
            { data: 'thuongHieu' },
            { data: 'mauSac' },
        ],
        select: true,
        order: [[1, 'asc']],
        scrollCollapse: true,
        scrollX: true,
        // scrollY: 300,
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

    $('#btn-openNhapVTModal').on('click', function () {
        // Làm mới trạng thái nút Nhập
        $('#btn-chonVT').removeAttr('disabled')
        $('#btn-nhapVatTu').removeAttr('disabled')
        $('#btn-nhapVatTu').html('Lưu')
    })

    $('#nhapVatTuModal').modal('show')
    $('#btn-chonXong').on('click', function () {
        // nhapVatTuTable.rows().deselect()
        // nhapVatTuTable.rows((idx, data) => data.id === 28).select()

        const selectedData = nhapVatTuTable.rows({ selected: true }).data()
        let table_html = ''
        for (let i = 0; i < selectedData.length; i++) {
            table_html += `
                <tr id="${selectedData[i].id}">
                    <td>${selectedData[i].tenVatTu}</td>
                    <td><img src="${selectedData[i].anhVatTu}" alt="Ảnh của ${selectedData[i].tenVatTu}" width="100px" /></td>
                    <td>SL : <input type="number" style="width: 100px; display: inline-block;" class="form-control" id="soluongNhap_VT${selectedData[i].id}" value="1" /></td>
                    <td><button type="button" class="btn btn-outline-danger"><i class="fa-regular fa-trash-can"></i></button></td>
                </tr>`
        }
        $('#vatTuDaChonTable tbody').html(table_html)
    })

    // Nhấn nút xóa
    $('#vatTuDaChonTable tbody').on('click', 'button', function () {
        $(this).parents('tr').remove()

        // Check nếu xóa hết vật tư rồi thì Hiển thị CHƯA CÓ VẬT TƯ NÀO
        if (!$('#vatTuDaChonTable tbody tr').length) {
            const tbody_html = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">
                        CHƯA CÓ VẬT TƯ NÀO
                    </td>
                </tr>`
            $('#vatTuDaChonTable tbody').html(tbody_html)
        }
    })

    // Khi nhấn nút Nhập
    $('#btn-nhapVatTu').on('click', function () {
        const VT_count = $('#vatTuDaChonTable tbody tr button').length
        if (VT_count === 0) {
            return
        }

        $('#btn-chonVT').attr('disabled', 'disabled')
        $('#btn-nhapVatTu').attr('disabled', 'disabled')
        $('#btn-nhapVatTu').html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status"> Đang nhập...</span>')

        for (let i = 1; i <= VT_count; i++) {
            const row = $(`#vatTuDaChonTable tbody tr:nth-child(${i})`)
            const VT_id = row.attr('id')
            const VT_SL = row.find('input').val()

            console.log({id: VT_id, SL: VT_SL})
        }

        // Dùng ajax gọi API
        // $.ajax({
        //     url: `http://localhost:3000/vatTus/${data_VT.id}`,
        //     type: 'PATCH',
        //     data: {
        //         soLuongTonKho: $('#soLuongInput').val()
        //     }
        // })
        //     .done(function (ketqua) {
        //         console.log(ketqua)
        //     })
        //     .fail(function () {
        //         console.log('failed')
        //         $('#save-form-btn').removeAttr('disabled')
        //         $('#save-form-btn').html('Lưu')
        //     })
        //     .always(function () {
        //         vatTusTable.ajax.reload(null, false);
        //     })
    })

    $('#nhapVTLog').on('click', function () {
        const selectedData = nhapVatTuTable.rows({ selected: true }).data()
        console.log(selectedData[0], selectedData[1])
        nhapVatTuTable.rows((idx, data) => data.id === 28).deselect()
        console.log(nhapVatTuTable.rows((idx, data) => data.id === 28).data()[0].soLuongTonKho)
    })
})
