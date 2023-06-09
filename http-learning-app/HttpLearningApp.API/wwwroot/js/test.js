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
const toggleButton = document.getElementById('toggle');
const urlSelect = document.getElementById('urlSelect');

const httpHeadersDictionary = {
    "accept": "Media type(s) that is/are acceptable for the response.",
    "accept-charset": "Character sets that are acceptable.",
    "accept-encoding": "List of acceptable encodings.",
    "accept-language": "List of acceptable human languages for response.",
    "accept-datetime": "Acceptable version in time.",
    "access-control-request-method": "Used when issuing a preflight request to let the server know what HTTP method will be used.",
    "access-control-request-headers": "Used when issuing a preflight request to let the server know what HTTP headers will be used.",
    "authorization": "Authentication credentials for HTTP authentication.",
    "cache-control": "Directives for caching mechanisms in both requests and responses.",
    "connection": "Control options for the current connection and list of hop-by-hop response fields.",
    "content-length": "The size of the entity-body, in decimal number of octets, sent to the recipient.",
    "content-md5": "An MD5 sum of the entity-body for the purpose of providing an end-to-end message integrity check.",
    "content-type": "The Media type of the body of the request (used with POST and PUT requests).",
    "cookie": "An HTTP cookie previously sent by the server with Set-Cookie (below).",
    "date": "The date and time that the message was originated.",
    "expect": "Indicates that particular server behaviors are required by the client.",
    "forwarded": "Disclose original information of a client connecting to a web server through an HTTP proxy.",
    "from": "The email address of the user making the request.",
    "host": "The domain name of the server (for virtual hosting), and the TCP port number on which the server is listening.",
    "if-match": "Only perform the action if the client supplied entity matches the same entity on the server.",
    "if-modified-since": "Allows a 304 Not Modified to be returned if content is unchanged.",
    "if-none-match": "Allows a 304 Not Modified to be returned if content is unchanged.",
    "if-range": "If the entity is unchanged, send me the part(s) that I am missing; otherwise, send me the entire new entity.",
    "if-unmodified-since": "Only send the response if the entity has not been modified since a specific time.",
    "max-forwards": "Limit the number of times the message can be forwarded through proxies or gateways.",
    "origin": "Initiates a request for cross-origin resource sharing with Origin.",
    "pragma": "Implementation-specific fields that may have various effects anywhere along the request-response chain.",
    "proxy-authorization": "Authorization credentials for connecting to a proxy.",
    "range": "Request only part of an entity.",
    "referer": "This is the address of the previous web page from which a link to the currently requested page was followed.",
    "te": "The transfer encodings the user agent is willing to accept.",
    "user-agent": "The user agent string of the user agent.",
    "upgrade": "Ask the server to upgrade to another protocol.",
    "via": "Informs the server of proxies through which the request was sent.",
    "warning": "A general warning about possible problems with the entity body."
    // Add more headers as needed
};

// Обработчик события изменения типа ввода для URL
toggleButton.addEventListener('change', function () {
    if (toggleButton.checked) {
        urlSelect.style.display = 'block';
        urlInput.style.display = 'none';
    } else {
        urlSelect.style.display = 'none';
        urlInput.style.display = 'block';
    }
});


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

function parseBodyTable() {
    const bodyData = {};
    const tbody = bodyTable ? bodyTable.querySelector('tbody') : null;

    if (tbody) {
        const rows = Array.from(tbody.querySelectorAll('tr'));
        rows.forEach((row) => {
            const nameInput = row.querySelector('.body-name');
            const valueInput = row.querySelector('.body-value');
            const name = nameInput ? nameInput.value.trim() : '';
            const value = valueInput ? valueInput.value.trim() : '';
            if (name !== '' && value !== '') {
                bodyData[name] = value;
            }
        });
    }

    const params = new URLSearchParams(bodyData);
    return params.toString();
}



// Add event listener to the form
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = urlInput.value;
    const method = methodSelect.value;

    const headers = {};
    const headerRows = Array.from(headersTable.querySelectorAll('tbody tr'));
    headerRows.forEach((row) => {
        const nameInput = row.querySelector('.header-name');
        const valueInput = row.querySelector('.header-value');
        const name = nameInput.value.trim();
        const value = valueInput.value.trim();
        if (name !== '' && value !== '' && isValidHeader(method, name)) {
            headers[name] = value;

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

    // Check if the data is JSON and format it accordingly
    if (typeof data === 'object') {
        requestText += decodeURIComponent(parseBodyTable());

    } else {
        requestText += data;
    }

    requestContainer.textContent = requestText;
}

function displayResponse(response) {
    removeAllChildNodes(responseContainer);

    const headers = response.headers;
    const data = response.data;


    let statusTextNode = document.createTextNode(`Status: ${response.status} ${response.statusText}`);
    responseContainer.appendChild(statusTextNode);
    addNewLine(responseContainer);


    let headersTextNode = document.createTextNode('Headers:');
    responseContainer.appendChild(headersTextNode);
    addNewLine(responseContainer);

    addHeadersTable(responseContainer, headers);

    let responseBodyTextNode = document.createTextNode('Response Body:');
    responseContainer.appendChild(responseBodyTextNode);
    addNewLine(responseContainer);

    for (const [name, value] of Object.entries(data)) {
        if (name.toLowerCase() == 'headers') {
            addHeadersTable(responseContainer, value);
            continue;
        }

        let textNode = document.createTextNode(`${name}: ${JSON.stringify(value, null, 2)}`);
        responseContainer.appendChild(textNode);
        addNewLine(responseContainer);
    }
}

function displayResult(data) {
    resultContainer.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.srcdoc = data;
    iframe.style.width = '100%';
    iframe.style.height = '500px';

    resultContainer.appendChild(iframe);
}



function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function addNewLine(container) {
    var br = document.createElement("span");
    br.innerHTML = "<br/>";
    container.appendChild(br);
}

function addHeadersTable(container, headers) {
    // Create a table and add styles
    const headersTable = document.createElement('table');
    headersTable.style.width = '100%';
    headersTable.style.borderCollapse = 'collapse';

    // For each header, create a new row in the table
    for (const [name, value] of Object.entries(headers)) {
        const row = headersTable.insertRow();

        // Insert a cell for the header name and add styles
        const nameCell = row.insertCell();
        nameCell.style.border = '1px solid black';
        nameCell.style.padding = '5px';

        // If the header is in the dictionary, add an info icon with the description as the title
        if (name.toLowerCase() in httpHeadersDictionary) {
            const infoIcon = document.createElement('i');
            infoIcon.className = 'fa fa-question-circle';
            infoIcon.title = httpHeadersDictionary[name.toLowerCase()];
            nameCell.appendChild(document.createTextNode(name + ' '));
            nameCell.appendChild(infoIcon);
        }
        else {
            nameCell.textContent = name;
        }

        // Insert a cell for the header value and add styles
        const valueCell = row.insertCell();
        valueCell.textContent = value;
        valueCell.style.border = '1px solid black';
        valueCell.style.padding = '5px';
    }

    // Add the created table to your container
    container.appendChild(headersTable);
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
    nameInput.setAttribute('list', 'headerNames'); // Set the datalist ID for autocomplete
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

    // Update autocomplete for new header fields
    const headerNamesDatalist = document.getElementById('headerNames');
    const headerNameInputs = Array.from(document.querySelectorAll('.header-name'));
    headerNameInputs.forEach(input => {
        input.setAttribute('list', 'headerNames');
    });

    // Update autocomplete options for new headers
    const method = methodSelect.value;
    const headerNames = validHeaders[method] || [];
    headerNamesDatalist.innerHTML = '';
    headerNames.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        headerNamesDatalist.appendChild(option);
    });
}





// Initialize header autocomplete based on the default method
updateHeaderAutocomplete();