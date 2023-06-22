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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCustomerRequestById, updateCustomerRequestById } from 'apiSdk/customer-requests';
import { Error } from 'components/error';
import { customerRequestValidationSchema } from 'validationSchema/customer-requests';
import { CustomerRequestInterface } from 'interfaces/customer-request';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function CustomerRequestEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CustomerRequestInterface>(
    () => (id ? `/customer-requests/${id}` : null),
    () => getCustomerRequestById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CustomerRequestInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCustomerRequestById(id, values);
      mutate(updated);
      resetForm();
      router.push('/customer-requests');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CustomerRequestInterface>({
    initialValues: data,
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
            Edit Customer Request
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
              <Input
                type="text"
                name="request_type"
                value={formik.values?.request_type}
                onChange={formik.handleChange}
              />
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'customer_request',
  operation: AccessOperationEnum.UPDATE,
})(CustomerRequestEditPage);
