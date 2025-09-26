import express from 'express';
import { GetUserDetailsWithBankDetails,GetPaymentListForEmp,
    MakePaymentToUser,GetPaymentList
} from '../controller/payment.controller';
import { authorization } from '../middleware/auth.middleware';


const PaymentRouter= express.Router();

PaymentRouter.post('/GetUserDetailsWithBankDetails',authorization,GetUserDetailsWithBankDetails);
PaymentRouter.get('/GetPaymentListForEmp',authorization,GetPaymentListForEmp);
PaymentRouter.post('/MakePaymentToEmp',authorization,MakePaymentToUser);
PaymentRouter.get('/GetPaymentList',authorization,GetPaymentList);
export default PaymentRouter;