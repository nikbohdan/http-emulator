const uri = 'api/RequestDetails';
const form = document.getElementById('requestForm');
const urlInput = document.getElementById('urlInput');
const methodSelect = document.getElementById('methodSelect');
const headersTextarea = document.getElementById('headersTextarea');
const bodyTextarea = document.getElementById('bodyTextarea');
const requestContainer = document.getElementById('requestContainer');
const responseContainer = document.getElementById('responseContainer');
const resultContainer = document.getElementById('resultContainer');

const httpHeadersDictionary = {
    "accept": "Media type(s) that is/are acceptable for the response.",
    "accept-encoding": "List of acceptable encodings.",
    "authorization": "Authentication credentials for HTTP authentication.",
    "cache-control": "Directives for caching mechanisms.",
    "content-length": "The length of the request body in octets (8-bit bytes).",
    "content-type": "The Media type of the body of the request.",
    "date": "The date and time that the message was sent.",
    "host": "The domain name of the server (for virtual hosting), and the TCP port number on which the server is listening.",
    "user-agent": "The user agent string of the user agent."
    // Add more headers as needed
};



form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = urlInput.value;
    const method = methodSelect.value;
    const headers = parseHeaders(headersTextarea.value);
    const body = bodyTextarea.value;
    resultContainer.innerHTML = '';
    try {
        const request = {
            method,
            url,
            headers,
            data: body
        };

        displayRequest(request);

        const response = await axios(request);

        displayResponse(response);
        displayResult(response.data);
    } catch (error) {
        displayError(error);
    }
});

function parseHeaders(headersString) {
    const headers = {};

    if (headersString.trim() === '') {
        return headers;
    }

    const headerLines = headersString.split('\n');
    for (const line of headerLines) {
        const [name, value] = line.split(':');
        headers[name.trim()] = value.trim();
    }

    return headers;
}

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

function displayError(error) {
    responseContainer.textContent = `Error: ${error.message}`;
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