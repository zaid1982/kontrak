function SectionContract() {

    const className = 'SectionContract';
    let self = this;
    let classFrom;
    let isFirstLoad = true;
    let formMctValidate;
    let oTableSctSla;
    let oTableSctClaimAll;
    let oTableSctClaimCm;
    let oTableSctClaimPm;
    let oTableSctClaimMandays;
    let oTableSctClaimLesen;
    let contractId;
    let modalContractSlaClass;
    let modalContractClaimClass;

    this.init = function () {
        $('#sectionContract').hide();

        $('#btnSctBack').on('click', function () {
            $('#sectionContract').hide();
            classFrom.showMain();
        });

        mzDateFromTo('txtSctContractPeriodStart', 'txtSctContractPeriodEnd');

        let vDataSct = [
            {
                field_id: 'txtSctContractNo',
                type: 'text',
                name: 'No. Kontrak',
                validator: {
                    notEmpty: true,
                    maxLength: 25
                }
            },
            {
                field_id: 'txtSctContractTenderNo',
                type: 'text',
                name: 'No. Tender',
                validator: {
                    notEmpty: true,
                    maxLength: 25
                }
            },
            {
                field_id: 'txaSctContractName',
                type: 'text',
                name: 'Nama Kontrak',
                validator: {
                    maxLength: 500
                }
            },
            {
                field_id: 'txtSctContractBonValue',
                type: 'text',
                name: 'Bon Perlaksanaan',
                validator: {
                    numeric: true,
                    min: 0,
                    max: 1000000000
                }
            },
            {
                field_id: 'txtSctContractCeiling',
                type: 'text',
                name: 'Nilai Had Bumbung',
                validator: {
                    numeric: true,
                    min: 0,
                    max: 1000000000
                }
            },
            {
                field_id: 'txtSctContractCeilingYearlyCm',
                type: 'text',
                name: 'Siling Setahun (CM)',
                validator: {
                    numeric: true,
                    similarLess: {
                        id: "txtSctContractCeiling",
                        label: "Nilai Had Bumbung"
                    },
                    min: 0,
                    max: 1000000000
                }
            },
            {
                field_id: 'txtSctContractCeilingYearlyPm',
                type: 'text',
                name: 'Siling Setahun (PM)',
                validator: {
                    numeric: true,
                    similarLess: {
                        id: "txtSctContractCeiling",
                        label: "Nilai Had Bumbung"
                    },
                    min: 0,
                    max: 1000000000
                }
            },
            {
                field_id: 'txtSctContractCeilingYearlyMandays',
                type: 'text',
                name: 'Siling Setahun (Mandays)',
                validator: {
                    numeric: true,
                    similarLess: {
                        id: "txtSctContractCeiling",
                        label: "Nilai Had Bumbung"
                    },
                    min: 0,
                    max: 1000000000
                }
            },
            {
                field_id: 'txtSctContractCeilingYearlyLicense',
                type: 'text',
                name: 'Siling Setahun (Lesen)',
                validator: {
                    numeric: true,
                    similarLess: {
                        id: "txtSctContractCeiling",
                        label: "Nilai Had Bumbung"
                    },
                    min: 0,
                    max: 1000000000
                }
            },
            {
                field_id: 'txtSctContractPeriodYear',
                type: 'text',
                name: 'Jumlah Tahun Kontrak',
                validator: {
                    digit: true,
                    min: 0,
                    max: 10
                }
            },
            {
                field_id: 'txtSctContractPeriodStart',
                type: 'text',
                name: 'Tempoh Kontrak Dari',
                validator: {}
            },
            {
                field_id: 'txtSctContractPeriodEnd',
                type: 'text',
                name: 'Tempoh Kontrak Hingga',
                validator: {}
            },
            {
                field_id: 'txtSctContractWarranty',
                type: 'text',
                name: 'Jaminan',
                validator: {
                    maxLength: 250
                }
            },
            {
                field_id: 'txtSctContractCompanyName',
                type: 'text',
                name: 'Nama Syarikat',
                validator: {
                    maxLength: 150
                }
            },
            {
                field_id: 'txaSctContractCompanyAddress',
                type: 'text',
                name: 'Alamat Syarikat',
                validator: {
                    maxLength: 1000
                }
            },
            {
                field_id: 'txtSctContractProjectManager',
                type: 'text',
                name: 'Project Manager',
                validator: {
                    maxLength: 150
                }
            },
        ];

        formMctValidate = new MzValidate('formSct');
        formMctValidate.registerFields(vDataSct);

        $('#txtSctContractCeiling').on('keyup', function () {
            formMctValidate.validateFieldWithError('txtSctContractCeilingYearlyCm');
            formMctValidate.validateFieldWithError('txtSctContractCeilingYearlyPm');
            formMctValidate.validateFieldWithError('txtSctContractCeilingYearlyMandays');
            formMctValidate.validateFieldWithError('txtSctContractCeilingYearlyLicense');
        });

        $('#btnSctSave').on('click', function () {
            if (!formMctValidate.validateNow()) {
                toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
            } else {
                ShowLoader();
                setTimeout(function () {
                    try {
                        if (contractId === '') {
                            contractId = mzAjaxRequest('contract', 'POST');
                        }
                        const data = {
                            contractNo: $('#txtSctContractNo').val(),
                            contractTenderNo: $('#txtSctContractTenderNo').val(),
                            contractName: $('#txaSctContractName').val(),
                            contractBonValue: $('#txtSctContractBonValue').val(),
                            contractCeiling: $('#txtSctContractCeiling').val(),
                            contractCeilingYearlyCm: $('#txtSctContractCeilingYearlyCm').val(),
                            contractCeilingYearlyPm: $('#txtSctContractCeilingYearlyPm').val(),
                            contractCeilingYearlyMandays: $('#txtSctContractCeilingYearlyMandays').val(),
                            contractCeilingYearlyLicense: $('#txtSctContractCeilingYearlyLicense').val(),
                            contractPeriodYear: $('#txtSctContractPeriodYear').val(),
                            contractPeriodStart: mzConvertDate($('#txtSctContractPeriodStart').val()),
                            contractPeriodEnd: mzConvertDate($('#txtSctContractPeriodEnd').val()),
                            contractWarranty: $('#txtSctContractWarranty').val(),
                            contractCompanyName: $('#txtSctContractCompanyName').val(),
                            contractCompanyAddress: $('#txaSctContractCompanyAddress').val(),
                            contractProjectManager: $('#txtSctContractProjectManager').val()
                        }
                        mzAjaxRequest('contract/'+contractId, 'PUT', data);
                        self.setMainInfo();
                    } catch (e) {
                        toastr['error'](e.message, _ALERT_TITLE_ERROR);
                    }
                    HideLoader();
                }, 200);
            }
        });

        oTableSctSla =  $('#dtSctSla').DataTable({
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
                {mData: 'contractSlaDesc'}
            ]
        });
        let oTableSctSlaTbody = $('#dtSctSla tbody');
        oTableSctSlaTbody.delegate('tr', 'click', function () {
            const data = oTableSctSla.row(this).data();
            modalContractSlaClass.setContractSlaId(data['contractSlaId']);
            modalContractSlaClass.setContractId(contractId);
            modalContractSlaClass.setContractNo($('#txtSctContractNo').val());
            modalContractSlaClass.setContractName($('#txaSctContractName').val());
            modalContractSlaClass.edit();
        });
        oTableSctSlaTbody.delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            $cell.css( 'cursor', 'pointer' );
        });

        oTableSctClaimAll = $('#dtSctClaimAll').DataTable({
            bLengthChange: false,
            bFilter: false,
            language: _DATATABLE_LANGUAGE,
            aaSorting: [1, 'asc'],
            bPaginate: false,
            ordering: false,
            autoWidth: false,
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            dom: "<'row'<'col-sm-12'B>>" +
                "<'row'<'col-sm-12'tr>>",
            buttons: [
                { extend: 'colvis', text:'<i class="fas fa-columns"></i>', className: 'btn btn-sm px-2 mx-1 mb-1', titleAttr: 'Pilihan Kolum'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-print"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Cetak', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-copy"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-excel"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-pdf"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt}
            ],
            aoColumns: [
                {mData: null, sClass: 'text-center', bSortable: false},
                {mData: 'contractClaimDesc'},
                {mData: 'contractClaimInvoiceDate', sClass: 'text-center'},
                {mData: 'contractClaimInvoiceNo', sClass: 'text-center'},
                {mData: 'contractClaimInvoiceAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimReceivedAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimOverdueAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalance', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalancePerc', sClass: 'text-center', mRender: function (data) { return mzFormatNumber(data,1)}},
            ]
        });
        let oTableSctClaimAllTbody = $('#dtSctClaimAll tbody');
        oTableSctClaimAllTbody.delegate('tr', 'click', function () {
            const data = oTableSctClaimAll.row(this).data();
            modalContractClaimClass.setContractClaimId(data['contractClaimId']);
            modalContractClaimClass.setContractId(contractId);
            modalContractClaimClass.setContractClaimType(data['contractClaimType']);
            modalContractClaimClass.setContractNo($('#txtSctContractNo').val());
            modalContractClaimClass.setContractName($('#txaSctContractName').val());
            modalContractClaimClass.edit();
        });
        oTableSctClaimAllTbody.delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            $cell.css( 'cursor', 'pointer' );
        });

        oTableSctClaimCm = $('#dtSctClaimCm').DataTable({
            bLengthChange: false,
            bFilter: false,
            language: _DATATABLE_LANGUAGE,
            aaSorting: [1, 'asc'],
            bPaginate: false,
            ordering: false,
            autoWidth: false,
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            dom: "<'row'<'col-sm-12'B>>" +
                "<'row'<'col-sm-12'tr>>",
            buttons: [
                { extend: 'colvis', text:'<i class="fas fa-columns"></i>', className: 'btn btn-sm px-2 mx-1 mb-1', titleAttr: 'Pilihan Kolum'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-print"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Cetak', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-copy"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-excel"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-pdf"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt}
            ],
            aoColumns: [
                {mData: null, sClass: 'text-center', bSortable: false},
                {mData: 'contractClaimDesc'},
                {mData: 'contractClaimInvoiceDate', sClass: 'text-center'},
                {mData: 'contractClaimInvoiceNo', sClass: 'text-center'},
                {mData: 'contractClaimInvoiceAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimReceivedAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimOverdueAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalance', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalancePerc', sClass: 'text-center', mRender: function (data) { return mzFormatNumber(data,1)}},
                {mData: 'ceilingBalanceYear', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalanceYearPerc', sClass: 'text-center', mRender: function (data) { return mzFormatNumber(data,1)}}
            ]
        });
        let oTableSctClaimCmTbody = $('#dtSctClaimCm tbody');
        oTableSctClaimCmTbody.delegate('tr', 'click', function () {
            const data = oTableSctClaimCm.row(this).data();
            modalContractClaimClass.setContractClaimId(data['contractClaimId']);
            modalContractClaimClass.setContractId(contractId);
            modalContractClaimClass.setContractClaimType('CM');
            modalContractClaimClass.setContractNo($('#txtSctContractNo').val());
            modalContractClaimClass.setContractName($('#txaSctContractName').val());
            modalContractClaimClass.edit();
        });
        oTableSctClaimCmTbody.delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            $cell.css( 'cursor', 'pointer' );
        });

        oTableSctClaimPm = $('#dtSctClaimPm').DataTable({
            bLengthChange: false,
            bFilter: false,
            language: _DATATABLE_LANGUAGE,
            aaSorting: [1, 'asc'],
            bPaginate: false,
            ordering: false,
            autoWidth: false,
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            dom: "<'row'<'col-sm-12'B>>" +
                "<'row'<'col-sm-12'tr>>",
            buttons: [
                { extend: 'colvis', text:'<i class="fas fa-columns"></i>', className: 'btn btn-sm px-2 mx-1 mb-1', titleAttr: 'Pilihan Kolum'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-print"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Cetak', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-copy"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-excel"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-pdf"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt}
            ],
            aoColumns: [
                {mData: null, sClass: 'text-center', bSortable: false},
                {mData: 'contractClaimDesc'},
                {mData: 'contractClaimInvoiceDate', sClass: 'text-center'},
                {mData: 'contractClaimInvoiceNo', sClass: 'text-center'},
                {mData: 'contractClaimInvoiceAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimReceivedAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimOverdueAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalance', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalancePerc', sClass: 'text-center', mRender: function (data) { return mzFormatNumber(data,1)}},
                {mData: 'ceilingBalanceYear', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalanceYearPerc', sClass: 'text-center', mRender: function (data) { return mzFormatNumber(data,1)}}
            ]
        });
        let oTableSctClaimPmTbody = $('#dtSctClaimPm tbody');
        oTableSctClaimPmTbody.delegate('tr', 'click', function () {
            const data = oTableSctClaimPm.row(this).data();
            modalContractClaimClass.setContractClaimId(data['contractClaimId']);
            modalContractClaimClass.setContractId(contractId);
            modalContractClaimClass.setContractClaimType('PM');
            modalContractClaimClass.setContractNo($('#txtSctContractNo').val());
            modalContractClaimClass.setContractName($('#txaSctContractName').val());
            modalContractClaimClass.edit();
        });
        oTableSctClaimPmTbody.delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            $cell.css( 'cursor', 'pointer' );
        });

        oTableSctClaimMandays = $('#dtSctClaimMandays').DataTable({
            bLengthChange: false,
            bFilter: false,
            language: _DATATABLE_LANGUAGE,
            aaSorting: [1, 'asc'],
            bPaginate: false,
            ordering: false,
            autoWidth: false,
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            dom: "<'row'<'col-sm-12'B>>" +
                "<'row'<'col-sm-12'tr>>",
            buttons: [
                { extend: 'colvis', text:'<i class="fas fa-columns"></i>', className: 'btn btn-sm px-2 mx-1 mb-1', titleAttr: 'Pilihan Kolum'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-print"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Cetak', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-copy"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-excel"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-pdf"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt}
            ],
            aoColumns: [
                {mData: null, sClass: 'text-center', bSortable: false},
                {mData: 'contractClaimDesc'},
                {mData: 'contractClaimInvoiceDate', sClass: 'text-center'},
                {mData: 'contractClaimInvoiceNo', sClass: 'text-center'},
                {mData: 'contractClaimInvoiceAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimReceivedAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimOverdueAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalance', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalancePerc', sClass: 'text-center', mRender: function (data) { return mzFormatNumber(data,1)}},
                {mData: 'ceilingBalanceYear', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalanceYearPerc', sClass: 'text-center', mRender: function (data) { return mzFormatNumber(data,1)}}
            ]
        });
        let oTableSctClaimMandaysTbody = $('#dtSctClaimMandays tbody');
        oTableSctClaimMandaysTbody.delegate('tr', 'click', function () {
            const data = oTableSctClaimMandays.row(this).data();
            modalContractClaimClass.setContractClaimId(data['contractClaimId']);
            modalContractClaimClass.setContractId(contractId);
            modalContractClaimClass.setContractClaimType('Mandays');
            modalContractClaimClass.setContractNo($('#txtSctContractNo').val());
            modalContractClaimClass.setContractName($('#txaSctContractName').val());
            modalContractClaimClass.edit();
        });
        oTableSctClaimMandaysTbody.delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            $cell.css( 'cursor', 'pointer' );
        });

        oTableSctClaimLesen = $('#dtSctClaimLesen').DataTable({
            bLengthChange: false,
            bFilter: false,
            language: _DATATABLE_LANGUAGE,
            aaSorting: [1, 'asc'],
            bPaginate: false,
            ordering: false,
            autoWidth: false,
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            dom: "<'row'<'col-sm-12'B>>" +
                "<'row'<'col-sm-12'tr>>",
            buttons: [
                { extend: 'colvis', text:'<i class="fas fa-columns"></i>', className: 'btn btn-sm px-2 mx-1 mb-1', titleAttr: 'Pilihan Kolum'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-print"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Cetak', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-copy"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-excel"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-pdf"></i>', title:'PDRM SPK - Senarai Tututan CM', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt}
            ],
            aoColumns: [
                {mData: null, sClass: 'text-center', bSortable: false},
                {mData: 'contractClaimDesc'},
                {mData: 'contractClaimInvoiceDate', sClass: 'text-center'},
                {mData: 'contractClaimInvoiceNo', sClass: 'text-center'},
                {mData: 'contractClaimInvoiceAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimReceivedAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractClaimOverdueAmount', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalance', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalancePerc', sClass: 'text-center', mRender: function (data) { return mzFormatNumber(data,1)}},
                {mData: 'ceilingBalanceYear', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'ceilingBalanceYearPerc', sClass: 'text-center', mRender: function (data) { return mzFormatNumber(data,1)}}
            ]
        });
        let oTableSctClaimLesenTbody = $('#dtSctClaimLesen tbody');
        oTableSctClaimLesenTbody.delegate('tr', 'click', function () {
            const data = oTableSctClaimLesen.row(this).data();
            modalContractClaimClass.setContractClaimId(data['contractClaimId']);
            modalContractClaimClass.setContractId(contractId);
            modalContractClaimClass.setContractClaimType('Lesen');
            modalContractClaimClass.setContractNo($('#txtSctContractNo').val());
            modalContractClaimClass.setContractName($('#txaSctContractName').val());
            modalContractClaimClass.edit();
        });
        oTableSctClaimLesenTbody.delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            $cell.css( 'cursor', 'pointer' );
        });

        $('#btnSctSlaAdd').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (contractId === '') {
                        contractId = mzAjaxRequest('contract', 'POST');
                    }
                    modalContractSlaClass.setContractId(contractId);
                    modalContractSlaClass.setContractNo($('#txtSctContractNo').val());
                    modalContractSlaClass.setContractName($('#txaSctContractName').val());
                    modalContractSlaClass.add();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });

        $('#btnSctClaimCmAdd').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (contractId === '') {
                        contractId = mzAjaxRequest('contract', 'POST');
                    }
                    modalContractClaimClass.setContractId(contractId);
                    modalContractClaimClass.setContractClaimType('CM');
                    modalContractClaimClass.setContractNo($('#txtSctContractNo').val());
                    modalContractClaimClass.setContractName($('#txaSctContractName').val());
                    modalContractClaimClass.add();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });

        $('#btnSctClaimPmAdd').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (contractId === '') {
                        contractId = mzAjaxRequest('contract', 'POST');
                    }
                    modalContractClaimClass.setContractId(contractId);
                    modalContractClaimClass.setContractClaimType('PM');
                    modalContractClaimClass.setContractNo($('#txtSctContractNo').val());
                    modalContractClaimClass.setContractName($('#txaSctContractName').val());
                    modalContractClaimClass.add();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });

        $('#btnSctClaimMandaysAdd').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (contractId === '') {
                        contractId = mzAjaxRequest('contract', 'POST');
                    }
                    modalContractClaimClass.setContractId(contractId);
                    modalContractClaimClass.setContractClaimType('Mandays');
                    modalContractClaimClass.setContractNo($('#txtSctContractNo').val());
                    modalContractClaimClass.setContractName($('#txaSctContractName').val());
                    modalContractClaimClass.add();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });

        $('#btnSctClaimLesenAdd').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (contractId === '') {
                        contractId = mzAjaxRequest('contract', 'POST');
                    }
                    modalContractClaimClass.setContractId(contractId);
                    modalContractClaimClass.setContractClaimType('Lesen');
                    modalContractClaimClass.setContractNo($('#txtSctContractNo').val());
                    modalContractClaimClass.setContractName($('#txaSctContractName').val());
                    modalContractClaimClass.add();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });
    };

    this.add = function () {
        ShowLoader();
        setTimeout(function () {
            try {
                formMctValidate.clearValidation();
                contractId = '';
                mzDateFromToReset('txtSctContractPeriodStart', 'txtSctContractPeriodEnd');
                self.genTableSla();
                self.genTableClaimCm();
                classFrom.hideMain();
                $('#sectionContract').show();
                self.setChartHeight();
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 200);
    };

    this.load = function () {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam(contractId);
                formMctValidate.clearValidation();

                mzDateFromToReset('txtSctContractPeriodStart', 'txtSctContractPeriodEnd');
                const contract = mzAjaxRequest('contract/'+contractId, 'GET');
                mzSetFieldValue('SctContractNo', contract['contractNo'], 'text');
                mzSetFieldValue('SctContractTenderNo', contract['contractTenderNo'], 'text');
                mzSetFieldValue('SctContractName', contract['contractName'], 'textarea');
                mzSetFieldValue('SctContractBonValue', contract['contractBonValue'], 'text');
                mzSetFieldValue('SctContractCeiling', contract['contractCeiling'], 'text');
                mzSetFieldValue('SctContractCeilingYearlyCm', contract['contractCeilingYearlyCm'], 'text');
                mzSetFieldValue('SctContractCeilingYearlyPm', contract['contractCeilingYearlyPm'], 'text');
                mzSetFieldValue('SctContractCeilingYearlyMandays', contract['contractCeilingYearlyMandays'], 'text');
                mzSetFieldValue('SctContractCeilingYearlyLicense', contract['contractCeilingYearlyLicense'], 'text');
                mzSetFieldValue('SctContractPeriodYear', contract['contractPeriodYear'], 'text');
                mzSetFieldValue('SctContractPeriodStart', contract['contractPeriodStart'], 'date');
                mzSetFieldValue('SctContractPeriodEnd', contract['contractPeriodEnd'], 'date');
                mzSetFieldValue('SctContractWarranty', contract['contractWarranty'], 'text');
                mzSetFieldValue('SctContractCompanyName', contract['contractCompanyName'], 'text');
                mzSetFieldValue('SctContractCompanyAddress', contract['contractCompanyAddress'], 'textarea');
                mzSetFieldValue('SctContractProjectManager', contract['contractProjectManager'], 'text');

                self.setMainInfo();
                self.genTableSla();
                self.genTableClaimAll();
                self.genTableClaimCm();
                self.genTableClaimPm();
                classFrom.hideMain();
                $('#sectionContract').show();
                self.setChartHeight();
                self.generateChartBalanceCeiling();
                self.generateChartBalanceCeilingSub();
                self.generateChartTotalClaim();
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 200);
    };

    this.setMainInfo = function () {
        $('#lblSctInfoContractNo').text($('#txtSctContractNo').val());
        $('#lblSctInfoContractTenderNo').text($('#txtSctContractTenderNo').val());
        $('#lblSctInfoContractCeiling').text($('#txtSctContractCeiling').val() !== '' ? 'RM '+mzFormatNumber($('#txtSctContractCeiling').val(), 2) : '');
        const periodStart = $('#txtSctContractPeriodStart').val() !== '' ? moment(mzConvertDate($('#txtSctContractPeriodStart').val())).format('LL') : '-';
        const periodEnd = $('#txtSctContractPeriodEnd').val() !== '' ? moment(mzConvertDate($('#txtSctContractPeriodEnd').val())).format('LL') : '-';
        $('#lblSctInfoPeriod').text(periodStart + ' hingga ' + periodEnd);
        $('#lblSctInfoCompanyName').text($('#txtSctContractCompanyName').val());
    };

    this.setChartHeight = function () {
        let sectionContract = document.getElementById("sectionContract");
        if (sectionContract.offsetWidth > 690) {
            let divSctMainInfo = document.getElementById("divSctMainInfo");
            let divSctMainForm = document.getElementById("divSctMainForm");
            const totalHeight = divSctMainInfo.offsetHeight + divSctMainForm.offsetHeight - 350;
            $('#chartSct1').css('height', ((totalHeight / 2) - 24) + 'px');
            $('#chartSct3').css('height', (totalHeight / 2) + 'px');
        } else {
            $('#chartSct1').css('height', '310px');
            $('#chartSct3').css('height', '300px');
        }
    };

    this.genTableSla = function () {
        if (contractId !== '') {
            const dataDb = mzAjaxRequest('contract_sla/list/'+contractId, 'GET');
            oTableSctSla.clear().rows.add(dataDb).draw();
        } else {
            oTableSctSla.clear().draw();
        }
    };

    this.genTableClaimAll = function () {
        if (contractId !== '') {
            const dataDb = mzAjaxRequest('contract_claim/all/'+contractId, 'GET');
            oTableSctClaimAll.clear().rows.add(dataDb).draw();
        } else {
            oTableSctClaimAll.clear().draw();
        }
    };

    this.genTableClaimCm = function () {
        if (contractId !== '') {
            const dataDb = mzAjaxRequest('contract_claim/CM/'+contractId, 'GET');
            oTableSctClaimCm.clear().rows.add(dataDb).draw();
        } else {
            oTableSctClaimCm.clear().draw();
        }
    };

    this.genTableClaimPm = function () {
        if (contractId !== '') {
            const dataDb = mzAjaxRequest('contract_claim/PM/'+contractId, 'GET');
            oTableSctClaimPm.clear().rows.add(dataDb).draw();
        } else {
            oTableSctClaimPm.clear().draw();
        }
    };

    this.genTableClaimMandays = function () {
        if (contractId !== '') {
            const dataDb = mzAjaxRequest('contract_claim/Mandays/'+contractId, 'GET');
            oTableSctClaimMandays.clear().rows.add(dataDb).draw();
        } else {
            oTableSctClaimMandays.clear().draw();
        }
    };

    this.genTableClaimLesen = function () {
        if (contractId !== '') {
            const dataDb = mzAjaxRequest('contract_claim/Lesen/'+contractId, 'GET');
            oTableSctClaimLesen.clear().rows.add(dataDb).draw();
        } else {
            oTableSctClaimLesen.clear().draw();
        }
    };

    this.generateChartBalanceCeiling = function () {
        /*$.ajax({
            url: 'account/allList',
            type: 'GET', headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')},
            dataType: 'json', async: true,
            success: function (resp) {
                if (resp.success) {
                    let data = [];
                    $.each(resp.result, function (no, row) {
                        console.log(row);
                        const unixTime = new Date(row['ballDate'].replace(' ', 'T')).getTime();
                        console.log(unixTime);
                        data.push([unixTime, parseFloat(row['ballBalance'])]);
                    });*/
        Highcharts.chart('chartSct1', {
            chart: {
                type: 'solidgauge',
                plotBackgroundImage:  'https://www.highcharts.com/samples/graphics/sand.png',
                marginTop: -100
            },
            title: {
                text: 'Jumlah Tuntutan'
            },
            subtitle: {
                text: 'Jumlah Tuntuan dari Nilai Had Bumbung'
            },
            pane: {
                center: ['50%', '80%'],
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor:
                        Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            },
            yAxis: {
                stops: [
                    [0.1, '#55BF3B'], // green
                    [0.5, '#DDDF0D'], // yellow
                    [0.9, '#DF5353'] // red
                ],
                lineWidth: 0,
                tickWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,
                labels: {
                    y: 16
                },
                min: 0,
                max: 21350930.63,
                title: {
                    text: 'Jumlah<br/>Tuntutan Semasa'
                }
            },
            series: [{
                name: 'Jumlah Tuntutan Semasa',
                data: [1040930.03],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:20px">RM '+mzFormatNumber('1040930.03')+'</span><br/>' +
                        '<span style="font-size:11px;opacity:0.6">5.33 % dari Had Bumbung</span>' +
                        '</div>'
                },
                tooltip: {
                    valueSuffix: ' km/h'
                }
            }],
            credits: {
                enabled: false
            }
        });
        /*} else {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
    },
    error: function () {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
});*/
    };

    this.generateChartBalanceCeilingSub = function () {
        /*$.ajax({
            url: 'account/allList',
            type: 'GET', headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')},
            dataType: 'json', async: true,
            success: function (resp) {
                if (resp.success) {
                    let data = [];
                    $.each(resp.result, function (no, row) {
                        console.log(row);
                        const unixTime = new Date(row['ballDate'].replace(' ', 'T')).getTime();
                        console.log(unixTime);
                        data.push([unixTime, parseFloat(row['ballBalance'])]);
                    });*/
        Highcharts.chart('chartSct2-1', {
            chart: {
                inverted: true,
                marginLeft: 135,
                type: 'bullet',
                plotBackgroundImage:  'https://www.highcharts.com/samples/graphics/sand.png'
            },
            title: {
                text: 'Jumlah Tuntuan Tahunan'
            },
            subtitle: {
                text: 'Jumlah Tuntuan dari Had Bumbung 2021'
            },
            xAxis: {
                categories: ['<span class="hc-cat-title">Tuntutan CM</span><br/>Siling RM 1,040,930.00']
            },
            yAxis: {
                gridLineWidth: 0,
                plotBands: [{
                    from: 0,
                    to: 1040930,
                    color: '#80cbc4'
                }, {
                    from: 1040930,
                    to: 9e9,
                    color: '#d32f2f'
                }],
                title: null
            },
            plotOptions: {
                series: {
                    pointPadding: 0.25,
                    borderWidth: 0,
                    color: '#0d47a1',
                    targetOptions: {
                        width: '200%'
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            tooltip: {
                pointFormat: '<b>{point.y}</b> (with target at {point.target})'
            },
            series: [{
                data: [{
                    y: 550000,
                    target: 1040930
                }]
            }],
        });

        Highcharts.chart('chartSct2-2', {
            chart: {
                inverted: true,
                marginLeft: 135,
                type: 'bullet',
                plotBackgroundImage:  'https://www.highcharts.com/samples/graphics/sand.png'
            },
            title: null,
            xAxis: {
                categories: ['<span class="hc-cat-title">Tuntutan PM</span><br/>Siling RM 0.00']
            },
            yAxis: {
                gridLineWidth: 0,
                plotBands: [{
                    from: 0,
                    to: 500000,
                    color: '#80cbc4'
                }, {
                    from: 500000,
                    to: 9e9,
                    color: '#d32f2f'
                }],
                title: null
            },
            plotOptions: {
                series: {
                    pointPadding: 0.25,
                    borderWidth: 0,
                    color: '#0d47a1',
                    targetOptions: {
                        width: '200%'
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            tooltip: {
                pointFormat: '<b>{point.y}</b> (with target at {point.target})'
            },
            series: [{
                data: [{
                    y: 0,
                    target: 500000
                }]
            }],
        });

        Highcharts.chart('chartSct2-3', {
            chart: {
                inverted: true,
                marginLeft: 135,
                type: 'bullet',
                plotBackgroundImage:  'https://www.highcharts.com/samples/graphics/sand.png'
            },
            title: null,
            xAxis: {
                categories: ['<span class="hc-cat-title">Tuntutan Maindays</span><br/>Siling RM 1,340,930.00']
            },
            yAxis: {
                gridLineWidth: 0,
                plotBands: [{
                    from: 0,
                    to: 150,
                    color: '#666'
                }, {
                    from: 150,
                    to: 225,
                    color: '#999'
                }, {
                    from: 225,
                    to: 9e9,
                    color: '#bbb'
                }],
                title: null
            },
            plotOptions: {
                series: {
                    pointPadding: 0.25,
                    borderWidth: 0,
                    color: '#000',
                    targetOptions: {
                        width: '200%'
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            tooltip: {
                pointFormat: '<b>{point.y}</b> (with target at {point.target})'
            },
            series: [{
                data: [{
                    y: 275,
                    target: 250
                }]
            }],
        });

        Highcharts.chart('chartSct2-4', {
            chart: {
                inverted: true,
                marginLeft: 135,
                type: 'bullet',
                plotBackgroundImage:  'https://www.highcharts.com/samples/graphics/sand.png'
            },
            title: null,
            xAxis: {
                categories: ['<span class="hc-cat-title">Tuntutan Claim</span><br/>Siling RM 1,340,930.00']
            },
            yAxis: {
                gridLineWidth: 0,
                plotBands: [{
                    from: 0,
                    to: 150,
                    color: '#666'
                }, {
                    from: 150,
                    to: 225,
                    color: '#999'
                }, {
                    from: 225,
                    to: 9e9,
                    color: '#bbb'
                }],
                title: null
            },
            plotOptions: {
                series: {
                    pointPadding: 0.25,
                    borderWidth: 0,
                    color: '#000',
                    targetOptions: {
                        width: '200%'
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            tooltip: {
                pointFormat: '<b>{point.y}</b> (with target at {point.target})'
            },
            series: [{
                data: [{
                    y: 275,
                    target: 250
                }]
            }],
        });
        /*} else {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
    },
    error: function () {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
});*/
    };

    this.generateChartTotalClaim = function () {
        /*$.ajax({
            url: 'account/allList',
            type: 'GET', headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')},
            dataType: 'json', async: true,
            success: function (resp) {
                if (resp.success) {
                    let data = [];
                    $.each(resp.result, function (no, row) {
                        console.log(row);
                        const unixTime = new Date(row['ballDate'].replace(' ', 'T')).getTime();
                        console.log(unixTime);
                        data.push([unixTime, parseFloat(row['ballBalance'])]);
                    });*/
        Highcharts.chart('chartSct3', {
            chart: {
                type: 'column',
                plotBackgroundImage:  'https://www.highcharts.com/samples/graphics/sand.png'
            },
            title: {
                text: 'Jumlah Tuntutan'
            },
            subtitle: {
                text: 'Jumlah Tuntuan dari Nilai Had Bumbung'
            },
            xAxis: {
                categories: [
                    'PM',
                    'CM',
                    'Mandays',
                    'License'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Rainfall (mm)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: '2020',
                    data: [122221, 23233, 43334, 434343]
                },
                {
                    name: '2021',
                    data: [122221, 23233, 43334, 434343]
                }
            ]
        });
        /*} else {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
    },
    error: function () {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
});*/
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

    this.setModalContractSlaClass = function (_modalContractSlaClass) {
        modalContractSlaClass = _modalContractSlaClass;
    };

    this.setModalContractClaimClass = function (_modalContractClaimClass) {
        modalContractClaimClass = _modalContractClaimClass;
    };
}