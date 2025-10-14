import express from 'express';
import { getUserLogs,getAllUsers,GetTeamListByID ,GetUser,GetUserDetails ,RestoreUser,
    GetTeamListAndTaskDetailByID,
    CreateUserMapping,DeleteUser,UserListByRole,GetListUserAssign,GetListUserOnRoleBased,GetUserListForDropdown,UpdateUserDetails, AddNewUser} from '../controller/user.controller';
import { authorization } from '../middleware/auth.middleware';
import { UserList } from '../controller/user.controller';
const router= express.Router();

router.get('/getUserLogs',authorization,getUserLogs);
router.get('/getAllUsers', authorization,getAllUsers);
router.get("/getUser",authorization,GetUser);
router.get("/userList",UserList);
router.get("/GetUserDetails",authorization,GetUserDetails);
router.post("/UpdateUserDetails",authorization,UpdateUserDetails);
router.post("/AddNewUser",authorization,AddNewUser);
router.get("/GetUserListForDropdown",authorization,GetUserListForDropdown);
router.post("/CreateUserMaping",authorization,CreateUserMapping);
router.post("/GetListUserOnRoleBased",authorization,GetListUserOnRoleBased);
router.get("/GetListUserAssign",authorization,GetListUserAssign);
router.get("/UserListByRole",authorization,UserListByRole);
router.post("/DeleteUser",authorization,DeleteUser);
router.get('/GetTeamListByID',authorization,GetTeamListByID)
router.get('/RestoreUser',RestoreUser);
router.get('/GetTeamListAndTaskDetailByID',authorization,GetTeamListAndTaskDetailByID)
export default router;

