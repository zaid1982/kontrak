<?php

class Class_contract_claim_sub
{

    private $constant;
    private $fn_general;
    private $contractClaimSubId;

    function __construct()
    {
    }

    private function get_exception($codes, $function, $line, $msg)
    {
        if ($msg != '') {
            $pos = strpos($msg, '-');
            if ($pos !== false) {
                $msg = substr($msg, $pos + 2);
            }
            return "(ErrCode:" . $codes . ") [" . __CLASS__ . ":" . $function . ":" . $line . "] - " . $msg;
        } else {
            return "(ErrCode:" . $codes . ") [" . __CLASS__ . ":" . $function . ":" . $line . "]";
        }
    }

    /**
     * @param $property
     * @return mixed
     * @throws Exception
     */
    public function __get($property)
    {
        if (property_exists($this, $property)) {
            return $this->$property;
        } else {
            throw new Exception($this->get_exception('0001', __FUNCTION__, __LINE__, 'Get Property not exist [' . $property . ']'));
        }
    }

    /**
     * @param $property
     * @param $value
     * @throws Exception
     */
    public function __set($property, $value)
    {
        if (property_exists($this, $property)) {
            $this->$property = $value;
        } else {
            throw new Exception($this->get_exception('0002', __FUNCTION__, __LINE__, 'Get Property not exist [' . $property . ']'));
        }
    }

    /**
     * @param $property
     * @return bool
     * @throws Exception
     */
    public function __isset($property)
    {
        if (property_exists($this, $property)) {
            return isset($this->$property);
        } else {
            throw new Exception($this->get_exception('0003', __FUNCTION__, __LINE__, 'Get Property not exist [' . $property . ']'));
        }
    }

    /**
     * @param $property
     * @throws Exception
     */
    public function __unset($property)
    {
        if (property_exists($this, $property)) {
            unset($this->$property);
        } else {
            throw new Exception($this->get_exception('0004', __FUNCTION__, __LINE__, 'Get Property not exist [' . $property . ']'));
        }
    }

    /**
     * @return mixed
     * @throws Exception
     */
    public function get_contract_claim_sub() {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->contractClaimSubId));
            return Class_db::getInstance()->db_select_single('t_contract_claim_sub', array('contract_claim_sub_id'=>$this->contractClaimSubId), null, 1);
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $contractClaimId
     * @param $contractClaimSubType
     * @return array
     * @throws Exception
     */
    public function get_contract_claim_sub_list($contractClaimId, $contractClaimSubType)
    {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($contractClaimId, $contractClaimSubType));
            return Class_db::getInstance()->db_select('t_contract_claim_sub', array('contract_claim_id'=>$contractClaimId, 'contract_claim_sub_type'=>$contractClaimSubType));
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $params
     * @return string
     * @throws Exception
     */
    public function add_contract_claim_sub ($params=array()) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParamsArray($params, array('contractId', 'contractClaimId', 'contractClaimSubDesc', 'contractClaimSubTotal', 'contractClaimSubCost', 'contractClaimSubUpdatedBy'));
			$params['contractClaimSubTotalCost'] = strval(intval($params['contractClaimSubTotal']) * floatval($params['contractClaimSubCost']));
            $this->contractClaimSubId = Class_db::getInstance()->db_insert('t_contract_claim_sub', $this->fn_general->convertToMysqlArrAll($params));
            return $this->contractClaimSubId;
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $params
     * @throws Exception
     */
    public function update_contract_claim_sub($params=array())
    {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->contractClaimSubId));
			$this->fn_general->checkEmptyParamsArray($params, array('contractClaimSubDesc', 'contractClaimSubTotal', 'contractClaimSubCost'));
			$params['contractClaimSubTotalCost'] = strval(intval($params['contractClaimSubTotal']) * floatval($params['contractClaimSubCost']));
            Class_db::getInstance()->db_update('t_contract_claim_sub', $this->fn_general->convertToMysqlArrAll($params), array('contract_claim_sub_id'=>$this->contractClaimSubId));
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @throws Exception
     */
    public function delete_contract_claim_sub()
    {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->contractClaimSubId));
            Class_db::getInstance()->db_delete('t_contract_claim_sub', array('contract_claim_sub_id'=>$this->contractClaimSubId));
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }
}