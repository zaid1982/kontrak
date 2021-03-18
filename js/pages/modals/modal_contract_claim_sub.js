function ModalContractClaimSub() {

	const className = 'ModalContractClaimSub';
    let self = this;
    let classFrom;
    let contractId;
    let contractClaimId;
    let contractClaimSubId;
    let contractClaimSubType;
    let submitType;
    let formMcbValidate;
    let confirmDelete;
	
	this.init = function () {
		const vDataMcb = [
            {
                field_id: 'txtMcbClaimSubDesc',
                type: 'text',
                name: 'Jenis Alat Ganti',
                validator: {
                    notEmpty: true,
                    maxLength: 200
                }
            },
            {
                field_id: 'txtMcbClaimSubRefNo',
                type: 'text',
                name: 'No Rujukan',
                validator: {
                    notEmpty: true,
                    maxLength: 50
                }
            },
            {
                field_id: 'txtMcbClaimSubCost',
                type: 'text',
                name: 'Kos Per Unit',
                validator: {
                    notEmpty: true,
                    numeric: true,
                    min: 0,
                    max: 100000000
                }
            },
            {
                field_id: 'txtMcbClaimSubTotal',
                type: 'text',
                name: 'Jumlah Unit',
                validator: {
                    notEmpty: true,
                    digit: true,
                    min: 0,
                    max: 100000
                }
            },
			{
                field_id: 'txtMcbClaimSubApprovalMinute',
                type: 'text',
                name: 'Minit Kelulusan TSM',
                validator: {
                    notEmpty: false,
                    maxLength: 200
                }
            }
		];

        formMcbValidate = new MzValidate('formMcb');
        formMcbValidate.registerFields(vDataMcb);
		
		$('.funcMcbCalculateCost').on('keyup', function () {
			let totalCost = 0;
			if (formMcbValidate.validateField('txtMcbClaimSubCost') && formMcbValidate.validateField('txtMcbClaimSubTotal')) {
				totalCost = parseFloat($('#txtMcbClaimSubCost').val()) * parseInt($('#txtMcbClaimSubTotal').val());
			}
			mzSetFieldValue('McbClaimSubTotalCost', mzFormatNumber(totalCost,2), 'text');
        });
		
		$('#btnMcbSubmit').on('click', function () {
            if (!formMcbValidate.validateNow()) {
                toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
            } else {
                ShowLoader();
                setTimeout(function () {
                    try {
                        let data = {
                            contractClaimSubType: contractClaimSubType,
                            contractClaimSubDesc: $('#txtMcbClaimSubDesc').val(),
                            contractClaimSubRefNo: $('#txtMcbClaimSubRefNo').val(),
                            contractClaimSubCost: $('#txtMcbClaimSubCost').val(),
                            contractClaimSubTotal: $('#txtMcbClaimSubTotal').val(),
                            contractClaimSubApprovalMinute: $('#txtMcbClaimSubApprovalMinute').val()
                        }
                        if (submitType === 'add') {
                            data['contractId'] = contractId;
                            data['contractClaimId'] = contractClaimId;
                            mzAjaxRequest('contract_claim_sub', 'POST', data);
                        } else if (submitType === 'edit') {
                            mzAjaxRequest('contract_claim_sub/'+contractClaimSubId, 'PUT', data);
                        } else {
                            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
                        }
                        if (classFrom.getClassName() === 'ModalContractClaim') {
                            if (contractClaimSubType === 'Ganti Baru') {
								classFrom.genTableNew();
							} else if (contractClaimSubType === 'Alat Ganti') {
								classFrom.genTableReplace();
							}
                        }
                        $('#modal_contract_claim_sub').modal('hide');
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 200);
            }
        });
		
		$('#modal_contract_claim_sub').on('hidden.bs.modal', function (e) {
			if (classFrom.getClassName() === 'ModalContractClaim') {
				$('#modal_contract_claim').removeClass('modal-blur');
			}
		});
	};
	
	this.setForm = function () {
		if (contractClaimSubType === 'Ganti Baru') {
			$('#divMcbApprovalMinute').show();
			$('#lblMcbClaimSubRefNo').text('No Rujukan Dalam Jadual 3C');
		} else if (contractClaimSubType === 'Alat Ganti') {
			$('#divMcbApprovalMinute').hide();
			$('#lblMcbClaimSubRefNo').text('No Rujukan Dalam Jadual 3A');
		}
	};
	
	this.add = function () {
        mzCheckFuncParam([contractId, contractClaimId]);
        formMcbValidate.clearValidation();
        submitType = 'add';		
		self.setForm();
        $('#btnMcbDelete').hide();
        $('#modal_contract_claim_sub').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
		if (classFrom.getClassName() === 'ModalContractClaim') {
			$('#modal_contract_claim').addClass('modal-blur');
		}
    };
	
	this.delete = function () {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam(contractClaimId);
                mzAjaxRequest('contract_claim_sub/'+contractClaimSubId, 'DELETE');
                if (classFrom.getClassName() === 'ModalContractClaim') {
                    if (contractClaimSubType === 'Ganti Baru') {
                        classFrom.genTableNew();
                    } else if (contractClaimSubType === 'Alat Ganti') {
                        classFrom.genTableReplace();
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
	
	this.setModalConfirmDeleteClass = function (_confirmDelete) {
        confirmDelete = _confirmDelete;
    };

    this.setContractId = function (_contractId) {
        contractId = _contractId;
    };

    this.setContractClaimId = function (_contractClaimId) {
        contractClaimId = _contractClaimId;
    };

    this.setContractClaimSubId = function (_contractClaimSubId) {
        contractClaimSubId = _contractClaimSubId;
    };
	
	this.setContractClaimSubType = function (_contractClaimSubType) {
        contractClaimSubType = _contractClaimSubType;
		$('#lblMcbTitle').text(contractClaimSubType);
    };
	
	this.setContractNo = function (_contractNo) {
        mzSetFieldValue('McbContractNo', _contractNo, 'text');
    };

    this.setContractName = function (_contractName) {
        mzSetFieldValue('McbContractName', _contractName, 'textarea');
    };

    this.setContractClaimDesc = function (_contractClaimDesc) {
        mzSetFieldValue('McbContractClaimDesc', _contractClaimDesc, 'textarea');
    };

    this.setModalConfirmDeleteClass = function (_confirmDelete) {
        confirmDelete = _confirmDelete;
    };
}