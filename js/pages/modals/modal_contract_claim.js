function ModalContractClaim() {

    const className = 'ModalContractClaim';
    let self = this;
    let classFrom;
    let contractId;
    let contractClaimId;
    let contractClaimType;
    let formMccValidate;
    let submitType;
    let confirmDelete;
	let oTableMccReplace;
	let oTableMccNew;
	let modalContractClaimSubClass;

    this.init = function () {
        const vDataMcc = [
            {
                field_id: 'txaMccDesc',
                type: 'text',
                name: 'Tajuk Penyelenggaraan',
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
                            classFrom.genTableClaimAll();
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
            confirmDelete.load(contractClaimId, contractClaimType);
        });
		
		oTableMccReplace =  $('#dtMccReplace').DataTable({
            bLengthChange: false,
            bFilter: false,
            language: _DATATABLE_LANGUAGE,
            bInfo: false,
            bPaginate: false,
            ordering: false,
            autoWidth: false,
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            aoColumns: [
                {mData: null, sClass: 'text-center', bSortable: false},
                {mData: 'contractClaimSubDesc'},
                {mData: 'contractClaimSubRefNo'},
                {mData: 'contractClaimSubTotal', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimSubCost', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimSubTotalCost', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
            ]
        });
        let oTableMccReplaceTbody = $('#dtMccReplace tbody');
        oTableMccReplaceTbody.delegate('tr', 'click', function () {
            const data = oTableMccReplace.row(this).data();
            modalContractClaimSubClass.setContractClaimSubId(data['contractClaimSubId']);
            modalContractClaimSubClass.setContractClaimSubType('Alat Ganti');
            modalContractClaimSubClass.setContractNo($('#txtMccContractNo').val());
            modalContractClaimSubClass.setContractName($('#txaMccContractName').val());
            modalContractClaimSubClass.setContractClaimDesc($('#txaMccDesc').val());
            modalContractClaimSubClass.edit();
        });
        oTableMccReplaceTbody.delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            $cell.css( 'cursor', 'pointer' );
        });
		
		oTableMccNew =  $('#dtMccNew').DataTable({
            bLengthChange: false,
            bFilter: false,
            language: _DATATABLE_LANGUAGE,
            bInfo: false,
            bPaginate: false,
            ordering: false,
            autoWidth: false,
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            aoColumns: [
                {mData: null, sClass: 'text-center', bSortable: false},
                {mData: 'contractClaimSubDesc'},
                {mData: 'contractClaimSubRefNo'},
                {mData: 'contractClaimSubTotal', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimSubCost', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimSubTotalCost', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimSubApprovalMinute'},
            ]
        });
        let oTableMccNewTbody = $('#dtMccNew tbody');
        oTableMccNewTbody.delegate('tr', 'click', function () {
            const data = oTableMccNew.row(this).data();
            modalContractClaimSubClass.setContractClaimSubId(data['contractClaimSubId']);
            modalContractClaimSubClass.setContractClaimSubType('Ganti Baru');
            modalContractClaimSubClass.setContractNo($('#txtMccContractNo').val());
            modalContractClaimSubClass.setContractName($('#txaMccContractName').val());
            modalContractClaimSubClass.setContractClaimDesc($('#txaMccDesc').val());
            modalContractClaimSubClass.edit();
        });
        oTableMccNewTbody.delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            $cell.css( 'cursor', 'pointer' );
        });
		
		$('#btnMccReplaceAdd').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    modalContractClaimSubClass.setClassFrom(self);
					modalContractClaimSubClass.setContractId(contractId);   
					modalContractClaimSubClass.setContractClaimId(contractClaimId);  
					modalContractClaimSubClass.setContractClaimSubType('Alat Ganti');      
					modalContractClaimSubClass.setContractNo($('#txtMccContractNo').val());
                    modalContractClaimSubClass.setContractName($('#txaMccContractName').val());
					modalContractClaimSubClass.setContractClaimDesc($('#txaMccDesc').val()); 
                    modalContractClaimSubClass.add();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });
		
		$('#btnMccNewAdd').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    modalContractClaimSubClass.setClassFrom(self);
					modalContractClaimSubClass.setContractId(contractId);   
					modalContractClaimSubClass.setContractClaimId(contractClaimId);  
					modalContractClaimSubClass.setContractClaimSubType('Ganti Baru');      
					modalContractClaimSubClass.setContractNo($('#txtMccContractNo').val());
                    modalContractClaimSubClass.setContractName($('#txaMccContractName').val());
					modalContractClaimSubClass.setContractClaimDesc($('#txaMccDesc').val()); 
                    modalContractClaimSubClass.add();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });
    };

    this.add = function () {
        mzCheckFuncParam([contractId]);
		contractClaimId = '';
        formMccValidate.clearValidation();
        submitType = 'add';
        $('#btnMccDelete, .divMccIsCm').hide();
        $('#modal_contract_claim').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
    };

    this.edit = function () {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam([contractId, contractClaimId]);
                formMccValidate.clearValidation();

                const contractClaim = mzAjaxRequest('contract_claim/'+contractClaimId, 'GET');
                mzSetFieldValue('MccDesc', contractClaim['contractClaimDesc'], 'textarea');
                mzSetFieldValue('MccInvoiceNo', contractClaim['contractClaimInvoiceNo'], 'text');
                mzSetFieldValue('MccInvoiceDate', contractClaim['contractClaimInvoiceDate'], 'date');
                mzSetFieldValue('MccInvoiceAmount', contractClaim['contractClaimInvoiceAmount'], 'text');
                mzSetFieldValue('MccReceivedAmount', contractClaim['contractClaimReceivedAmount'], 'text');
                mzSetFieldValue('MccOverdueAmount', contractClaim['contractClaimOverdueAmount'], 'text');
				
				$('.divMccIsCm').hide();
				if (contractClaimType === 'CM') {
					$('.divMccIsCm').show();
					self.genTableReplace();
					self.genTableNew();
				}
                submitType = 'edit';
                $('#btnMccDelete').show();
                $('#modal_contract_claim').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 200);
    };

    this.confirmDelete = function (_returnId, _returnFlag) {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam(_returnId, _returnFlag);
                mzAjaxRequest('contract_claim/'+_returnId, 'DELETE');
                if (classFrom.getClassName() === 'SectionContract') {
                    classFrom.genTableClaimAll();
                    if (_returnFlag === 'CM') {
                        classFrom.genTableClaimCm();
                    } else if (_returnFlag === 'PM') {
                        classFrom.genTableClaimPm();
                    } else if (_returnFlag === 'Mandays') {
                        classFrom.genTableClaimMandays();
                    } else if (_returnFlag === 'Lesen') {
                        classFrom.genTableClaimLesen();
                    }
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 200);
    };

    this.cancelDelete = function () {
        $('#modal_contract_claim').modal({backdrop: 'static', keyboard: false}).scrollTop(0);
    };
	
	this.genTableReplace = function () {
		const dataDb = mzAjaxRequest('contract_claim_sub/list_replace/'+contractClaimId, 'GET');
		oTableMccReplace.clear().rows.add(dataDb).draw();
	};
	
	this.genTableNew = function () {
		const dataDb = mzAjaxRequest('contract_claim_sub/list_new/'+contractClaimId, 'GET');
		oTableMccNew.clear().rows.add(dataDb).draw();
	};

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

    this.setModalContractClaimSubClass = function (_modalContractClaimSubClass) {
        modalContractClaimSubClass = _modalContractClaimSubClass;
    };
}