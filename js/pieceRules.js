export function validateMove(fromRow, fromCol, toRow, toCol, piece, boardState) {
    // Calculate how far the piece is intended to move
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Ensure the destination square is inside the board boundaries
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;

    // Identify the piece (if any) that currently occupies the destination square
    const destinationPiece = boardState[toRow]?.[toCol];

    // Check if the destination square is occupied by a piece of the same color
    // If so, the move is invalid
    if (destinationPiece && getPieceColor(destinationPiece) === getPieceColor(piece)) {
        return false;
    }

    // Determine move validity based on piece type
    switch (piece) {
        case 'pawn':
            // White pawns move upward (towards row 0)
            // Normal forward move by 1
            if (fromCol === toCol) {
                if (toRow === fromRow - 1 && !destinationPiece) return true;
                // Initial double move for white pawn (starting from row 6)
                if (
                    fromRow === 6 &&
                    toRow === fromRow - 2 &&
                    !boardState[fromRow - 1][fromCol] &&
                    !destinationPiece
                ) {
                    return true;
                }
            }

            // White pawn capture move (diagonal by 1 step)
            if (
                Math.abs(toCol - fromCol) === 1 &&
                toRow === fromRow - 1 &&
                destinationPiece &&
                getPieceColor(destinationPiece) === 'black'
            ) {
                return true;
            }

            return false;

        case 'pawnb':
            // Black pawns move downward (towards row 7)
            // Normal forward move by 1
            if (fromCol === toCol) {
                if (toRow === fromRow + 1 && !destinationPiece) return true;
                // Initial double move for black pawn (starting from row 1)
                if (
                    fromRow === 1 &&
                    toRow === fromRow + 2 &&
                    !boardState[fromRow + 1][fromCol] &&
                    !destinationPiece
                ) {
                    return true;
                }
            }

            // Black pawn capture move (diagonal by 1 step)
            if (
                Math.abs(toCol - fromCol) === 1 &&
                toRow === fromRow + 1 &&
                destinationPiece &&
                getPieceColor(destinationPiece) === 'white'
            ) {
                return true;
            }

            return false;


            

        case 'rook':
        case 'rookb':
            // Rooks move any number of squares along a row or column
            return (
                (fromRow === toRow || fromCol === toCol) &&
                isPathClear(fromRow, fromCol, toRow, toCol, boardState)
            );

        case 'knight':
        case 'knightb':
            // Knights move in 'L' shapes: 2 squares in one direction and 1 in the perpendicular direction
            return (
                (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 1) ||
                (Math.abs(toRow - fromRow) === 1 && Math.abs(toCol - fromCol) === 2)
            );

        case 'bishop':
        case 'bishopb':
            // Bishops move diagonally any number of squares
            return (
                Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol) &&
                isPathClear(fromRow, fromCol, toRow, toCol, boardState)
            );

        case 'queen':
        case 'queenb':
            // Queens move like both rooks and bishops combined
            const isDiagonal = Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol);
            const isStraight = fromRow === toRow || fromCol === toCol;
            return (
                (isDiagonal || isStraight) &&
                isPathClear(fromRow, fromCol, toRow, toCol, boardState)
            );

        case 'king':
        case 'kingb':
            // Kings move one square in any direction, but must not move into check
            if (Math.abs(toRow - fromRow) <= 1 && Math.abs(toCol - fromCol) <= 1) {
                const color = getPieceColor(piece);

                // Temporarily make the move on a copy of the board to test for check
                const boardCopy = boardState.map(row => row.slice());
                boardCopy[toRow][toCol] = piece;
                boardCopy[fromRow][fromCol] = '';

                // If king would be in check after this move, it's not valid
                if (isKingInCheck(color, boardCopy, validateMove)) return false;

                return true;
            }
            return false;

        default:
            // If piece type is unknown or not handled, return false
            return false;
    }
}

// Check if the path between two squares is clear (no pieces in the way)
// Used for rook, bishop, and queen moves
function isPathClear(fromRow, fromCol, toRow, toCol, boardState) {
    const rowStep = Math.sign(toRow - fromRow); // 1, 0, or -1 direction step for rows
    const colStep = Math.sign(toCol - fromCol); // 1, 0, or -1 direction step for columns

    // If there's no movement, there's no path to clear
    if (rowStep === 0 && colStep === 0) {
        return false;
    }

    // Start from the square adjacent to the origin in the direction of movement
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    // Traverse the path until reaching the destination square
    while (currentRow !== toRow || currentCol !== toCol) {
        // If we go out of bounds, the path isn't valid
        if (
            currentRow < 0 || currentRow > 7 ||
            currentCol < 0 || currentCol > 7
        ) {
            return false;
        }

        // If a piece is found along the path, it isn't clear
        if (boardState[currentRow]?.[currentCol]) {
            return false;
        }

        currentRow += rowStep;
        currentCol += colStep;
    }

    // No pieces found along the path
    return true;
}

// Find the king of a given color on the board
export function getKingPosition(color, boardState) {
    // Determine which piece name we're looking for
    const kingPiece = (color === 'white') ? 'king' : 'kingb';

    // Scan the board to find the king
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (boardState[row][col] === kingPiece) {
                return { row, col };
            }
        }
    }

    // If no king is found (which theoretically shouldn't happen), return null
    return null;
}

// Check if a specific position is attacked by the opponent
export function isPositionAttacked(targetRow, targetCol, color, boardState, validateMove) {
    // Identify the opponent's color
    const opponentColor = (color === 'white') ? 'black' : 'white';

    // Scan the entire board for opponent's pieces
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = boardState[row][col];
            // If it's an opponent's piece, check if it can move to the target position
            if (piece && getPieceColor(piece) === opponentColor) {
                if (validateMove(row, col, targetRow, targetCol, piece, boardState)) {
                    return true;
                }
            }
        }
    }

    return false;
}

// Check if the king of a given color is currently in check
export function isKingInCheck(color, boardState, validateMove) {
    // Find the king's position
    const kingPos = getKingPosition(color, boardState);
    if (!kingPos) return false; // If no king found, return false as a fallback

    // Determine if the king's position is attacked by any of the opponent's pieces
    return isPositionAttacked(kingPos.row, kingPos.col, color, boardState, validateMove);
}

// Determine the color of a piece based on its name
export function getPieceColor(piece) {
    if (!piece) return null; 
    // Pieces ending with 'b' are black, otherwise they are white
    return piece.endsWith('b') ? 'black' : 'white';
} 