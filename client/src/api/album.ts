import { del } from "./connector";

export const resetAlbums = (): Promise<void> =>
  del<void>({path: `/album/resetAlbums`});