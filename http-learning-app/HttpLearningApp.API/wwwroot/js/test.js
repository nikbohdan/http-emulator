const form = document.getElementById('requestForm');
const urlInput = document.getElementById('urlInput');
const methodSelect = document.getElementById('methodSelect');
const headersTable = document.getElementById('headersTable');

const bodyInputType = document.getElementById('bodyInputType');
const bodyTable = document.getElementById('bodyTable');
const bodyText = document.getElementById('bodyText');
const requestContainer = document.getElementById('requestContainer');
const responseContainer = document.getElementById('responseContainer');
const responsePreContainer = document.getElementById('responsePreContainer');
const requestViewContainer = document.getElementById('requestViewContainer');
const requestViewPreContainer = document.getElementById('requestViewPreContainer');
const toggleButton = document.getElementById('toggle');
const urlSelect = document.getElementById('urlSelect');
// При нажатии на кнопку окно выдвигается или скрывается, кнопка перемещается
var helpButton = document.querySelector('.help-button');
var helpWindow = document.querySelector('.help-window');
var leftSection = document.querySelector('.left-section');
var isOpen = false; // Флаг для отслеживания состояния окна

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


var httpStatusCodes = {
    100: "Continue - The server has received the initial part of the request and is waiting for the client to send the remaining parts.",
    101: "Switching Protocols - The server is changing protocols according to the client's request.",
    200: "OK - The request has succeeded. The response depends on the request method.",
    201: "Created - The request has been fulfilled, and a new resource is created as a result.",
    202: "Accepted - The request has been accepted for processing, but the processing has not been completed yet.",
    203: "Non-Authoritative Information - The server successfully processed the request, but is returning information from a different source.",
    204: "No Content - The server successfully processed the request, but there is no content to send back.",
    205: "Reset Content - The server successfully processed the request, and the user agent should reset the document view.",
    206: "Partial Content - The server is delivering only part of the resource due to a range header sent by the client.",
    300: "Multiple Choices - The requested resource has multiple choices, each with different locations.",
    301: "Moved Permanently - The requested resource has been permanently moved to a new location.",
    302: "Found - The requested resource has been temporarily moved to a different location.",
    303: "See Other - The response to the request can be found under a different URI.",
    304: "Not Modified - The client can use the cached version of the requested resource.",
    307: "Temporary Redirect - The requested resource has been temporarily moved to a different location.",
    308: "Permanent Redirect - The requested resource has been permanently moved to a different location.",
    400: "Bad Request - The server could not understand the request due to malformed syntax or invalid data.",
    401: "Unauthorized - The client must authenticate itself to get the requested response.",
    402: "Payment Required - Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme.",
    403: "Forbidden - The client does not have permission to access the requested resource.",
    404: "Not Found - The server could not find the requested resource.",
    405: "Method Not Allowed - The method specified in the request is not allowed for the resource.",
    406: "Not Acceptable - The server cannot generate a response that matches the list of acceptable values defined in the request's headers.",
    407: "Proxy Authentication Required - The client must authenticate itself with the proxy.",
    408: "Request Timeout - The server timed out waiting for the request.",
    409: "Conflict - The request could not be completed due to a conflict with the current state of the resource.",
    410: "Gone - The requested resource is no longer available and has been permanently removed.",
    411: "Length Required - The server requires a valid 'Content-Length' header to be specified in the request.",
    412: "Precondition Failed - The precondition given in the request evaluated to false by the server.",
    413: "Payload Too Large - The request entity is larger than the server is willing or able to process.",
    414: "URI Too Long - The request URI exceeds the maximum length allowed by the server.",
    415: "Unsupported Media Type - The server does not support the media type used in the request.",
    416: "Range Not Satisfiable - The requested range cannot be fulfilled by the server.",
    417: "Expectation Failed - The server cannot meet the requirements specified in the Expect request header.",
    422: "Unprocessable Entity - The request was well-formed but unable to be followed due to semantic errors.",
    429: "Too Many Requests - The user has sent too many requests in a given amount of time.",
    500: "Internal Server Error - The server encountered an unexpected condition that prevented it from fulfilling the request.",
    501: "Not Implemented - The server does not support the functionality required to fulfill the request.",
    502: "Bad Gateway - The server, while acting as a gateway or proxy, received an invalid response from an upstream server.",
    503: "Service Unavailable - The server is currently unable to handle the request due to a temporary overload or maintenance of the server.",
    504: "Gateway Timeout - The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.",
    505: "HTTP Version Not Supported - The server does not support the HTTP protocol version used in the request.",
};

console.log(httpStatusCodes);


helpButton.addEventListener('click', function () {
    isOpen = !isOpen; // Инвертируем состояние окна

    if (isOpen) {
        helpWindow.style.transform = 'translateX(0)';
        helpButton.style.right = 'calc(33.33% - 70px)'; /* При открытии окна кнопка перемещается вместе с ним */
        leftSection.style.width = 'calc(67% - 40px)'; /* При открытии окна левая часть сдвигается и занимает 2/3 экрана */
    } else {
        helpWindow.style.transform = 'translateX(100%)';
        helpButton.style.right = '-35px'; /* При закрытии окна кнопка возвращается к правому краю без отступа */
        leftSection.style.width = '95%'; /* При закрытии окна левая часть возвращается к 100% ширины экрана */
    }
});

// Функция для обновления информации о методе
function updateMethodInfo(method) {
    let theory = '';

    switch (method) {
        case 'GET':
            theory = 'Метод GET використовується для отримання ресурсів з сервера. Зазвичай, при використанні методу GET, дані запиту передаються у рядку запиту (query string) в URL-адресі. Метод GET не передає дані через тіло запиту (request body) і використовується для запиту ресурсів без внесення змін на сервері. Такий запит може бути кешованим браузером.';
            break;
        case 'POST':
            theory = 'Метод POST використовується для надсилання даних на сервер для обробки. У відмінність від методу GET, дані запиту в методі POST передаються через тіло запиту (request body) і не відображаються у URL-адресі. Цей метод зазвичай використовується для створення нових ресурсів на сервері або виконання дій, що змінюють стан існуючих ресурсів.';
            break;
        case 'PUT':
            theory = 'Метод PUT використовується для оновлення існуючого ресурсу на сервері. Він також передає дані через тіло запиту, подібно до методу POST. Основна відмінність між методами PUT і POST полягає в тому, що метод PUT є ідемпотентним. Це означає, що при кількох послідовних ідентичних запитах PUT стан ресурсу на сервері не змінюється після першого виконання запиту.';
            break;
        case 'DELETE':
            theory = 'Метод DELETE використовується для видалення ресурсу на сервері. Він вказує серверу, що потрібно видалити вказаний ресурс. Запит DELETE також може містити дані в тілі запиту, які допомагають серверу здійснити видалення. Як і метод PUT, метод DELETE також є ідемпотентним. Це означає, що при кількох послідовних ідентичних запитах DELETE стан сервера не змінюється після першого виконання запиту.';
            break;
        default:
            theory = 'Інформація про обраний метод';
            break;
    }
    helpWindow.textContent = theory;
    helpWindow.style.backgroundColor = "WhiteSmoke";
}

// Устанавливаем информацию о методе GET по умолчанию
updateMethodInfo('GET');

// Обработчик события для обновления информации при изменении выбранного метода
methodSelect.addEventListener('change', function () {
    const selectedMethod = this.value;
    updateMethodInfo(selectedMethod);

    // Clear the headers table and add a default row on page load
    clearHeadersTable();
    updateHeaderAutocomplete();
});

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

    //if (header === 'Content-Type') {
    //    const headerValues = document.getElementById('headerValues');

    //    // Clear existing options
    //    headerValues.innerHTML = '';

    //    // Define suggested values for "Content-Type"
    //    const contentTypes = ['application/json', 'application/xml', 'application/x-www-form-urlencoded', 'text/plain'];

    //    // Create new options
    //    contentTypes.forEach(contentType => {
    //        const option = document.createElement('option');
    //        option.value = contentType;
    //        headerValues.appendChild(option);
    //    });
    //}
}

function clearHeadersTable() {
    const tbody = headersTable.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    // Удаляем все строки, начиная со второй
    for (let i = 1; i < rows.length; i++) {
        rows[i].remove();
    }

    // Очищаем значения первой строки
    const defaultRow = rows[0];
    const nameInput = defaultRow.querySelector('.header-name');
    const valueInput = defaultRow.querySelector('.header-value');
    nameInput.value = '';
    valueInput.value = '';
    updateHeaderAutocomplete();
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
    nameInput.setAttribute('onchange', 'updateHeaderValueAutocomplete(this)');
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
}

function updateHeaderValueAutocomplete(input) {
    const selectedHeader = input.value;
    const row = input.closest('tr');
    const valueInput = row.querySelector('.header-value');
    const headerValues = document.getElementById('headerValues');

    // Clear existing options
    headerValues.innerHTML = '';

    if (selectedHeader === 'Content-Type') {
        // Define suggested values for "Content-Type"
        const contentTypes = ['application/json', 'application/xml', 'application/x-www-form-urlencoded', 'text/plain'];

        // Create new options
        contentTypes.forEach(contentType => {
            const option = document.createElement('option');
            option.value = contentType;
            headerValues.appendChild(option);
        });
    }

    // Update autocomplete for value input field
    valueInput.setAttribute('list', 'headerValues');
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

    removeAllChildNodes(requestViewContainer);
    requestViewPreContainer.textContent = "";

    const config = {
        method,
        url,
        headers,
        data: body
    };

    try {
        const response = await axios(config);

        displayRequest(config);
        displayRequestView(response);
        displayResponse(response);
        displayResult(response.data);
    } catch (error) {
        if (error.response !== null && error.response !== undefined) {
            displayRequest(config);
            displayError(error);
        }
        
        //console.error(error);

        //requestContainer.textContent = 'Error occurred. Please check the console for details.';
        //responseContainer.textContent = 'Error occurred. Please check the console for details.';
        //resultContainer.textContent = 'Error occurred. Please check the console for details.';
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

function displayRequestView(response) {
    removeAllChildNodes(requestViewContainer);

    const data = response.data.requestDetails;

    for (const [name, value] of Object.entries(data)) {
        if (name.toLowerCase() == 'headers') {
            addHeadersTable(requestViewContainer, value);
            continue;
        }
        if (name.toLowerCase() == 'body') {
            //let bodyText = 'Body:\n'
            //bodyText += JSON.stringify(value, null, 2);
            //responsePreContainer.textContent = bodyText;
            displayBody(value, requestViewPreContainer);
            continue;
        }

        let textNode = document.createTextNode(`${name}: ${JSON.stringify(value, null, 2)}`);
        requestViewContainer.appendChild(textNode);
        addNewLine(requestViewContainer);
    }
}

function displayBody(value, preContainer) {
    if (value !== null && value !== "") {
        let bodyText = 'Body:\n'
        bodyText += JSON.stringify(value, null, 2);
        preContainer.textContent = bodyText;
    } else {
        preContainer.textContent = "";
    }
}

function displayResponse(response) {
    removeAllChildNodes(responseContainer);

    const headers = response.headers;
    const data = response.data.data;


    let statusTextNode = document.createTextNode(`Status: ${response.status} ${response.statusText} `);
    const infoIcon = document.createElement('i');
    infoIcon.className = 'fa fa-question-circle';
    infoIcon.title = httpStatusCodes[response.status];
    responseContainer.appendChild(statusTextNode);
    responseContainer.appendChild(infoIcon);
    addNewLine(responseContainer);


    let headersTextNode = document.createTextNode('Headers:');
    responseContainer.appendChild(headersTextNode);
    addNewLine(responseContainer);

    addHeadersTable(responseContainer, headers);

    //let responseBodyTextNode = document.createTextNode('Response Body:');
    //responseContainer.appendChild(responseBodyTextNode);
    displayBody(value, responsePreContainer);
    //let bodyText = 'Body:\n'
    //bodyText += JSON.stringify(data, null, 2);
    //responsePreContainer.textContent = bodyText;

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
    removeAllChildNodes(responseContainer);

    let response = error.response;
    let statusTextNode = document.createTextNode(`Status: ${response.status} ${response.statusText} `);
    const infoIcon = document.createElement('i');
    infoIcon.className = 'fa fa-question-circle';
    infoIcon.title = httpStatusCodes[response.status];
    responseContainer.appendChild(statusTextNode);
    responseContainer.appendChild(infoIcon);
    addNewLine(responseContainer);

    let headersTextNode = document.createTextNode('Headers:');
    responseContainer.appendChild(headersTextNode);
    addNewLine(responseContainer);

    addHeadersTable(responseContainer, response.headers);

    if (response.data !== null && response.data !== "") {
        let errorText = 'Data:\n'
        errorText += JSON.stringify(response.data, null, 2);
        responsePreContainer.textContent = errorText;
    } else {
        responsePreContainer.textContent = "";
    }
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

// Initialize header autocomplete based on the default method
updateHeaderAutocomplete();