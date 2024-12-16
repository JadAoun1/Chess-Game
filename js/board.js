import { enableDragAndDrop, selectPiece, movePiece } from './interactions.js';

/**
 * Renders the chessboard UI based on the current board state.
 * boardState: A 2D array representing the chessboard and pieces.
 * pieceImages: An object mapping piece identifiers to their image file paths.
 * handleCapture: A callback function to handle when a piece is captured.
 */
export function renderBoard(boardState, pieceImages, handleCapture) {
    // Select the chessboard container from the DOM
    const chessboard = document.querySelector('.chessboard');
    
    // Clear any existing HTML elements inside the chessboard to start fresh
    chessboard.innerHTML = '';

    // Loop through each row (rowArray) and column (piece) in boardState
    boardState.forEach((rowArray, row) => {
        rowArray.forEach((piece, col) => {
            // Create a new cell element
            const cell = document.createElement('div');
            cell.className = 'cell';

            // Set the cell's background color to create a checkerboard pattern
            // (row + col) % 2 === 0 ? '#fff' : '#000' ensures alternating colors
            cell.style.backgroundColor = (row + col) % 2 === 0 ? '#fff' : '#000';

            // Store the cell's row and column in dataset attributes for potential reference
            cell.dataset.row = row;
            cell.dataset.col = col;

            // If there is a piece in this position, create an <img> to display it
            if (piece) {
                const pieceElement = document.createElement('img');
                pieceElement.src = pieceImages[piece];  // Set the image source based on piece type
                pieceElement.alt = piece;               // For accessibility and debugging
                pieceElement.className = 'chess-piece';

                // When the piece is clicked, attempt to select it
                // selectPiece can update the board state, and then we re-render
                pieceElement.addEventListener('click', () => {
                    selectPiece(
                        row, 
                        col, 
                        piece, 
                        boardState, 
                        updatedBoard => renderBoard(updatedBoard, pieceImages, handleCapture)
                    );
                });

                // Add the piece's image element to the cell
                cell.appendChild(pieceElement);
            }

            // If the cell (not just the piece) is clicked, attempt to move a previously selected piece here
            cell.addEventListener('click', () => {
                movePiece(
                    row, 
                    col, 
                    boardState, 
                    updatedBoard => renderBoard(updatedBoard, pieceImages, handleCapture)
                );
            });

            // Add the cell to the chessboard element in the DOM
            chessboard.appendChild(cell);
        });
    });

    // After all cells are rendered, enable drag-and-drop functionality for the pieces
    enableDragAndDrop(
        boardState, 
        updatedBoard => renderBoard(updatedBoard, pieceImages, handleCapture)
    );
}
