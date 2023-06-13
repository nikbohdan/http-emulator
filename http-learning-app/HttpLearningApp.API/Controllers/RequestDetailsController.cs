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
        }

        [HttpPost]
        public async Task<IActionResult> PostRequest()
        {
            var request = HttpContext.Request;
            request.EnableBuffering(); // Enables request body buffering

            var requestDetails = await this.requestDetailsService.GetRequestDetails(request);

            return Ok(new ResponseWrapper<object>(requestDetails));
        }
    }
}
