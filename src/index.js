const NUM_OF_OBSTACLES = 20;
const GAME_DURATION = 150;
const BPM = 82;
const BEAT_INTERVAL = (60 / BPM) * 1000;
const BEAT_WINDOW = 200; // Allowable window around the beat
const MISSED_BEAT_PENALTY = 5;
const DEFAULT_WIDTH = 3;
const OBSTACLES_HIEGHT = 6;
const PLAYER_HIEGHT = 9;
const PLAYER_DIMENSION = {
    width: DEFAULT_WIDTH,
    height: PLAYER_HIEGHT
}
const PLAYER_STARTING_POSITON = { x: 0, y: 0 };

const game = new Game();
