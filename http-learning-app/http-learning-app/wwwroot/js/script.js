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