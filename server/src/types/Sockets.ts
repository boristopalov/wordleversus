export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  on_update_game: (message: any) => void;
  game_found: (roomId: string) => void;
  game_not_found: (roomId: string) => void;
  create_room_fail: (roomId: string) => void;
  create_room_success: (roomId: string) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  join_queue: (id: string) => void;
  join_room: (id: string) => void;
  update_game: (message: any, gameId: Number) => void;
  create_room: (id: string) => void;
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
