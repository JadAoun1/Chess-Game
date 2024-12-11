

import { validateMove } from './pieceRules.js';

// State variables
let selectedPiece = null;
let fromRow = null;
let fromCol = null;

// Highlight possible moves
export function highlightMoves(fromRow, fromCol, piece, boardState) {
    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        const toRow = parseInt(cell.dataset.row);
        const toCol = parseInt(cell.dataset.col);

        // If validateMove returns true, highlight the cell
        if (validateMove(fromRow, fromCol, toRow, toCol, piece)) {
            cell.classList.add('highlight');
        }
    });
}

// Clear all highlights
export function clearHighlights() {
    const highlightedCells = document.querySelectorAll('.highlight');
    highlightedCells.forEach(cell => cell.classList.remove('highlight'));
}

// Select a piece
export function selectPiece(row, col, piece, boardState) {
    clearHighlights();
    highlightMoves(row, col, piece, boardState);
    selectedPiece = piece;
    fromRow = row;
    fromCol = col;
}

export function movePiece(toRow, toCol, boardState, renderCallback, clearHighlights) {
    const cell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);

    if (selectedPiece && cell.classList.contains('highlight')) {
        boardState[toRow][toCol] = selectedPiece;
        boardState[fromRow][fromCol] = '';

        clearHighlights();
        selectedPiece = null;
        fromRow = null;
        fromCol = null;

        // Call the callback function instead of directly calling renderBoard
        renderCallback(boardState);
    }
}


export function enableDragAndDrop(boardState, renderCallback) {
    const pieces = document.querySelectorAll('.chess-piece');
    const cells = document.querySelectorAll('.cell');

    pieces.forEach(piece => {
        piece.draggable = true;
        piece.addEventListener('dragstart', event => {
            fromRow = parseInt(event.target.parentElement.dataset.row);
            fromCol = parseInt(event.target.parentElement.dataset.col);
            selectedPiece = boardState[fromRow][fromCol];

            clearHighlights();
            highlightMoves(fromRow, fromCol, selectedPiece, boardState);
        });
    });

    cells.forEach(cell => {
        cell.addEventListener('dragover', event => {
            event.preventDefault();
        });

        cell.addEventListener('drop', event => {
            const toRow = parseInt(cell.dataset.row);
            const toCol = parseInt(cell.dataset.col);

            if (selectedPiece && cell.classList.contains('highlight')) {
                boardState[toRow][toCol] = selectedPiece;
                boardState[fromRow][fromCol] = '';

                clearHighlights();
                selectedPiece = null;
                fromRow = null;
                fromCol = null;

                // Use the callback with pieceImages included
                renderCallback(boardState);
                enableDragAndDrop(boardState, renderCallback);
            }
        });
    });
}

