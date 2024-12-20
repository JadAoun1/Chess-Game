import { renderBoard } from './board.js';
import { selectPiece, movePiece } from './interactions.js';

const pieceImages = {
    'pawn': 'assets/images/pawn.png',
    'rook': 'assets/images/rook.png',
    'knight': 'assets/images/knight.png',
    'bishop': 'assets/images/bishop.png',
    'queen': 'assets/images/queen.png',
    'king': 'assets/images/king.png',
    'pawnb': 'assets/images/pawnb.png',
    'rookb': 'assets/images/rookb.png',
    'knightb': 'assets/images/knightb.png',
    'bishopb': 'assets/images/bishopb.png',
    'queenb': 'assets/images/queenb.png',
    'kingb': 'assets/images/kingb.png',
};

let currentTurn = 'White';

const boardState = [
    ['rookb', 'knightb', 'bishopb', 'queenb', 'kingb', 'bishopb', 'knightb', 'rookb'],
    ['pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
    ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
];

// Render the board with the initial state and turn
renderBoard(boardState, pieceImages, currentTurn);
