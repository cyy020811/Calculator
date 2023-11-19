const operations = ["+", "-", "*", "/", "(", ")", ".", "^"];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const symbols = operations.concat(numbers);
const numPattern = /\d+\.?\d*/;
let enterBtn, clearBtn, inputBar, resultTxt;

document.addEventListener("DOMContentLoaded", function() {
    enterBtn = document.getElementById("enter");
    clearBtn = document.getElementById("clear");
    inputBar = document.getElementById("expressionTxt");
    resultTxt = document.getElementById("result");
    enterBtn.addEventListener("click", function() {
        let input = inputBar.value;
        let result = evaluate(input);
        console.log(result);
        resultTxt.innerHTML = `Result: ${result}`;
    });
    clearBtn.addEventListener("click", function() {
        inputBar.value = '';
        resultTxt.innerHTML = `Result:`;
    });
})


// Get user input and evalate the expression
const evaluate = (input) => {
    const expression = input.replaceAll(' ', ''); // Remove all spaces
    const result = isValid(expression) ? calculate(expression) : "Your input is invalid!"; // Check expression validity
    // Return result
    if (!isNaN(result)) {
        console.log(result);
    } else {
        console.log("Your input is invalid!");
    }
    return result;
}

// A series of form validity tests
const isValid = string => {
    if (checkSymbols(string) && checkParenthesis(string)) return true;
    return false;
}

// Check whether the input contains illegal symbols
const checkSymbols = string => {
    for (let index in string) {
        if (!(symbols.includes(string.charAt(index)))) return false;
    }
    return true;
}

// Check whether parenthesises are correctly structured
const checkParenthesis = string => {
    let leftParenthesisCount = 0;
    for (let index in string) {
        if (string.charAt(index) === "(") leftParenthesisCount++;
        else if (string.charAt(index) === ")") {
            leftParenthesisCount--;
            // More right parenthesises than left parenthesises
            if (leftParenthesisCount < 0) return false;
        }
    }
    if (leftParenthesisCount === 0) return true;
    return false;
}

const calculate = expression => {
    const opStack = [];
    const numStack = [];
    let input = expression;
    while (input) {
        let char = input.charAt(0), forward = 1, pushTopOp = true, pushChar = true;
        // Process operations
        if (operations.includes(char)) {
            let topOp = opStack.pop();
            if (!topOp) pushTopOp = false;
            // Recursively calculate sub-expression in the parenthesises
            if (char === '(') {
                let rightParenIndex = input.indexOf(")");
                console.log(rightParenIndex);
                numStack.push(calculate(input.substring(1, rightParenIndex)));
                forward += rightParenIndex;
                pushChar = false;
            } else {
                // Calculate * and / before pushing + and -
                if (topOp) {
                    if (higherPriority(topOp, char)) {
                        let right = numStack.pop(), left = numStack.pop();
                        numStack.push(arithmetic(char, left, right));
                        pushTopOp = false;
                    }
                }
            }
            if (pushTopOp) opStack.push(topOp);
            if (pushChar) opStack.push(char);
        }
        // Process numbers
        if (numbers.includes(char)) {
            let num = input.match(numPattern)[0];
            numStack.push(Number(num));
            forward = num.length;
        }
        // Move reading cursor forward
        input = input.substring(forward);
    }
    // Calculate the result
    while (opStack.length !== 0) {
        let operation = opStack.pop(), right = numStack.pop(), left = numStack.pop();
        numStack.push(arithmetic(operation, left, right));
    }
    return numStack.pop();
}

// Retrive sub-expression
function getSubExpression(expression) {
    const leftParenIndex = expression.indexOf("(");
    const rightParenIndex = expression.indexOf(")");
    return expression.slice(leftParenIndex + 1, rightParenIndex);
}

// Basic mathematical functions
function arithmetic(operand, leftNum, rightNum) {
    let result;
    switch (operand) {
        case "+":
            result = leftNum + rightNum;
            break;
        case "-":
            result = leftNum - rightNum;
            break;
        case "*":
            result = leftNum * rightNum;
            break;
        case "/":
            result = leftNum / rightNum;
            break;
        default:
            result = NaN;
            break;
    }
    return result;
}

// Check operational priorities 
function higherPriority(top, curr) {
    if (top === "*" || top === "/") {
        if (curr === "+" || curr === "-") {
            return true;
        }
    }
    return false;
}