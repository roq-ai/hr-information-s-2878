import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCustomerRequest } from 'apiSdk/customer-requests';
import { Error } from 'components/error';
import { customerRequestValidationSchema } from 'validationSchema/customer-requests';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { CustomerRequestInterface } from 'interfaces/customer-request';

function CustomerRequestCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CustomerRequestInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCustomerRequest(values);
      resetForm();
      router.push('/customer-requests');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CustomerRequestInterface>({
    initialValues: {
      customer_name: '',
      customer_email: '',
      request_type: '',
      request_details: '',
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: customerRequestValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Customer Request
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="customer_name" mb="4" isInvalid={!!formik.errors?.customer_name}>
            <FormLabel>Customer Name</FormLabel>
            <Input
              type="text"
              name="customer_name"
              value={formik.values?.customer_name}
              onChange={formik.handleChange}
            />
            {formik.errors.customer_name && <FormErrorMessage>{formik.errors?.customer_name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="customer_email" mb="4" isInvalid={!!formik.errors?.customer_email}>
            <FormLabel>Customer Email</FormLabel>
            <Input
              type="text"
              name="customer_email"
              value={formik.values?.customer_email}
              onChange={formik.handleChange}
            />
            {formik.errors.customer_email && <FormErrorMessage>{formik.errors?.customer_email}</FormErrorMessage>}
          </FormControl>
          <FormControl id="request_type" mb="4" isInvalid={!!formik.errors?.request_type}>
            <FormLabel>Request Type</FormLabel>
            <Input type="text" name="request_type" value={formik.values?.request_type} onChange={formik.handleChange} />
            {formik.errors.request_type && <FormErrorMessage>{formik.errors?.request_type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="request_details" mb="4" isInvalid={!!formik.errors?.request_details}>
            <FormLabel>Request Details</FormLabel>
            <Input
              type="text"
              name="request_details"
              value={formik.values?.request_details}
              onChange={formik.handleChange}
            />
            {formik.errors.request_details && <FormErrorMessage>{formik.errors?.request_details}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'customer_request',
  operation: AccessOperationEnum.CREATE,
})(CustomerRequestCreatePage);
