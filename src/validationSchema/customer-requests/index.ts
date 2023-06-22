import * as yup from 'yup';

export const customerRequestValidationSchema = yup.object().shape({
  customer_name: yup.string().required(),
  customer_email: yup.string().required(),
  request_type: yup.string().required(),
  request_details: yup.string().required(),
  company_id: yup.string().nullable(),
});
