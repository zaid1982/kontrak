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
		
		$('#modal_contract_claim_sub').on('hidden.bs.modal', function (e) {
			$('#modal_contract_claim').removeClass('modal-blur');
		});
	};
	
	this.add = function () {
        mzCheckFuncParam([contractId, contractClaimId]);
        //formMcbValidate.clearValidation();
        submitType = 'add';
        $('#btnMcbDelete').hide();
        $('#modal_contract_claim_sub').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
		$('#modal_contract_claim').addClass('modal-blur');
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