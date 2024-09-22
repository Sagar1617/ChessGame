import { ROOT_DIV } from "../helper/constants.js";
import { globalAccess } from "../styles/index.js";
import { clearHighlights, renderHighlight } from "../render/main.js";
import { pieceSelfHighlight } from "../render/main.js";
import { checkPieceOfOpponentOnElement } from "../helper/commonHelper.js";
import { globalStateRenderer } from "../render/main.js";
import { keySquareMapper } from "../styles/index.js";
import { checkCaptureIDsquare } from "../helper/commonHelper.js"; 
import { provideHighlightToBishop } from "../helper/commonHelper.js";
import { checkPieceExistence } from "../helper/commonHelper.js";
import { provideHighlightToRook } from "../helper/commonHelper.js";
import { provideHighlightToKnight } from "../helper/commonHelper.js";
import { provideHighlightToQueen } from "../helper/commonHelper.js";
import { provideHighlightToKing } from "../helper/commonHelper.js";
import { globalPiece } from "../render/main.js";
import { provideCaptureToKnight } from "../helper/commonHelper.js";
import { provideCaptureToKing } from "../helper/commonHelper.js";
import { provideCaptureToBishop } from "../helper/commonHelper.js";
import { provideCaptureToRook } from "../helper/commonHelper.js";
import { provideCaptureToQueen } from "../helper/commonHelper.js";
import { provideCaptureToPawn } from "../helper/commonHelper.js";
import pawnPromotion from "../helper/modalCreator.js";

let highlight_state = false;
let nextTurn = "white";
let whoIsGettingChecked = null;

/**
 * Switches the turn between "white" and "black".
 */
function switchTurn() {
    nextTurn = nextTurn === "white" ? "black" : "white";
}

/**
 * Moves the piece to the square if capture is allowed.
 * @param {Object} square - The square on which a piece might be captured.
 */
function turnToCapture(square) {
    const piece = square.piece;

    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }
}

/**
 * Checks if the current player is in check.
 */
function checkForChecks() {
    if (nextTurn === "black") {
        const whiteKingCurrentPosition = globalPiece.white_king.current_position;
        const knight_1 = globalPiece.black_knight_1.current_position;
        const knight_2 = globalPiece.black_knight_2.current_position;
        const bishop_1 = globalPiece.black_bishop_1.current_position;
        const bishop_2 = globalPiece.black_bishop_2.current_position;
        const rook_1 = globalPiece.black_rook_1.current_position;
        const rook_2 = globalPiece.black_rook_2.current_position;
        const king = globalPiece.black_king.current_position;
        const queen = globalPiece.black_queen.current_position;

        let finalListOfChecks = [];
        finalListOfChecks.push(provideCaptureToKnight(knight_1, nextTurn));
        finalListOfChecks.push(provideCaptureToKnight(knight_2, nextTurn));
        finalListOfChecks.push(provideCaptureToKing(king, nextTurn));
        finalListOfChecks.push(provideCaptureToBishop(bishop_1, nextTurn));
        finalListOfChecks.push(provideCaptureToBishop(bishop_2, nextTurn));
        finalListOfChecks.push(provideCaptureToRook(rook_1, nextTurn));
        finalListOfChecks.push(provideCaptureToRook(rook_2, nextTurn));
        finalListOfChecks.push(provideCaptureToQueen(queen, nextTurn));

        finalListOfChecks = finalListOfChecks.flat();
        const OnCheckOrNot = finalListOfChecks.find((element) => element === whiteKingCurrentPosition);
        if (OnCheckOrNot) {
            whoIsGettingChecked = "white";
        }
    } else {
        const blackKingCurrentPosition = globalPiece.black_king.current_position;
        const knight_1 = globalPiece.white_knight_1.current_position;
        const knight_2 = globalPiece.white_knight_2.current_position;
        const bishop_1 = globalPiece.white_bishop_1.current_position;
        const bishop_2 = globalPiece.white_bishop_2.current_position;
        const rook_1 = globalPiece.white_rook_1.current_position;
        const rook_2 = globalPiece.white_rook_2.current_position;
        const king = globalPiece.white_king.current_position;
        const queen = globalPiece.white_queen.current_position;

        let finalListOfChecks = [];
        finalListOfChecks.push(provideCaptureToKnight(knight_1, nextTurn));
        finalListOfChecks.push(provideCaptureToKnight(knight_2, nextTurn));
        finalListOfChecks.push(provideCaptureToKing(king, nextTurn));
        finalListOfChecks.push(provideCaptureToBishop(bishop_1, nextTurn));
        finalListOfChecks.push(provideCaptureToBishop(bishop_2, nextTurn));
        finalListOfChecks.push(provideCaptureToRook(rook_1, nextTurn));
        finalListOfChecks.push(provideCaptureToRook(rook_2, nextTurn));
        finalListOfChecks.push(provideCaptureToQueen(queen, nextTurn));

        finalListOfChecks = finalListOfChecks.flat();
        const OnCheckOrNot = finalListOfChecks.find((element) => element === blackKingCurrentPosition);
        if (OnCheckOrNot) {
            whoIsGettingChecked = "black";
        }
    }
}

/**
 * Checks if a pawn promotion is needed.
 * @param {Object} piece - The piece being moved.
 * @param {string} id - The id of the target square.
 * @returns {boolean} - Whether pawn promotion is required.
 */
function checkForPawnPromotion(piece, id) {
    if (nextTurn === "white") {
        return piece?.piece_name?.toLowerCase()?.includes("pawn") && id?.includes("8");
    } else {
        return piece?.piece_name?.toLowerCase()?.includes("pawn") && id?.includes("1");
    }
}

/**
 * Callback for pawn promotion.
 * @param {Object} piece - The piece to be promoted.
 * @param {string} id - The id of the square.
 */
function pawnPromotionCallback(piece, id) {
    const realPiece = piece(id);
    const currentSquare = keySquareMapper[id];
    piece.current_position = id;
    currentSquare.piece = realPiece;
    const image = document.createElement("img");
    image.src = realPiece.img;
    image.classList.add("piece");
    const currentElement = document.getElementById(id);
    currentElement.innerHTML = "";
    currentElement.append(image);
}

/**
 * Moves the piece to the square with id.
 * @param {Object} piece - The piece to be moved.
 * @param {string} id - The id of the target square.
 * @param {boolean} castle - Whether the move is part of castling.
 */
function movePiece(piece, id, castle) {
    const pawnBeingPromoted = checkForPawnPromotion(piece, id);

    if (piece.piece_name.includes("KING") || piece.piece_name.includes("ROOK")) {
        piece.move = true;

        if (piece.piece_name.includes("KING") && piece.piece_name.includes("WHITE")) {
            if (id === 'c1' || id === 'g1') {
                let rook = keySquareMapper[id === 'c1' ? 'a1' : 'h1'];
                movePiece(rook.piece, id === 'c1' ? 'd1' : 'f1', true);
            }
        }
    }

    if (piece.piece_name.includes("KING") || piece.piece_name.includes("ROOK")) {
        piece.move = true;

        if (piece.piece_name.includes("KING") && piece.piece_name.includes("BLACK")) {
            if (id === 'c8' || id === 'g8') {
                let rook = keySquareMapper[id === 'c8' ? 'a8' : 'h8'];
                movePiece(rook.piece, id === 'c8' ? 'd8' : 'f8', true);
            }
        }
    }

    const flatData = globalAccess.flat();

    flatData.forEach((el) => {
        if (el.id == piece.current_position) {
            el.piece = null;
        }
        if (el.id == id) {
            if (el.piece) {
                el.piece.current_position = null;
            }
            el.piece = piece;
        }
    });

    clearHighlights();
    const previousPiece = document.getElementById(piece.current_position);
    piece.current_position = null;
    previousPiece?.classList?.remove("pieceHighlightYellow");

    const currentPiece = document.getElementById(id);
    currentPiece.innerHTML = previousPiece?.innerHTML;
    if (previousPiece) {
        previousPiece.innerHTML = "";
    }

    piece.current_position = id;
    if (pawnBeingPromoted) {
        pawnPromotion(nextTurn, pawnPromotionCallback, id);
    }

    checkForChecks();
    if (!castle) {
        switchTurn();
    }
}

/**
 * Clears highlights on the board.
 */
function clearHighlightsLocal() {
    clearHighlights();
    highlight_state = false;
}

/**
 * Moves a piece from one square to another.
 * @param {Object} from - The square where the piece is.
 * @param {Object} to - The square where the piece will move to.
 */
function movePiecefromXtoY(from, to) {
    to.piece = from.piece;
    from.piece = null;
    globalStateRenderer();
}

let pieceSelfHighlightState = null;
let moveState = null;


// White pawn events
function WhitePawnClick(square) {
    const piece = square.piece;

    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();

    // Highlight the clicked/selected piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;

    // Add the piece to "move" state
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = [];

    // If pawn is in the initial position, it can move two squares forward
    if (current_pos[1] === "2") {
        highlightSquareID = [
            `${current_pos[0]}${Number(current_pos[1]) + 1}`,
            `${current_pos[0]}${Number(current_pos[1]) + 2}`,
        ];
    } else {
        highlightSquareID = [`${current_pos[0]}${Number(current_pos[1]) + 1}`];
    }

    // Apply logic to check valid movement squares
    highlightSquareID = checkCaptureIDsquare(highlightSquareID);

    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    // Capture logic for diagonal positions
    const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${Number(current_pos[1]) + 1}`;
    const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${Number(current_pos[1]) + 1}`;
  
    let captureID = [col1, col2];
  
    captureID.forEach((element) => {
        checkPieceOfOpponentOnElement(element, "white");
    });

    // Render the global state to update the board
    globalStateRenderer();
}

// White bishop events
function WhiteBishopClick(square) {
    const piece = square.piece;
    
    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }
    
    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }
    
    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();
    
    // Highlight the clicked/selected piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;
    
    // Add the piece to "move" state
    moveState = piece;
    
    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = provideHighlightToBishop(current_pos);
    let temp = [];

    const {bottomLeft, topLeft, bottomRight, topRight} = highlightSquareID;

    let result = [];
    result.push(checkCaptureIDsquare(bottomLeft));
    result.push(checkCaptureIDsquare(topLeft));
    result.push(checkCaptureIDsquare(bottomRight));
    result.push(checkCaptureIDsquare(topRight));

    // Insert into temp
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);
    
    highlightSquareID = result.flat();
    
    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });
    
    let captureID = [];
   
    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkPieceExistence(element);
            if(checkPieceResult && checkPieceResult.piece && checkPieceResult.piece.piece_name.toLowerCase().includes("white")){
                break;                
            }

            if (checkPieceOfOpponentOnElement(element, "white")){
                break;
            }            
        }
    }

    globalStateRenderer();
}

// White rook events
function WhiteRookClick(square) {
    const piece = square.piece;
    
    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }
    
    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }
    
    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();
    
    // Highlight the clicked/selected piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;
    
    // Add the piece to "move" state
    moveState = piece;
    
    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = provideHighlightToRook(current_pos);
    let temp = [];

    const {topMove, bottomMove, rightMove, leftMove} = highlightSquareID;

    let result = [];
    result.push(checkCaptureIDsquare(topMove));
    result.push(checkCaptureIDsquare(bottomMove));
    result.push(checkCaptureIDsquare(rightMove));
    result.push(checkCaptureIDsquare(leftMove));

    // Insert into temp
    temp.push(topMove);
    temp.push(bottomMove);
    temp.push(rightMove);
    temp.push(leftMove);
    
    highlightSquareID = result.flat();
    
    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    let captureID = [];
   
    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkPieceExistence(element);
            if(checkPieceResult && checkPieceResult.piece && checkPieceResult.piece.piece_name.toLowerCase().includes("white")){
                break;                
            }

            if (checkPieceOfOpponentOnElement(element, "white")){
                break;
            }            
        }
    }

    globalStateRenderer();
}

// White knight events
function WhiteKnightClick(square) {
    const piece = square.piece;
    
    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }
    
    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }
    
    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();
    
    // Highlight the clicked/selected piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;
    
    // Add the piece to "move" state
    moveState = piece;
    
    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = provideHighlightToKnight(current_pos);
    
    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    let captureID = [];

    highlightSquareID.forEach((element) => {
        checkPieceOfOpponentOnElement(element, "white");
    });

    // Render the global state to update the board
    globalStateRenderer();
}


// White Queen Events
function WhiteQueenClick(square) {
    const piece = square.piece;

    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();

    // Highlight the clicked/selected piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;

    // Add a piece to "move" state
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = provideHighlightToQueen(current_pos);
    let temp = [];

    const {bottomLeft, topLeft, bottomRight, topRight, topMove, rightMove, bottomMove, leftMove} = highlightSquareID;

    let result = [];
    result.push(checkCaptureIDsquare(bottomLeft));
    result.push(checkCaptureIDsquare(topLeft));
    result.push(checkCaptureIDsquare(bottomRight));
    result.push(checkCaptureIDsquare(topRight));
    result.push(checkCaptureIDsquare(topMove));
    result.push(checkCaptureIDsquare(rightMove));
    result.push(checkCaptureIDsquare(bottomMove));
    result.push(checkCaptureIDsquare(leftMove));

    // Insert into temp
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);
    temp.push(topMove);
    temp.push(rightMove);
    temp.push(bottomMove);
    temp.push(leftMove);

    highlightSquareID = result.flat();

    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    let captureID = [];

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkPieceExistence(element);
            if (checkPieceResult && checkPieceResult.piece && checkPieceResult.piece.piece_name.toLowerCase().includes("white")) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "white")) {
                break;
            }
        }
    }

    globalStateRenderer();
}

// White King Events
function WhiteKingClick(square) {
    const piece = square.piece;

    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();

    // Highlight the clicked/selected piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;

    // Add a piece to "move" state
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = provideHighlightToKing(current_pos);
    let temp = [];

    const {bottomLeft, topLeft, bottomRight, topRight, topMove, rightMove, bottomMove, leftMove} = highlightSquareID;

    let result = [];

    if (!piece.move) {
        const rook1 = globalPiece.white_rook_1;
        const rook2 = globalPiece.white_rook_2;
        if (!rook1.move) {
            const b1 = keySquareMapper['b1'];
            const c1 = keySquareMapper['c1'];
            const d1 = keySquareMapper['d1'];
            if (!b1.piece && !c1.piece && !d1.piece) {
                result.push('c1');
            }
        }
        if (!rook2.move) {
            const f1 = keySquareMapper['f1'];
            const g1 = keySquareMapper['g1'];

            if (!f1.piece && !g1.piece) {
                result.push('g1');
            }
        }
    }

    result.push(checkCaptureIDsquare(bottomLeft));
    result.push(checkCaptureIDsquare(topLeft));
    result.push(checkCaptureIDsquare(bottomRight));
    result.push(checkCaptureIDsquare(topRight));
    result.push(checkCaptureIDsquare(topMove));
    result.push(checkCaptureIDsquare(rightMove));
    result.push(checkCaptureIDsquare(bottomMove));
    result.push(checkCaptureIDsquare(leftMove));

    // Insert into temp
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);
    temp.push(topMove);
    temp.push(rightMove);
    temp.push(bottomMove);
    temp.push(leftMove);

    highlightSquareID = result.flat();

    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    let captureID = [];

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkPieceExistence(element);
            if (checkPieceResult && checkPieceResult.piece && checkPieceResult.piece.piece_name.toLowerCase().includes("white")) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "white")) {
                break;
            }
        }
    }

    globalStateRenderer();
}



// Handles Black Pawn click events
function BlackPawnClick(square) {
    const piece = square.piece;

    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();

    // Highlight the clicked piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;

    // Set the move state for the piece
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = [];

    // Highlight movement squares based on pawn's initial position
    if (current_pos[1] === "7") {
        highlightSquareID = [
            `${current_pos[0]}${Number(current_pos[1]) - 1}`,
            `${current_pos[0]}${Number(current_pos[1]) - 2}`,
        ];
    } else {
        highlightSquareID = [`${current_pos[0]}${Number(current_pos[1]) - 1}`];
    }

    // Check valid movement squares
    highlightSquareID = checkCaptureIDsquare(highlightSquareID);

    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    // Capture logic for diagonal squares
    const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${Number(current_pos[1]) - 1}`;
    const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${Number(current_pos[1]) - 1}`;
  
    let captureID = [col1, col2];
  
    captureID.forEach((element) => {
        checkPieceOfOpponentOnElement(element, "black");
    });

    // Render the global state to update the board
    globalStateRenderer();
}

// Handles Black Bishop click events
function BlackBishopClick(square) {
    const piece = square.piece;

    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();

    // Highlight the clicked piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;

    // Set the move state for the piece
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = provideHighlightToBishop(current_pos);
    let temp = [];

    const {bottomLeft, topLeft, bottomRight, topRight} = highlightSquareID;

    let result = [];
    result.push(checkCaptureIDsquare(bottomLeft));
    result.push(checkCaptureIDsquare(topLeft));
    result.push(checkCaptureIDsquare(bottomRight));
    result.push(checkCaptureIDsquare(topRight));

    // Store valid movement squares
    temp.push(bottomLeft, topLeft, bottomRight, topRight);

    // Flatten the result array and highlight squares
    highlightSquareID = result.flat();
    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    // Check opponent pieces on movement squares
    temp.forEach((arr) => {
        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkPieceExistence(element);
            if (checkPieceResult && checkPieceResult.piece && checkPieceResult.piece.piece_name.toLowerCase().includes("black")) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "black")) {
                break;
            }
        }
    });

    // Render the global state to update the board
    globalStateRenderer();
}

// Handles Black Rook click events
function BlackRookClick(square) {
    const piece = square.piece;

    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();

    // Highlight the clicked piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;

    // Set the move state for the piece
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = provideHighlightToRook(current_pos);
    let temp = [];

    const {topMove, bottomMove, rightMove, leftMove} = highlightSquareID;

    let result = [];
    result.push(checkCaptureIDsquare(topMove));
    result.push(checkCaptureIDsquare(bottomMove));
    result.push(checkCaptureIDsquare(rightMove));
    result.push(checkCaptureIDsquare(leftMove));

    // Store valid movement squares
    temp.push(topMove, bottomMove, rightMove, leftMove);

    // Flatten the result array and highlight squares
    highlightSquareID = result.flat();
    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    // Check opponent pieces on movement squares
    temp.forEach((arr) => {
        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkPieceExistence(element);
            if (checkPieceResult && checkPieceResult.piece && checkPieceResult.piece.piece_name.toLowerCase().includes("black")) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "black")) {
                break;
            }
        }
    });

    // Render the global state to update the board
    globalStateRenderer();
}

// Handles Black Knight click events
function BlackKnightClick(square) {
    const piece = square.piece;

    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();

    // Highlight the clicked piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;

    // Set the move state for the piece
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = provideHighlightToKnight(current_pos);

    // Highlight valid movement squares
    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    // Check opponent pieces on movement squares
    highlightSquareID.forEach((element) => {
        checkPieceOfOpponentOnElement(element, "black");
    });

    // Render the global state to update the board
    globalStateRenderer();
}

// Handles Black Queen click events
function BlackQueenClick(square) {
    const piece = square.piece;

    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();

    // Highlight the clicked piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;

    // Set the move state for the piece
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalAccess.flat();
    let highlightSquareID = provideHighlightToQueen(current_pos);
    let temp = [];

    const {bottomLeft, topLeft, bottomRight, topRight, topMove, rightMove, bottomMove, leftMove} = highlightSquareID;

    let result = [];
    result.push(checkCaptureIDsquare(bottomLeft));
    result.push(checkCaptureIDsquare(topLeft));
    result.push(checkCaptureIDsquare(bottomRight));
    result.push(checkCaptureIDsquare(topRight));
    result.push(checkCaptureIDsquare(topMove));
    result.push(checkCaptureIDsquare(rightMove));
    result.push(checkCaptureIDsquare(bottomMove));
    result.push(checkCaptureIDsquare(leftMove));

    // Store valid movement squares
    temp.push(bottomLeft, topLeft, bottomRight, topRight, topMove, rightMove, bottomMove, leftMove);

    // Flatten the result array and highlight squares
    highlightSquareID = result.flat();
    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    // Check opponent pieces on movement squares
    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkPieceExistence(element);
            if (checkPieceResult && checkPieceResult.piece && checkPieceResult.piece.piece_name.toLowerCase().includes("black")) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "black")) {
                break;
            }
        }
    }

    // Render the global state to update the board
    globalStateRenderer();
}

// Handles Black King click events
function BlackKingClick(square) {
    const piece = square.piece;

    // If the piece is already highlighted, clear the highlight and return
    if (piece === pieceSelfHighlightState) {
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // If the square has a capture highlight, move the piece and clear highlights
    if (square.captureHighlight) {
        movePiece(pieceSelfHighlightState, square.id);
        clearPreviousSelfHighlight(pieceSelfHighlightState);
        clearHighlightsLocal();
        return;
    }

    // Clear previous highlights before highlighting the current piece
    clearPreviousSelfHighlight(pieceSelfHighlightState);
    clearHighlightsLocal();

    // Highlight the clicked piece
    pieceSelfHighlight(piece);
    highlight_state = true;
    pieceSelfHighlightState = piece;

    // Set the move state for the piece
    moveState = piece;

    const current_pos = piece.current_position;
    let highlightSquareID = provideHighlightToKing(current_pos);
    let temp = [];

    const {bottomLeft, topLeft, bottomRight, topRight, topMove, rightMove, bottomMove, leftMove} = highlightSquareID;

    let result = [];

    // Castling logic for Black King
    if (!piece.move) {
        const rook1 = globalPiece.black_rook_1;
        const rook2 = globalPiece.black_rook_2;
        if (!rook1.move) {
            const b8 = keySquareMapper['b8'];
            const c8 = keySquareMapper['c8'];
            const d8 = keySquareMapper['d8'];
            if (!b8.piece && !c8.piece && !d8.piece) {
                result.push('c8');
            }
        }
        if (!rook2.move) {
            const f8 = keySquareMapper['f8'];
            const g8 = keySquareMapper['g8'];
            if (!f1.piece && !g1.piece) {
                result.push('g8');
            }
        }
    }

    result.push(checkCaptureIDsquare(bottomLeft));
    result.push(checkCaptureIDsquare(topLeft));
    result.push(checkCaptureIDsquare(bottomRight));
    result.push(checkCaptureIDsquare(topRight));
    result.push(checkCaptureIDsquare(topMove));
    result.push(checkCaptureIDsquare(rightMove));
    result.push(checkCaptureIDsquare(bottomMove));
    result.push(checkCaptureIDsquare(leftMove));

    // Store valid movement squares
    temp.push(bottomLeft, topLeft, bottomRight, topRight, topMove, rightMove, bottomMove, leftMove);

    // Flatten the result array and highlight squares
    highlightSquareID = result.flat();
    highlightSquareID.forEach((highlight) => {
        const element = keySquareMapper[highlight];
        if (element) {
            element.highlight = true;
        }
    });

    // Check opponent pieces on movement squares
    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkPieceExistence(element);
            if (checkPieceResult && checkPieceResult.piece && checkPieceResult.piece.piece_name.toLowerCase().includes("black")) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "black")) {
                break;
            }
        }
    }

    // Render the global state to update the board
    globalStateRenderer();
}

// Clears previous self highlight on the piece
function clearPreviousSelfHighlight(piece) {
    if (piece) {
        document.getElementById(piece.current_position).classList.remove("pieceHighlightYellow");
        pieceSelfHighlightState = null;
    }
}


// Initializes global event listener for click events on the game board
function GlobalEvent() {
    ROOT_DIV.addEventListener("click", function (event) {
        // Check if the clicked element is an image
        if (event.target.localName === "img") {
            const clickID = event.target.parentNode.id;
            const square = keySquareMapper[clickID];

            // Handle piece capture if the player clicks on an opponent's piece
            if ((square.piece.piece_name.includes("WHITE") && nextTurn === "black") 
                || (square.piece.piece_name.includes("BLACK") && nextTurn === "white")) {
                turnToCapture(square);
                return;                    
            }

            // Handle piece movement based on the clicked piece's type and current turn
            if (square.piece.piece_name === "WHITE_PAWN") {
                if (nextTurn == "white") WhitePawnClick(square);
            } else if (square.piece.piece_name === "BLACK_PAWN") {
                if (nextTurn == "black") BlackPawnClick(square);
            } else if (square.piece.piece_name === "WHITE_BISHOP") {
                if (nextTurn == "white") WhiteBishopClick(square);
            } else if (square.piece.piece_name === "BLACK_BISHOP") {
                if (nextTurn == "black") BlackBishopClick(square);  
            } else if (square.piece.piece_name === "WHITE_ROOK") {
                if (nextTurn == "white") WhiteRookClick(square);
            } else if (square.piece.piece_name === "BLACK_ROOK") {
                if (nextTurn == "black") BlackRookClick(square);
            } else if (square.piece.piece_name === "WHITE_KNIGHT") {
                if (nextTurn == "white") WhiteKnightClick(square);
            } else if (square.piece.piece_name === "BLACK_KNIGHT") {
                if (nextTurn == "black") BlackKnightClick(square);
            } else if (square.piece.piece_name === "WHITE_QUEEN") {
                if (nextTurn == "white") WhiteQueenClick(square);
            } else if (square.piece.piece_name === "BLACK_QUEEN") {
                if (nextTurn == "black") BlackQueenClick(square);
            } else if (square.piece.piece_name === "WHITE_KING") {
                if (nextTurn == "white") WhiteKingClick(square);
            } else if (square.piece.piece_name === "BLACK_KING") {
                if (nextTurn == "black") BlackKingClick(square);
            }
        } else {
            // Handle clicks on other elements (like spans)
            const childElementsofClickedPiece = Array.from(event.target.childNodes);

            // Check if the clicked element is a valid move target
            if (childElementsofClickedPiece.length == 1 || event.target.localName == "span") {
                // Handle movement based on clicked element
                clearPreviousSelfHighlight(pieceSelfHighlightState);
                const id = event.target.localName == "span" ? event.target.parentNode.id : event.target.id;
                movePiece(moveState, id);
                moveState = null;
            } else {
                // Clear highlights on clicking on any different square
                clearHighlightsLocal();
                clearPreviousSelfHighlight(pieceSelfHighlightState);
            }
        }
    });
}

// Exports the GlobalEvent function and movePiecefromXtoY function for external use
export { GlobalEvent, movePiecefromXtoY };



