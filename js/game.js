const chessboard = document.querySelector('.chessboard');

// Chess piece image paths
const pieceImages = {
    pawn: '../assets/images/pawn.png',
    rook: '../assets/images/rook.png',
    knight: '../assets/images/knight.png',
    bishop: '../assets/images/bishop.png',
    queen: '../assets/images/queen.png',
    king: '../assets/images/king.png',
    pawnb: '../assets/images/pawnb.png',
    rookb: '../assets/images/rookb.png',
    knightb: '../assets/images/knightb.png',
    bishopb: '../assets/images/bishopb.png',
    queenb: '../assets/images/queenb.png',
    kingb: '../assets/images/kingb.png'
};

// Initial white chess piece placement
const whitePieces = [
    'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook',
    'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    'pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb',
    'rookb', 'knightb', 'bishopb', 'queenb', 'kingb', 'bishopb', 'knightb', 'rookb'
];

// Generate 8x8 chessboard with alternating colors and pieces
for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');

    // Alternate colors based on row and column
    const row = Math.floor(i / 8);
    const col = i % 8;
    if ((row + col) % 2 === 0) {
        cell.style.backgroundColor = '#fff'; // White squares
    } else {
        cell.style.backgroundColor = '#000'; // Black squares
    }

    // Add white pieces to their initial positions
    const piece = whitePieces[i];
    if (piece) {
        const pieceElement = document.createElement('img');
        pieceElement.src = pieceImages[piece];
        pieceElement.alt = piece;
        pieceElement.classList.add('chess-piece');
        cell.appendChild(pieceElement);
    }

    chessboard.appendChild(cell);
}
