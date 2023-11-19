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
    enterBtn.addEventListener("click", function() {main(1)});
    clearBtn.addEventListener("click", function() {main(0)});
})

// A series of form validity tests
const validation = string => {
    if (checkSymbols(string) && checkParenthesis(string) & string.length > 0) return true;
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

// Evaluate the expression
const calculate = (input) => {
    const opStack = [];
    const numStack = [];
    let expression = input;
    while (expression) {
        let char = expression.charAt(0), forward = 1, pushTopOp = true, pushChar = true;
        // Process operations
        if (operations.includes(char)) {
            let topOp = opStack.pop();
            if (!topOp) pushTopOp = false;
            // Recursively calculate sub-expression in the parenthesises
            if (char === '(') {
                let rightParenIndex = expression.indexOf(")");
                console.log(rightParenIndex);
                numStack.push(calculate(expression.substring(1, rightParenIndex)));
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
            let num = expression.match(numPattern)[0];
            numStack.push(Number(num));
            forward = num.length;
        }
        // Move reading cursor forward
        expression = expression.substring(forward);
    }
    // Calculate the result
    while (opStack.length !== 0) {
        let operation = opStack.pop(), right = numStack.pop(), left = numStack.pop();
        numStack.push(arithmetic(operation, left, right));
    }
    return numStack.pop();
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

const main = command => {
    if (command === 0) {
        inputBar.value = '';
        resultTxt.innerHTML = `Result:`;
    } else if (command === 1) {
        let input = inputBar.value.replaceAll(" ", ""), result;
        if (validation(input)) {
            result = calculate(input);
        } else {
            result = "Invalid input";
        }
        console.log(result);
        resultTxt.innerHTML = `Result: ${result}`;
    }
}