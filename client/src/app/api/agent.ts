import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Product } from '../models/product';
import { router } from '../router/Routes';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(
  async (response) => {
    await sleep();
    return response;
  },
  (error: AxiosError) => {
    const { data: { title = '', errors = '' } = {}, data, status } = (error?.response as AxiosResponse) || {};
    switch (status) {
      case 400:
        if (errors) {
          throw Object.values(errors)
            .reduce<any[]>((errs, error) => (error ? [...errs, error] : errs), [])
            .flat();
        }
        toast.error(title);
        break;
      case 401:
        toast.error(title);
        break;
      case 404:
        toast.error(title);
        break;
      case 500:
        router.navigate('/server-error', { state: { error: data } });
        break;
      default:
        toast.error('Something went wrong');
        break;
    }

    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody)
};

const Catalog = {
  list: (): Promise<Product[]> => requests.get('/products'),
  details: (id: string): Promise<Product> => requests.get(`/products/${id}`)
};

const TestErrors = {
  get404Error: () => requests.get('/Buggy/not-found'),
  get400Error: () => requests.get('/buggy/bad-request'),
  get401Error: () => requests.get('/buggy/unauthorised'),
  getValidationError: () => requests.get('/buggy/validation-error'),
  get500Error: () => requests.get('/buggy/server-error')
};

const agent = {
  Catalog,
  TestErrors
};

export default agent;
