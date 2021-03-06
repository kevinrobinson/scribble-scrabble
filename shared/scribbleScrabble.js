import {v4 as uuidv4} from 'uuid';
import _ from 'lodash';


export function newGameRecord(playerKey) {
  const timestamp = new Date();
  const key = `g:${uuidv4()}`;
  const initialGameDoc = {
    version: 'v2',
    createdAt: timestamp.getTime(),
    orderedPlayerKeys: [],
    lettersForPlayers: {},
    bagOfLetters: bagOfLetters(),
    moves: [],
    tiles: makeTiles(),
  };
  const doc = gameDocAfterJoining(initialGameDoc, playerKey);
  return {key, doc, timestamp};
}

export function gameDocAfterJoining(gameDoc, playerKey) {
  if (gameDoc.orderedPlayerKeys.indexOf(playerKey) !== -1) {
    return gameDoc;
  }

  const bagNow = gameDoc.bagOfLetters;
  const {drawn, remaining} = drawLetters(bagNow, 7);  
  return {
    ...gameDoc,
    orderedPlayerKeys: gameDoc.orderedPlayerKeys.concat([playerKey]),
    bagOfLetters: remaining,
    lettersForPlayers: {
      ...gameDoc.lettersForPlayers,
      [playerKey]: drawn
    }
  };
}


export function gameDocAfterMove(gameDoc, playerKey, move) {
  // TODO validate points and placements ???
  // TODO validate that is is their turn
  const validatedMove = {
    ...move,
    playerKey
  };

  // draw new letters
  const bagNow = gameDoc.bagOfLetters;
  const trayLettersNow = gameDoc.lettersForPlayers[playerKey];
  const placedLetters = Object.values(validatedMove.placements);
  const {drawn, remaining} = drawLetters(bagNow, placedLetters.length);
  const updatedPlayerLetters = _.differenceWith(trayLettersNow, placedLetters, _.isEqual).concat(drawn);

  // update letters in bag, letters for player, and add move
  return {
    ...gameDoc,
    bagOfLetters: remaining,
    lettersForPlayers: {
      ...gameDoc.lettersForPlayers,
      [playerKey]: updatedPlayerLetters
    },
    moves: gameDoc.moves.concat([validatedMove]),
  };
}

export function placementsFromMoves(moves) {
  const placements = {};
  moves.forEach(move => {
    Object.keys(move.placements).forEach(tileIndex => {
      placements[tileIndex] = move.placements[tileIndex];
    })
  });
  return placements;
}


export function gameForClient(gameKey, playerKey, players, doc) {
  return {
    gameKey,
    playerKey,
    players,
    version: doc.version,
    createdAt: doc.createdAt,
    orderedPlayerKeys: doc.orderedPlayerKeys,
    letters: doc.lettersForPlayers[playerKey] || [],
    tiles: doc.tiles,
    moves: doc.moves
  };
}

function drawLetters(bagLetters, nRequested) {
  const n = Math.min(nRequested, bagLetters.length);
  const drawn = bagLetters.slice(0, n);
  const remaining = bagLetters.slice(n);

  return {drawn, remaining};
}

export const Tiles = {
  BLANK: 't:B',
  START: 't:*',
  DOUBLE_LETTER: 't:DL',
  TRIPLE_LETTER: 't:TL',
  DOUBLE_WORD: 't:DW',
  TRIPLE_WORD: 't:TW'
};

function makeTiles() {
  let tiles = _.range(0, 15*15).map(() => Tiles.BLANK);

  tiles[0] = Tiles.TRIPLE_WORD;
  tiles[3+15* 0] = Tiles.DOUBLE_LETTER;
  tiles[7+15* 0] = Tiles.TRIPLE_WORD;
  tiles[11+15*  0] = Tiles.DOUBLE_LETTER;
  tiles[14+15*  0] = Tiles.TRIPLE_WORD;
  tiles[1+15* 1] = Tiles.DOUBLE_WORD;
  tiles[5+15* 1] = Tiles.TRIPLE_LETTER;
  tiles[9+15* 1] = Tiles.TRIPLE_LETTER;
  tiles[13+15*  1] = Tiles.DOUBLE_WORD;
  tiles[2+15* 2] = Tiles.DOUBLE_WORD;
  tiles[6+15* 2] = Tiles.DOUBLE_LETTER;
  tiles[8+15* 2] = Tiles.DOUBLE_LETTER;
  tiles[12+15*  2] = Tiles.DOUBLE_WORD;
  tiles[0+15* 3] = Tiles.DOUBLE_LETTER;
  tiles[3+15* 3] = Tiles.DOUBLE_WORD;
  tiles[7+15* 3] = Tiles.DOUBLE_LETTER;
  tiles[11+15*  3] = Tiles.DOUBLE_WORD;
  tiles[14+15*  3] = Tiles.DOUBLE_LETTER;
  tiles[4+15* 4] = Tiles.DOUBLE_WORD;
  tiles[10+15*  4] = Tiles.DOUBLE_WORD;
  tiles[1+15* 5] = Tiles.TRIPLE_LETTER;
  tiles[5+15* 5] = Tiles.TRIPLE_LETTER;
  tiles[9+15* 5] = Tiles.TRIPLE_LETTER;
  tiles[13+15*  5] = Tiles.TRIPLE_LETTER;
  tiles[2+15* 6] = Tiles.DOUBLE_LETTER;
  tiles[6+15* 6] = Tiles.DOUBLE_LETTER;
  tiles[8+15* 6] = Tiles.DOUBLE_LETTER;
  tiles[12+15*  6] = Tiles.DOUBLE_LETTER;
  tiles[0+15* 7] = Tiles.TRIPLE_WORD;
  tiles[3+15* 7] = Tiles.DOUBLE_LETTER;
  tiles[7+15* 7] = Tiles.START;
  tiles[11+15*  7] = Tiles.DOUBLE_LETTER;
  tiles[14+15*  7] = Tiles.TRIPLE_WORD;
  tiles[2+15* 8] = Tiles.DOUBLE_LETTER;
  tiles[6+15* 8] = Tiles.DOUBLE_LETTER;
  tiles[8+15* 8] = Tiles.DOUBLE_LETTER;
  tiles[12+15*  8] = Tiles.DOUBLE_LETTER;
  tiles[1+15* 9] = Tiles.TRIPLE_LETTER;
  tiles[5+15* 9] = Tiles.TRIPLE_LETTER;
  tiles[9+15* 9] = Tiles.TRIPLE_LETTER;
  tiles[13+15*  9] = Tiles.TRIPLE_LETTER;
  tiles[4+15* 10] = Tiles.DOUBLE_WORD;
  tiles[10+15* 10] = Tiles.DOUBLE_WORD;
  tiles[0+15* 11] = Tiles.DOUBLE_LETTER;
  tiles[3+15* 11] = Tiles.DOUBLE_WORD;
  tiles[7+15* 11] = Tiles.DOUBLE_LETTER;
  tiles[11+15*  11] = Tiles.DOUBLE_WORD;
  tiles[14+15*  11] = Tiles.DOUBLE_LETTER;
  tiles[2+15* 12] = Tiles.DOUBLE_WORD;
  tiles[6+15* 12] = Tiles.DOUBLE_LETTER;
  tiles[8+15* 12] = Tiles.DOUBLE_LETTER;
  tiles[12+15*  12] = Tiles.DOUBLE_WORD;
  tiles[1+15* 13] = Tiles.DOUBLE_WORD;
  tiles[5+15* 13] = Tiles.TRIPLE_LETTER;
  tiles[9+15* 13] = Tiles.TRIPLE_LETTER;
  tiles[13+15*  13] = Tiles.DOUBLE_WORD;
  tiles[0+15* 14] = Tiles.TRIPLE_WORD;
  tiles[3+15* 14] = Tiles.DOUBLE_LETTER;
  tiles[7+15* 14] = Tiles.TRIPLE_WORD;
  tiles[11+15*  14] = Tiles.DOUBLE_LETTER;
  tiles[14+15*  14] = Tiles.TRIPLE_WORD;

  return tiles;
}


function bagOfLetters() {
  let lettersInBag = [];
  const letterKeys = Object.keys(letterInfo);
  letterKeys.forEach(letterKey => {
    const {count, points} = letterInfo[letterKey];
    _.range(0, count).forEach(i => {
      lettersInBag.push({
        id: `${letterKey}#${i+1}`,
        key: letterKey,
        points: points
      });
    });
  });
  return _.shuffle(lettersInBag);
}


// TODO: also need to support adjacent words formed
export function calculatePoints(tiles, placements) {
  const scores = [];
  const multipliers = [1];
  Object.keys(placements).forEach(tileIndex => {
    const tile = tiles[tileIndex];
    if (tile === Tiles.DOUBLE_WORD || Tiles.START) {
      multipliers.push(2);
    } else if (tile === Tiles.TRIPLE_WORD) {
      multipliers.push(3);
    }

    const letter = placements[tileIndex];
    if (tile === Tiles.DOUBLE_LETTER) {
      scores.push(letter.points * 2);
    } else if (tile === Tiles.TRIPLE_LETTER) {
      scores.push(letter.points * 3);
    } else {
      scores.push(letter.points);
    }
  });
  const total = scores.reduce((sum, score) => sum + score, 0);
  const multiplier = Math.max(...multipliers);
  return total * multiplier;
}




export const BLANK_LETTER = ' ';
const letterInfo = {
  A: {
    count: 9,
    points: 1
  },
  B: {
    count: 2,
    points: 3
  },
  C: {
    count: 2,
    points: 3
  },
  D: {
    count: 4,
    points: 2
  },
  E: {
    count: 12,
    points:  1
  },
  F: {
    count: 2,
    points: 4
  },
  G: {
    count: 3,
    points: 2
  },
  H: {
    count: 2,
    points: 4
  },
  I: {
    count: 9,
    points: 1
  },
  J: {
    count: 1,
    points: 8
  },
  K: {
    count: 1,
    points: 5
  },
  L: {
    count: 4,
    points: 1
  },
  M: {
    count: 2,
    points: 3
  },
  N: {
    count: 6,
    points: 1
  },
  O: {
    count: 8,
    points: 1
  },
  P: {
    count: 2,
    points: 3
  },
  Q: {
    count: 1,
    points: 10
  },
  R: {
    count: 6,
    points: 1
  },
  S: {
    count: 4,
    points: 1
  },
  T: {
    count: 6,
    points: 1
  },
  U: {
    count: 4,
    points: 1
  },
  V: {
    count: 2,
    points: 4
  },
  W: {
    count: 2,
    points: 4
  },
  X: {
    count: 1,
    points: 8
  },
  Y: {
    count: 2,
    points: 4
  },
  Z: {
    count: 1,
    points: 10
  },
  [BLANK_LETTER]: {
    count: 2,
    points: 0
  }
};