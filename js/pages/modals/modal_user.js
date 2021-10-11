function ModalUser() {

    const className = 'ModalUser';
    let self = this;
    let classFrom;
    let userId = '';
    let formValidate;
    let submitType = '';
    let confirmDelete;
    let refGroup;
    let refRole;
    let refContract;

    this.init = function () {
        mzOption('optMusGroup', refGroup, 'Sila Pilih', 'groupId', 'groupName', {groupType: '1', groupStatus: '1'}, 'required');

        let htmlRole = '';
        for (let i=0; i<refRole.length; i++) {
            if (typeof refRole[i] !== 'undefined') {
                htmlRole += '<div class="form-check form-check-inline mr-4">\n' +
                    '<input type="checkbox" class="form-check-input" id="chkMusRole_'+refRole[i]['roleId']+'" name="chkMusRole[]" value="'+refRole[i]['roleId']+'">\n' +
                    '<label class="form-check-label" for="chkMusRole_'+refRole[i]['roleId']+'">'+refRole[i]['roleDesc']+'</label>\n' +
                    '</div>';
                if (i === refRole.length - 1) {
                    $('#divMusChkRole').append(htmlRole);
                    $('#divMusChkRole').append('<p class="font-small text-danger mb-0" id="chkMusRoleErr"></p>');
                }
            }
        }

        let htmlContract = '';
        for (let i=0; i<refContract.length; i++) {
            if (typeof refContract[i] !== 'undefined') {
                htmlContract += '<div class="form-check form-check-inline mr-4">\n' +
                    '<input type="checkbox" class="form-check-input" id="chkMusContract_'+refContract[i]['contractId']+'" name="chkMusContract[]" value="'+refContract[i]['contractId']+'">\n' +
                    '<label class="form-check-label" for="chkMusContract_'+refContract[i]['contractId']+'">'+refContract[i]['contractNo']+'</label>\n' +
                    '</div>';
                if (i === refContract.length - 1) {
                    $('#divMusChkContract').append(htmlContract);
                    $('#divMusChkContract').append('<p class="font-small text-danger mb-0" id="chkMusContractErr"></p>');
                }
            }
        }

        $('input[name="chkMusRole[]"]').on('click', function () {
            try {
                if ($(this).val() === '2') {
                    if ($(this).prop('checked')) {
                        $('.divMusContract').show();
                        formValidate.enableField('chkMusContract[]');
                    } else {
                        $('.divMusContract').hide();
                        formValidate.disableField('chkMusContract[]');
                    }
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
        });

        const vData = [
            {
                field_id: 'txtMusUserName',
                type: 'text',
                name: 'ID Log Masuk',
                validator: {
                    notEmpty: true,
                    minLength: 6,
                    maxLength: 30
                }
            },
            {
                field_id: 'txtMusUserPassword',
                type: 'text',
                name: 'Kata Laluan',
                validator: {
                    notEmpty: true,
                    maxLength: 15,
                    minLength: 8,
                    password: true
                }
            },
            {
                field_id: 'txtMusUserFirstName',
                type: 'text',
                name: 'Nama Penuh',
                validator: {
                    notEmpty: true,
                    minLength: 6,
                    maxLength: 200
                }
            },
            {
                field_id: 'txtMusUserEmail',
                type: 'text',
                name: 'Alamat Emel',
                validator: {
                    notEmpty: true,
                    maxLength: 50,
                    email: true
                }
            },
            {
                field_id: 'txtMusUserContactNo',
                type: 'text',
                name: 'No. Telefon',
                validator: {
                    minLength: 8,
                    maxLength: 14,
                    digit: true
                }
            },
            {
                field_id: 'optMusGroup',
                type: 'select',
                name: 'Jabatan / Bahagian',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'chkMusRole[]',
                type: 'check',
                name: 'Peranan',
                validator: {
                    notEmptyCheck: true
                }
            },
            {
                field_id: 'chkMusContract[]',
                type: 'check',
                name: 'Kontrak',
                validator: {
                    notEmptyCheck: true
                }
            }
        ];

        formValidate = new MzValidate('formMus');
        formValidate.registerFields(vData);

        $('#btnMusSubmit').on('click', function () {
            if (!formValidate.validateNow()) {
                toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
            } else {
                ShowLoader();
                setTimeout(function () {
                    try {
                        const roleList = $.map($('input[name="chkMusRole[]"]:checked'), function(c){return c.value; });
                        const contractList = $.map($('input[name="chkMusContract[]"]:checked'), function(c){return c.value; });
                        const contractList2 = (jQuery.inArray('2', roleList) !== -1) ? contractList : [];
                        const dataUser = {
                            userName: $('#txtMusUserName').val(),
                            userPasswordTemp: $('#txtMusUserPassword').val(),
                            userFirstName: $('#txtMusUserFirstName').val(),
                            userEmail: $('#txtMusUserEmail').val(),
                            userContactNo: $('#txtMusUserContactNo').val(),
                            groupId: $('#optMusGroup').val()
                        };
                        const data = {
                            user: dataUser,
                            roleList: roleList,
                            contractList: contractList2
                        };
                        mzAjaxRequest('user', 'POST', data);
                        classFrom.genTable();
                        $('#modal_user').modal('hide');
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 200);
            }
        });

        $('#btnMusUpdate').on('click', function () {
            if (!formValidate.validateNow()) {
                toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
            } else {
                ShowLoader();
                setTimeout(function () {
                    try {
                        mzCheckFuncParam(userId);
                        const roleList = $.map($('input[name="chkMusRole[]"]:checked'), function(c){return c.value; });
                        const contractList = $.map($('input[name="chkMusContract[]"]:checked'), function(c){return c.value; });
                        const contractList2 = (jQuery.inArray('2', roleList) !== -1) ? contractList : [];
                        const dataUser = {
                            userName: $('#txtMusUserName').val(),
                            userPasswordTemp: $('#txtMusUserPassword').val(),
                            userFirstName: $('#txtMusUserFirstName').val(),
                            userEmail: $('#txtMusUserEmail').val(),
                            userContactNo: $('#txtMusUserContactNo').val(),
                            groupId: $('#optMusGroup').val()
                        };
                        const data = {
                            user: dataUser,
                            roleList: roleList,
                            contractList: contractList2
                        };
                        mzAjaxRequest('user/'+userId, 'PUT', data);
                        classFrom.genTable();
                        $('#modal_user').modal('hide');
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 200);
            }
        });
    };

    this.add = function () {
        formValidate.clearValidation();
        self.setSubmitType('add');

        $('.divMusContract').hide();
        formValidate.disableField('chkMusContract[]');
        $('#btnMusDelete, #btnMusUpdate').hide();
        $('#btnMusSubmit').show();
        $('#modal_user').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
    };

    this.edit = function (_userId) {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam(_userId);
                self.setUserId(_userId);
                self.setSubmitType('edit');
                formValidate.clearValidation();

                const user = mzAjaxRequest('user/full_details/'+userId, 'GET');
                mzSetFieldValue('MusUserName', user['userName'], 'text');
                mzSetFieldValue('MusUserPassword', user['userPasswordTemp'], 'text');
                mzSetFieldValue('MusUserFirstName', user['userFirstName'], 'text');
                mzSetFieldValue('MusUserEmail', user['userEmail'], 'text');
                mzSetFieldValue('MusUserContactNo', user['userContactNo'], 'text');
                mzSetFieldValue('MusGroup', user['groupId'], 'select');

                formValidate.disableField('chkMusContract[]');
                const roles = user['roles'];
                const roleSplit = roles.split(',');
                $.each(roleSplit, function (n, u) {
                    $('input[name="chkMusRole[]"][value="'+u+'"]').prop('checked', true);
                    if (u === '2') {
                        const contracts = user['contracts'];
                        const contractSplit = contracts.split(',');
                        $.each(contractSplit, function (n2, u2) {
                            $('input[name="chkMusContract[]"][value="'+u2+'"]').prop('checked', true);
                        });
                        formValidate.enableField('chkMusContract[]');
                    }
                });

                $('#btnMusDelete, #btnMusUpdate').show();
                $('#btnMusSubmit').hide();
                $('#modal_user').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 200);
    };

    this.getClassName = function () {
        return className;
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.setUserId = function (_userId) {
        userId = _userId;
    };

    this.setSubmitType = function (_submitType) {
        submitType = _submitType;
    };

    this.setRefGroup = function (_refGroup) {
        refGroup = _refGroup;
    };

    this.setRefRole = function (_refRole) {
        refRole = _refRole;
    };

    this.setRefContract = function (_refContract) {
        refContract = _refContract;
    };
}