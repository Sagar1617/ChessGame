// Functions to create and display black chess pieces on the board
function blackPawns(current_position) {
    return {
        current_position,
        img: "/images/pieces/black/pawn.png",
        piece_name: "BLACK_PAWN"
    };
}

function blackRook(current_position) {
    return {
        move: false,
        current_position,
        img: "/images/pieces/black/rook.png",
        piece_name: "BLACK_ROOK"
    };
}

function blackKnight(current_position) {
    return {
        current_position,
        img: "/images/pieces/black/knight.png",
        piece_name: "BLACK_KNIGHT"
    };
}

function blackBishop(current_position) {
    return {
        current_position,
        img: "/images/pieces/black/bishop.png",
        piece_name: "BLACK_BISHOP"
    };
}

function blackQueen(current_position) {
    return {
        current_position,
        img: "/images/pieces/black/queen.png",
        piece_name: "BLACK_QUEEN"
    };
}

function blackKing(current_position) {
    return {
        move: false,
        current_position,
        img: "/images/pieces/black/king.png",
        piece_name: "BLACK_KING"
    };
}

// Functions to create and display white chess pieces on the board
function whitePawns(current_position) {
    return {
        current_position,
        img: "/images/pieces/white/pawn.png",
        piece_name: "WHITE_PAWN"
    };
}

function whiteRook(current_position) {
    return {
        move: false,
        current_position,
        img: "/images/pieces/white/rook.png",
        piece_name: "WHITE_ROOK"
    };
}

function whiteKnight(current_position) {
    return {
        current_position,
        img: "/images/pieces/white/knight.png",
        piece_name: "WHITE_KNIGHT"
    };
}

function whiteBishop(current_position) {
    return {
        current_position,
        img: "/images/pieces/white/bishop.png",
        piece_name: "WHITE_BISHOP"
    };
}

function whiteQueen(current_position) {
    return {
        current_position,
        img: "/images/pieces/white/queen.png",
        piece_name: "WHITE_QUEEN"
    };
}

function whiteKing(current_position) {
    return {
        move: false,
        current_position,
        img: "/images/pieces/white/king.png",
        piece_name: "WHITE_KING"
    };
}

// Exporting all piece creation functions for use in other modules
export {
    blackPawns,
    blackRook,
    blackKnight,
    blackBishop,
    blackQueen,
    blackKing,
    whitePawns,
    whiteRook,
    whiteKnight,
    whiteBishop,
    whiteQueen,
    whiteKing
};
