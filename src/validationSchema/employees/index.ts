import * as yup from 'yup';

export const employeeValidationSchema = yup.object().shape({
  employment_start_date: yup.date().required(),
  employment_end_date: yup.date(),
  position: yup.string().required(),
  salary: yup.number().integer().required(),
  user_id: yup.string().nullable(),
  company_id: yup.string().nullable(),
});
