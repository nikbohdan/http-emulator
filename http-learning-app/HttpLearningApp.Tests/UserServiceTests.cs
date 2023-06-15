using AutoMapper;
using HttpLearningApp.BLL.Implementation;
using HttpLearningApp.Domain.Entities;
using HttpLearningApp.Domain.Interfaces.Repositories;
using Moq;

namespace HttpLearningApp.Tests
{
    public class UserServiceTests
    {
        [Fact]
        public async Task GetUserAsync_WhenUserExists_ShouldReturnUser()
        {
            // Arrange
            var userId = 1;
            var userRepositoryMock = new Mock<IGenericRepository<User>>();
            var mapperMock = new Mock<IMapper>();
            var userService = new UserService(userRepositoryMock.Object, mapperMock.Object);

            var user = new User { Id = userId, Name = "John Doe", Email = "john@example.com" };

            userRepositoryMock.Setup(repo => repo.GetByIdAsync(
                    userId,
                    null, // Optional include parameter
                    true  // Optional disableTracking parameter
                ))
                .ReturnsAsync(user);

            // Act
            var result = await userService.GetUserAsync(userId);

            // Assert
            Assert.Equal(user, result);
            userRepositoryMock.Verify(repo => repo.GetByIdAsync(userId, null, true), Times.Once);
        }



        [Fact]
        public async Task DeleteUserAsync_WhenUserExists_ShouldDeleteUser()
        {
            // Arrange
            var userId = 1;
            var userRepositoryMock = new Mock<IGenericRepository<User>>();
            var mapperMock = new Mock<IMapper>();
            var userService = new UserService(userRepositoryMock.Object, mapperMock.Object);

            userRepositoryMock.Setup(repo => repo.DeleteAsync(userId))
                .Returns(Task.CompletedTask);

            // Act
            await userService.DeleteUserAsync(userId);

            // Assert
            userRepositoryMock.Verify(repo => repo.DeleteAsync(userId), Times.Once);
        }


        [Fact]
        public async Task GetAllUsersAsync_ShouldReturnAllUsers()
        {
            // Arrange
            var users = new List<User>
            {
                new() { Id = 1, Name = "John Doe", Email = "john@example.com" },
                new() { Id = 2, Name = "Jane Smith", Email = "jane@example.com" },
                new() { Id = 3, Name = "Alice Johnson", Email = "alice@example.com" }
            };

            var userRepositoryMock = new Mock<IGenericRepository<User>>();
            var mapperMock = new Mock<IMapper>();
            var userService = new UserService(userRepositoryMock.Object, mapperMock.Object);

            userRepositoryMock.Setup(repo => repo.FindAsync())
                .ReturnsAsync(users);

            // Act
            var result = await userService.GetAllUsersAsync();

            // Assert
            Assert.Equal(users, result);
            userRepositoryMock.Verify(repo => repo.FindAsync(), Times.Once);
        }

    }
}