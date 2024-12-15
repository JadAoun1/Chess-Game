export function validateMove(fromRow, fromCol, toRow, toCol, piece, boardState) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Prevent moving outside the board
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;

    // Prevent moving to a square occupied by a friendly piece
    const destinationPiece = boardState[toRow]?.[toCol];
    if (destinationPiece && destinationPiece[0] === piece[0]) return false;

    switch (piece) {
        case 'pawn':
            // White pawns move upwards
            if (fromCol === toCol) {
                if (toRow === fromRow - 1 && !destinationPiece) return true; // Single step
                if (fromRow === 6 && toRow === fromRow - 2 && !boardState[fromRow - 1][fromCol] && !destinationPiece) return true; // Double step
            }
            // Diagonal capture
            if (colDiff === 1 && toRow === fromRow - 1 && destinationPiece?.[0] === 'b') return true;
            return false;

        case 'pawnb':
            // Black pawns move downwards
            if (fromCol === toCol) {
                if (toRow === fromRow + 1 && !destinationPiece) return true; // Single step
                if (fromRow === 1 && toRow === fromRow + 2 && !boardState[fromRow + 1][fromCol] && !destinationPiece) return true; // Double step
            }
            // Diagonal capture
            if (colDiff === 1 && toRow === fromRow + 1 && destinationPiece?.[0] === 'w') return true;
            return false;

        case 'rook':
        case 'rookb':
            return isPathClear(fromRow, fromCol, toRow, toCol, boardState) && (fromRow === toRow || fromCol === toCol);

        case 'knight':
        case 'knightb':
            return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

        case 'bishop':
        case 'bishopb':
            return isPathClear(fromRow, fromCol, toRow, toCol, boardState) && rowDiff === colDiff;

        case 'queen':
        case 'queenb':
            return isPathClear(fromRow, fromCol, toRow, toCol, boardState) &&
                   (rowDiff === colDiff || fromRow === toRow || fromCol === toCol);

        case 'king':
        case 'kingb':
            // Normal king moves
            return rowDiff <= 1 && colDiff <= 1;

        default:
            return false;
    }
}

// Helper function to check if a path is clear
function isPathClear(fromRow, fromCol, toRow, toCol, boardState) {
    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        if (boardState[currentRow]?.[currentCol]) return false; // Blocked by another piece
        currentRow += rowStep;
        currentCol += colStep;
    }
    return true;
}