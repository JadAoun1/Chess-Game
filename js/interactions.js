// Import dependencies
import { validateMove } from './pieceRules.js';

// Variables to track the selected piece and its position
let selectedPiece = null;
let fromRow = null;
let fromCol = null;

// Highlight valid moves for a selected piece
export function highlightMoves(row, col, piece, boardState) {
    clearHighlights();
    document.querySelectorAll('.cell').forEach(cell => {
        const toRow = parseInt(cell.dataset.row);
        const toCol = parseInt(cell.dataset.col);

        if (validateMove(row, col, toRow, toCol, piece, boardState)) {
            cell.classList.add('highlight');
        }
    });
}

// Clear all highlighted cells
export function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(cell => cell.classList.remove('highlight'));
}

// Handle the selection of a chess piece
export function selectPiece(row, col, piece, boardState, renderCallback) {
    console.log(`Clicked Piece: ${piece} at (${row}, ${col})`);

    if (selectedPiece && fromRow === row && fromCol === col) {
        console.log('Deselecting piece');
        clearHighlights();
        selectedPiece = fromRow = fromCol = null;
        return;
    }

    if (!boardState[row][col]) {
        console.error('Error: Selected piece not found in boardState!');
        return;
    }

    highlightMoves(row, col, piece, boardState);
    selectedPiece = piece;
    fromRow = row;
    fromCol = col;
    console.log(`Selected Piece: ${selectedPiece}`);
}

// Move a selected piece to a target cell if valid
export function movePiece(toRow, toCol, boardState, renderCallback) {
    console.log('Board State Before Move:', JSON.stringify(boardState));

    const cell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);
    if (selectedPiece && cell.classList.contains('highlight')) {
        console.log(`Moving piece: ${selectedPiece} to (${toRow}, ${toCol})`);

        boardState[toRow][toCol] = selectedPiece;
        boardState[fromRow][fromCol] = '';

        console.log('Board State After Move:', JSON.stringify(boardState));

        finalizeMove(boardState, renderCallback);
    } else {
        console.log('Move not valid or cell not highlighted');
    }
}

// Enable drag-and-drop functionality for pieces
export function enableDragAndDrop(boardState, renderCallback) {
    console.log('Enabling drag-and-drop...');

    document.querySelectorAll('.chess-piece').forEach(piece => {
        piece.draggable = true;

        piece.addEventListener('dragstart', e => {
            const parentCell = e.target.parentElement;
            fromRow = parseInt(parentCell.dataset.row);
            fromCol = parseInt(parentCell.dataset.col);
            selectedPiece = boardState[fromRow][fromCol];

            clearHighlights();
            highlightMoves(fromRow, fromCol, selectedPiece, boardState);
        });
    });

    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('dragover', e => e.preventDefault());
        cell.addEventListener('drop', e => {
            const toRow = parseInt(cell.dataset.row);
            const toCol = parseInt(cell.dataset.col);

            if (selectedPiece && cell.classList.contains('highlight')) {
                console.log(`Dropping piece: ${selectedPiece} to (${toRow}, ${toCol})`);

                boardState[toRow][toCol] = selectedPiece;
                boardState[fromRow][fromCol] = '';

                finalizeMove(boardState, renderCallback);
            }
        });
    });
}

// Finalize the move by cleaning up and re-rendering the board
function finalizeMove(boardState, renderCallback) {
    console.log('Finalizing move...');
    clearHighlights();
    selectedPiece = fromRow = fromCol = null;
    renderCallback(boardState);
}
