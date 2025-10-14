import express from 'express';
import { GetUserDetailsWithBankDetails,GetPaymentListForEmp,
    MakePaymentToUser,GetPaymentList,DeletePayment,CreatePaymentReceiptSetting,
    UpdatePaymentReceiptSetting,FindPaymentReceiptSetting,
    GetPaymentDetails
} from '../controller/payment.controller';
import { authorization } from '../middleware/auth.middleware';


const PaymentRouter= express.Router();

PaymentRouter.post('/GetUserDetailsWithBankDetails',authorization,GetUserDetailsWithBankDetails);
PaymentRouter.get('/GetPaymentListForEmp',authorization,GetPaymentListForEmp);
PaymentRouter.post('/MakePaymentToEmp',authorization,MakePaymentToUser);
PaymentRouter.get('/GetPaymentList',authorization,GetPaymentList);
PaymentRouter.post("/DeletePayment",authorization,DeletePayment)
PaymentRouter.post("/CreatePaymentReceiptSetting",authorization,CreatePaymentReceiptSetting)
PaymentRouter.post("/UpdatePaymentReceiptSetting",authorization,UpdatePaymentReceiptSetting)
PaymentRouter.get('/FindPaymentReceiptSetting',authorization,FindPaymentReceiptSetting)
PaymentRouter.get("/GetPaymentDetails",authorization,GetPaymentDetails);
export default PaymentRouter;