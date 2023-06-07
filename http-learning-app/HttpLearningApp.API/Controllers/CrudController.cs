using HttpLearningApp.BLL.Interfaces;
using HttpLearningApp.Domain.DTOs;
using HttpLearningApp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace HttpLearningApp.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CrudController : Controller
    {
        private readonly IUserService userService;

        public CrudController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUser([FromQuery] int id)
        {
            var user = await this.userService.GetUserAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await this.userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> PostUser([FromBody] AddUserDTO addUserDTO)
        {
            try
            {
                var createdUserId = await this.userService.AddUserAsync(addUserDTO);
                var uri = $"/Crud/GetUser/{createdUserId}";
                return Created(uri , createdUserId);
            }
            catch (InvalidOperationException ex)
            {
                ModelState.AddModelError("Id", ex.Message);
                return BadRequest(ModelState);
            }
        }

        [HttpPut]
        public async Task<IActionResult> PutUser([FromBody] User user)
        {

            var dbUser = await this.userService.GetUserAsync(user.Id);
            if (dbUser == null)
            {
                var createdUserId = await this.userService.AddUserAsync(user);
                var uri = $"/Crud/GetUser/{createdUserId}";
                return Created(uri, createdUserId);
            }

            await this.userService.UpdateUserAsync(user);
            return NoContent();

        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser([FromQuery] int id)
        {
            if (!await this.userService.UserExist(id))
            {
                return NotFound();
            }

            await this.userService.DeleteUserAsync(id);

            return NoContent();
        }
    }
}
