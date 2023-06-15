using HttpLearningApp.Domain.DTOs;
using HttpLearningApp.Domain.Entities;
using HttpLearningApp.Domain.Interfaces.Services;
using HttpLearningApp.Utils.RequestDetailsHelper;
using HttpLearningApp.Utils.Wrappers.Response;
using Microsoft.AspNetCore.Mvc;

namespace HttpLearningApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CrudController : Controller
    {
        private readonly IUserService userService;
        private readonly IRequestDetailsService requestDetailsService;

        public CrudController(IUserService userService, IRequestDetailsService requestDetailsService)
        {
            this.userService = userService;
            this.requestDetailsService = requestDetailsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUser([FromQuery] int id)
        {
            var request = HttpContext.Request;
            request.EnableBuffering(); // Enables request body buffering

            var requestDetails = await this.requestDetailsService.GetRequestDetails(request);

            var user = await this.userService.GetUserAsync(id);

            if (user == null)
            {
                return NotFound(new ResponseWrapper<object>(requestDetails, false));
            }

            return Ok(new ResponseWrapper<User>(user, requestDetails));
        }

       
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var request = HttpContext.Request;
            request.EnableBuffering(); // Enables request body buffering

            var requestDetails = await this.requestDetailsService.GetRequestDetails(request);

            var users = await this.userService.GetAllUsersAsync();

            return Ok(new ResponseWrapper<IEnumerable<User>>(users, requestDetails));
        }

        [HttpPost]
        public async Task<IActionResult> PostUser([FromBody] AddUserDTO addUserDTO)
        {
            var request = HttpContext.Request;
            request.EnableBuffering(); // Enables request body buffering

            var requestDetails = await this.requestDetailsService.GetRequestDetails(request);
            requestDetails.Body = addUserDTO;

            try
            {
                var createdUserId = await this.userService.AddUserAsync(addUserDTO);
                var uri = $"/Crud/GetUser?id={createdUserId}";

                return Created(uri, new ResponseWrapper<int>(createdUserId, requestDetails));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ResponseWrapper<string>(ex.Message, requestDetails, false));
            }
        }

        [HttpPut]
        public async Task<IActionResult> PutUser([FromBody] User user)
        {
            var request = HttpContext.Request;
            request.EnableBuffering(); // Enables request body buffering

            var requestDetails = await this.requestDetailsService.GetRequestDetails(request);
            requestDetails.Body = user;
            try
            {
                if (!await this.userService.UserExist(user.Id))
                {
                    var createdUserId = await this.userService.AddUserAsync(user);
                    var uri = $"/Crud/GetUser?id={createdUserId}";
                    return Created(uri, new ResponseWrapper<int>(createdUserId, requestDetails));
                }

                await this.userService.UpdateUserAsync(user);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseWrapper<string>(ex.Message, requestDetails, false));
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser([FromQuery] int id)
        {
            var request = HttpContext.Request;
            request.EnableBuffering(); // Enables request body buffering

            var requestDetails = await this.requestDetailsService.GetRequestDetails(request);

            if (!await this.userService.UserExist(id))
            {
                return NotFound(new ResponseWrapper<object>(requestDetails, false));
            }

            await this.userService.DeleteUserAsync(id);

            return NoContent();
        }
    }
}
