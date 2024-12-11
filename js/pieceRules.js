export function validateMove(fromRow, fromCol, toRow, toCol, piece) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (piece) {
        case 'pawn':
            // White pawns move upwards (decreasing row number)
            return toRow === fromRow - 1 && fromCol === toCol;

        case 'pawnb':
            // Black pawns move downwards (increasing row number)
            return toRow === fromRow + 1 && fromCol === toCol;

        case 'rook':
        case 'rookb':
            return (fromRow === toRow || fromCol === toCol);

        case 'knight':
        case 'knightb':
            return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

        case 'bishop':
        case 'bishopb':
            return (rowDiff === colDiff);

        case 'queen':
        case 'queenb':
            return (rowDiff === colDiff || fromRow === toRow || fromCol === toCol);

        case 'king':
        case 'kingb':
            return (rowDiff <= 1 && colDiff <= 1);

        default:
            return false;
    }
}



