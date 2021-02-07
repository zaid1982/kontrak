function ModalContractClaim() {

    const className = 'ModalContractClaim';
    let self = this;
    let classFrom;
    let contractId = '';
    let contractClaimId = '';
    let contractClaimType = '';
    let formMccValidate;
    let submitType = '';
    let confirmDelete;

    this.init = function () {
        const vDataMcc = [
            {
                field_id: 'txaMccDesc',
                type: 'text',
                name: 'Jenis Penyelenggaraan',
                validator: {
                    notEmpty: true,
                    maxLength: 500
                }
            },
            {
                field_id: 'txtMccInvoiceNo',
                type: 'text',
                name: 'No. Invois',
                validator: {
                    notEmpty: true,
                    maxLength: 30
                }
            },
            {
                field_id: 'txtMccInvoiceDate',
                type: 'text',
                name: 'Tarikh Invois',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtMccInvoiceAmount',
                type: 'text',
                name: 'Jumlah Invois',
                validator: {
                    notEmpty: true,
                    numeric: true,
                    min: 0,
                    max: 1000000000
                }
            },
            {
                field_id: 'txtMccReceivedAmount',
                type: 'text',
                name: 'Jumlah Terima Bayaran',
                validator: {
                    numeric: true,
                    min: 0,
                    max: 1000000000
                }
            },
            {
                field_id: 'txtMccOverdueAmount',
                type: 'text',
                name: 'Bayaran Tertunggak',
                validator: {
                    numeric: true,
                    min: 0,
                    max: 1000000000
                }
            }
        ];

        formMccValidate = new MzValidate('formMcc');
        formMccValidate.registerFields(vDataMcc);

        $('#btnMccSubmit').on('click', function () {
            if (!formMccValidate.validateNow()) {
                toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
            } else {
                ShowLoader();
                setTimeout(function () {
                    try {
                        let data = {
                            contractClaimType: contractClaimType,
                            contractClaimDesc: $('#txaMccDesc').val(),
                            contractClaimInvoiceNo: $('#txtMccInvoiceNo').val(),
                            contractClaimInvoiceDate: mzConvertDate($('#txtMccInvoiceDate').val()),
                            contractClaimInvoiceAmount: $('#txtMccInvoiceAmount').val(),
                            contractClaimReceivedAmount: $('#txtMccReceivedAmount').val(),
                            contractClaimOverdueAmount: $('#txtMccOverdueAmount').val()
                        }
                        if (submitType === 'add') {
                            data['contractId'] = contractId;
                            mzAjaxRequest('contract_claim', 'POST', data);
                        } else if (submitType === 'edit') {
                            mzAjaxRequest('contract_claim/'+contractClaimId, 'PUT', data);
                        } else {
                            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
                        }
                        if (classFrom.getClassName() === 'SectionContract') {
                            self.genTableClaimAll();
                            if (contractClaimType === 'CM') {
                                classFrom.genTableClaimCm();
                            } else if (contractClaimType === 'PM') {
                                classFrom.genTableClaimPm();
                            } else if (contractClaimType === 'Mandays') {
                                classFrom.genTableClaimMandays();
                            } else if (contractClaimType === 'Lesen') {
                                classFrom.genTableClaimLesen();
                            }
                        }
                        $('#modal_contract_claim').modal('hide');
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 200);
            }
        });

        $('#btnMccDelete').on('click', function () {
            confirmDelete.setClassFrom(self);
            confirmDelete.load();
        });
    };

    this.add = function () {
        mzCheckFuncParam(contractId);
        formMccValidate.clearValidation();
        submitType = 'add';
        $('#btnMccDelete').hide();
        $('#modal_contract_claim').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
    };

    this.edit = function () {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam(contractClaimId);
                formMccValidate.clearValidation();

                const contractClaim = mzAjaxRequest('contract_claim/'+contractClaimId, 'GET');
                mzSetFieldValue('MccDesc', contractClaim['contractClaimDesc'], 'textarea');
                mzSetFieldValue('MccInvoiceNo', contractClaim['contractClaimInvoiceNo'], 'text');
                mzSetFieldValue('MccInvoiceDate', contractClaim['contractClaimInvoiceDate'], 'date');
                mzSetFieldValue('MccInvoiceAmount', contractClaim['contractClaimInvoiceAmount'], 'text');
                mzSetFieldValue('MccReceivedAmount', contractClaim['contractClaimReceivedAmount'], 'text');
                mzSetFieldValue('MccOverdueAmount', contractClaim['contractClaimOverdueAmount'], 'text');
                submitType = 'edit';
                $('#btnMccDelete').show();
                $('#modal_contract_claim').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 200);
    };

    this.delete = function () {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam(contractClaimId);
                mzAjaxRequest('contract_claim/'+contractClaimId, 'DELETE');
                if (classFrom.getClassName() === 'SectionContract') {
                    self.genTableClaimAll();
                    if (contractClaimType === 'CM') {
                        classFrom.genTableClaimCm();
                    } else if (contractClaimType === 'PM') {
                        classFrom.genTableClaimPm();
                    } else if (contractClaimType === 'Mandays') {
                        classFrom.genTableClaimMandays();
                    } else if (contractClaimType === 'Lesen') {
                        classFrom.genTableClaimLesen();
                    }
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 200);
    };

    this.confirmDelete = function (_returnFlag) {
        self.delete();
    }

    this.getClassName = function () {
        return className;
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.setContractId = function (_contractId) {
        contractId = _contractId;
    };

    this.setContractClaimId = function (_contractClaimId) {
        contractClaimId = _contractClaimId;
    };

    this.setContractClaimType = function (_contractClaimType) {
        contractClaimType = _contractClaimType;
        mzSetFieldValue('MccClaimType', contractClaimType, 'text');
    };

    this.setContractNo = function (_contractNo) {
        mzSetFieldValue('MccContractNo', _contractNo, 'text');
    };

    this.setContractName = function (_contractName) {
        mzSetFieldValue('MccContractName', _contractName, 'textarea');
    };

    this.setModalConfirmDeleteClass = function (_confirmDelete) {
        confirmDelete = _confirmDelete;
    };
}