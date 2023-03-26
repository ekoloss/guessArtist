import { post, get } from "./connector";
import {IUserCreateBody, IUserResponse} from "@models";

export const submitResult = (gameId: string, data: IUserCreateBody): Promise<IUserResponse> =>
  post<IUserResponse, IUserCreateBody>({path: `/user/${gameId}`, data});

export const getTopRated = (): Promise<IUserResponse[]> =>
  get<IUserResponse[]>({path: `/user/top`});