function ModalContractSla() {

    const className = 'ModalContractSla';
    let self = this;
    let classFrom;
    let contractId = '';
    let contractSlaId = '';
    let formMcsValidate;
    let submitType = '';
    let confirmDelete;

    this.init = function () {
        const vDataMcs = [
            {
                field_id: 'txaMcsDesc',
                type: 'text',
                name: 'Penerangan SLA',
                validator: {
                    notEmpty: true,
                    maxLength: 1000
                }
            }
        ];

        formMcsValidate = new MzValidate('formMcs');
        formMcsValidate.registerFields(vDataMcs);

        $('#btnMcsSubmit').on('click', function () {
            if (!formMcsValidate.validateNow()) {
                toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
            } else {
                ShowLoader();
                setTimeout(function () {
                    try {
                        let data = {
                            contractSlaDesc: $('#txaMcsDesc').val()
                        }
                        if (submitType === 'add') {
                            data['contractId'] = contractId;
                            mzAjaxRequest('contract_sla', 'POST', data);
                        } else if (submitType === 'edit') {
                            mzAjaxRequest('contract_sla/'+contractSlaId, 'PUT', data);
                        } else {
                            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
                        }
                        if (classFrom.getClassName() === 'SectionContract') {
                            classFrom.genTableSla();
                        }
                        $('#modal_contract_sla').modal('hide');
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 200);
            }
        });

        $('#btnMcsDelete').on('click', function () {
            confirmDelete.setClassFrom(self);
            confirmDelete.load();
        });
    };

    this.add = function () {
        mzCheckFuncParam(contractId);
        formMcsValidate.clearValidation();
        submitType = 'add';
        $('#btnMcsDelete').hide();
        $('#modal_contract_sla').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
    };

    this.edit = function () {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam(contractSlaId);
                formMcsValidate.clearValidation();

                const contractSla = mzAjaxRequest('contract_sla/'+contractSlaId, 'GET');
                mzSetFieldValue('McsDesc', contractSla['contractSlaDesc'], 'textarea');
                submitType = 'edit';
                $('#btnMcsDelete').show();
                $('#modal_contract_sla').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
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
                mzCheckFuncParam(contractSlaId);
                mzAjaxRequest('contract_sla/'+contractSlaId, 'DELETE');
                if (classFrom.getClassName() === 'SectionContract') {
                    classFrom.genTableSla();
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

    this.setContractSlaId = function (_contractSlaId) {
        contractSlaId = _contractSlaId;
    };

    this.setContractNo = function (_contractNo) {
        mzSetFieldValue('McsContractNo', _contractNo, 'text');
    };

    this.setContractName = function (_contractName) {
        mzSetFieldValue('McsContractName', _contractName, 'textarea');
    };

    this.setModalConfirmDeleteClass = function (_confirmDelete) {
        confirmDelete = _confirmDelete;
    };
}