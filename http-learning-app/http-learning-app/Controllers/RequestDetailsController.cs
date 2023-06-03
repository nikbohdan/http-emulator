using System.Text;
using System.Xml;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;


namespace http_learning_app.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RequestDetailsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetRequest()
        {
            var request = HttpContext.Request;

            var headers = request.Headers.ToDictionary(
                h => h.Key,
                h => h.Value.ToString());

            var details = new
            {
                Method = request.Method,
                Scheme = request.Scheme,
                Host = request.Host.Value,
                PathBase = request.PathBase.Value,
                Path = request.Path.Value,
                QueryString = request.QueryString.Value,
                Headers = headers
            };

            return new JsonResult(details);
        }

        [HttpPost]
        public async Task<IActionResult> PostRequest()
        {
            var request = HttpContext.Request;
            request.EnableBuffering(); // Enables request body buffering

            var headers = request.Headers.ToDictionary(
                h => h.Key,
                h => h.Value.ToString());

            // Get the Content-Type of the request
            var contentType = request.ContentType;

            // Convert the request body to a string if it's a type we can handle
            var body = string.Empty;
            if (request.Body != null && contentType is "application/json" or "text/plain")
            {
                using (var reader = new StreamReader(request.Body, Encoding.UTF8, true, 1024, true))
                {
                    body = await reader.ReadToEndAsync();
                }

                // Rewind the request body stream position so it can be read again if needed
                request.Body.Position = 0;
            }

            object deserializedBody = null;
            try
            {
                if (contentType == "application/json")
                {
                    deserializedBody = JsonConvert.DeserializeObject(body);
                }
                else if (contentType == "text/plain")
                {
                    deserializedBody = body; // No deserialization needed for plain text
                }
                else if (contentType == "application/xml")
                {
                    var xmlDocument = new XmlDocument();
                    xmlDocument.LoadXml(body);
                    deserializedBody = xmlDocument;
                }
                else if (contentType == "application/x-www-form-urlencoded")
                {
                    var formCollection = await new FormReader(request.Body).ReadFormAsync();
                    deserializedBody = formCollection.Keys.ToDictionary(k => k, k => formCollection[k].ToString());
                }
            }
            catch
            {
                body = "Failed to read the request body.";
            }

            var details = new
            {
                Method = request.Method,
                Scheme = request.Scheme,
                Host = request.Host.Value,
                PathBase = request.PathBase.Value,
                Path = request.Path.Value,
                QueryString = request.QueryString.Value,
                Headers = headers,
                ContentType = contentType,
                Body = deserializedBody ?? body
            };

            return new JsonResult(details);
        }
    }
}
