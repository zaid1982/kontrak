<?php

class Class_user {

    private $constant;
    private $fn_general;
    private $fn_email;
    private $userId;
    
    function __construct() {
    }
    
    private function get_exception($codes, $function, $line, $msg) {
        if ($msg != '') {            
            $pos = strpos($msg,'-');
            if ($pos !== false) {   
                $msg = substr($msg, $pos+2); 
            }
            return "(ErrCode:".$codes.") [".__CLASS__.":".$function.":".$line."] - ".$msg;
        } else {
            return "(ErrCode:".$codes.") [".__CLASS__.":".$function.":".$line."]";
        }
    }

    /**
     * @param $property
     * @return mixed
     * @throws Exception
     */
    public function __get($property) {
        if (property_exists($this, $property)) {
            return $this->$property;
        } else {
            throw new Exception($this->get_exception('0001', __FUNCTION__, __LINE__, 'Get Property not exist ['.$property.']'));
        }
    }

    /**
     * @param $property
     * @param $value
     * @throws Exception
     */
    public function __set($property, $value ) {
        if (property_exists($this, $property)) {
            $this->$property = $value;        
        } else {
            throw new Exception($this->get_exception('0002', __FUNCTION__, __LINE__, 'Get Property not exist ['.$property.']'));
        }
    }

    /**
     * @param $property
     * @return bool
     * @throws Exception
     */
    public function __isset($property ) {
        if (property_exists($this, $property)) {
            return isset($this->$property);
        } else {
            throw new Exception($this->get_exception('0003', __FUNCTION__, __LINE__, 'Get Property not exist ['.$property.']'));
        }
    }

    /**
     * @param $property
     * @throws Exception
     */
    public function __unset($property ) {
        if (property_exists($this, $property)) {
            unset($this->$property);
        } else {
            throw new Exception($this->get_exception('0004', __FUNCTION__, __LINE__, 'Get Property not exist ['.$property.']'));
        } 
    }

    /**
     * @param array $params
     * @param $groupId
     * @return array
     * @throws Exception
     */
    public function register_user ($params, $groupId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            $this->fn_general->checkEmptyParams(array($groupId));
            $this->fn_general->checkEmptyParamsArray($params, array('userName', 'userFirstName', 'userMykadNo', 'userContactNo', 'userEmail'));
            if (Class_db::getInstance()->db_count('sys_user', array('user_name'=>$params['userName'], 'user_type'=>'2')) > 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_USER_REGISTER_SIMILAR_USERNAME, 31);
            }

            $tempPassword = $this->fn_general->generateRandomString(10);
            $params['userPassword'] = md5($tempPassword);
            $params['userPasswordTemp'] = $tempPassword;
            $params['userType'] = '2';
            $params['userStatus'] = '99';
            $params['userActivationKey'] = $this->fn_general->generateRandomString(20);
            $sqlArr = $this->fn_general->convertToMysqlArr($params, array('userName', 'userPassword', 'userPasswordTemp', 'userType', 'userFirstName', 'userMykadNo', 'userContactNo', 'userFaxNo', 'userEmail', 'userDesignation', 'userActivationKey', 'userStatus'));
            $userId = Class_db::getInstance()->db_insert('sys_user', $sqlArr);
            Class_db::getInstance()->db_insert('sys_user_role', array('user_id'=>$userId, 'role_id'=>'1', 'group_id'=>$groupId));

            return array('userId'=>$userId, 'userName'=>$params['userName'], 'userPasswordTemp'=>$params['userPasswordTemp']);
        }
        catch(Exception $ex) {   
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @return mixed
     * @throws Exception
     */
    public function get_group_pengguna() {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering ' . __FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->userId));
            return Class_db::getInstance()->db_select_col('sys_user_role', array('user_id'=>$this->userId, 'role_id'=>'1', 'user_role_id DESC'), 'group_id');
        } catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }



    /**
     * @param string $activationInput
     * @return bool|string
     * @throws Exception
     */
    public function activate_user ($activationInput='') {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            if (empty($activationInput)) {
                throw new Exception('['.__LINE__.'] - Parameter activationInput empty');
            }    
            if (strlen($activationInput) < 21) { 
                throw new Exception('['.__LINE__.'] - Wrong activation key. Please click the activation link given from your email.', 31);
            }
            
            $userId = substr($activationInput, 20);
            
            if (Class_db::getInstance()->db_count('sys_user', array('user_id'=>$userId, 'user_activation_key'=>$activationInput)) == 0) {
                throw new Exception('['.__LINE__.'] - Wrong activation key. Please click the activation link given from your email.', 31);
            }
            if (Class_db::getInstance()->db_count('sys_user', array('user_id'=>$userId, 'user_activation_key'=>$activationInput, 'user_status'=>'1')) == 1) {
                throw new Exception('['.__LINE__.'] - Your account already activated. Please login with email as user ID and your registered password.', 31);
            }
                        
            Class_db::getInstance()->db_update('sys_user', array('user_status'=>'1', 'user_time_activate'=>'Now()'), array('user_id'=>$userId));
            return $userId;
        }
        catch(Exception $ex) {   
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param string $username
     * @return mixed
     * @throws Exception
     */
    public function forgot_password ($username) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($username)) {
                throw new Exception('['.__LINE__.'] - ID Pengguna tidak sah', 31);
            }

            $sys_user = Class_db::getInstance()->db_select_single('sys_user', array('user_name'=>$username, 'user_status'=>'1'));
            if (empty($sys_user)) {
                throw new Exception('['.__LINE__.'] - '.$constant::ERR_FORGOT_PASSWORD_NOT_EXIST, 31);
            }
            $userId = $sys_user['userId'];
            $temporaryPassword = $this->fn_general->generateRandomString(15);
            Class_db::getInstance()->db_update('sys_user', array('user_password'=>md5($temporaryPassword), 'user_password_temp'=>$temporaryPassword, 'user_is_first_time'=>'1', 'user_time_activate'=>'', 'user_fail_attempt'=>'0', 'user_time_block'=>''), array('user_id'=>$userId));
            return array('userId'=>$userId, 'tempPassword'=>$temporaryPassword, 'userEmail'=>$sys_user['userEmail']);
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $userId
     * @param $put_vars
     * @throws Exception
     */
    public function update_profile ($userId, $put_vars) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;
            
            if (empty($userId)) {
                throw new Exception('[' . __LINE__ . '] - Parameter userId empty');
            }
            if (!isset($put_vars['userEmail']) || empty($put_vars['userEmail'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter userEmail empty');
            }
            if (!isset($put_vars['userFirstName']) || empty($put_vars['userFirstName'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter userFirstName empty');
            }
            if (!isset($put_vars['userContactNo']) || empty($put_vars['userContactNo'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter userContactNo empty');
            }
            if (!isset($put_vars['designationId']) || empty($put_vars['designationId'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter designationId empty');
            }
            if (!isset($put_vars['roles']) || empty($put_vars['roles'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter roles empty');
            }
            if (!isset($put_vars['userType']) || empty($put_vars['userType'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter userType empty');
            }
            if (!isset($put_vars['siteId']) || empty($put_vars['siteId'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter siteId empty');
            }

            $userEmail = $put_vars['userEmail'];
            $userFirstName = $put_vars['userFirstName'];
            $userContactNo = $put_vars['userContactNo'];
            $designationId = $put_vars['designationId'];
            $rolesStr = $put_vars['roles'];
            $userType = $put_vars['userType'];
            $siteId = $put_vars['siteId'];

            $curSite = Class_db::getInstance()->db_select_col('sys_user', array('user_id'=>$userId), 'site_id', null, 1);
            if ($curSite !== $siteId) {
                if (Class_db::getInstance()->db_count('mw_ppm_group_user', array('ppm_group_user.user_id'=>$userId, 'sys_user.site_id'=>$curSite)) > 0) {
                    throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_USER_EXIST_IN_GROUP, 31);
                }
            }

            if ($userType === '1') {
                $groupId = '1';
            } else if ($userType === '2') {
                $groupId = Class_db::getInstance()->db_select_col('cli_site', array('site_id'=>$siteId), 'group_id', null, 1);
                //Class_db::getInstance()->db_update('sys_user_role', array('group_id'=>$groupId), array('user_id'=>$userId, 'role_id'=>'6'));
                //Class_db::getInstance()->db_update('wfl_checkpoint_user', array('group_id'=>$groupId), array('user_id'=>$userId, 'role_id'=>'6'));
            } else {
                throw new Exception('['.__LINE__.'] - Parameter userType invalid ('.$userType.')');
            }

            if ($userType === '1' || $userType === '2') {
                $roles = explode(',', $rolesStr);
                $dbRoles = Class_db::getInstance()->db_select('sys_user_role', array('user_id'=>$userId));
                foreach ($dbRoles as $dbRole) {
                    $curRole = $dbRole['role_id'];
                    $key = array_search($curRole, $roles);
                    if ($key !== false) {
                        if ($dbRole['group_id'] !== $groupId) {
                            Class_db::getInstance()->db_update('sys_user_role', array('group_id'=>$groupId), array('user_id'=>$userId, 'role_id'=>$curRole));
                            Class_db::getInstance()->db_update('wfl_checkpoint_user', array('group_id'=>$groupId), array('user_id'=>$userId, 'role_id'=>$curRole));
                            if ($curRole === '3' || $curRole === '4' || $curRole === '5' || $curRole === '8') {
                                $ppmGroupUsers = Class_db::getInstance()->db_select('ppm_group_user', array('user_id'=>$userId));
                                foreach ($ppmGroupUsers as $ppmGroupUser) {
                                    if (Class_db::getInstance()->db_select_col('ppm_group', array('ppm_group_id'=>$ppmGroupUser['ppm_group_id']), 'role_id', null, 1) == $curRole) {
                                        Class_db::getInstance()->db_delete('ppm_group_user', array('ppm_group_user_id' => $ppmGroupUser['ppm_group_user_id']));
                                    }
                                }
                            }
                        }
                        array_splice($roles, $key, 1);
                    } else {
                        Class_db::getInstance()->db_delete('sys_user_role', array('user_id'=>$userId, 'role_id'=>$curRole));
                        Class_db::getInstance()->db_delete('wfl_checkpoint_user', array('user_id'=>$userId, 'role_id'=>$curRole));
                        if ($curRole === '3' || $curRole === '4' || $curRole === '5' || $curRole === '8') {
                            $ppmGroupUsers = Class_db::getInstance()->db_select('ppm_group_user', array('user_id'=>$userId));
                            foreach ($ppmGroupUsers as $ppmGroupUser) {
                                if (Class_db::getInstance()->db_select_col('ppm_group', array('ppm_group_id'=>$ppmGroupUser['ppm_group_id']), 'role_id', null, 1) == $curRole) {
                                    Class_db::getInstance()->db_delete('ppm_group_user', array('ppm_group_user_id' => $ppmGroupUser['ppm_group_user_id']));
                                }
                            }
                        }
                    }
                }
                foreach ($roles as $role) {
                    Class_db::getInstance()->db_insert('sys_user_role', array('user_id'=>$userId, 'role_id'=>$role, 'group_id'=>$groupId));
                    $checkpoints = Class_db::getInstance()->db_select('wfl_checkpoint', array('checkpoint_type'=>'<>3', 'role_id'=>$role));
                    foreach ($checkpoints as $checkpoint) {
                        $checkpointId = $checkpoint['checkpoint_id'];
                        if ($checkpointId == '3' && $role == '4') {
                            $groupId_ = $groupId;
                        } else {
                            $groupId_ = $checkpoint['group_id'];
                        }
                        if ($groupId_ === $groupId || is_null($groupId_)) {
                            Class_db::getInstance()->db_insert('wfl_checkpoint_user', array('user_id'=>$userId, 'checkpoint_id'=>$checkpointId, 'role_id'=>$role, 'group_id'=>$groupId_));
                        }
                    }
                }
            }

            Class_db::getInstance()->db_update('sys_user', array('user_first_name'=>$userFirstName, 'site_id'=>$siteId), array('user_id'=>$userId));
            Class_db::getInstance()->db_update('sys_user_profile', array('user_email'=>$userEmail, 'user_contact_no'=>$userContactNo, 'designation_id'=>$designationId), array('user_id'=>$userId, 'user_profile_status'=>'1'));

        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $userId
     * @param $name
     * @param $phoneNo
     * @param $uploadId
     * @return string
     * @throws Exception
     */
    public function update_profile_m ($userId, $name, $phoneNo, $uploadId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($userId)) {
                throw new Exception('[' . __LINE__ . '] - Parameter userId empty');
            }

            $sys_user = Class_db::getInstance()->db_select_single('sys_user', array('user_id'=>$userId), null, 1);
            if (!empty($name)) {
                Class_db::getInstance()->db_update('sys_user', array('user_first_name'=>$name), array('user_id'=>$userId));
            }
            if (!empty($phoneNo)) {
                Class_db::getInstance()->db_update('sys_user_profile', array('user_contact_no'=>$phoneNo), array('user_id'=>$userId, 'user_profile_status'=>'1'));
            }
            if (!empty($uploadId)) {
                if (!empty($sys_user['upload_id'])) {
                    Class_db::getInstance()->db_update('sys_upload', array('upload_status'=>'6'), array('upload_id'=>$sys_user['upload_id']));
                }

                Class_db::getInstance()->db_update('sys_user', array('upload_id'=>$uploadId), array('user_id'=>$userId));
                $upload = Class_db::getInstance()->db_select_single('vw_sys_upload', array('upload_id'=>$uploadId), null, 1);
                $docUrl = $constant::URL.$upload['upload_folder'].'/'.$upload['upload_filename'].'.'.$upload['upload_extension'];
                return $docUrl;
            }
            return '';
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param array $params
     * @param $isFirstTime
     * @throws Exception
     */
    public function change_password ($params=array(), $isFirstTime=false) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            $this->fn_general->checkEmptyParams(array($this->userId, $isFirstTime));
            $this->fn_general->checkEmptyParamsArray($params, array('oldPassword', 'newPassword'));

            $oldPassword = $params['oldPassword'];
            $newPassword = $params['newPassword'];

            if (Class_db::getInstance()->db_count('sys_user', array('user_password'=>md5($oldPassword), 'user_id'=>$this->userId)) == 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_CHANGE_PASSWORD_WRONG_CURRENT, 31);
            }
            if ($oldPassword === $newPassword){
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_CHANGE_PASSWORD_OLD_NEW_SAME, 31);
            }

            Class_db::getInstance()->db_update('sys_user', array('user_password'=>md5($newPassword), 'user_password_temp'=>$newPassword), array('user_id'=>$this->userId));
            if ($isFirstTime) {
                Class_db::getInstance()->db_update('sys_user', array('user_status'=>'1', 'user_time_activate'=>'Now()', 'user_is_first_time'=>'0'), array('user_id'=>$this->userId));
            }
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $userId
     * @param $put_vars
     * @throws Exception
     */
    public function edit_password ($userId, $put_vars) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            if (empty($userId)) {
                throw new Exception('[' . __LINE__ . '] - Parameter userId empty');
            }
            if (!isset($put_vars['newPassword']) || empty($put_vars['newPassword'])) {
                throw new Exception('[' . __LINE__ . '] - Parameter newPassword empty');
            }

            $newPassword = $put_vars['newPassword'];
            Class_db::getInstance()->db_update('sys_user', array('user_password'=>md5($newPassword)), array('user_id'=>$userId));
        }
        catch(Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param array $userDetails
     * @return mixed
     * @throws Exception
     */
    public function add_user ($userDetails=array()) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($userDetails)) {
                throw new Exception('['.__LINE__.'] - Array userDetails empty');
            }
            if (!array_key_exists('userName', $userDetails) && empty($userDetails['userName'])) {
                throw new Exception('['.__LINE__.'] - Parameter userName empty');
            }
            if (!array_key_exists('userFirstName', $userDetails) && empty($userDetails['userFirstName'])) {
                throw new Exception('['.__LINE__.'] - Parameter userFirstName empty');
            }
            if (!array_key_exists('userEmail', $userDetails) && empty($userDetails['userEmail'])) {
                throw new Exception('['.__LINE__.'] - Parameter userEmail empty');
            }
            if (!array_key_exists('userContactNo', $userDetails) && empty($userDetails['userContactNo'])) {
                throw new Exception('['.__LINE__.'] - Parameter userProfileContactNo empty');
            }
            if (!array_key_exists('userPassword', $userDetails) && empty($userDetails['userPassword'])) {
                throw new Exception('['.__LINE__.'] - Parameter userPassword empty');
            }
            if (!array_key_exists('userType', $userDetails) && empty($userDetails['userType'])) {
                throw new Exception('['.__LINE__.'] - Parameter userType empty');
            }
            if (!array_key_exists('roles', $userDetails) && empty($userDetails['roles'])) {
                throw new Exception('['.__LINE__.'] - Parameter roles empty');
            }
            if (!array_key_exists('designationId', $userDetails) && empty($userDetails['designationId'])) {
                throw new Exception('['.__LINE__.'] - Parameter designationId empty');
            }
            if (!array_key_exists('siteId', $userDetails) && empty($userDetails['siteId'])) {
                throw new Exception('['.__LINE__.'] - Parameter siteId empty');
            }

            $userName = $userDetails['userName'];
            $userFirstName = $userDetails['userFirstName'];
            $userEmail = $userDetails['userEmail'];
            $userContactNo = $userDetails['userContactNo'];
            $userPassword = $userDetails['userPassword'];
            $designationId = $userDetails['designationId'];
            $userType = $userDetails['userType'];
            $rolesStr = $userDetails['roles'];
            $siteId = $userDetails['siteId'];

            if ($userType == '1') {
                $groupId = '1';
            } else if ($userType == '2') {
                $groupId = Class_db::getInstance()->db_select_col('cli_site', array('site_id'=>$siteId), 'group_id', null, 1);
            } else {
                throw new Exception('['.__LINE__.'] - Parameter userType invalid ('.$userType.')');
            }

            if (Class_db::getInstance()->db_count('sys_user', array('user_name'=>$userName)) > 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_USER_ADD_SIMILAR_USERNAME, 31);
            }
            if (Class_db::getInstance()->db_count('sys_user_profile', array('user_email'=>$userEmail)) > 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_USER_ADD_SIMILAR_EMAIL, 31);
            }

            $userId = Class_db::getInstance()->db_insert('sys_user', array('user_name'=>$userName, 'user_type'=>$userType, 'user_password'=>md5($userPassword), 'user_first_name'=>$userFirstName, 'site_id'=>$siteId, 'user_status'=>'1'));
            Class_db::getInstance()->db_insert('sys_user_profile', array('user_id'=>$userId, 'user_email'=>$userEmail, 'user_contact_no'=>$userContactNo, 'designation_id'=>$designationId));
            Class_db::getInstance()->db_insert('sys_user_group', array('user_id'=>$userId, 'group_id'=>$groupId));
            $roles = explode(',', $rolesStr);
            foreach ($roles as $role) {
                Class_db::getInstance()->db_insert('sys_user_role', array('user_id'=>$userId, 'role_id'=>$role, 'group_id'=>$groupId));
                $checkpoints = Class_db::getInstance()->db_select('wfl_checkpoint', array('checkpoint_type'=>'<>3', 'role_id'=>$role));
                foreach ($checkpoints as $checkpoint) {
                    $checkpointId = $checkpoint['checkpoint_id'];
                    if ($checkpointId == '3' && $role == '4') {
                        $groupId_ = $groupId;
                    } else {
                        $groupId_ = $checkpoint['group_id'];
                    }
                    if ($groupId_ === $groupId || is_null($groupId_)) {
                        Class_db::getInstance()->db_insert('wfl_checkpoint_user', array('user_id'=>$userId, 'checkpoint_id'=>$checkpointId, 'role_id'=>$role, 'group_id'=>$groupId));
                    }
                }
            }

            return $userId;
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
    public function get_user_list() {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            return Class_db::getInstance()->db_select('sys_user');
        }
        catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public function get_user () {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $this->fn_general->checkEmptyParams(array($this->userId));
            $user = Class_db::getInstance()->db_select_single('vw_user_list', array('sys_user.user_id'=>$this->userId), null, 1);
            $user['clientId'] = !empty($user['siteId']) ? Class_db::getInstance()->db_select_col('cli_site', array('site_id' => $user['siteId']), 'client_id') : '';
            return $user;
        }
        catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public function get_user_by_role() {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            $result = array();
            $userData = Class_db::getInstance()->db_select('vw_user_by_role');
            foreach ($userData as $data) {
                $row_result['roleId'] = $data['role_id'];
                $row_result['total'] = $data['total'];
                array_push($result, $row_result);
            }

            return $result;
        }
        catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $userId
     * @throws Exception
     */
    public function deactivate_profile ($userId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($userId)) {
                throw new Exception('[' . __LINE__ . '] - Parameter userId empty');
            }
            if (Class_db::getInstance()->db_count('sys_user', array('user_id'=>$userId, 'user_status'=>'2')) > 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_USER_DEACTIVATE, 31);
            }

            Class_db::getInstance()->db_update('sys_user', array('user_status'=>'2'), array('user_id'=>$userId));
        }
        catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $userId
     * @throws Exception
     */
    public function activate_profile ($userId) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);
            $constant = $this->constant;

            if (empty($userId)) {
                throw new Exception('[' . __LINE__ . '] - Parameter userId empty');
            }
            if (Class_db::getInstance()->db_count('sys_user', array('user_id'=>$userId, 'user_status'=>'1')) > 0) {
                throw new Exception('[' . __LINE__ . '] - '.$constant::ERR_USER_ACTIVATE, 31);
            }

            Class_db::getInstance()->db_update('sys_user', array('user_status'=>'1'), array('user_id'=>$userId));
        }
        catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }

    /**
     * @param $userId
     * @param $token
     * @throws Exception
     */
    public function save_token ($userId, $token) {
        try {
            $this->fn_general->log_debug(__CLASS__, __FUNCTION__, __LINE__, 'Entering '.__FUNCTION__);

            if (empty($userId)) {
                throw new Exception('[' . __LINE__ . '] - Parameter userId empty');
            }
            if (empty($token)) {
                throw new Exception('[' . __LINE__ . '] - Parameter token empty');
            }

            Class_db::getInstance()->db_update('sys_user', array('user_token'=>$token), array('user_id'=>$userId));
        }
        catch (Exception $ex) {
            $this->fn_general->log_error(__CLASS__, __FUNCTION__, __LINE__, $ex->getMessage());
            throw new Exception($this->get_exception('0005', __FUNCTION__, __LINE__, $ex->getMessage()), $ex->getCode());
        }
    }
}