import { validateMove } from './pieceRules.js';

let selectedPiece = null;
let fromRow = null;
let fromCol = null;

// Highlight valid moves for a selected piece
export function highlightMoves(row, col, piece, boardState) {
    document.querySelectorAll('.cell').forEach(cell => {
        const toRow = parseInt(cell.dataset.row);
        const toCol = parseInt(cell.dataset.col);
        if (validateMove(row, col, toRow, toCol, piece)) cell.classList.add('highlight');
    });
}

// Remove all highlighted cells
export function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(c => c.classList.remove('highlight'));
}

// Handle piece selection
export function selectPiece(row, col, piece, boardState, renderCallback) {
    console.log('Clicked Piece:', piece, 'at', row, col);

    // Deselect if the same piece is clicked again
    if (selectedPiece && fromRow === row && fromCol === col) {
        console.log('Deselecting piece:', piece);
        clearHighlights();
        selectedPiece = fromRow = fromCol = null;
        return;
    }

    // Validate piece in boardState
    if (!boardState[row][col]) {
        console.error('Error: Selected piece not found in boardState!');
        return;
    }

    // Select new piece and highlight moves
    clearHighlights();
    highlightMoves(row, col, piece, boardState);
    selectedPiece = piece;
    fromRow = row;
    fromCol = col;
    console.log('Selected Piece:', selectedPiece);
    console.log('Board State:', JSON.stringify(boardState));
}

// Move a piece to a highlighted cell
export function movePiece(toRow, toCol, boardState, renderCallback) {
    const cell = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"]`);
    if (selectedPiece && cell.classList.contains('highlight')) {
        console.log('Moving piece:', selectedPiece, 'to', toRow, toCol);
        boardState[toRow][toCol] = selectedPiece;
        boardState[fromRow][fromCol] = '';

        finalizeMove(boardState, renderCallback);
        console.log('Updated Board State:', JSON.stringify(boardState));
    } else {
        console.log('Move not valid or cell not highlighted');
    }
}

// Set up drag-and-drop handlers
export function enableDragAndDrop(boardState, renderCallback) {
    document.querySelectorAll('.chess-piece').forEach(piece => {
        piece.draggable = true;
        piece.addEventListener('dragstart', e => {
            fromRow = parseInt(e.target.parentElement.dataset.row);
            fromCol = parseInt(e.target.parentElement.dataset.col);
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
                console.log('Dropping piece:', selectedPiece, 'to', toRow, toCol);
                boardState[toRow][toCol] = selectedPiece;
                boardState[fromRow][fromCol] = '';
                finalizeMove(boardState, renderCallback);
            }
        });
    });
}

// Common cleanup and re-render after a successful move
function finalizeMove(boardState, renderCallback) {
    clearHighlights();
    selectedPiece = fromRow = fromCol = null;
    renderCallback(boardState);
    enableDragAndDrop(boardState, renderCallback);
}
