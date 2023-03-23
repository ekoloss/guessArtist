import { gameStatus } from "../server/libs/utils/src";

export interface IGameGetQuestionParams {
  gameId: string;
}

export interface IGameCheckBody {
  answer: string;
  albumId: string;
}

export interface IGameCheckResponse {
  correct: boolean;
  status: gameStatus;
}
export interface IGameAlbumResponse {
  album: string;
}