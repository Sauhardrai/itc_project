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

    let L = [];
    for (let i = 0; i < dimension; i++) {
        L[i] = [];
        for (let j = 0; j < dimension; j++) {
            L[i][j] = (i === j) ? 1 : 0;
        }
    }

    let U = [];
    for (let i = 0; i < dimension; i++) {
        U[i] = [];
        for (let j = 0; j < dimension; j++) {
            U[i][j] = A[i][j];
        }
    }

    let D = [];
    for (let i = 0; i < dimension; i++) {
        D[i] = [];
        for (let j = 0; j < dimension; j++) {
            D[i][j] = 0;
        }
    }

    const result = document.getElementById('result');
    result.innerHTML = '';

    for (let j = 0; j < dimension - 1; j++) {
        for (let i = j + 1; i < dimension; i++) {
            document.getElementById('result').innerHTML += `<hr style= margin:20px;> `;
            if (U[j][j] === 0) {
                let swapFound = false;
                for (let k = j + 1; k < dimension; k++) {
                    if (U[k][j] !== 0) {
                        [U[j], U[k]] = [U[k], U[j]];
                        alert(`Swapped row ${j + 1} with row ${k + 1} to avoid division by zero.`);
                        swapFound = true;
                        break;
                    }
                }
                if (!swapFound) {
                    alert("Division by zero encountered, and no suitable row found for swapping. Please provide a matrix that allows factorization.");
                    return;
                }
            }
            const multiplier = U[i][j] / U[j][j];
            L[i][j] = multiplier;

            let E = [];
            for (let k = 0; k < dimension; k++) {
                E[k] = [];
                for (let l = 0; l < dimension; l++) {
                    E[k][l] = (k === l) ? 1 : 0;
                }
            }
            E[i][j] = -multiplier;

            for (let k = j; k < dimension; k++) {
                U[i][k] -= multiplier * U[j][k];
            }
            displayEliminationMatrix(E, `E${i + 1}${j + 1}`);
            displayUMatrixStep(U, `A Matrix after row operation:-`, `(R${i + 1} = R${i + 1} - (a${i + 1}${j + 1}/a${j + 1}${j + 1}) * R${j + 1})`);
        }
    }
    displayUMatrix(U, `Final U matrix is:`)

    for (let i = 0; i < dimension; i++) {
        D[i][i] = U[i][i];
        for (let j = 0; j < dimension; j++) {
            U[i][j] = (i === j) ? 1 : (U[i][j] / D[i][i]);
        }
    }

    displayResult(L, D, U);
    displayFinalLDU(L, D, U);
}

function displayEliminationMatrix(E, label) {
    const result = document.getElementById('result');

    const table = document.createElement('table');
    let title = document.createElement('h3');
    title.innerText = `${label} (Elimination Matrix) `;
    table.appendChild(createMatrixTable(E));
    result.appendChild(title);
    result.appendChild(table);
}

function displayUMatrixStep(U, label, description) {
    const result = document.getElementById('result');

    const uTable = document.createElement('table');
    let uTitle = document.createElement('h3');
    uTitle.innerText = `${label} ${description}`;
    uTable.appendChild(createMatrixTable(U));
    result.appendChild(uTitle);
    result.appendChild(uTable);
}
function displayUMatrix(U, label,) {
    const result = document.getElementById('result');

    const uTable = document.createElement('table');
    let uTitle = document.createElement('h3');
    uTitle.innerText = `${label}`;
    uTable.appendChild(createMatrixTable(U));
    result.appendChild(uTitle);
    result.appendChild(uTable);
}

function displayResult(L, D, U) {
    const result = document.getElementById('result');

    const lTable = document.createElement('table');
    let lTitle = document.createElement('h3');
    lTitle.innerText = 'Final L matrix:';
    lTable.appendChild(createMatrixTable(L));
    result.appendChild(lTitle);
    result.appendChild(lTable);

    const dTable = document.createElement('table');
    let dTitle = document.createElement('h3');
    dTitle.innerText = 'Final D Matrix (Diagonal Matrix):';
    dTable.appendChild(createMatrixTable(D));
    result.appendChild(dTitle);
    result.appendChild(dTable);

    const uTable = document.createElement('table');
    let uTitle = document.createElement('h3');
    uTitle.innerText = "Final U Matrix as U' :";
    uTable.appendChild(createMatrixTable(U));
    result.appendChild(uTitle);
    result.appendChild(uTable);
}

function displayFinalLDU(L, D, U) {
    const result = document.getElementById('result');

    const title = document.createElement('h3');
    title.innerText = 'Final A = LDU Matrix';
    result.appendChild(title);

    const A = multiplyMatrices(L, multiplyMatrices(D, U));
    const aTable = createMatrixTable(A);
    result.appendChild(aTable);
}

function multiplyMatrices(A, B) {
    const result = [];
    for (let i = 0; i < A.length; i++) {
        result[i] = [];
        for (let j = 0; j < B[0].length; j++) {
            result[i][j] = 0;
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
