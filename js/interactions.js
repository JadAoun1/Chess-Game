// Import necessary functions from other modules
import { validateMove } from './pieceRules.js';
import { isKingInCheck, getKingPosition, getPieceColor } from './pieceRules.js';
import { makeAIMove } from './ai.js'; // Import AI logic

// Variables to track the currently selected piece and the position it was selected from
let selectedPiece = null;
let fromRow = null;
let fromCol = null;

// The current player: 'white' or 'black'
let currentPlayer = 'white';

// Track whether the current player's king is in check
let kingInCheck = false;

// Global AI difficulty level
let aiDifficulty = 'easy'; // Options: 'easy', 'medium', 'hard'

// Function to allow external code to set the AI difficulty
export function setAIDifficulty(difficulty) {
    aiDifficulty = difficulty;
}

// Highlight valid moves for the currently selected piece
export function highlightMoves(row, col, piece, boardState) {
    // First clear all existing highlights
    clearHighlights();
    
    // For every cell in the board, check if the move is valid
    // If valid, highlight that cell to indicate it's a possible move
    document.querySelectorAll('.cell').forEach(cell => {
        const toRow = parseInt(cell.dataset.row, 10);
        const toCol = parseInt(cell.dataset.col, 10);

        if (validateMove(row, col, toRow, toCol, piece, boardState)) {
            cell.classList.add('highlight');
        }
    });
}

// Clear all highlighted cells
export function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(cell => cell.classList.remove('highlight'));
}

// Clear king check highlight
function clearKingCheckHighlight() {
    document.querySelectorAll('.king-check').forEach(cell => cell.classList.remove('king-check'));
}

// Highlight the king's cell if it is in check
function highlightKingCell(row, col) {
    const kingCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (kingCell) {
        kingCell.classList.add('king-check');
    }
}

// Check if the current player's king can move anywhere when in check
function canKingMove(color, boardState) {
    const kingPos = getKingPosition(color, boardState);
    if (!kingPos) return false;

    const { row, col } = kingPos;
    const kingPiece = (color === 'white') ? 'king' : 'kingb';

    // The king can move one step in any of the 8 directions around it
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    // Check each possible move. If any is valid, the king can move
    for (const [dr, dc] of directions) {
        const nr = row + dr;
        const nc = col + dc;
        if (validateMove(row, col, nr, nc, kingPiece, boardState)) {
            return true;
        }
    }

    // If no moves are valid, the king cannot move
    return false;
}

// Handle the selection of a chess piece on the board
export function selectPiece(row, col, piece, boardState, renderCallback) {
    // If the king is in check, only allow selecting the king of the player in check
    if (kingInCheck && getPieceColor(piece) !== currentPlayer) {
        return;
    }
    // If king in check and the selected piece is not the king, disallow selection
    if (kingInCheck && !piece.toLowerCase().includes('king')) {
        return;
    }

    // If we already selected a piece and clicked the same cell again, deselect it
    if (selectedPiece && fromRow === row && fromCol === col) {
        clearHighlights();
        selectedPiece = null;
        fromRow = null;
        fromCol = null;
        return;
    }

    // Ensure the selected piece belongs to the current player
    const pieceColor = getPieceColor(piece);
    if (pieceColor !== currentPlayer) {
        return;
    }

    // If a piece is already selected and we clicked on an opponent's piece,
    // it means we are attempting a capture move.
    if (selectedPiece && boardState[row][col] && getPieceColor(boardState[row][col]) !== pieceColor) {
        movePiece(row, col, boardState, renderCallback);
        return;
    }

    // If there's no piece on the cell, do nothing
    if (!boardState[row][col]) {
        return;
    }

    // Highlight valid moves for the newly selected piece
    highlightMoves(row, col, piece, boardState);

    // Store the selected piece and its original location
    selectedPiece = piece;
    fromRow = row;
    fromCol = col;
}

// Move the selected piece to the target cell if it is a valid move
export function movePiece(toRow, toCol, boardState, renderCallback) {
    const targetCell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);

    // Proceed only if we have a selected piece and the move is highlighted as valid
    if (selectedPiece && targetCell.classList.contains('highlight')) {
        // Check if there's a piece on the target cell (capture scenario)
        const capturedPiece = boardState[toRow][toCol];
        if (capturedPiece) {
            handleCapture(capturedPiece, selectedPiece);
        }

        // Update board state: move selected piece and clear old position
        boardState[toRow][toCol] = selectedPiece;
        boardState[fromRow][fromCol] = '';

        // Finalize the move (switch turn, check for check, possibly trigger AI move, etc.)
        finalizeMove(boardState, renderCallback);
    }
}

// Handle the capture of a piece
function handleCapture(capturedPiece, capturingPiece) {
    console.log(`${capturingPiece} captured ${capturedPiece}`);
    // Additional logic for scoring or other effects could go here.
}

// Enable drag-and-drop functionality for pieces
export function enableDragAndDrop(boardState, renderCallback) {
    // Make all pieces draggable
    document.querySelectorAll('.chess-piece').forEach(piece => {
        if (!piece.draggable) {
            piece.draggable = true;

            // When dragging starts, record the piece's original position and validate moves
            piece.addEventListener('dragstart', e => {
                const parentCell = e.target.parentElement;
                fromRow = parseInt(parentCell.dataset.row, 10);
                fromCol = parseInt(parentCell.dataset.col, 10);
                selectedPiece = boardState[fromRow][fromCol];

                // If king is in check and this piece is not the king, stop drag
                if (kingInCheck && !selectedPiece.toLowerCase().includes('king')) {
                    e.preventDefault();
                    selectedPiece = fromRow = fromCol = null;
                    return;
                }

                // Only allow dragging the current player's pieces
                if (getPieceColor(selectedPiece) !== currentPlayer) {
                    e.preventDefault();
                    selectedPiece = fromRow = fromCol = null;
                    return;
                }

                // Highlight valid moves for the piece being dragged
                highlightMoves(fromRow, fromCol, selectedPiece, boardState);
            });
        }
    });

    // Set up drop targets (all cells)
    document.querySelectorAll('.cell').forEach(cell => {
        // Ensure we only set these listeners once
        if (!cell.dataset.dragInitialized) {
            cell.dataset.dragInitialized = 'true';

            // Allow dropping on these cells
            cell.addEventListener('dragover', e => e.preventDefault());

            // Handle dropping the piece
            cell.addEventListener('drop', e => {
                const toRow = parseInt(cell.dataset.row, 10);
                const toCol = parseInt(cell.dataset.col, 10);

                // Check if the move is valid (highlighted) and belongs to the current player
                if (selectedPiece && cell.classList.contains('highlight') && getPieceColor(selectedPiece) === currentPlayer) {
                    
                    // If king in check and the piece is not the king, no move allowed
                    if (kingInCheck && !selectedPiece.toLowerCase().includes('king')) {
                        return;
                    }

                    // Handle capture if there's an opponent piece on the target cell
                    const capturedPiece = boardState[toRow][toCol];
                    if (capturedPiece) {
                        handleCapture(capturedPiece, selectedPiece);
                    }

                    // Perform the move on the board
                    boardState[toRow][toCol] = selectedPiece;
                    boardState[fromRow][fromCol] = '';

                    // Finalize after dropping the piece
                    finalizeMove(boardState, renderCallback);
                }
            });
        }
    });
}

// Finalize the move:
// - Clear highlights
// - Switch turns
// - Check for game ending conditions
// - If AI turn, execute AI move
function finalizeMove(boardState, renderCallback) {
    // Clear all move highlights and king check highlights
    clearHighlights();
    clearKingCheckHighlight();

    // Reset selected piece and from coordinates
    selectedPiece = null;
    fromRow = null;
    fromCol = null;

    // Switch the current player after a successful move
    currentPlayer = (currentPlayer === 'white') ? 'black' : 'white';

    // Check if the game ended (no kings means someone won)
    const winner = checkWinCondition(boardState);
    if (winner) {
        alert(`${winner} wins!`);
        resetGame(); // Optionally reset the game
        return;
    }

    // Re-render the board to reflect the new move
    renderCallback(boardState);

    // After rendering, check if the current player's king is in check
    kingInCheck = isKingInCheck(currentPlayer, boardState, validateMove);

    if (kingInCheck) {
        // Highlight the king cell if it's in check
        const kingPos = getKingPosition(currentPlayer, boardState);
        if (kingPos) {
            highlightKingCell(kingPos.row, kingPos.col);

            // Check if the king can move. If not, it's checkmate.
            const kingCanMove = canKingMove(currentPlayer, boardState);
            if (!kingCanMove) {
                const checkmateWinner = (currentPlayer === 'white') ? 'Black' : 'White';
                alert(`Checkmate! ${checkmateWinner} wins!`);
                resetGame();
                return;
            }
        }
    }

    // If it is the AI's turn (black), let the AI make a move after a short delay
    if (currentPlayer === 'black') {
        setTimeout(() => {
            const newBoardState = makeAIMove(boardState, currentPlayer, aiDifficulty);
            // Use the same finalizeMove function to handle AI's move aftermath
            finalizeMove(newBoardState, renderCallback);
        }, 500);
    }
}

// Check for a game-ending condition: if one king is missing, the other player wins
function checkWinCondition(boardState) {
    let whiteKingExists = false;
    let blackKingExists = false;

    // Scan through the board for kings
    for (let row = 0; row < boardState.length; row++) {
        for (let col = 0; col < boardState[row].length; col++) {
            const piece = boardState[row][col];
            if (piece === 'king') whiteKingExists = true;
            if (piece === 'kingb') blackKingExists = true;
        }
    }

    // If one of the kings doesn't exist, the other side wins
    if (!whiteKingExists) return 'Black';
    if (!blackKingExists) return 'White';

    // If both kings still exist, no winner yet
    return null;
}

// Reset the game (implementation depends on the specific requirements)
// For now, just a placeholder function
function resetGame() {
    // Implement game reset logic if desired
}
