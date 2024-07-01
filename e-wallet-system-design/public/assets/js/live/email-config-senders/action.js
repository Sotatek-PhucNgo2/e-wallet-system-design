const templateUrl = '/admin/email-config-senders'


function saveData() {

    const isEdit = !!$('#IsEdit').val();

    notify.loading();
    const configSender = {
        provider: $('#sl_provider').val(),
        host_email: $('#email-host').val(),
        port: $('#email-port').val(),
        secure: true,
        user: $('#email-user').val(),
        pass: $('#email-password').val(),
        limit: $('#email-limit').val(),
    };


    if (isEdit) {
        $.ajax({
            url: `${templateUrl}/update`,
            data: configSender,
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
    } else {
        $.ajax({
            url: `${templateUrl}/create`,
            data: configSender,
            type: 'POST',
            success: function (response) {
                if (response.success) {
                    notify.push("Thêm thành công", notify.EType.SUCCESS);
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
            error: function (request, msg, error) {
                notify.done();
                notify.push(request.responseJSON.error, notify.EType.DANGER);
            },
        });
    }
}


function del(id) {
    notify.loading();

    $.ajax({
        url: `${templateUrl}/${id}/delete`,
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
