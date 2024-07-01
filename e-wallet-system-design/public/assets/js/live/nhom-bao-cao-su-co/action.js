const templateUrl = '/admin/nhom-bao-cao-su-co'


//mở ra và check trạng thái
function openModal(isEdit, id) {
    if (!!isEdit) {
        getData(id);
    } else {
        $('#myModal').modal('show');

        $('#txtIdMaNhomBaoCaoSuCo').val(null);
        $('#txtMaNhomBaoCaoSuCo').val('');
        $('#txtTenNhomBaoCaoSuCo').val('');
    }
}

function saveData() {
    const isEdit = $('#IsEdit').val();
    if (!!isEdit) {
        updateInvitee();
    } else {
        createInvitee();
    }
}

//Thêm dữ liệu
function createInvitee() {
    notify.loading();
    const nhombaocaosuco = {
        maNhomBaoCaoSuCo: $('#txtMaNhomBaoCaoSuCo').val(),
        tenNhomBaoCaoSuCo: $('#txtTenNhomBaoCaoSuCo').val(),
    };


    $.ajax({
        url: `${templateUrl}/create`,
        data: nhombaocaosuco,
        type: 'POST',
        success: function (data) {
            if (data.success) {
                $('#exampleModal').modal('hide');
                notify.push(data.message, notify.EType.SUCCESS);
                setTimeout(function () {
                    window.location.reload();
                    notify.done();
                }, 500);
            } else {
                $('#exampleModal').modal('hide');
                notify.push(data.success, notify.EType.DANGER);
                setTimeout(function () {
                    notify.done();
                }, 2000);
            }
        },
        error: function (request, msg, error) {
            notify.done();
            notify.push(request.responseJSON.error, notify.EType.DANGER);
        },
    });
}

//cập nhật dữ liệu
function updateInvitee() {
    const nhombaocaosuco = {
        maNhomBaoCaoSuCo: $('#txtMaNhomBaoCaoSuCo').val(),
        tenNhomBaoCaoSuCo: $('#txtTenNhomBaoCaoSuCo').val(),
    };
    notify.loading();

    $.ajax({
        url: `${templateUrl}/update`,
        data: nhombaocaosuco,
        type: 'PUT',
        success: function (response) {
            if (response.success) {
                $('#exampleModal').modal('hide');
                notify.push("Success", notify.EType.SUCCESS);
                setTimeout(function () {
                    window.location.reload();
                    notify.done();
                }, 500);
            } else {
                $('#exampleModal').modal('hide');
                const msg = (response.messageList && response.messageList.length > 0) ? response.messageList[0].text : "Erros";
                notify.push(msg, notify.EType.DANGER);
                setTimeout(function () {
                    notify.done();
                }, 2000);
            }
        },
        error: function (request, msg, error) {
            notify.done();
            notify.push(request.responseJSON.error, notify.EType.DANGER);
        },
    });
}

//lấy dữ liệu điền lên
function getData(id) {
    $.get(`${templateUrl}/${id}/detail`)
        .done(function (rp) {
            if (rp.success) {
                const data = rp.data;
                $('#txtMaNhomBaoCaoSuCo').val(data.MaNhomBaoCaoSuCo);
                $('#txtTenNhomBaoCaoSuCo').val(data.TenNhomBaoCaoSuCo);


                $('#myModal').modal('show');
                $('#IsEdit').val(true);
                $('#txtIdMaNhomBaoCaoSuCo').val(id);
            } else {
                console.log('K lay dc du lieu');
            }
        });
}

function del(id) {
    notify.loading();

    $.ajax({
        url: `${templateUrl}/delete`,
        data: {id},
        type: 'DELETE',
        success: function (response) {
            // Do something with the result
            if (response.success) {
                notify.push("Success", notify.EType.SUCCESS);
                setTimeout(function () {
                    window.location.reload();
                    notify.done();
                }, 500);
            } else {
                const msg = (response.messageList && response.messageList.length > 0) ? response.messageList[0].text : "Erros";
                notify.push(msg, notify.EType.DANGER);
                setTimeout(function () {
                    notify.done();
                }, 2000);
            }
        },
    });
}
