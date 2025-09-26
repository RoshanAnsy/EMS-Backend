import express from 'express';
import { getUserLogs,getAllUsers, GetUser,GetUserDetails ,GetUserListForDropdown,UpdateUserDetails, AddNewUser} from '../controller/user.controller';
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

export default router;

