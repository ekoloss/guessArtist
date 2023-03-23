import {
  ILoginBody,
  ILoginResponse,
} from '@models';

import { post } from './connector';

export const login = (data: ILoginBody): Promise<ILoginResponse> =>
  post<ILoginResponse, ILoginBody>({ path: '/login', data });
