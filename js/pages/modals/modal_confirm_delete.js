function ModalConfirmDelete() {
    let classFrom;
    let returnFlag;

    this.init = function () {
        $('#btnConfirmDelete').on('click', function () {
            classFrom.confirmDelete(returnFlag);
            $('#modal_confirm_delete').modal('hide');
        });
    };

    this.load = function (_returnFlag) {
        returnFlag = _returnFlag;
        $('#modal_confirm_delete').modal({backdrop: 'static', keyboard: false});
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.init();
}