function ModalConfirmDelete() {
    let classFrom;
    let returnFlag;
    let returnId;

    this.init = function () {
        $('#btnConfirmDelete').on('click', function () {
            classFrom.confirmDelete(returnId, returnFlag);
            $('#modal_confirm_delete').modal('hide');
        });

        $('#btnCancelDelete').on('click', function () {
            classFrom.cancelDelete();
        });
    };

    this.load = function (_returnId, _returnFlag) {
        returnId = _returnId;
        returnFlag = _returnFlag;
        $('#modal_confirm_delete').modal({backdrop: 'static', keyboard: false});
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.init();
}