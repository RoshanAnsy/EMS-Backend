import express from 'express';
import { createTask,GetTasksList,UpdateTaskStatus,
    CompleteTask,GetAssignTasksList,GetTargetTasksList,
    GetCompletedTaskDetails,AcceptTask,
    GetCompletedTasksList,GetInprogressTasksList,CreateTargetTask } from '../controller/task.controller';
import { authorization } from '../middleware/auth.middleware';


const TaskRouter= express.Router();

TaskRouter.post('/createTask',authorization,createTask);
TaskRouter.get('/GetTasksList',authorization,GetTasksList);
TaskRouter.get('/GetAssignTasksList',authorization,GetAssignTasksList);
TaskRouter.post('/CompleteTask',authorization,CompleteTask);
// TaskRouter.post('/UpdateTask',authorization,UpdateTask);
TaskRouter.get('/GetCompletedTaskDetails',authorization,GetCompletedTaskDetails);
TaskRouter.post('/UpdateTaskStatus',authorization,UpdateTaskStatus);
TaskRouter.get('/GetCompletedTasksList',authorization,GetCompletedTasksList);
TaskRouter.get('/GetInprogressTasksList',authorization,GetInprogressTasksList);
TaskRouter.post('/CreateTargetTask',authorization,CreateTargetTask);
TaskRouter.get('/GetTargetTasksList',authorization,GetTargetTasksList);
TaskRouter.post('/AcceptTask',authorization,AcceptTask);

export default TaskRouter;