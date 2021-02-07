<?php

class Class_task
{

    private $constant;
    private $fn_general;
    private $transactionId;
    private $checkpointId;
    private $taskId;

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
    public function get_task () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->taskId));
            return Class_db::getInstance()->db_select_single('wfl_task', array('task_id'=>$this->taskId), null, 1);
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param string $transactionId
     * @return mixed
     * @throws Exception
     */
    public function get_transaction ($transactionId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($transactionId));
            return Class_db::getInstance()->db_select_single('wfl_transaction', array('transaction_id'=>$transactionId), null, 1);
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param string $checkpointId
     * @return mixed
     * @throws Exception
     */
    public function get_checkpoint ($checkpointId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($checkpointId));
            return Class_db::getInstance()->db_select_single('wfl_checkpoint', array('checkpoint_id'=>$checkpointId), null, 1);
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @return mixed
     * @throws Exception
     */
    public function check_current_task () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->taskId));
            $this->transactionId = Class_db::getInstance()->db_select_col('wfl_task', array('task_id'=>$this->taskId, 'task_current'=>'1'), 'transaction_id', null, 1);
            return $this->transactionId;
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param string $checkpointId
     * @param string $assignedGroup
     * @param string $assignedUser
     * @param string $userId
     * @throws Exception
     */
    private function check_assign ($checkpointId, $assignedGroup='', $assignedUser='', $userId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->transactionId, $checkpointId, $userId));
            $checkpointAssigns = Class_db::getInstance()->db_select('wfl_checkpoint_assign', array('checkpoint_id'=>$checkpointId));
            foreach ($checkpointAssigns as $checkpointAssign) {
                $assignType = $checkpointAssign['checkpointAssignType'];
                $checkpointTo = $checkpointAssign['checkpointTo'];
                $checkpointData = Class_db::getInstance()->db_select_single('wfl_checkpoint', array('checkpoint_id'=>$checkpointTo), null, 1);
                $roleId = $checkpointData['roleId'];
                $groupId = $checkpointData['groupId'];
                if ($assignType == '1') {   // Assign to himself
                    if (Class_db::getInstance()->db_count('wfl_task_assign', array('transaction_id'=>$this->transactionId, 'checkpoint_id'=>$checkpointTo, 'role_id'=>$roleId)) == 0) {
                        if (empty($groupId)) {
                            $groupId = $assignedGroup;
                        }
                        Class_db::getInstance()->db_insert('wfl_task_assign', array('transaction_id'=>$this->transactionId, 'checkpoint_id'=>$checkpointTo, 'role_id'=>$roleId, 'group_id'=>$groupId, 'user_id'=>$userId));
                    }
                }
                else if ($assignType == '2') {    // Assign to User
                    if (Class_db::getInstance()->db_count('wfl_task_assign', array('transaction_id'=>$this->transactionId, 'checkpoint_id'=>$checkpointTo, 'role_id'=>$roleId)) == 0) {
                        if (empty($groupId)) {
                            $this->fn_general->checkEmptyParams(array($assignedGroup));
                            $groupId = $assignedGroup;
                        }
                        $this->fn_general->checkEmptyParams(array($assignedUser));
                        Class_db::getInstance()->db_insert('wfl_task_assign', array('transaction_id'=>$this->transactionId, 'checkpoint_id'=>$checkpointTo, 'role_id'=>$roleId, 'group_id'=>$groupId, 'user_id'=>$assignedUser));
                    }
                }
                else if ($assignType == '3') {    // Assign to Group
                    if (Class_db::getInstance()->db_count('wfl_task_assign', array('transaction_id'=>$this->transactionId, 'checkpoint_id'=>$checkpointTo, 'role_id'=>$roleId)) == 0) {
                        $this->fn_general->checkEmptyParams(array($assignedGroup));
                        Class_db::getInstance()->db_insert('wfl_task_assign', array('transaction_id'=>$this->transactionId, 'checkpoint_id'=>$checkpointTo, 'role_id'=>$roleId, 'group_id'=>$assignedGroup));
                    }
                }
            }
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @return string
     * @throws Exception
     */
    public function set_task_id () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->transactionId));
            $this->taskId = Class_db::getInstance()->db_select_col('wfl_task', array('transaction_id'=>$this->transactionId, 'task_current'=>'1'), 'task_id', null, 1);
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $flowId
     * @param $userId
     * @param $groupId
     * @param $transactionNo
     * @param string $checkpointId
     * @return string
     * @throws Exception
     */
    public function create_new_task ($flowId, $userId, $groupId, $transactionNo, $checkpointId='') {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($flowId, $userId, $groupId, $transactionNo));
            if (empty($checkpointId)) {
                $checkpoint = Class_db::getInstance()->db_select_single('wfl_checkpoint', array('flow_id'=>$flowId, 'checkpoint_type'=>'1'), null, 1);
                $checkpointId = $checkpoint['checkpointId'];
            } else {
                $checkpoint = Class_db::getInstance()->db_select_single('wfl_checkpoint', array('checkpoint_id'=>$checkpointId,'flow_id'=>$flowId, 'checkpoint_type'=>'1'), null, 1);
            }

            $roleId = $checkpoint['roleId'];
            $this->fn_general->checkEmptyParams(array($roleId));
            $sqlArr = array('user_id'=>$userId, 'role_id'=>$roleId);
            if (!empty($checkpoint['groupId'])) {
                if ($checkpoint['groupId'] !== $groupId) {
                    throw new Exception('[' . __LINE__ . '] - GroupId '.$groupId.' not allowed to perform this task ('.$checkpoint['groupId'].').');
                }
                $sqlArr['group_id'] = $groupId;
            }
            if (Class_db::getInstance()->db_count('sys_user_role', $sqlArr) == 0) {
                throw new Exception('[' . __LINE__ . '] - UserId '.$userId.' not exist to perform this task (groupId='.$checkpoint['groupId'].', roleId='.$roleId.').');
            }

            $flowDueDay = Class_db::getInstance()->db_select_col('wfl_flow', array('flow_id'=>$flowId), 'flow_due_day', null, 1);
            $this->transactionId = Class_db::getInstance()->db_insert('wfl_transaction', array('transaction_no'=>$transactionNo, 'flow_id'=>$flowId, 'user_id'=>$userId, 'group_id'=>$groupId,
                'transaction_date_due'=>'|Curdate() + INTERVAL '.$flowDueDay.' DAY', 'transaction_status'=>'19'));

            $checkpointDueDate = !empty($checkpoint['checkpoint_due_day'])?'|CURDATE() + INTERVAL '.$checkpoint['checkpointDueDay'].' DAY':'';
            $this->taskId = Class_db::getInstance()->db_insert('wfl_task', array('transaction_id'=>$this->transactionId, 'checkpoint_id'=>$checkpointId, 'role_id'=>$roleId, 'group_id'=>$groupId,
                'task_created_user'=>$userId, 'task_created_group'=>$groupId,'task_claimed_user'=>$userId, 'task_time_claimed'=>'Now()', 'task_date_due'=>$checkpointDueDate, 'task_status'=>'19'));
            return $this->taskId;
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $userId
     * @param string $status
     * @param string $remark
     * @param string $next
     * @param string $groupId
     * @param string $toGroup
     * @param string $toUser
     * @param string $skipTaskAssign
     * @return mixed
     * @throws Exception
     */
    public function submit_task ($userId, $status='23', $remark='', $next='', $groupId='', $toGroup='', $toUser='', $skipTaskAssign='') {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            $this->fn_general->checkEmptyParams(array($this->taskId, $this->transactionId, $userId, $status));
            $task = Class_db::getInstance()->db_select_single('wfl_task', array('task_id'=>$this->taskId), null, 1);
            $groupId = empty($task['groupId']) ? $groupId : $task['groupId'];
            $checkpointId = $task['checkpointId'];
            $roleId = $task['roleId'];
            $this->fn_general->checkEmptyParams(array($groupId, $checkpointId, $roleId));
            if ($task['taskCurrent'] != '1') {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_TASK_ALREADY_SUBMITTED, 31);
            }
            if (!empty($task['taskClaimedUser']) && $task['taskClaimedUser'] !== $userId) {
                throw new Exception('[' . __LINE__ . '] - User claimed not same');
            }

            $checkpoint = Class_db::getInstance()->db_select_single('wfl_checkpoint', array('checkpoint_id'=>$checkpointId), null, 1);
            $sqlArr = array('user_id'=>$userId, 'role_id'=>$roleId);
            if (!empty($checkpoint['group_id'])) {
                if ($checkpoint['group_id'] !== $groupId) {
                    throw new Exception('[' . __LINE__ . '] - GroupId '.$groupId.' not allowed to perform this task ('.$checkpoint['group_id'].').');
                }
                $sqlArr['group_id'] = $groupId;
            }
            if (Class_db::getInstance()->db_count('sys_user_role', $sqlArr) == 0) {
                throw new Exception('[' . __LINE__ . '] - UserId '.$userId.' not exist to perform this task (groupId='.$checkpoint['group_id'].', roleId='.$roleId.').');
            }

            $params = array('taskCurrent'=>'2', 'roleId'=>$roleId, 'groupId'=>$groupId, 'taskTimeSubmit'=>'Now()', 'taskRemark'=>$remark, 'taskStatus'=>$status);
            if ($checkpoint['checkpointClaimType'] === '2') {
                if (empty($task['taskClaimedUser'])) {
                    throw new Exception('[' . __LINE__ . '] - Task supposed to be claimed first');
                }
            } else {
                $params['taskTimeClaimed'] = 'Now()';
                $params['taskClaimedUser'] = $userId;
            }
            $sqlUpdateArr = $this->fn_general->convertToMysqlArr($params, array('taskCurrent', 'roleId', 'groupId', 'taskClaimedUser', 'taskTimeClaimed', 'taskTimeSubmit', 'taskRemark', 'taskStatus'));
            Class_db::getInstance()->db_update('wfl_task', $sqlUpdateArr, array('task_id'=>$this->taskId));

            if (empty($next)) {
                $nextPointId = Class_db::getInstance()->db_select_col('wfl_checkpoint', array('checkpoint_id'=>$checkpointId), 'checkpoint_next', null, 1);
            } else if ($next === '1' || $next === '2' || $next === '3') {
                $nextPointId = Class_db::getInstance()->db_select_col('wfl_checkpoint', array('checkpoint_id'=>$checkpointId), 'checkpoint_case_'.$next, null, 1);
            } else {
                throw new Exception('[' . __LINE__ . '] - Parameter next invalid (' . $next . ')');
            }
            $nextPoint = Class_db::getInstance()->db_select_single('wfl_checkpoint', array('checkpoint_id'=>$nextPointId), null, 1);
            $this->fn_general->checkEmptyParams(array($nextPoint['roleId']));
            if ($nextPoint['flowId'] !== $checkpoint['flowId']) {
                throw new Exception('[' . __LINE__ . '] - Parameter nextFlowId invalid ('.$nextPoint['flowId'].')');
            }

            if ($nextPoint['checkpointType'] === '3') {    // Last checkpoint
                $transaction = Class_db::getInstance()->db_select_single('wfl_transaction', array('transaction_id'=>$this->transactionId), null, 1);
                Class_db::getInstance()->db_update('wfl_transaction', array('transaction_time_complete'=>'Now()'), array('transaction_id'=>$this->transactionId)); // , 'transaction_status'=>'7'
                $params = array('transactionId'=>$this->transactionId, 'checkpointId'=>$nextPointId, 'taskCreatedUser'=>$userId, 'taskCreatedGroup'=>$groupId, 'roleId'=>$nextPoint['roleId'],
                    'groupId'=>$transaction['groupId'], 'taskClaimedUser'=>$transaction['userId'], 'taskStatusPrevious'=>$status, 'taskStatus'=>'9');
                $sqlInsertArr = $this->fn_general->convertToMysqlArr($params, array('transactionId', 'checkpointId', 'taskCreatedUser', 'taskCreatedGroup', 'roleId', 'groupId', 'taskClaimedUser', 'taskStatusPrevious', 'taskStatus'));
                $this->taskId = Class_db::getInstance()->db_insert('wfl_task', $sqlInsertArr);
                return $this->taskId;
            }

            if ($skipTaskAssign !== 1) {
                $this->check_assign($checkpointId, $toGroup, $toUser, $userId);
            }

            $nextPointDueDay = !empty($nextPoint['checkpointDueDay']) ? '|Curdate() + INTERVAL '.$nextPoint['checkpointDueDay'].' DAY' : '';
            $params = array('transactionId'=>$this->transactionId, 'checkpointId'=>$nextPointId, 'roleId'=>$nextPoint['roleId'], 'groupId'=>'', 'taskCreatedUser'=>$userId, 'taskCreatedGroup'=>$groupId,
                'taskClaimedUser'=>'', 'taskDateDue'=>$nextPointDueDay, 'taskStatusPrevious'=>$status, 'taskStatus'=>'20');
            $taskAssign = Class_db::getInstance()->db_select_single('wfl_task_assign', array('transaction_id'=>$this->transactionId, 'checkpoint_id'=>$nextPointId, 'role_id'=>$nextPoint['roleId']));
            if ($nextPoint['checkpointClaimType'] === '3') {    // Assigned User
                $this->fn_general->checkEmptyParams(array($taskAssign, $taskAssign['groupId'], $taskAssign['userId']));
                $params['groupId'] = $taskAssign['groupId'];
                $params['taskClaimedUser'] = $taskAssign['userId'];
            } else if ($nextPoint['checkpointClaimType'] === '4') {     // Assigned Group
                $this->fn_general->checkEmptyParams(array($taskAssign, $taskAssign['groupId']));
                $params['groupId'] = $taskAssign['groupId'];
            } else {
                if (!empty($taskAssign) && !empty($taskAssign['userId'])) {
                    $params['groupId'] = $taskAssign['groupId'];
                    $params['taskClaimedUser'] = $taskAssign['userId'];
                } else if (!empty($taskAssign) && !empty($taskAssign['groupId'])) {
                    $params['groupId'] = $taskAssign['groupId'];
                } else {
                    $params['groupId'] = $nextPoint['groupId'];
                }
            }

            $sqlInsertArr = $this->fn_general->convertToMysqlArr($params, array('transactionId', 'checkpointId', 'taskCreatedUser', 'taskCreatedGroup', 'roleId', 'groupId', 'taskClaimedUser', 'taskDateDue', 'taskStatusPrevious', 'taskStatus'));
            $this->taskId = Class_db::getInstance()->db_insert('wfl_task', $sqlInsertArr);
            $this->checkpointId = $nextPointId;
            return $this->taskId;
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param string $groupId
     * @return
     * @throws Exception
     */
    public function get_checkpoints_users ($groupId='') {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->checkpointId, $this->taskId));
            $checkpoint = Class_db::getInstance()->db_select_single('wfl_checkpoint', array('checkpoint_id'=>$this->checkpointId), null, 1);
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'roleId '.$checkpoint['roleId']);
            $this->fn_general->checkEmptyParams(array($checkpoint['roleId']));
            $params = array('roleId'=>$checkpoint['roleId']);
            if (!empty($checkpoint['groupId'])) {
                $params['groupId'] = $checkpoint['groupId'];
            } else if (!empty($groupId)) {
                $params['groupId'] = $groupId;
            }
            $sqlArr = $this->fn_general->convertToMysqlArr($params, array('roleId', 'groupId'));
            return Class_db::getInstance()->db_select_colm('sys_user_role', $sqlArr, 'user_id');
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public function get_kpi_transaction () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->transactionId));
            $tasks = Class_db::getInstance()->db_select('vw_kpi_transaction', array('transaction_id'=>$this->transactionId));
            $results = array();
            foreach ($tasks as $task) {
                $result = array();
                $result['checkpointId'] = $task['checkpointId'];
                $result['kpi'] = $task['kpi'];
                $result['dayProcess'] = $task['dayProcess'];
                $result['timeCreated'] = $task['taskTimeCreated'];
                $result['remark'] = $task['taskRemark'];
                $result['current'] = $task['taskCurrent'];
                $result['status'] = $task['taskStatus'];
                $result['claimedBy'] = $task['claimedByName'];
                $result['groupName'] = $task['groupName'];
                $result['groupId'] = $task['groupId'];
                array_push($results, $result);
            }
            return $results;
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $flowList
     * @return mixed
     * @throws Exception
     */
    public function get_total_processing($flowList) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);
            return Class_db::getInstance()->db_select_col('vw_total_processing', array(), 'total', null, 0, array('flowId'=>$flowList));
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }
}