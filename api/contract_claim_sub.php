<?php

require_once 'library/constant.php';
require_once 'function/db.php';
require_once 'function/f_general.php';
require_once 'function/f_login.php';
require_once 'function/f_contract_claim_sub.php';

$api_name = 'api_contract_claim_sub';
$is_transaction = false;
$form_data = array('success'=>false, 'result'=>'', 'error'=>'', 'errmsg'=>'');
$result = '';
$userId = '';

$constant = new Class_constant();
$fn_general = new Class_general();
$fn_login = new Class_login();
$fn_contract_claim_sub = new Class_contract_claim_sub();

try {
    $fn_general->__set('constant', $constant);
    $fn_login->__set('constant', $constant);
    $fn_login->__set('fn_general', $fn_general);
    $fn_contract_claim_sub->__set('constant', $constant);
    $fn_contract_claim_sub->__set('fn_general', $fn_general);

    Class_db::getInstance()->db_connect();
    $request_method = $_SERVER['REQUEST_METHOD'];
    $fn_general->log_debug('API', $api_name, __LINE__, 'Request method = '.$request_method);

    $urlArr = explode('/', $_SERVER['REQUEST_URI']);
    foreach ($urlArr as $i=>$param) {
        if ($param === 'contract_claim_sub') {
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
            if ($urlArr[1] === 'list_replace') {
                $result = $fn_contract_claim_sub->get_contract_claim_sub_list($urlArr[2], 'Alat Ganti');
			} 
			else if ($urlArr[1] === 'list_new') {
                $result = $fn_contract_claim_sub->get_contract_claim_sub_list($urlArr[2], 'Ganti Baru');
            }
            else if ($urlArr[1] === 'list_replace_by_contract') {
                $result = $fn_contract_claim_sub->get_contract_claim_sub_list_by_contract($urlArr[2], 'Alat Ganti');
            }
            else if ($urlArr[1] === 'list_new_by_contract') {
                $result = $fn_contract_claim_sub->get_contract_claim_sub_list_by_contract($urlArr[2], 'Ganti Baru');
            } else {
                $fn_contract_claim_sub->__set('contractClaimSubId', $urlArr[1]);
                $result = $fn_contract_claim_sub->get_contract_claim_sub();
            }
        } else {
            throw new Exception('[' . __LINE__ . '] - Wrong Request Method');
        }
        $form_data['result'] = $result;
        $form_data['success'] = true;
    }
    else if ('POST' === $request_method) {
        Class_db::getInstance()->db_beginTransaction();
        $is_transaction = true;
        $param = $_POST;

        $param['contractClaimSubUpdatedBy'] = $userId;
        $fn_contract_claim_sub->add_contract_claim_sub($param);
        $form_data['errmsg'] = $constant::SUC_CONTRACT_CLAIM_SUB_ADD;

        Class_db::getInstance()->db_commit();
        $form_data['result'] = $result;
        $form_data['success'] = true;
    }
    else if ('PUT' === $request_method) {
        Class_db::getInstance()->db_beginTransaction();
        $is_transaction = true;
        $putData = file_get_contents("php://input");
        parse_str($putData, $params);

        if (isset ($urlArr[1])) {
            $fn_contract_claim_sub->__set('contractClaimSubId', $urlArr[1]);
            $fn_contract_claim_sub->update_contract_claim_sub($params);
            $form_data['errmsg'] = $constant::SUC_CONTRACT_CLAIM_SUB_UPDATE;
        } else {
            throw new Exception('[' . __LINE__ . '] - Wrong Request Method');
        }

        Class_db::getInstance()->db_commit();
        $form_data['result'] = $result;
        $form_data['success'] = true;
    }
    else if ('DELETE' === $request_method) {
        Class_db::getInstance()->db_beginTransaction();
        $is_transaction = true;

        if (!isset ($urlArr[1])) {
            throw new Exception('[' . __LINE__ . '] - Inspection Checklist Id empty');
        }
        $fn_contract_claim_sub->__set('contractClaimSubId', $urlArr[1]);
        $fn_contract_claim_sub->delete_contract_claim_sub();
        $form_data['errmsg'] = $constant::SUC_CONTRACT_CLAIM_SUB_DELETE;

        Class_db::getInstance()->db_commit();
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