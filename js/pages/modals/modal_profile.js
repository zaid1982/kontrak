function ModalProfile() {

    const className = 'ModalProfile';
    let self = this;
    let classFrom;
    let userId = '';

    this.init = function () {


        $('#btnChangeProfile').on('click', function () {
            let userInfo = sessionStorage.getItem('userInfo');
            const objEncrypted = CryptoJS.AES.decrypt(userInfo, 'SPDP2').toString(CryptoJS.enc.Utf8);
            userInfo = JSON.parse(objEncrypted);
            self.edit('Top', userInfo['userId']);
        });
    };

    this.edit = function (_userId) {
        mzCheckFuncParam([_userId]);
        userId = _userId;
        //$('#modal_profile')
        //    .modal({backdrop: 'static', keyboard: false})
        //    .scrollTop(0);
    };

    this.getClassName = function () {
        return className;
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.init();
}