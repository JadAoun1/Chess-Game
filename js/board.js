import { enableDragAndDrop, selectPiece, movePiece, clearHighlights } from './interactions.js';

export function renderBoard(boardState, pieceImages) {
    const chessboard = document.querySelector('.chessboard');
    chessboard.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.style.backgroundColor = (row + col) % 2 === 0 ? '#fff' : '#000';

            const piece = boardState[row][col];
            if (piece) {
                const pieceElement = document.createElement('img');
                pieceElement.src = pieceImages[piece];
                pieceElement.alt = piece;
                pieceElement.classList.add('chess-piece');
                pieceElement.addEventListener('click', () => selectPiece(row, col, piece, boardState));
                cell.appendChild(pieceElement);
            }

            // Pass a callback that includes pieceImages
            cell.addEventListener('click', () =>
                movePiece(row, col, boardState, updatedBoard => {
                    renderBoard(updatedBoard, pieceImages);
                }, clearHighlights)
            );

            chessboard.appendChild(cell);
        }
    }

    // Reapply drag-and-drop with a callback that includes pieceImages
    enableDragAndDrop(boardState, updatedBoard => {
        renderBoard(updatedBoard, pieceImages);
    });
}
