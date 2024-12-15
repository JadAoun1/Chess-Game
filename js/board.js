import { enableDragAndDrop, selectPiece, movePiece } from './interactions.js';

export function renderBoard(boardState, pieceImages) {
    console.log('Rendering board...');
    const chessboard = document.querySelector('.chessboard');
    chessboard.innerHTML = ''; // Clear the board

    boardState.forEach((rowArray, row) => {
        rowArray.forEach((piece, col) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.backgroundColor = (row + col) % 2 === 0 ? '#fff' : '#000';
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (piece) {
                const pieceElement = document.createElement('img');
                pieceElement.src = pieceImages[piece];
                pieceElement.alt = piece;
                pieceElement.className = 'chess-piece';
                pieceElement.addEventListener('click', () => {
                    selectPiece(row, col, piece, boardState, updatedBoard => {
                        renderBoard(updatedBoard, pieceImages);
                    });
                });
                cell.appendChild(pieceElement);
            }

            cell.addEventListener('click', () => {
                movePiece(row, col, boardState, updatedBoard => {
                    renderBoard(updatedBoard, pieceImages);
                });
            });

            chessboard.appendChild(cell);
        });
    });

    enableDragAndDrop(boardState, updatedBoard => renderBoard(updatedBoard, pieceImages));
}
