<?php

require_once 'library/constant.php';
require_once 'function/db.php';
require_once 'function/f_general.php';
require_once 'function/f_login.php';
require_once 'function/f_user.php';

$api_name = 'api_user';
$is_transaction = false;
$form_data = array('success'=>false, 'result'=>'', 'error'=>'', 'errmsg'=>'');
$result = '';
$userId = '';

$constant = new Class_constant();
$fn_general = new Class_general();
$fn_login = new Class_login();
$fn_user = new Class_user();

try {
    $fn_general->__set('constant', $constant);
    $fn_login->__set('constant', $constant);
    $fn_login->__set('fn_general', $fn_general);
    $fn_user->__set('constant', $constant);
    $fn_user->__set('fn_general', $fn_general);

    Class_db::getInstance()->db_connect();
    $request_method = $_SERVER['REQUEST_METHOD'];
    $fn_general->log_debug('API', $api_name, __LINE__, 'Request method = '.$request_method);

    $urlArr = explode('/', $_SERVER['REQUEST_URI']);
    foreach ($urlArr as $i=>$param) {
        if ($param === 'user') {
            break;
        }
        array_shift($urlArr);
    }

    if (isset($urlArr[1]) && $urlArr[1] === 'external') {
        array_shift($urlArr);
    } else {
        $headers = apache_request_headers();
        if (!isset($headers['Authorization'])) {
            throw new Exception('[' . __LINE__ . '] - Parameter Authorization empty');
        }
        $jwt_data = $fn_login->check_jwt($headers['Authorization']);
        $userId = $jwt_data->userId;
    }

    if ('GET' === $request_method) {
        if (isset ($urlArr[1])) {
            if ($urlArr[1] === 'full_list') {
                $result = $fn_user->getUserFullList();
            } else if ($urlArr[1] === 'full_details') {
                $result = $fn_user->getUserFull($urlArr[2]);
            } else {
                $result = $fn_user->getUser($urlArr[1]);
            }
        } else {
            $result = $fn_user->getUserList();
        }
        $form_data['result'] = $result;
        $form_data['success'] = true;
    }
    else if ('POST' === $request_method) {
        $param = $_POST;

        Class_db::getInstance()->db_beginTransaction();
        $is_transaction = true;
        $result = $fn_user->addUser($param['user'], $param['roleList'], $param['contractList']);
        $form_data['errmsg'] = $constant::SUC_USER_ADD;
        Class_db::getInstance()->db_commit();

        $form_data['result'] = $result;
        $form_data['success'] = true;
    }
    else if ('PUT' === $request_method) {
        Class_db::getInstance()->db_beginTransaction();
        $is_transaction = true;

        $putData = file_get_contents("php://input");
        parse_str($putData, $param);

        if (isset ($urlArr[1])) {
            if ($urlArr[1] === 'change_password') {
                $fn_user->__set('userId', $userId);
                $fn_user->change_password($param);
                $form_data['errmsg'] = $constant::SUC_CHANGE_PASSWORD;
            }
            else if ($urlArr[1] === 'first_time') {
                $fn_user->__set('userId', $userId);
                $fn_user->change_password($param, true);
                $form_data['errmsg'] = $constant::SUC_ACTIVATED;
            } else {
                throw new Exception('[' . __LINE__ . '] - Wrong Request Method');
            }
        } else {
            throw new Exception('[' . __LINE__ . '] - Wrong Request Method');
        }

        Class_db::getInstance()->db_commit();
        $form_data['result'] = $result;
        $form_data['success'] = true;
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