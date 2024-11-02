function generateMatrix() {
    // Get the dimension from user input
    const dimension = document.getElementById('dimension').value;

    // Check if the input is a valid number
    if (dimension < 1) {
        alert("Please enter a valid positive number.");
        return;
    }

    // Clear any existing matrix
    const matrixContainer = document.getElementById('matrixContainer');
    matrixContainer.innerHTML = '';

    // Create a table element for the matrix
    const table = document.createElement('table');

    // Loop to create the rows and cells for the matrix
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            tr.id = `cell-${i}-${j}`; // Unique ID for each cell
            cell.textContent = `(${i + 1},${j + 1})`; // Cell coordinates or placeholder text
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Append the table to the container
    matrixContainer.appendChild(table);
}

function generateMatrixInputs() {
    const dimension = document.getElementById('dimension').value;

    // Check if the input is a valid number
    if (dimension < 1) {
        alert("Please enter a valid positive number.");
        return;
    }

    const matrixInputContainer = document.getElementById('matrixInputContainer');
    matrixInputContainer.innerHTML = ''; // Clear previous inputs

    // Create input fields for each matrix cell
    for (let i = 0; i < dimension; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = "matrix-row";

        for (let j = 0; j < dimension; j++) {
            const input = document.createElement('input');
            input.type = "number";
            input.className = "matrix-input";
            input.placeholder= 'Inter your number'
            input.id = `cell-${i}-${j}`; // Unique ID for each cell
            rowDiv.appendChild(input);
        }
        matrixInputContainer.appendChild(rowDiv);
    }

    // Show the button to display the matrix
    document.getElementById('showMatrixBtn').style.display = 'inline';
}

function displayMatrix() {
    document.getElementById('line').style.display = 'inline';
    const dimension = document.getElementById('dimension').value;
    const matrixContainer = document.getElementById('matrixContainer');
    matrixContainer.innerHTML = ''; // Clear any existing matrix

    const table = document.createElement('table');

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            const cellValue = document.getElementById(`cell-${i}-${j}`).value || 0; // Default to 0 if empty
            cell.textContent = cellValue;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    matrixContainer.appendChild(table);
    // matrixInputContainer.innerHTML='';
    
    document.getElementById('showMatrixBtn').style.display='none';
    document.getElementById('Decompose').style.display= 'inline';
    
}

function calculateLU() {
    document.getElementById('Decompose').style.display= 'none';
    const dimension = parseInt(document.getElementById('dimension').value);

    // Initialize the matrix A
    let A = [];
    for (let i = 0; i < dimension; i++) {
        A[i] = [];
        for (let j = 0; j < dimension; j++) {
            A[i][j] = parseFloat(document.getElementById(`cell-${i}-${j}`).value) || 0;
        }
    }
    matrixInputContainer.innerHTML='';

    // Initialize L as an identity matrix and U as a copy of A
    let L = Array.from({ length: dimension }, (_, i) => Array(dimension).fill(0));
    let U = JSON.parse(JSON.stringify(A));

    for (let i = 0; i < dimension; i++) {
        L[i][i] = 1;  // Set diagonal of L to 1
    }

    // Perform LU Decomposition using Elimination Matrix method
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = ''; // Clear previous results

    for (let j = 0; j < dimension - 1; j++) {
        for (let i = j + 1; i < dimension; i++) {
            const multiplier = U[i][j] / U[j][j];
            L[i][j] = multiplier;

            // Display how L is updated
           

            // Create and display the current Elimination Matrix E_ij
            let E = Array.from({ length: dimension }, (_, k) => Array(dimension).fill(0));
            for (let k = 0; k < dimension; k++) {
                E[k][k] = 1;
            }
            E[i][j] = -multiplier;  // Set the elimination factor in E

            // Update U for this row
            for (let k = j; k < dimension; k++) {
                U[i][k] -= multiplier * U[j][k];
            }

            // Display E_ij
            displayEliminationMatrix(E, `E_${i + 1}${j + 1}`);
            displayLUpdate(L, i, j, multiplier);
        }
    }

    displayResult(L, U);
}



function displayEliminationMatrix(E, label) {
    const resultContainer = document.getElementById('resultContainer');

    const table = document.createElement('table');
    let title = document.createElement('h3');
    title.innerText = `${label} (Elimination Matrix)`;
    table.appendChild(createMatrixTable(E));
    resultContainer.appendChild(title);
    resultContainer.appendChild(table);
}

function displayLUpdate(L, row, col, multiplier) {
    const resultContainer = document.getElementById('resultContainer');

    const table = document.createElement('table');
    let title = document.createElement('h3');
    title.innerText = `Updated L Matrix after setting L[${row + 1}][${col + 1}] = ${multiplier.toFixed(2)}`;
    table.appendChild(createMatrixTable(L));
    resultContainer.appendChild(title);
    resultContainer.appendChild(table);
}

function displayResult(L, U) {
    const resultContainer = document.getElementById('resultContainer');

    // Display L Matrix
    const lTable = document.createElement('table');
    let lTitle = document.createElement('h3');
    lTitle.innerText = 'Final L Matrix';
    lTable.appendChild(createMatrixTable(L));
    resultContainer.appendChild(lTitle);
    resultContainer.appendChild(lTable);

    // Display U Matrix
    const uTable = document.createElement('table');
    let uTitle = document.createElement('h3');
    uTitle.innerText = 'Final U Matrix';
    uTable.appendChild(createMatrixTable(U));
    resultContainer.appendChild(uTitle);
    resultContainer.appendChild(uTable);
}

function createMatrixTable(matrix) {
    const table = document.createElement('table');
    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('td');
            cell.textContent = matrix[i][j].toFixed(2);  // Display with 2 decimal places
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    return table;
}