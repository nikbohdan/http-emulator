using HttpLearningApp.Domain.DTOs;
using HttpLearningApp.Domain.Entities;

namespace HttpLearningApp.Domain.Interfaces.Services
{
    public interface IUserService
    {
        Task<int> AddUserAsync(AddUserDTO userDTO);

        Task<int> AddUserAsync(User user);

        Task UpdateUserAsync(User user);

        Task DeleteUserAsync(int id);

        Task<User?> GetUserAsync(int id);

        Task<IEnumerable<User>> GetAllUsersAsync();

        Task<bool> UserExist(int id);
    }
}
