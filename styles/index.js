// Importing necessary functions for game initialization, rendering, and event handling
import { initGame } from "../data/data.js";
import { initGameRender } from "../render/main.js";
import { GlobalEvent } from "../events/global.js";

// Initialize the game and create a global access variable to manage the game state
const globalAccess = initGame();

// Create a mapping of square IDs to their respective square objects
let keySquareMapper = {};
globalAccess.flat().forEach(square => {
    keySquareMapper[square.id] = square;
});

// Render the initial game state
initGameRender(globalAccess);

// Initialize global events for handling user interactions
GlobalEvent();

// Extend the String prototype to add a method for replacing characters at a specific index
String.prototype.replaceAt = function (index, replacement) {
    return (
      this.substring(0, index) +
      replacement +
      this.substring(index + replacement.length)
    );
};

// Export the global access variable and the key square mapper for use in other modules
export { globalAccess, keySquareMapper };
