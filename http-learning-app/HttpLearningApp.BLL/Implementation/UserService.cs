using AutoMapper;
using HttpLearningApp.BLL.Interfaces;
using HttpLearningApp.Domain.DTOs;
using HttpLearningApp.Domain.Entities;
using HttpLearningApp.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HttpLearningApp.BLL.Implementation
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<User> userRepository;
        private readonly IMapper mapper;

        public UserService(IGenericRepository<User> userRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public async Task<int> AddUserAsync(AddUserDTO userDTO)
        {
            if (await this.userRepository.Find().AnyAsync(user => user.Email == userDTO.Email))
            {
                throw new InvalidOperationException("User with this email already exist");
            }

            var user = this.mapper.Map<User>(userDTO);

            return await this.userRepository.CreateAsync(user);
        }

        public async Task<int> AddUserAsync(User user)
        {
            if (await this.userRepository.Find().AnyAsync(us => us.Email == user.Email))
            {
                throw new InvalidOperationException("User with this email already exist");
            }

            return await this.userRepository.CreateAsync(user);
        }

        public async Task DeleteUserAsync(int id)
        {
            await this.userRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await this.userRepository.FindAsync();
        }

        public async Task<bool> UserExist(int id)
        {
            return await this.userRepository.Find().AnyAsync(user => user.Id == id);
        }

        public async Task<User?> GetUserAsync(int id)
        {
            return await this.userRepository.GetByIdAsync(id);
        }

        public async Task UpdateUserAsync(User user)
        {
            await this.userRepository.UpdateAsync(user);
        }
    }
}
