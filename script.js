function generateMatrixInputs() {
    const dimension = document.getElementById('dimension').value;

    if (dimension < 1) {
        alert("Please enter a valid positive number.");
        return;
    }

    const matrix = document.getElementById('matrixInputContainer');
    matrix.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = "matrix-row";

        for (let j = 0; j < dimension; j++) {
            const input = document.createElement('input');
            input.type = "number";
            input.className = "matrix-input";
            input.placeholder = 'Enter your number';
            input.id = `cell-${i}-${j}`;
            rowDiv.appendChild(input);
        }
        matrix.appendChild(rowDiv);
    }

    document.getElementById('showMatrixBtn').style.display = 'inline';
}

function displayMatrix() {
    document.getElementById('line').style.display = 'inline';
    const dimension = document.getElementById('dimension').value;
    const matrixContainer = document.getElementById('matrixContainer');
    matrixContainer.innerHTML = '';

    const table = document.createElement('table');

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            const cellValue = document.getElementById(`cell-${i}-${j}`).value || 0;
            cell.textContent = cellValue;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    matrixContainer.appendChild(table);

    document.getElementById('showMatrixBtn').style.display = 'none';
    document.getElementById('Decompose').style.display = 'inline';
}

function calculateLU() {
    document.getElementById('Decompose').style.display = 'none';
    const dimension = parseInt(document.getElementById('dimension').value);

    let A = [];
    for (let i = 0; i < dimension; i++) {
        A[i] = [];
        for (let j = 0; j < dimension; j++) {
            A[i][j] = parseFloat(document.getElementById(`cell-${i}-${j}`).value) || 0;
        }
    }

    let L = Array.from({ length: dimension }, (_, i) => Array(dimension).fill(0));
    let U = JSON.parse(JSON.stringify(A));
    let D = Array.from({ length: dimension }, (_, i) => Array(dimension).fill(0));

    for (let i = 0; i < dimension; i++) {
        L[i][i] = 1;
    }

    const result = document.getElementById('result');
    result.innerHTML = '';

    for (let j = 0; j < dimension - 1; j++) {
        for (let i = j + 1; i < dimension; i++) {
            if (U[j][j] === 0) {
                alert("Division by zero encountered. Please provide a matrix that allows factorization.");
                return;
            }

            const multiplier = U[i][j] / U[j][j];
            L[i][j] = multiplier;

            let E = Array.from({ length: dimension }, (_, k) => Array(dimension).fill(0));
            for (let k = 0; k < dimension; k++) {
                E[k][k] = 1;
            }
            E[i][j] = -multiplier;

            for (let k = j; k < dimension; k++) {
                U[i][k] -= multiplier * U[j][k];
            }

            displayEliminationMatrix(E, `E${i + 1}${j + 1}`);
            displayUMatrixStep(U, `A Matrix after row opration:-`,`(R${i + 1} = R${i + 1} - (a${i+1}${j+1}/a${j+1}${j+1})* R${j + 1})`);
        }
    }

    // Extract D from the diagonal of U and normalize U to have ones on the diagonal
    for (let i = 0; i < dimension; i++) {
        D[i][i] = U[i][i];
        for (let j = 0; j < dimension; j++) {
            if (i === j) {
                U[i][j] = 1;
            } else {
                U[i][j] = U[i][j] / D[i][i];
            }
        }
    }

    displayResult(L, D, U);
    displayFinalLDU(L, D, U);
}

function displayEliminationMatrix(E, label, description) {
    const result = document.getElementById('result');

    const table = document.createElement('table');
    let title = document.createElement('h3');
    title.innerText = `${label} (Elimination Matrix) `;
    table.appendChild(createMatrixTable(E));
    result.appendChild(title);
    result.appendChild(table);
}

function displayUMatrixStep(U,label, description) {
    const result = document.getElementById('result');

    const uTable = document.createElement('table');
    let uTitle = document.createElement('h3');
    uTitle.innerText = `${label} ${description}`;
    uTable.appendChild(createMatrixTable(U));
    result.appendChild(uTitle);
    result.appendChild(uTable);
}

function displayResult(L, D, U) {
    const result = document.getElementById('result');

    // Display L Matrix
    const lTable = document.createElement('table');
    let lTitle = document.createElement('h3');
    let span = document.createElement('span');
    span.id = 'gao';
    span.textContent = 'L = (Inverse of Product of all Elimination Matrices)';
    lTitle.innerText = `Final L matrix as `;
    lTitle.appendChild(span);
    lTable.appendChild(createMatrixTable(L));
    result.appendChild(lTitle);
    result.appendChild(lTable);

    // Display D Matrix
    const dTable = document.createElement('table');
    let dTitle = document.createElement('h3');
    dTitle.innerText = 'Final D Matrix (Diagonal Matrix)';
    dTable.appendChild(createMatrixTable(D));
    result.appendChild(dTitle);
    result.appendChild(dTable);

    // Display U Matrix
    const uTable = document.createElement('table');
    let uTitle = document.createElement('h3');
    uTitle.innerText = 'Final U Matrix (Normalized)';
    uTable.appendChild(createMatrixTable(U));
    result.appendChild(uTitle);
    result.appendChild(uTable);
}

function displayFinalLDU(L, D, U) {
    const result = document.getElementById('result');

    const title = document.createElement('h3');
    title.innerText = 'Final A = LDU Matrix';
    result.appendChild(title);

    // We multiply L, D, and U matrices to get A
    const A = multiplyMatrices(L, multiplyMatrices(D, U));
    const aTable = createMatrixTable(A);
    result.appendChild(aTable);
}

function multiplyMatrices(A, B) {
    const result = Array.from({ length: A.length }, () => Array(B[0].length).fill(0));

    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            for (let k = 0; k < B.length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

function createMatrixTable(matrix) {
    const table = document.createElement('table');
    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('td');
            cell.textContent = matrix[i][j].toFixed(2);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    return table;
}
