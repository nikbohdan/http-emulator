using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace http_learning_app.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HttpController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetMessage()
        {
            var headers = JsonSerializer.Serialize(HttpContext.Request.Headers);

            return Ok(headers);
        }
    }
}
