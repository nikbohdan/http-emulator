const uri = 'api/http';

async function getMessage() {
    const customHeaderValue = document.getElementById("customHeader").value; 

    const response = await fetch(`${uri}/GetMessage`,
        {
            method: 'GET',
            headers: {
                'Custom-Header': customHeaderValue
            }
        });

    const responseHeaders = Object.fromEntries(response.headers.entries());
    const bodyData = await response.json();

    console.dir(responseHeaders);
    console.dir(bodyData); 

    console.log(JSON.stringify(responseHeaders));
    console.log(JSON.stringify(bodyData));

    const responseHeadersElement = document.getElementById("responseHeaders");
    responseHeadersElement.innerHTML = "Response headers:\n" + JSON.stringify(responseHeaders);

    const requestHeadersElement = document.getElementById("requestHeaders");
    requestHeadersElement.innerHTML = "Request headers:\n" + JSON.stringify(bodyData);


}
