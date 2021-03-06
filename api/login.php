<?php
require_once 'library/constant.php';
require_once 'function/db.php';
require_once 'function/f_general.php';
require_once 'function/f_login.php';
require_once 'function/f_user.php';
require_once 'function/f_address.php';
require_once 'function/f_email.php';

$api_name = 'api_login';
$is_transaction = false;
$form_data = array('success'=>false, 'result'=>'', 'error'=>'', 'errmsg'=>'');
$result = '';

$constant = new Class_constant();
$fn_general = new Class_general();
$fn_login = new Class_login();
$fn_user = new Class_user();
$fn_address = new Class_address();
$fn_email = new Class_email();

try {
    $fn_general->__set('constant', $constant);
    $fn_login->__set('constant', $constant);
    $fn_login->__set('fn_general', $fn_general);
    $fn_user->__set('constant', $constant);
    $fn_user->__set('fn_general', $fn_general);
    $fn_email->__set('fn_general', $fn_general);

    Class_db::getInstance()->db_connect();
    //$request_method = filter_input(INPUT_SERVER, 'REQUEST_METHOD');
    $request_method = $_SERVER['REQUEST_METHOD'];
    $fn_general->log_debug('API', $api_name, __LINE__, 'Request method = '.$request_method);

    $urlArr = explode('/', $_SERVER['REQUEST_URI']);
    foreach ($urlArr as $i=>$param) {
        if ($param === 'login') {
            break;
        }
        array_shift($urlArr);
    }

    if ('POST' === $request_method) {
        Class_db::getInstance()->db_beginTransaction();
        $is_transaction = true;
        $param = $_POST;
        if (isset ($urlArr[1])) {
            if ($urlArr[1] === 'forgot_password') {
                $username = filter_input(INPUT_POST, 'username');
                $result = $fn_user->forgot_password($username);
                $fn_email->setup_email($result['userId'], 16, array('tempPassword'=>$result['tempPassword']));
                //$fn_general->save_audit('4', $userId);
                $form_data['errmsg'] = $constant::SUC_FORGOT_PASSWORD;
            }
        } else {
            $username = filter_input(INPUT_POST, 'username');
            $password = filter_input(INPUT_POST, 'password');
            $roleId = filter_input(INPUT_POST, 'roleId');

            $result = $fn_login->check_login_web($param);
            //$fn_general->save_audit('1', $result['userId']);
        }

        Class_db::getInstance()->db_commit();
        $form_data['result'] = $result;
        $form_data['success'] = true;
        //$fn_general->log_debug('API', $api_name, __LINE__, 'Result = '.print_r($result, true));
    } else {
        throw new Exception('[' . __LINE__ . '] - Wrong Request Method');
    }       
    Class_db::getInstance()->db_close();
} catch (Exception $ex) {
    if ($is_transaction) {
        Class_db::getInstance()->db_rollback();
    }
    Class_db::getInstance()->db_close();
    $form_data['error'] = substr($ex->getMessage(), strpos($ex->getMessage(), '] - ') + 4);
    if ($ex->getCode() === 31) {
        $form_data['errmsg'] = substr($ex->getMessage(), strpos($ex->getMessage(), '] - ') + 4);
    } else {
        $form_data['errmsg'] = $constant::ERR_DEFAULT;
    }
    $fn_general->log_error('API', $api_name, __LINE__, $ex->getMessage());
}

echo json_encode($form_data);
