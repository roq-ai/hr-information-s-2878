import * as yup from 'yup';

export const payrollValidationSchema = yup.object().shape({
  payment_date: yup.date().required(),
  amount: yup.number().integer().required(),
  employee_id: yup.string().nullable(),
});
