<?php

class Class_contract_claim
{

    private $constant;
    private $fn_general;
    private $contractClaimId;

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
    public function get_contract_claim() {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->contractClaimId));
            return Class_db::getInstance()->db_select_single('t_contract_claim', array('contract_claim_id'=>$this->contractClaimId), null, 1);
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $contractId
     * @param $claimType
     * @return array
     * @throws Exception
     */
    public function get_contract_claim_list($contractId, $claimType)
    {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($contractId, $claimType));
            $contract = Class_db::getInstance()->db_select_single('t_contract', array('contract_id'=>$contractId), null, 1);
            if ($claimType === 'all') {
                $ceiling = floatval($contract['contractCeiling']);
                $ceilingYear = $contract['contractPeriodYear'] !== '' ? $ceiling / intval($contract['contractPeriodYear']) : '';
                $contractClaims = Class_db::getInstance()->db_select('t_contract_claim', array('contract_id'=>$contractId), 'contract_claim_invoice_date');
            } else {
                if ($claimType === 'CM') {
                    $ceilingYear = floatval($contract['contractCeilingYearlyCm']);
                } else if ($claimType === 'PM') {
                    $ceilingYear = floatval($contract['contractCeilingYearlyPm']);
                } else if ($claimType === 'Lesen') {
                    $ceilingYear = floatval($contract['contractCeilingYearlyLicense']);
                } else {
                    $ceilingYear = floatval($contract['contractCeilingYearly'.$claimType]);
                }
                $ceiling = $ceilingYear * intval($contract['contractPeriodYear']);
                $contractClaims = Class_db::getInstance()->db_select('t_contract_claim', array('contract_id'=>$contractId, 'contract_claim_type'=>$claimType), 'contract_claim_invoice_date');
            }
            $ceilingCurrent = $ceiling;
            $ceilingYearCurrent = $ceilingYear;

            $result = array();
            foreach ($contractClaims as $contractClaim) {
                $ceilingCurrent = $ceilingCurrent - floatval($contractClaim['contractClaimInvoiceAmount']);
                $ceilingYearCurrent = $ceilingYearCurrent - floatval($contractClaim['contractClaimInvoiceAmount']);
                $contractClaim['ceilingBalance'] = $ceilingCurrent;
                $contractClaim['ceilingBalancePerc'] = $ceiling != 0 ? $ceilingCurrent/$ceiling*100 : 0;
                $contractClaim['ceilingBalanceYear'] = $ceilingYearCurrent;
                $contractClaim['ceilingBalanceYearPerc'] = $ceilingYear != 0 ? $ceilingYearCurrent/$ceilingYear*100 : 0;
                array_push($result, $contractClaim);
            }
            return $result;
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
    public function add_contract_claim ($params=array()) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParamsArray($params, array('contractId', 'contractClaimType', 'contractClaimDesc', 'contractClaimInvoiceNo', 'contractClaimInvoiceDate', 'contractClaimInvoiceAmount', 'contractClaimUpdatedBy'));
            $this->contractClaimId = Class_db::getInstance()->db_insert('t_contract_claim', $this->fn_general->convertToMysqlArrAll($params));
            return $this->contractClaimId;
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
    public function update_contract_claim($params=array())
    {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->contractClaimId));
            Class_db::getInstance()->db_update('t_contract_claim', $this->fn_general->convertToMysqlArrAll($params), array('contract_claim_id'=>$this->contractClaimId));
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @throws Exception
     */
    public function delete_contract_claim()
    {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->contractClaimId));
            Class_db::getInstance()->db_delete('t_contract_claim_sub', array('contract_claim_id'=>$this->contractClaimId));
            Class_db::getInstance()->db_delete('t_contract_claim', array('contract_claim_id'=>$this->contractClaimId));
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }
}