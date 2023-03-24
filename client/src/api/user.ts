import { post } from "./connector";
import { IGameGetQuestionParams, IUserCreateBody } from "@models";

export const submitResult = (params: IGameGetQuestionParams, data: IUserCreateBody) =>
  post<IGameGetQuestionParams, IUserCreateBody>({path: `/user/${params.gameId}`, data});