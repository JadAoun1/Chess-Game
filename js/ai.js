import { validateMove, getPieceColor, isKingInCheck } from './pieceRules.js';

/**
 * Determines and applies the AI's move for the black player.
 * 
 * boardState: A 2D array representing the current state of the board.
 * currentPlayer: A string representing the current player ("white" or "black").
 * aiDifficulty: A string representing the AI difficulty setting ("easy", "medium", "hard").
 * 
 * returns: A 2D array representing the new board state after the AI move.
 */

export function makeAIMove(boardState, currentPlayer, aiDifficulty = 'easy') {
    // Only proceed if it is black's turn. If not, just return the board as is.
    if (currentPlayer !== 'black') {
        return boardState;
    }

    // Get all possible moves for the black pieces.
    let possibleMoves = getAllPossibleMoves(boardState, 'black');

    // Check if the black king is currently in check.
    if (isKingInCheck('black', boardState, validateMove)) {
        // Filter moves to only include those that resolve the check.
        possibleMoves = possibleMoves.filter(move => {
            const newBoardState = applyMove(boardState, move);
            // Keep the move only if it leads to a state where black's king is not in check.
            return !isKingInCheck('black', newBoardState, validateMove);
        });

        // If no possible moves get the black king out of check, it's checkmate.
        if (possibleMoves.length === 0) {
            // Black loses, so just return the current board (no move made).
            return boardState;
        }
    }

    // Select and apply a move based on the chosen difficulty setting.
    switch (aiDifficulty) {
        case 'medium':
            return makeMediumAIMove(boardState, possibleMoves);
        case 'hard':
            return makeHardAIMove(boardState, possibleMoves);
        case 'easy':
        default:
            return makeEasyAIMove(boardState, possibleMoves);
    }
}

/**
 * Retrieves all possible moves for a given color from the current board state.
 * 
 * boardState: The current board as a 2D array.
 * color: The color of the player we want moves for ("white" or "black").
 * 
 * returns: An array of possible moves, each move an object with from/to coordinates and the piece.
 */

function getAllPossibleMoves(boardState, color) {
    const moves = [];

    // Iterate over every square on the board.
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = boardState[fromRow][fromCol];
            // Check if there is a piece of the correct color on this square.
            if (piece && getPieceColor(piece) === color) {
                // For this piece, check every possible target square.
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        // Use validateMove to confirm if piece can move from (fromRow, fromCol) to (toRow, toCol).
                        if (validateMove(fromRow, fromCol, toRow, toCol, piece, boardState)) {
                            // Store the move if it's valid.
                            moves.push({
                                fromRow,
                                fromCol,
                                toRow,
                                toCol,
                                piece
                            });
                        }
                    }
                }
            }
        }
    }

    return moves;
}

/**
 * Returns a new board state after applying the given move.
 * 
 * boardState: The current board as a 2D array.
 * move: The move to apply, containing fromRow, fromCol, toRow, toCol, and piece.
 * 
 * returns: A new 2D array representing the board after the move is applied.
 */

function applyMove(boardState, move) {
    // Create a copy of the board to avoid mutating the original.
    const newBoardState = boardState.map(row => row.slice());

    // Move the piece to the target location.
    newBoardState[move.toRow][move.toCol] = move.piece;

    // Empty the original position.
    newBoardState[move.fromRow][move.fromCol] = '';

    return newBoardState;
}













/**
 * AI "easy" move: just pick a random valid move.
 * 
 * boardState: The current board as a 2D array.
 * moves: An array of valid moves.
 * 
 * returns: A new 2D array representing the board after a random move is chosen.
 */

function makeEasyAIMove(boardState, moves) {
    // Pick a random move from the list of possible moves.
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return applyMove(boardState, randomMove);
}

/**
 * AI "medium" move: prefer capturing moves if available, otherwise random.
 * 
 * boardState: The current board as a 2D array.
 * moves: An array of valid moves.
 * 
 * returns: A new 2D array representing the board after the chosen move.
 */

function makeMediumAIMove(boardState, moves) {
    // Identify moves that capture an opponent's piece.
    const capturingMoves = moves.filter(move => boardState[move.toRow][move.toCol] !== '');

    // If there are capturing moves, pick one of them at random; otherwise pick a random move.
    const chosenMove = (capturingMoves.length > 0)
        ? capturingMoves[Math.floor(Math.random() * capturingMoves.length)]
        : moves[Math.floor(Math.random() * moves.length)];

    return applyMove(boardState, chosenMove);
}

/**
 * AI "hard" move: prefer capturing moves first; if no captures,
 * move towards the center squares.
 * 
 * boardState: The current board as a 2D array.
 * moves: An array of valid moves.
 * 
 * returns: A new 2D array representing the board after the chosen move.
 */

function makeHardAIMove(boardState, moves) {
    // Identify capturing moves.
    const capturingMoves = moves.filter(move => boardState[move.toRow][move.toCol] !== '');
    if (capturingMoves.length > 0) {
        // If captures are available, choose one at random.
        const randomCapture = capturingMoves[Math.floor(Math.random() * capturingMoves.length)];
        return applyMove(boardState, randomCapture);
    }

    // Define the "center" squares to move towards.
    const centerSquares = [
        { r: 3, c: 3 },
        { r: 3, c: 4 },
        { r: 4, c: 3 },
        { r: 4, c: 4 }
    ];

    // Sort moves by their distance to the center, and pick the one closest to the center.
    const movesSortedByCenterDistance = moves.slice().sort((a, b) => {
        const distA = getMinDistanceToCenter(a.toRow, a.toCol, centerSquares);
        const distB = getMinDistanceToCenter(b.toRow, b.toCol, centerSquares);
        return distA - distB;
    });

    // The best move after sorting will be the first one.
    const bestMove = movesSortedByCenterDistance[0];
    return applyMove(boardState, bestMove);
}















/**
 * Compute the minimum Manhattan distance from a given square to any of the center squares.
 * 
 * row: The target row index.
 * col: The target column index.
 * centers: An array of center square objects {r, c}.
 * 
 * returns: The minimum distance to any center square.
 */

function getMinDistanceToCenter(row, col, centers) {
    let minDist = Infinity;

    // Calculate the Manhattan distance to each center square and track the minimum.
    for (const { r, c } of centers) {
        const dist = Math.abs(row - r) + Math.abs(col - c);
        if (dist < minDist) {
            minDist = dist;
        }
    }

    return minDist;
}
