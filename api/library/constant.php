<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 2/18/2019
 * Time: 10:39 PM
 */

class Class_constant {

    //const URL = '//metadatasyst.com/gems/api/';
    //const URL = '//daftar.pdp.gov.my/api/';
    const URL = '//localhost:8081/kontrak/api/';

    const ERR_DEFAULT = 'Kesilapan pada sistem. Sila hubungi pihak Admin PDRM!';
    const ERR_LOGIN_NOT_EXIST = 'Invalid Login ID or Password. Please try again.';
    const ERR_LOGIN_WRONG_PASSWORD = 'Invalid Login ID or Password. Please try again.';
    const ERR_LOGIN_BLOCK = 'You account has been blocked. Please retry after 10 minutes.';
    const ERR_RESET_SAME_PASSWORD = 'Password cannot be similar to previous';
    const ERR_LOGIN_NOT_ACTIVE = 'ID Pengguna tidak aktif. Sila hubungi pihak Admin JPDP untuk mengaktifkan kembali akaun anda.';
    const ERR_USER_ALREADY_ACTIVATED = 'Your ID already activated.';
    const ERR_FORGOT_PASSWORD_NOT_EXIST = 'Email not exist';
    const ERR_CHANGE_PASSWORD_WRONG_CURRENT = 'Kata Laluan Sekarang tidak betul.';
    const ERR_CHANGE_PASSWORD_OLD_NEW_SAME = 'Kata Laluan baharu mesti berlainan dari Kata Laluan Sekarang.';
    const ERR_ROLE_DELETE_HAVE_TASK = 'This user cannot be removed from this roles since there are still task assigned. Please delegate the task first.';
    const ERR_ROLE_DELETE_ALONE = 'There is no other user are assigned to this role. Please assign this role to new user before remove this user form this role.';
    const ERR_USER_ADD_SIMILAR_USERNAME = 'Login ID already registered. Please choose another ID.';
    const ERR_USER_ADD_SIMILAR_EMAIL = 'Email already registered. Please choose another email.';
    const ERR_USER_REGISTER_SIMILAR_USERNAME = 'No. Pendaftaran Syarikat telah didaftarkan. Sila hubungi pihak Admin JPDP untuk keterangan lanjut.';
    const ERR_USER_REGISTER_SIMILAR_NO_PENDAFTARAN = 'No. Pendaftaran Syarikat telah didaftarkan. Sila hubungi pihak Admin JPDP untuk keterangan lanjut.';

    const SUC_FORGOT_PASSWORD = 'Your password successfully reset. Please login with temporary password sent to your email.';
    const SUC_CHANGE_PASSWORD = 'Kata Laluan Baharu anda berjaya disimpan.';
    const SUC_RESET_PASSWORD = 'Your password successfully updated';
    const SUC_ACTIVATED = 'Kata Laluan Baharu anda berjaya disimpan. Akaun anda telah diaktifkan.';
    const SUC_UPDATE_PROFILE = 'Your profile successfully updated';
    const SUC_EDIT_PASSWORD = 'Password successfully changed';
    const SUC_REGISTER = 'Anda telah berjaya mendaftar sebagai Pengguna SPDP. Sila semak email untuk pengesahan.';

    const ERR_USER_DEACTIVATE = 'User already inactive';
    const ERR_USER_ACTIVATE = 'User already active';
    const ERR_USER_EXIST_IN_GROUP = 'User already registered in PPM / WO Group for current site. Please remove user from the group first to change site.';
    const ERR_TASK_ALREADY_SUBMITTED = 'Transaksi Permohonan ini telah dihantar sebelum ini. Sila refresh halaman atau hubungi pihak Admin JPDP jika ralat masih berlaku.';
    const ERR_TASK_CLAIMED = 'Transaksi Permohonan ini telah diambil oleh pengguna lain sebelum ini. Sila refresh halaman atau hubungi pihak Admin JPDP jika ralat masih berlaku.';

    const SUC_CONTRACT_UPDATE = 'Kontrak berjaya dikemaskini';
    const SUC_CONTRACT_DELETE = 'Kontrak berjaya dihapus';
    const SUC_CONTRACT_SLA_ADD = 'Kontrak SLA berjaya ditambah';
    const SUC_CONTRACT_SLA_UPDATE = 'Kontrak SLA berjaya dikemaskini';
    const SUC_CONTRACT_SLA_DELETE = 'Kontrak SLA berjaya dihapus';
    const SUC_CONTRACT_CLAIM_ADD = 'Tuntutan berjaya ditambah';
    const SUC_CONTRACT_CLAIM_UPDATE = 'Tuntutan berjaya dikemaskini';
    const SUC_CONTRACT_CLAIM_DELETE = 'Tuntutan berjaya dihapus';
    const SUC_CONTRACT_CLAIM_SUB_ADD = 'Tuntutan Penggantian berjaya ditambah';
    const SUC_CONTRACT_CLAIM_SUB_UPDATE = 'Tuntutan Penggantian berjaya dikemaskini';
    const SUC_CONTRACT_CLAIM_SUB_DELETE = 'Tuntutan Penggantian berjaya dihapus';
}