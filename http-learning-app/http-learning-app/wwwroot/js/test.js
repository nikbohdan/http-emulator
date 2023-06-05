const form = document.getElementById('requestForm');
const urlInput = document.getElementById('urlInput');
const methodSelect = document.getElementById('methodSelect');
const headersTable = document.getElementById('headersTable');

const bodyInputType = document.getElementById('bodyInputType');
const bodyTable = document.getElementById('bodyTable');
const bodyText = document.getElementById('bodyText');
const requestContainer = document.getElementById('requestContainer');
const responseContainer = document.getElementById('responseContainer');
const resultContainer = document.getElementById('resultContainer');


// Valid headers list
const validHeaders = {
    GET: ['Content-Type', 'Accept', 'Accept-Language'],
    POST: ['Content-Type', 'Authorization', 'Accept'],
    PUT: ['Content-Type', 'Authorization', 'Accept'],
    DELETE: ['Authorization']
};

function isValidHeader(method, header) {
    const headers = validHeaders[method];
    return headers && headers.includes(header);
}

// Обработчик события изменения типа ввода для body
bodyInputType.addEventListener('change', function () {
    const selectedInputType = document.querySelector('input[name="bodyType"]:checked').value;
    if (selectedInputType === 'none') {
        bodyTable.style.display = 'none';
        bodyText.style.display = 'none';
    } else if (selectedInputType === 'table') {
        bodyTable.style.display = 'table';
        bodyText.style.display = 'none';
    } else if (selectedInputType === 'text') {
        bodyTable.style.display = 'none';
        bodyText.style.display = 'block';
    }
});

function addBodyRow() {
    const tbody = bodyTable.querySelector('tbody');
    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'body-name';
    nameInput.placeholder = 'Name';
    nameCell.appendChild(nameInput);
    newRow.appendChild(nameCell);

    const valueCell = document.createElement('td');
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.className = 'body-value';
    valueInput.placeholder = 'Value';
    valueCell.appendChild(valueInput);
    newRow.appendChild(valueCell);

    const controlsCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '-';
    removeButton.onclick = () => removeBodyRow(newRow);
    controlsCell.appendChild(removeButton);
    newRow.appendChild(controlsCell);

    tbody.appendChild(newRow);
}

function removeBodyRow(row) {
    const tbody = bodyTable.querySelector('tbody');
    tbody.removeChild(row);
}

// Update header autocomplete options based on selected method
function updateHeaderAutocomplete() {
    const method = methodSelect.value;
    const headerNames = validHeaders[method] || [];
    const headerNamesDatalist = document.getElementById('headerNames');

    // Clear existing options
    headerNamesDatalist.innerHTML = '';

    // Create new options
    headerNames.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        headerNamesDatalist.appendChild(option);
    });

    // Update autocomplete for new header fields
    const headerNameInputs = Array.from(document.querySelectorAll('.header-name'));
    headerNameInputs.forEach(input => {
        input.setAttribute('list', 'headerNames');
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = urlInput.value;
    const method = methodSelect.value;

    const headers = {};
    const headerRows = Array.from(headersTable.querySelectorAll('tbody tr'));
    headerRows.forEach((row) => {
        const keyInput = row.querySelector('.header-key');
        const valueInput = row.querySelector('.header-value');
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        if (key !== '' && value !== '' && isValidHeader(method, key)) {
            headers[key] = value;
        }
    });

    let body = '';
    const selectedInputType = document.querySelector('input[name="bodyType"]:checked').value;
    if (selectedInputType === 'table') {
        body = parseBodyTable();
    } else if (selectedInputType === 'text') {
        body = bodyText.value;
    }

    const config = {
        method,
        url,
        headers,
        data: body
    };

    try {

        const response = await axios(config);

        displayRequest(config);
        displayResponse(response);
        displayResult(response.data);
    } catch (error) {
        console.error(error);
        resultContainer.textContent = 'Error occurred. Please check the console for details.';
    }
});


function displayRequest(request) {
    const { method, url, headers, data } = request;

    let requestText = `${method} ${url}\n\n`;

    requestText += 'Headers:\n';
    for (const [name, value] of Object.entries(headers)) {
        requestText += `${name}: ${value}\n`;
    }

    requestText += '\nRequest Body:\n';
    requestText += data;

    requestContainer.textContent = requestText;
}

function displayResponse(response) {
    const headers = response.headers;
    const data = response.data;

    let responseText = `Status: ${response.status} ${response.statusText}\n\n`;

    responseText += 'Headers:\n';
    for (const [name, value] of Object.entries(headers)) {
        responseText += `${name}: ${value}\n`;
    }

    responseText += '\nResponse Body:\n';
    responseText += JSON.stringify(data, null, 2);

    responseContainer.textContent = responseText;
}

function displayResult(data) {
    resultContainer.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.srcdoc = data;
    iframe.style.width = '100%';
    iframe.style.height = '500px';

    resultContainer.appendChild(iframe);
}




function parseBodyTable() {
    const bodyData = [];
    const rows = Array.from(bodyTable.querySelectorAll('tbody tr'));
    rows.forEach((row) => {
        const nameInput = row.querySelector('.body-name');
        const valueInput = row.querySelector('.body-value');
        const name = nameInput.value.trim();
        const value = valueInput.value.trim();
        if (name !== '' && value !== '') {
            bodyData.push({ name, value });
        }
    });
    return JSON.stringify(bodyData);
}

function parseHeaders() {
    const headers = {};

    const rows = Array.from(headersTable.querySelectorAll('tbody tr'));
    rows.forEach((row) => {
        const nameInput = row.querySelector('.header-name');
        const valueInput = row.querySelector('.header-value');

        const name = nameInput.value.trim();
        const value = valueInput.value.trim();

        if (name !== '' && value !== '' && isValidHeader(methodSelect.value, name)) {
            headers[name] = value;
        }
    });

    return headers;
}





function displayError(error) {
    responseContainer.textContent = `Error: ${error.message}`;
}

function removeHeaderRow(row) {
    const tbody = headersTable.querySelector('tbody');
    tbody.removeChild(row);
}

function addHeaderRow() {
    const tbody = headersTable.querySelector('tbody');
    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'header-name';
    nameInput.placeholder = 'Name';
    nameCell.appendChild(nameInput);
    newRow.appendChild(nameCell);

    const valueCell = document.createElement('td');
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.className = 'header-value';
    valueInput.placeholder = 'Value';
    valueCell.appendChild(valueInput);
    newRow.appendChild(valueCell);

    const controlsCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '-';
    removeButton.onclick = () => removeHeaderRow(newRow);
    controlsCell.appendChild(removeButton);
    newRow.appendChild(controlsCell);

    tbody.appendChild(newRow);

    updateHeaderAutocomplete(); // Обновляем автозаполнение после добавления нового поля заголовка

    // Очищаем недопустимые заголовки
    const headerNameInputs = Array.from(document.querySelectorAll('.header-name'));
    headerNameInputs.forEach(input => {
        input.value = '';
    });
}



// Initialize header autocomplete based on the default method
updateHeaderAutocomplete();