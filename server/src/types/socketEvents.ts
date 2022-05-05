import { Game } from "knex/types/tables";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  on_update_game: (message: any) => void;
  game_found: (roomId: string) => void;
  game_not_found: (roomId: string) => void;
  create_room_fail: (roomId: string) => void;
  create_room_success: (roomId: string) => void;
  on_load_game_from_room: (game: Game) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  join_queue: () => void;
  join_room: (id: string) => void;
  update_game: (message: any, gameId: Number) => void;
  create_room: (id: string) => void;
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
  load_game_from_room: (roomId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
