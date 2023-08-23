// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect bet amount
// 4. Spin the slot machine
// 5. Check if user won
// 6. Give winnings or take losses
// 7. Play again

const prompt = require("prompt-sync")();

//4. Spin the slot machine (variables)
const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}



// 1. Deposit money
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");

        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Please enter a number greater than zero")
        } else {
            return numberDepositAmount;
        }
    }
}
//2. Determine number of lines
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");

        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3) {
            console.log("Please enter a number between 1 and 3")
        } else {
            return numberOfLines;
        }
    }
}
//3. Collect bet amount
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the amount to bet per line: ");

        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > (balance / lines)) {
            console.log("Please enter a bet greater than zero that will not exceed your balance. Your bet is multiplied by the number of lines you wish to bet.")
        } else {
            return numberBet;
        }
    }
}
//4. Spin slot machine (function)
// creating an array with all symbols. when contructing the slot results we will randomly choose an array index, remove it from array, and select again untill 3x3 columns is established as results
const spin = () => {
    const symbols = [];
    //create a new array with all possible symbols
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    //copy array into new array for mutablitly, construct reels array
    const reels = []; // reels = [[], [], []] when COLS = 3
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j= 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

const transpose = (reels) => {
    //converts the arrays representing rows into columns presentable to player as slot machine layout
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }
    return rows;
}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString)
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;

}


// calling the functions into a definition runs the code and stores the return in a usable variable
const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won $" + winnings.toString());

        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n)")

        if (playAgain != "y") break;
    }
}

game();

