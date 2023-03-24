import {
  IGameGetQuestionParams,
  IGameAlbumResponse,
  IGameCheckBody,
  IGameCheckResponse,
} from '@models';

import { put, get } from './connector';

 export const getQuestion = (params: IGameGetQuestionParams): Promise<IGameAlbumResponse> =>
   get<IGameAlbumResponse, IGameGetQuestionParams>({ path: `/game/${params.gameId}` });

 export const checkResult = (gameId: string, data: IGameCheckBody): Promise<IGameCheckResponse> =>
   put<IGameCheckResponse, IGameCheckBody>({ path: `/game/${gameId}/check`, data });
