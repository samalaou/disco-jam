const NUM_OF_OBSTACLES = 15;
const NUM_MOVING_OBSTACLES = 10;
const NUM_STATIC_OBSTACLES = 10;
const GAME_DURATION = 150;
const BPM = 82;
const BEAT_INTERVAL = (60 / BPM) * 1000;
const BEAT_WINDOW = 250; // Allowable window around the beat
const MISSED_BEAT_PENALTY = 5;
const DEFAULT_WIDTH = 3;
const OBSTACLES_HIEGHT = 6;
const PLAYER_HIEGHT = 9;
const PLAYER_DIMENSION = {
    width: DEFAULT_WIDTH,
    height: PLAYER_HIEGHT
}
const PLAYER_STARTING_POSITON = { x: 0, y: 0 };

const titleText = "Disco Jam";
const instructionsText = `
    You're in the Roller Disco, but oh no! You need to pee! Get to the bathroom quickly before an accident happens, but jam along with the beat - otherwise you'll lose ${MISSED_BEAT_PENALTY} seconds! Unfortunately, the Roller Disco is haunted... Beware of the ghosts, they will make you pee yourself
    <br>
    ARROW KEYS: Move left, right, up and down
    <br>
    SPACE: Start and pause the game
`;


const game = new Game();
