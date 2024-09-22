// Imports necessary modules for rendering and global access
import { renderHighlight } from "../render/main.js";
import { globalAccess } from "../styles/index.js";


// Creates a square with specified properties
function Square(color, id, piece) {
    return { color, id, piece };
}

// Generates a row of squares for the chessboard
function SquareRow(rowID) {
    const squareRow = [];
    const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    // Determine the color pattern based on the row ID
    if (rowID % 2 == 0) {
        alpha.forEach((element, index) => {
            if (index % 2 == 0) {
                squareRow.push(Square("white", element + rowID, null));
            } else {
                squareRow.push(Square("black", element + rowID, null));
            }
        });
    } else {
        alpha.forEach((element, index) => {
            if (index % 2 == 0) {
                squareRow.push(Square("black", element + rowID, null));
            } else {
                squareRow.push(Square("white", element + rowID, null));
            }
        });
    }
    return squareRow;
}

// Initializes the game by creating the chessboard squares
function initGame() {
    return [
        SquareRow(8),
        SquareRow(7),
        SquareRow(6),
        SquareRow(5),
        SquareRow(4),
        SquareRow(3),
        SquareRow(2),
        SquareRow(1)
    ];
}

// Exports the initGame function for external use
export { initGame };
