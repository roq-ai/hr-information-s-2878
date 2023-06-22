import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface CustomerRequestInterface {
  id?: string;
  company_id?: string;
  customer_name: string;
  customer_email: string;
  request_type: string;
  request_details: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  _count?: {};
}

export interface CustomerRequestGetQueryInterface extends GetQueryInterface {
  id?: string;
  company_id?: string;
  customer_name?: string;
  customer_email?: string;
  request_type?: string;
  request_details?: string;
}
