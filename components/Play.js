import React from 'react';
import Link from 'next/link'
import _ from 'lodash';
import JoinGame from './JoinGame';
import {Tiles, BLANK_LETTER, placementsFromMoves} from '../shared/scribbleScrabble';



const NBSP = '\u00A0';

export default class Play extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      trayLetters: props.game.letters,
      selectedLetter: null,
      localPlacements: {}
    };
    this.onShuffle = this.onShuffle.bind(this);
    this.onTileClick = this.onTileClick.bind(this);
    this.onTrayLetterClick = this.onTrayLetterClick.bind(this);
    this.onDoneTurnClick = this.onDoneTurnClick.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
  }

  onDoneTurnClick() {
    const {onMove} = this.props;
    const {localPlacements} = this.state;
    onMove({localPlacements});
  }

  onResetClick() {
    const {game} = this.props;
    this.setState({
      selectedLetter: null,
      localPlacements: {},
      trayLetters: game.letters
    });
  }

  onShuffle() {
    const {trayLetters} = this.state;
    this.setState({trayLetters: _.shuffle(trayLetters)});
  }

  onTrayLetterClick(letter) {
    const selectedLetter = (letter === this.state.selectedLetter)
      ? null
      : letter;
    this.setState({selectedLetter});
  }

  onTileClick(tile, tileIndex) {
    console.log('onTileClick', tile, tileIndex);
    const {selectedLetter, trayLetters, localPlacements} = this.state;
    const isFreeTile = (localPlacements[tileIndex] === null || localPlacements[tileIndex] === undefined);

    // Placed, no selection => clear
    if (!isFreeTile && !selectedLetter) {
      this.setState({
        localPlacements: {...localPlacements, [tileIndex]: null},
        trayLetters: trayLetters.concat([localPlacements[tileIndex]]),
        selectedLetter: null
      });
      return;
    }

    // Placed, selection => replace
    if (!isFreeTile && selectedLetter) {
      this.setState({
        localPlacements: {...localPlacements, [tileIndex]: selectedLetter},
        trayLetters: trayLetters.map(letter => letter === selectedLetter ? localPlacements[tileIndex] : letter),
        selectedLetter: null
      });
      return;
    }

    // Free, selection => place
    if (isFreeTile && selectedLetter) {
      this.setState({
        localPlacements: {...localPlacements, [tileIndex]: selectedLetter},
        trayLetters: trayLetters.filter(letter => letter !== selectedLetter),
        selectedLetter: null
      });
      return;
    }

    // Free, no selection => nothing
    if (isFreeTile && !selectedLetter) {
      return;
    }
  }

  render() {
    const {game, onDebug} = this.props;
    const {trayLetters, selectedLetter, localPlacements} = this.state;
    const props = {
      game,
      onDebug,
      trayLetters,
      selectedLetter,
      localPlacements,
      onTrayLetterClick: this.onTrayLetterClick,
      onTileClick: this.onTileClick,
      onShuffle: this.onShuffle,
      onResetClick: this.onResetClick,
      onDoneTurnClick: this.onDoneTurnClick
    };
    return <Board {...props} />;
  }
}


function Board(props) {
  const {
    game,
    trayLetters,
    selectedLetter,
    localPlacements,
    onShuffle,
    onTileClick,
    onTrayLetterClick,
    onResetClick,
    onDoneTurnClick,
    onDebug
  } = props;

  const previousPlacements = placementsFromMoves(game.moves);
  return (
    <div className="Board">
      <div className="Board-header">
        <b>Every man dies; not every man truly Scrabbles.</b>
        <div className="Link Board-score" onClick={() => alert('not yet')}>score: 0</div>
      </div>
      <div className="Board-board">
        {game.tiles.map((tile, index) => (
          <Tile
            key={index}
            tileIndex={index}
            tile={tile}
            letter={previousPlacements[index] || localPlacements[index]}
            isLetterLocal={localPlacements[index]}
            isTrayLetterSelected={selectedLetter !== null} 
            onClick={onTileClick}
          />
        ))}
      </div>
      <div className="Board-drawer">
        {!hasJoined(game)
          ? <div className="Join-spacer">
              <JoinGame gameKey={game.gameKey} onJoined={() => window.location.reload()}>Join game?</JoinGame>
            </div>
          : (
            <div>
              <div className="Bag-header">
                <div className="Bag-title">Your tray</div>
                <div className="Link MarginRight" onClick={() => onShuffle()}>shuffle</div>
                <div className="Link" onClick={onResetClick}>reset</div>
              </div>
              <div className="Bag-list">
                <Tray
                  letters={trayLetters}
                  selectedLetter={selectedLetter}
                  onTrayLetterClick={onTrayLetterClick}
                />
                <div className="Play-button" onClick={onDoneTurnClick}>Play</div>
              </div>
            </div>
          )
        }
      </div>
      <div className="Board-links">
        <Link href="/" as="/"><div className="Link">Home</div></Link>
        <div className="Link" onClick={() => alert(`Text or email the URL to your friends, and they\'ll be able to join:\n\n${window.location.href}`)}>Share</div>
        <div className="Link" onClick={() => alert('not done yet')}>Help</div>
        <div className="Link" onClick={onDebug}>Debug</div>
        <Turn game={game} />
      </div>
    </div>
  );
}

function Turn({game}) {
  const {playerKey, players, moves} = game;
  if (!hasJoined(game)) return <span className="Turn">spectating</span>;

  const playerPlayingNow = players[(moves.length % players.length)];
  const isYourTurn = (playerPlayingNow.playerKey === playerKey);
  if (isYourTurn) return <span className="Turn"><b>your turn!</b></span>;

  return <span className="Turn">Waiting for {playerPlayingNow.name}...</span>;
}

function Tile(props) { 
  const {
    tileIndex,
    tile,
    letter,
    isTrayLetterSelected,
    isLetterLocal,
    onClick
  } = props;
  // place or remove your own
  const canClick = (
    (!letter && isTrayLetterSelected) ||
    (letter && isLetterLocal)
  );
  const className = [
    "Tile",
    (canClick && 'Tile-clickable')
  ].join(' ');
  return (
    <div className={className} onClick={() => canClick && onClick(tile, tileIndex)}>
      {letter
        ? <Letter letter={letter} />
        : <TileBackground tile={tile} />
      }
    </div>
  );
}

function TileBackground({tile}) {
  if (tile === Tiles.DOUBLE_LETTER) {
    return <div className="Tile-content DoubleLetter"><div className="scaled">DOUBLE LETTER</div></div>;
  } else if (tile === Tiles.TRIPLE_LETTER) {
    return <div className="Tile-content TripleLetter"><div className="scaled">TRIPLE LETTER</div></div>;
  } else if (tile === Tiles.DOUBLE_WORD) {
    return <div className="Tile-content DoubleWord"><div className="scaled">DOUBLE WORD</div></div>;
  } else if (tile === Tiles.TRIPLE_WORD) {
    return <div className="Tile-content TripleWord"><div className="scaled">TRIPLE WORD</div></div>;
  } else if (tile === Tiles.START) {
    return <div className="Tile-content Start"><span aria-label="star" role="img">⭐</span></div>;
  } else {
    return '\u00A0';
  }
}

function Tray({letters, selectedLetter, onTrayLetterClick}) {
  return (
    <div className="Bag-letters">
      {letters.map((letter, index) => (
        <div key={index} className="Bag-letter-margin">
          <BagLetter
            letter={letter}
            isSelectedLetter={_.isEqual(selectedLetter, letter)}
            onTrayLetterClick={onTrayLetterClick}
          />
        </div>
      ))}
    </div>
  );
}


function BagLetter({letter, isSelectedLetter, onTrayLetterClick}) {
  const style = (isSelectedLetter) ? { outline: '2px solid white' } : {};
  return <Letter letter={letter} style={style} onClick={() => onTrayLetterClick(letter)} />;
}

function Letter({letter, style={}, onClick=null}) {
  const {key, points} = letter;
  const letterEl = (key === BLANK_LETTER) ? NBSP : key;
  const pointsEl = (key === BLANK_LETTER) ? NBSP : points;
  return (
    <div className="Letter" style={style} onClick={onClick}>
      <div className="Letter-letter">{letterEl}</div>
      <div className="Letter-points">{pointsEl}</div>
    </div>
  );
}


function hasJoined(game) {
  const {players, playerKey} = game;
  return _.some(players, {playerKey});
}