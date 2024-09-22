import * as piece from "../data/pieces.js";
import { ROOT_DIV } from "../helper/constants.js";
import { globalAccess } from "../styles/index.js"; 

const globalPiece = new Object();

/*
 * Function to render highlights on the board.
 * It uses data from globalAccess to determine which squares should be highlighted.
 */
function globalStateRenderer(){
    globalAccess.forEach(row => {
        row.forEach(element => {
            if(element.highlight){
                const highlightSpan = document.createElement("span");
                highlightSpan.classList.add("highlight");
                document.getElementById(element.id).appendChild(highlightSpan);
            } else if(element.highlight === null){
                const el = document.getElementById(element.id);
                const highlights = Array.from(el.getElementsByTagName("span"));
                highlights.forEach(element => {
                    el.removeChild(element);
                });
            }
        });
    });
}

/*
 * Function to render pieces on the chessboard based on the provided data.
 * It inserts the appropriate chess piece images into their respective squares.
 */
function pieceRender(data) {
    data.forEach((row) => {
        row.forEach((square) => {
            if (square.piece) {
                const squareEl = document.getElementById(square.id);
                const piece = document.createElement("img");
                piece.src = square.piece.img;
                piece.classList.add("piece");
                squareEl.appendChild(piece);
            }
        });
    });
}

/*
 * Function to highlight a specific square on the board.
 * It appends a highlight element to the given square ID.
 */
function renderHighlight(squareID) {
    const highlightSpan = document.createElement("span");
    highlightSpan.classList.add("highlight");
    document.getElementById(squareID).appendChild(highlightSpan);
}

/*
 * Function to clear all the highlights from the board.
 * It resets any highlight and capture states from globalAccess and re-renders the board state.
 */
function clearHighlights(){
    const flatData = globalAccess.flat();
    flatData.forEach((el) => {
        if(el.captureHighlight){
            document.getElementById(el.id).classList.remove("captureColor");
            el.captureHighlight = false;
        }
        if(el.highlight){
            el.highlight = null;
        }
        globalStateRenderer();
    });
}

/*
 * Function to highlight the square of the selected piece.
 * It adds a yellow highlight to the current position of the selected piece.
 */
function pieceSelfHighlight(piece){
    document.getElementById(piece.current_position).classList.add("pieceHighlightYellow");
}

/*
 * Function to initialize the rendering of the chessboard.
 * It generates the chessboard, assigns pieces to their starting positions, and then renders them.
 */
function initGameRender(data) {
    data.forEach((element) => {        
        const rowEl = document.createElement("div");
        element.forEach((square) => {
            const squareDiv = document.createElement("div");
            squareDiv.id = square.id;
            squareDiv.classList.add(square.color, "square");

            if (square.id[1] == 7) {
                square.piece = piece.blackPawns(square.id);
                globalPiece.black_pawn = square.piece;
            }

            if (square.id === "h8" || square.id === "a8") {
                square.piece = piece.blackRook(square.id);
                if (globalPiece.black_rook_1) {
                    globalPiece.black_rook_2 = square.piece;
                } else {
                    globalPiece.black_rook_1 = square.piece;
                }
            }

            if (square.id === "g8" || square.id === "b8") {
                square.piece = piece.blackKnight(square.id);
                if (globalPiece.black_knight_1) {
                    globalPiece.black_knight_2 = square.piece;
                } else {
                    globalPiece.black_knight_1 = square.piece;
                }
            }

            if (square.id === "f8" || square.id === "c8") {
                square.piece = piece.blackBishop(square.id);
                if (globalPiece.black_bishop_1) {
                    globalPiece.black_bishop_2 = square.piece;
                } else {
                    globalPiece.black_bishop_1 = square.piece;
                }
            }

            if (square.id === "d8") {
                square.piece = piece.blackQueen(square.id);
                globalPiece.black_queen = square.piece;
            }

            if (square.id === "e8") {
                square.piece = piece.blackKing(square.id);
                globalPiece.black_king = square.piece;
            }

            if (square.id[1] == 2) {
                square.piece = piece.whitePawns(square.id);
                globalPiece.white_pawn = square.piece;
            }

            if (square.id === "h1" || square.id === "a1") {
                square.piece = piece.whiteRook(square.id);
                if (globalPiece.white_rook_1) {
                    globalPiece.white_rook_2 = square.piece;
                } else {
                    globalPiece.white_rook_1 = square.piece;
                }
            }

            if (square.id === "g1" || square.id === "b1") {
                square.piece = piece.whiteKnight(square.id);
                if (globalPiece.white_knight_1) {
                    globalPiece.white_knight_2 = square.piece;
                } else {
                    globalPiece.white_knight_1 = square.piece;
                }
            }

            if (square.id === "f1" || square.id === "c1") {
                square.piece = piece.whiteBishop(square.id);
                if (globalPiece.white_bishop_1) {
                    globalPiece.white_bishop_2 = square.piece;
                } else {
                    globalPiece.white_bishop_1 = square.piece;
                }
            }

            if (square.id === "d1") {
                square.piece = piece.whiteQueen(square.id);
                globalPiece.white_queen = square.piece;
            }

            if (square.id === "e1") {
                square.piece = piece.whiteKing(square.id);
                globalPiece.white_king = square.piece;
            }

            rowEl.appendChild(squareDiv);
        });

        rowEl.classList.add("squareRow");
        ROOT_DIV.appendChild(rowEl);
    });

    pieceRender(data);
}

export { initGameRender, renderHighlight, clearHighlights, pieceSelfHighlight, globalPiece, globalStateRenderer };
