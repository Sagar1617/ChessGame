import { globalAccess } from "../styles/index.js";
import { keySquareMapper } from "../styles/index.js";

// Function to check if the piece exists on the squareID or not
function checkPieceExistence(squareID){
    const square = keySquareMapper[squareID];
    if (square.piece) {
        return square;        
    }else{
        return false;
    }

}


// Function to check captureIDs
function checkCaptureIDsquare(array){
    let returnArray = [];

    for (let index = 0; index < array.length; index++) {
        const squareID = array[index];
        const square = keySquareMapper[squareID];
        if (square.piece) {
            break;

            
        }
        returnArray.push(squareID);
        
    }
    return returnArray;

    

}


// Function to check if the oponent's piece exists
function checkPieceOfOpponentOnElement(id, color){
    
   const opponentColor = color === "white" ? "BLACK": "WHITE";
   const element = keySquareMapper[id];

   if(! element) return false;


   if(element.piece && element.piece.piece_name.includes(opponentColor)){
    const el = document.getElementById(id);
    el.classList.add("captureColor");
    element.captureHighlight = true;
    return true; 

}
    return false;

}
function checkPieceOfOpponentOnElementWithoutDOM(id, color){
    
   const opponentColor = color === "white" ? "BLACK": "WHITE";
   const element = keySquareMapper[id];

   if(! element) return false;


   if(element.piece && element.piece.piece_name.includes(opponentColor)){

    return true; 

}
    return false;

}

// Function to provide Highlight IDs for Bishop
function provideHighlightToBishop(id){
    let finalReturnArray = [];

    function topLeft(id){
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
       
        while(alpha != "a" && num != 8){
            num = num + 1;
            alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            resultArray.push(`${alpha}${num}`);
            

        } 
       return resultArray;
    }
    function bottomLeft(id){
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
       
        while(alpha != "a" && num != 1){
            num = num - 1;
            alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            resultArray.push(`${alpha}${num}`);
            

        } 
       return resultArray;
    }
    function topRight(id){
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
       
        while(alpha != "h" && num != 8){
            num = num + 1;
            alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
            resultArray.push(`${alpha}${num}`);
            

        }  
       return resultArray;
    }
    function bottomRight(id){
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
       
        while(alpha != "h" && num != 1){
            num = num - 1;
            alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
            resultArray.push(`${alpha}${num}`);
            

        } 
         return resultArray;
    }
    return {
        topLeft : topLeft(id),
        bottomLeft : bottomLeft(id),
        topRight : topRight(id),
        bottomRight : bottomRight(id)
    };

}


// Function to provide Highlight IDs for Rook
function provideHighlightToRook(id){

    let finalReturnArray = [];

    function topMove(id){
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
       
        while(num != 8){
            num = num + 1;
            //alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            resultArray.push(`${alpha}${num}`);
            

        } 
       return resultArray;
    }
    function bottomMove(id){
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
       
        while(num != 1){
            num = num - 1;
            //alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            resultArray.push(`${alpha}${num}`);
            

        } 
       return resultArray;
    }
    function rightMove(id){
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
       
        while(alpha != "h"){
            //num = num + 1;
            alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
            resultArray.push(`${alpha}${num}`);
            

        }  
       return resultArray;
    }
    function leftMove(id){
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
       
        while(alpha != "a"){
            //num = num + 1;
            alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            resultArray.push(`${alpha}${num}`);
            

        }  
       return resultArray;
    }

   
    return {
        topMove : topMove(id),
        bottomMove : bottomMove(id),
        rightMove : rightMove(id),
        leftMove : leftMove(id)
    };


}

// Function to provide Highlight IDs for Knight
function provideHighlightToKnight(id){
    if (!id) {
        return;
        
    }
    
    function left() {

        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
        let temp = 0;
       
        while(alpha != "a"){

            if(temp == 2){
                break;
            }
            //num = num + 1;
            alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            resultArray.push(`${alpha}${num}`);
            temp += 1;
            

        }  
        if (resultArray.length == 2){
            let finalReturnArray = [];
            const lastElement = resultArray[resultArray.length - 1];
            let alpha = lastElement[0];
            let number = Number(lastElement[1]);
            if (number < 8) {
                finalReturnArray.push(`${alpha}${number + 1}`)
                
            }
            if (number > 1) {
                finalReturnArray.push(`${alpha}${number - 1}`)
               
            }
             

            return finalReturnArray;
            //resultArray.push(`${Number(lastElement[1])}`)

        } else {
            return [];
        }
    
        
    }
    function top() {

        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
        let temp = 0;
       
        while(num != "8"){

            if(temp == 2){
                break;
            }
            num = num + 1;
            //alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
            resultArray.push(`${alpha}${num}`);
            temp += 1;
            

        }  
        if (resultArray.length == 2){
            let finalReturnArray = [];
            const lastElement = resultArray[resultArray.length - 1];
            let alpha = lastElement[0];
            let number = Number(lastElement[1]);
            if (alpha != "h") {
                let alpha2 = String.fromCharCode(alpha.charCodeAt(0) + 1);
                finalReturnArray.push(`${alpha2}${number}`);
                
            }
            if (alpha != "a") {
                let alpha2 = String.fromCharCode(alpha.charCodeAt(0) - 1);
                finalReturnArray.push(`${alpha2}${number}`);
            }
             

            return finalReturnArray;
            //resultArray.push(`${Number(lastElement[1])}`)

        } else {
            return [];
        }
        
    }
    function bottom() {

        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
        let temp = 0;
       
        while(num != "1"){

            if(temp == 2){
                break;
            }
            num = num - 1;
            //alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
            resultArray.push(`${alpha}${num}`);
            temp += 1;
            

        }  
        if (resultArray.length == 2){
            let finalReturnArray = [];
            const lastElement = resultArray[resultArray.length - 1];
            let alpha = lastElement[0];
            let number = Number(lastElement[1]);
            if (alpha != "h") {
                let alpha2 = String.fromCharCode(alpha.charCodeAt(0) + 1);
                finalReturnArray.push(`${alpha2}${number}`);
                
            }
            if (alpha != "a") {
                let alpha2 = String.fromCharCode(alpha.charCodeAt(0) - 1);
                finalReturnArray.push(`${alpha2}${number}`);
            }
             

            return finalReturnArray;
            //resultArray.push(`${Number(lastElement[1])}`)

        } else {
            return [];
        }


        
    }
    function right() {

        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];
        let temp = 0;
       
        while(alpha != "h"){

            if(temp == 2){
                break;
            }
            //num = num + 1;
            alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
            resultArray.push(`${alpha}${num}`);
            temp += 1;
            

        }  
        if (resultArray.length == 2){
            let finalReturnArray = [];
            const lastElement = resultArray[resultArray.length - 1];
            let alpha = lastElement[0];
            let number = Number(lastElement[1]);
            if (number < 8) {
                finalReturnArray.push(`${alpha}${number + 1}`)
                
            }
            if (number > 1) {
                finalReturnArray.push(`${alpha}${number - 1}`)
               
            }
             

            return finalReturnArray;
            //resultArray.push(`${Number(lastElement[1])}`)

        } else {
            return [];
        }
    
        
    }
    return [...top(),...right(),...bottom(),...left()];


}




// Function to provide Highlight IDs for Queen
function provideHighlightToQueen(id){
    const rookMoves = provideHighlightToRook(id);
    const bishopMoves = provideHighlightToBishop(id);
    return{
        "leftMove": rookMoves.leftMove,
        "rightMove": rookMoves.rightMove,
        "topMove": rookMoves.topMove,
        "bottomMove": rookMoves.bottomMove,
        "topLeft": bishopMoves.topLeft,
        "topRight": bishopMoves.topRight,
        "bottomLeft": bishopMoves.bottomLeft,
        "bottomRight": bishopMoves.bottomRight

    }
    
}
// Function to provide Highlight IDs for King
function provideHighlightToKing(id){
    const rookMoves = provideHighlightToRook(id);
    const bishopMoves = provideHighlightToBishop(id);
    const returnResult = {
        "leftMove": rookMoves.leftMove,
        "rightMove": rookMoves.rightMove,
        "topMove": rookMoves.topMove,
        "bottomMove": rookMoves.bottomMove,
        "topLeft": bishopMoves.topLeft,
        "topRight": bishopMoves.topRight,
        "bottomLeft": bishopMoves.bottomLeft,
        "bottomRight": bishopMoves.bottomRight

    }
    for (const key in returnResult) {
        if (Object.prototype.hasOwnProperty.call(returnResult, key)){ 
            const element = returnResult[key];
        if (element.length != 0) {
            returnResult[key] = new Array(element[0]);
            
        }

        }
    }
    return returnResult;

    
}




function provideCaptureToKnight(id, color){

    if (!id) {
        return [];
        
    }
    let returnArr = provideHighlightToKnight(id);
 
    returnArr = returnArr.filter(element => {
        if (checkPieceOfOpponentOnElementWithoutDOM(element, color)) {
            return true;

            
        }
            
    });
    return returnArr;


}

function provideCaptureToKing(id, color){

    if (!id) {
        return [];
        
    }

    let result = provideHighlightToKing(id);
    result = Object.values(result).flat();

    result = result.filter(element => {

        if(checkPieceOfOpponentOnElementWithoutDOM(element, color)){
            return true;
        }
        
    });
        return result;

        
    }

function provideCaptureToRook(id, color){

    if (!id) {
        return [];
        
    }

    let highlightSquareID = provideHighlightToRook(id);
    let temp = [];

    const {bottomMove, topMove, rightMove, leftMove} = highlightSquareID;
    let returnArr = [];

    let result = [];
    temp.push(bottomMove);
    temp.push(topMove);
    temp.push(rightMove);
    temp.push(leftMove);

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

           let checkPieceResult = checkPieceExistence(element);
           if(checkPieceResult && checkPieceResult.piece && checkPieceResult.piece.piece_name.toLowerCase().includes(color)){
            break;                
           }

            if (checkPieceOfOpponentOnElementWithoutDOM(element, color)){
                returnArr.push(element);
                break;
            }
          
            
        }
        
    }
    
    return returnArr;

}

function provideCaptureToBishop(id, color){

    if (!id) {
        return [];
        
    }

    let highlightSquareID = provideHighlightToBishop(id);
    let temp = [];

    const {bottomLeft, topLeft, bottomRight, topRight} = highlightSquareID;
    let returnArr = [];

    let result = [];
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

           let checkPieceResult = checkPieceExistence(element);
           if(checkPieceResult && checkPieceResult.piece && checkPieceResult.piece.piece_name.toLowerCase().includes(color)){
            break;                
           }

            if (checkPieceOfOpponentOnElementWithoutDOM(element, color)){
                returnArr.push(element);
                break;
            }
          
            
        }
        
    }
    return returnArr;

}

function provideCaptureToQueen(id, color){

    if (!id) {
        return [];
        
    }

    let returnArr = [];
    returnArr.push(provideCaptureToBishop(id, color));
    returnArr.push(provideCaptureToRook(id, color));

    
    return returnArr.flat();


}

function provideCaptureToPawn(id, color) {
    if (!id) {
        return [];
    }

    let alpha = id[0];  
    let num = Number(id[1]);  
    let returnArr = [];

    // Determine the direction of pawn movement based on color
    if (color === "white") {

        if (alpha !== 'a') {
            let leftCapture = `${String.fromCharCode(alpha.charCodeAt(0) - 1)}${num + 1}`;
            if (checkPieceOfOpponentOnElementWithoutDOM(leftCapture, color)) {
                returnArr.push(leftCapture);
            }
        }
        if (alpha !== 'h') {
            let rightCapture = `${String.fromCharCode(alpha.charCodeAt(0) + 1)}${num + 1}`;
            if (checkPieceOfOpponentOnElementWithoutDOM(rightCapture, color)) {
                returnArr.push(rightCapture);
            }
        }
    } else if (color === "black") {
        // Black pawns move downward (decrease row number)
        if (alpha !== 'a') {
            let leftCapture = `${String.fromCharCode(alpha.charCodeAt(0) - 1)}${num - 1}`;
            if (checkPieceOfOpponentOnElementWithoutDOM(leftCapture, color)) {
                returnArr.push(leftCapture);
            }
        }
        if (alpha !== 'h') {
            let rightCapture = `${String.fromCharCode(alpha.charCodeAt(0) + 1)}${num - 1}`;
            if (checkPieceOfOpponentOnElementWithoutDOM(rightCapture, color)) {
                returnArr.push(rightCapture);
            }
        }
    }

    return returnArr;
}





export {
checkPieceOfOpponentOnElement, 
checkCaptureIDsquare, 
provideHighlightToBishop, 
checkPieceExistence, 
provideHighlightToRook,
provideHighlightToKnight,
provideHighlightToQueen,
provideHighlightToKing,
provideCaptureToKnight,
provideCaptureToKing,
provideCaptureToBishop,
provideCaptureToRook,
provideCaptureToQueen,
provideCaptureToPawn
};  