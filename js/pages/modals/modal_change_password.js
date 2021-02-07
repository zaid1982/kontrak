function ModalChangePassword() {

    const className = 'ModalChangePassword';
    let self = this;
    let classFrom;
    let callFrom;
    let formMpwValidate
    let userId = '';

    this.init = function () {
        $('.btnMpwClose').show();

        const vDataMpw = [
            {
                field_id: 'txtMpwOldPassword',
                type: 'text',
                name: 'Kata Laluan Sekarang',
                validator: {
                    notEmpty: true,
                    maxLength: 20,
                    minLength: 6
                }
            },
            {
                field_id: 'txtMpwNewPassword',
                type: 'text',
                name: 'Kata Laluan Baharu',
                validator: {
                    notEmpty: true,
                    maxLength: 15,
                    minLength: 8,
                    password: true
                }
            },
            {
                field_id: 'txtMpwConfirmPassword',
                type: 'text',
                name: 'Sahkan Kata Laluan Baharu',
                validator: {
                    notEmpty: true,
                    maxLength: 15,
                    minLength: 8,
                    similar: {
                        id: "txtMpwNewPassword",
                        label: "Kata Laluan Baharu"
                    },
                    password: true
                }
            }
        ];

        formMpwValidate = new MzValidate('formMpw');
        formMpwValidate.registerFields(vDataMpw);

        $('#btnMpwSubmit').on('click', function () {
            if (!formMpwValidate.validateNow()) {
                toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
            }
            else {
                ShowLoader();
                setTimeout(function () {
                    try {
                        const data = {
                            oldPassword: $('#txtMpwOldPassword').val(),
                            newPassword: $('#txtMpwConfirmPassword').val()
                        };
                        if (callFrom === 'Top') {
                            mzAjaxRequest('user/change_password', 'PUT', data);
                        } else if (callFrom === 'FirstTime') {
                            mzAjaxRequest('user/first_time', 'PUT', data);
                            userInfo['userStatus'] = '1'
                            userInfo['userIsFirstTime'] = '0';
                            const rawEncrypted = CryptoJS.AES.encrypt(JSON.stringify(userInfo), 'PDRM');
                            sessionStorage.setItem('userInfo', rawEncrypted.toString());
                        } else {
                            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
                        }
                        $('#modal_change_password').modal('hide');
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 300);
            }
        });

        let userInfo = sessionStorage.getItem('userInfo');
        const objEncrypted = CryptoJS.AES.decrypt(userInfo, 'PDRM').toString(CryptoJS.enc.Utf8);
        userInfo = JSON.parse(objEncrypted);

        if (userInfo['userStatus'] === '99' || userInfo['userIsFirstTime'] === '1') {
            callFrom = 'FirstTime';
            self.edit(userInfo['userId']);
            $('.btnMpwClose').hide();
        }

        $('#btnChangePassword').on('click', function () {
            callFrom = 'Top';
            self.edit(userInfo['userId']);
        });
    };

    this.edit = function (_userId) {
        mzCheckFuncParam([_userId]);
        userId = _userId;
        formMpwValidate.clearValidation();
        $('#modal_change_password').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
    };

    this.init();
}