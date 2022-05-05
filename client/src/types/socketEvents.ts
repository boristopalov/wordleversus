interface Game {
  id: Number;
  room_id: String;
  p1_id: Number;
  p1_prev_guesses: String[];
  p1_current_guess: String[];
  p1_current_row: Number;
  p1_game_won: Boolean;
  p2_id: Number;
  p2_prev_guesses: String[];
  p2_current_guess: String[];
  p2_current_row: Number;
  p2_game_won: Boolean;
  created_at: String;
  updated_at: String;
}

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
