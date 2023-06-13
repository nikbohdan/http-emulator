using HttpLearningApp.Utils.RequestDetailsHelper;
using HttpLearningApp.Utils.Wrappers.Response;
using Microsoft.AspNetCore.Mvc;


namespace HttpLearningApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RequestDetailsController : ControllerBase
    {
        private readonly IRequestDetailsService requestDetailsService;

        public RequestDetailsController(IRequestDetailsService requestDetailsService)
        {
            this.requestDetailsService = requestDetailsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRequest()
        {
            var request = HttpContext.Request;
            request.EnableBuffering(); // Enables request body buffering

            var requestDetails = await this.requestDetailsService.GetRequestDetails(request);

            return Ok(new ResponseWrapper<object>(requestDetails));
            //var headers = request.Headers.ToDictionary(
            //    header => header.Key,
            //    header => header.Value.ToString());

            //var details = new
            //{
            //    Method = request.Method,
            //    Scheme = request.Scheme,
            //    Host = request.Host.Value,
            //    PathBase = request.PathBase.Value,
            //    Path = request.Path.Value,
            //    QueryString = request.QueryString.Value,
            //    Headers = headers
            //};

            //return new JsonResult(details);
        }

        [HttpPost]
        public async Task<IActionResult> PostRequest()
        {
            var request = HttpContext.Request;
            request.EnableBuffering(); // Enables request body buffering

            var requestDetails = await this.requestDetailsService.GetRequestDetails(request);

            return Ok(new ResponseWrapper<object>(requestDetails));

            //var headers = request.Headers.ToDictionary(
            //    header => header.Key,
            //    header => header.Value.ToString());

            //// Get the Content-Type of the request
            //var contentType = request.ContentType;

            //// Convert the request body to a string if it's a type we can handle
            //var body = string.Empty;
            //if (request.Body != null && contentType is "application/json" or "text/plain")
            //{
            //    using (var reader = new StreamReader(request.Body, Encoding.UTF8, true, 1024, true))
            //    {
            //        body = await reader.ReadToEndAsync();
            //    }

            //    // Rewind the request body stream position so it can be read again if needed
            //    request.Body.Position = 0;
            //}

            //object deserializedBody = null;
            //try
            //{
            //    if (contentType == "application/json")
            //    {
            //        deserializedBody = JsonConvert.DeserializeObject(body);
            //        deserializedBody = JsonConvert.SerializeObject(deserializedBody);
            //    }
            //    else if (contentType == "text/plain")
            //    {
            //        deserializedBody = body; // No deserialization needed for plain text
            //    }
            //    else if (contentType == "application/xml")
            //    {
            //        var xmlDocument = new XmlDocument();
            //        xmlDocument.LoadXml(body);
            //        deserializedBody = xmlDocument;
            //    }
            //    else if (contentType == "application/x-www-form-urlencoded")
            //    {
            //        var formCollection = await new FormReader(request.Body).ReadFormAsync();
            //        deserializedBody = formCollection.Keys.ToDictionary(k => k, k => formCollection[k].ToString());
            //    }
            //}
            //catch
            //{
            //    body = "Failed to read the request body.";
            //}

            //var details = new
            //{
            //    Method = request.Method,
            //    Scheme = request.Scheme,
            //    Host = request.Host.Value,
            //    PathBase = request.PathBase.Value,
            //    Path = request.Path.Value,
            //    QueryString = request.QueryString.Value,
            //    Headers = headers,
            //    ContentType = contentType,
            //    Body = deserializedBody ?? body
            //};

            //return new JsonResult(details);
        }
    }
}
