function MainContract () {

    const className = 'MainContract';
    let self = this;
    let oTableCtr;
    let sectionContractClass;
    let refStatus;

    this.init = function () {
        oTableCtr =  $('#dtCtrData').DataTable({
            bLengthChange: false,
            bFilter: true,
            language: _DATATABLE_LANGUAGE,
            aaSorting: [1, 'asc'],
            autoWidth: false,
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = $(this).DataTable().page.info();
                $('td', nRow).eq(0).html(info.start + (iDisplayIndex + 1));
            },
            dom: "<'row'<'col-sm-6'B><'col-sm-6 pb-0'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5 d-none d-md-block'i><'col-sm-12 col-md-7'p>>",
            buttons: [
                { extend: 'colvis', text:'<i class="fas fa-columns"></i>', className: 'btn btn-sm px-2 mx-1 mb-1', titleAttr: 'Pilihan Kolum'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-print"></i>', title:'PDRM SPK - Senarai Kontrak', titleAttr: 'Cetak', exportOptions: mzExportOpt},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-copy"></i>', title:'PDRM SPK - Senarai Kontrak', titleAttr: 'Copy', exportOptions: mzExportOpt},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-excel"></i>', title:'PDRM SPK - Senarai Kontrak', titleAttr: 'Excel', exportOptions: mzExportOpt},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-pdf"></i>', title:'PDRM SPK - Senarai Kontrak', titleAttr: 'PDF', orientation: 'landscape', exportOptions: mzExportOpt}
            ],
            aoColumns: [
                {mData: null, sClass: 'text-center', bSortable: false},
                {mData: 'contractTenderNo', sClass: 'text-center', visible:false},
                {mData: 'contractNo', sClass: 'text-center'},
                {mData: 'contractName'},
                {mData: 'contractCeiling', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}},
                {mData: 'contractCeilingYearlyCm', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}, visible:false},
                {mData: 'contractCeilingYearlyPm', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}, visible:false},
                {mData: 'contractCeilingYearlyMandays', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}, visible:false},
                {mData: 'contractCeilingYearlyLicense', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}, visible:false},
                {mData: 'contractPeriodStart', sClass: 'text-center'},
                {mData: 'contractPeriodEnd', sClass: 'text-center'},
                {mData: 'contractBonValue', sClass: 'text-right', mRender: function (data) { return mzFormatNumber(data,2)}, visible:false},
                {mData: 'contractSla', visible:false,
                    mRender: function (data) {
                        let label = '';
                        if (data !== '') {
                            label = '<ul style="padding-left: 17px; margin-bottom: 0px !important;">';
                            const dataSplit = data.split('||');
                            for (let j=0; j<dataSplit.length; j++) {
                                label += '<li>' + dataSplit[j] + '</li>';
                            }
                            label += '</ul>';
                        }
                        return label;
                    }
                },
                {mData: 'contractWarranty', visible:false},
                {mData: 'contractCompanyName'},
                {mData: 'contractCompanyAddress', visible:false},
                {mData: 'contractProjectManager'},
                {mData: 'contractCreatedByName', visible:false},
                {mData: 'contractTimeCreated', sClass: 'text-center', visible:false},
                {mData: 'contractTimeUpdated', sClass: 'text-center', visible:false},
                {mData: 'contractStatus', sClass: 'text-center', visible:false, mRender: function (data){
                        return refStatus[data]['statusDesc'];
                    }}

            ]
        });
        let oTableCtrTbody = $('#dtCtrData tbody');
        oTableCtrTbody.delegate('tr', 'click', function () {
            const data = oTableCtr.row(this).data();
            sectionContractClass.setContractId(data['contractId']);
            sectionContractClass.load();
        });
        oTableCtrTbody.delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            $cell.css( 'cursor', 'pointer' );
        });

        $('#btnDtCtrDataRefresh').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    self.genTable();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });

        $('#btnDtCtrDataAdd').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    sectionContractClass.add();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });

        self.genTable();
    };

    this.getClassName = function () {
        return className;
    };

    this.showMain = function () {
        $('.sectionCtrMain').show();
        self.genTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    this.hideMain = function () {
        $('.sectionCtrMain').hide();
    };

    this.genTable = function () {
        const data = mzAjaxRequest('contract/full_list', 'GET');
        oTableCtr.clear().rows.add(data);
        oTableCtr.search('').columns().search('').draw();
    };

    this.setSectionContractClass = function (_sectionContractClass) {
        sectionContractClass = _sectionContractClass;
    };

    this.setRefStatus = function (_refStatus) {
        refStatus = _refStatus;
    };
}