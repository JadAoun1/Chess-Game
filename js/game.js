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

// Initial chess piece placement in a 2D array
const boardState = [
    ['rookb', 'knightb', 'bishopb', 'queenb', 'kingb', 'bishopb', 'knightb', 'rookb'],
    ['pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb', 'pawnb'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
    ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
];

let selectedPiece = null; // Store the selected piece
let fromRow = null;
let fromCol = null;

// Generate chessboard and render pieces
function renderBoard() {
    chessboard.innerHTML = ''; // Clear the board

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row; // Store row and column as data attributes
            cell.dataset.col = col;

            // Alternate colors
            if ((row + col) % 2 === 0) {
                cell.style.backgroundColor = '#fff'; // White squares
            } else {
                cell.style.backgroundColor = '#000'; // Black squares
            }

            // Add piece if exists
            const piece = boardState[row][col];
            if (piece) {
                const pieceElement = document.createElement('img');
                pieceElement.src = pieceImages[piece];
                pieceElement.alt = piece;
                pieceElement.classList.add('chess-piece');

                // Add click functionality to select the piece
                pieceElement.addEventListener('click', () => selectPiece(row, col, piece));

                cell.appendChild(pieceElement);
            }

            // Add click functionality to cells for moving
            cell.addEventListener('click', () => movePiece(row, col));

            chessboard.appendChild(cell);
        }
    }
}

// Highlight possible moves
function highlightMoves(fromRow, fromCol, piece) {
    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        const toRow = parseInt(cell.dataset.row);
        const toCol = parseInt(cell.dataset.col);

        if (validateMove(fromRow, fromCol, toRow, toCol, piece)) {
            cell.classList.add('highlight'); // Add highlight class
        }
    });
}

// Clear highlights
function clearHighlights() {
    const highlightedCells = document.querySelectorAll('.highlight');
    highlightedCells.forEach(cell => cell.classList.remove('highlight'));
}

// Select a piece
function selectPiece(row, col, piece) {
    clearHighlights(); // Clear previous highlights
    highlightMoves(row, col, piece); // Highlight possible moves
    selectedPiece = piece;
    fromRow = row;
    fromCol = col;
}

// Move the selected piece
function movePiece(toRow, toCol) {
    const cell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);

    if (selectedPiece && cell.classList.contains('highlight')) {
        // Update board state
        boardState[toRow][toCol] = selectedPiece;
        boardState[fromRow][fromCol] = '';

        // Clear highlights and reset selection
        clearHighlights();
        selectedPiece = null;
        fromRow = null;
        fromCol = null;

        // Re-render the board
        renderBoard();
    }
}

// Validate moves based on piece rules
function validateMove(fromRow, fromCol, toRow, toCol, piece) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (piece) {
        case 'pawn':
        case 'pawnb':
            return toRow === fromRow - 1 && colDiff === 0; // Simple pawn forward move
        case 'rook':
        case 'rookb':
            return fromRow === toRow || fromCol === toCol; // Rook moves in straight lines
        case 'knight':
        case 'knightb':
            return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2); // "L" shape
        case 'bishop':
        case 'bishopb':
            return rowDiff === colDiff; // Bishop moves diagonally
        case 'queen':
        case 'queenb':
            return rowDiff === colDiff || fromRow === toRow || fromCol === toCol; // Combines rook and bishop
        case 'king':
        case 'kingb':
            return rowDiff <= 1 && colDiff <= 1; // King moves one square in any direction
        default:
            return false;
    }
}

// Initialize the chessboard
renderBoard();
