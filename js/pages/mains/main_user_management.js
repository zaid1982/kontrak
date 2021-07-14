function MainUserManagement() {

    const className = 'MainUserManagement';
    let self = this;
    let oTableUsm;
    let refStatus;
    let refRole;
    let refGroup;
    let refContract;
    let modalUserClass;

    this.init = function () {
        let exportOptUsm = Object.assign({}, mzExportOpt);
        exportOptUsm['columns'] = [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12];
        oTableUsm =  $('#dtUsmData').DataTable({
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
            columnDefs: [
                { bSortable: false, targets: [0, 6, 7, 8, 9] },
                { className: 'text-center', targets: [0, 3, 10, 11, 12]},
                { visible: false, targets: [4, 8, 9, 10] },
                { className: 'noVis', targets: [0, 8, 9]}
            ],
            buttons: [
                { extend: 'colvis', columns: ':not(.noVis)', fade: 400, collectionLayout: 'two-column', text:'<i class="fas fa-columns"></i>', className: 'btn btn-sm px-2 mx-1 mb-1', titleAttr: 'Pilihan Kolum'},
                { extend: 'print', className: 'btn btn-outline-blue-grey btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-print"></i>', title:'PDRM SPK - Senarai Pengguna Sistem', titleAttr: 'Cetak', exportOptions: exportOptUsm},
                { extend: 'copy', className: 'btn btn-outline-blue btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-copy"></i>', title:'PDRM SPK - Senarai Pengguna Sistem', titleAttr: 'Copy', exportOptions: exportOptUsm},
                { extend: 'excelHtml5', className: 'btn btn-outline-green btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-excel"></i>', title:'PDRM SPK - Senarai Pengguna Sistem', titleAttr: 'Excel', exportOptions: exportOptUsm},
                { extend: 'pdfHtml5', className: 'btn btn-outline-red btn-sm px-2 mx-1 mb-1', text:'<i class="fas fa-file-pdf"></i>', title:'PDRM SPK - Senarai Pengguna Sistem', titleAttr: 'PDF', orientation: 'landscape', exportOptions: exportOptUsm}
            ],
            aoColumns: [
                {mData: null},
                {mData: 'userFirstName'},
                {mData: 'userName'},
                {mData: 'userContactNo'},
                {mData: 'userEmail'},
                {mData: 'groupId', mRender: function (data) { return data !== '' ? refGroup[data]['groupName'] : ''}},
                {mData: null, mRender: function (data, type, row) {
                        let label = '';
                        const cellValue = row['roles'];
                        if (cellValue !== '') {
                            label = '<ul style="padding-left: 20px; margin-bottom: 0px !important;">';
                            const dataSplit = cellValue.split(',');
                            for (let j=0; j<dataSplit.length; j++) {
                                label += '<li>' + refRole[dataSplit[j]]['roleDesc'] + '</li>';
                            }
                            label += '</ul>';
                        }
                        return label;
                    }
                },
                {mData: null, mRender: function (data, type, row) {
                        let label = '';
                        const cellValue = row['contracts'];
                        if (cellValue !== '') {
                            label = '<ul style="padding-left: 20px; margin-bottom: 0px !important;">';
                            const dataSplit = cellValue.split(',');
                            for (let j=0; j<dataSplit.length; j++) {
                                label += '<li>' + refContract[dataSplit[j]]['contractNo'] + '</li>';
                            }
                            label += '</ul>';
                        }
                        return label;
                    }
                },
                {mData: 'roles', mRender: function (data){
                        let label = '';
                        if (data !== '') {
                            label = '';
                            const dataSplit = data.split(',');
                            for (let j=0; j<dataSplit.length; j++) {
                                if (j>0) {
                                    label += ', ';
                                }
                                label += refRole[dataSplit[j]]['roleDesc'];
                            }
                        }
                        return label;
                    }},
                {mData: 'contracts'},
                {mData: 'userTimeCreated'},
                {mData: 'userTimeLogin', width: '10%'},
                {mData: 'userStatus', mRender: function (data){
                        return refStatus[data]['statusDesc'];
                    }}
            ]
        });
        let oTableUsmTbody = $('#dtUsmData tbody');
        oTableUsmTbody.delegate('tr', 'click', function () {
            const data = oTableUsm.row(this).data();
            modalUserClass.edit(data['userId']);
        });
        oTableUsmTbody.delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            $cell.css( 'cursor', 'pointer' );
        });

        $('#btnUsmAdd').on('click', function () {
            modalUserClass.add();
        });

        //self.runDashboard();
        self.genTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    this.genTable = function () {
        const data = mzAjaxRequest('user/full_list', 'GET');
        oTableUsm.clear().rows.add(data);
        oTableUsm.search('').columns().search('').draw();
    };

    this.getClassName = function () {
        return className;
    };

    this.setRefStatus = function (_refStatus) {
        refStatus = _refStatus;
    };

    this.setRefRole = function (_refRole) {
        refRole = _refRole;
    };

    this.setRefGroup = function (_refGroup) {
        refGroup = _refGroup;
    };

    this.setRefContract = function (_refContract) {
        refContract = _refContract;
    };

    this.setModalUserClass = function (_modalUserClass) {
        modalUserClass = _modalUserClass;
    };
}