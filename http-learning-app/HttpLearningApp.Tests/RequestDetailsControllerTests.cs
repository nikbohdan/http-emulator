using HttpLearningApp.API.Controllers;
using HttpLearningApp.Utils.RequestDetailsHelper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Moq;

namespace HttpLearningApp.Tests
{
    public class RequestDetailsControllerTests
    {
        private readonly Mock<IRequestDetailsService> requestDetailsServiceMock;
        private readonly RequestDetailsController controller;

        public RequestDetailsControllerTests()
        {
            requestDetailsServiceMock = new Mock<IRequestDetailsService>();
            controller = new RequestDetailsController(requestDetailsServiceMock.Object);
        }

        [Fact]
        public async Task GetRequest_WhenCalled_ReturnsOkResult()
        {
            // Arrange
            var httpRequestMock = new Mock<HttpRequest>();
            httpRequestMock.SetupGet(r => r.Headers)
                .Returns(new HeaderDictionary(new Dictionary<string, StringValues>()));
            httpRequestMock.SetupGet(r => r.ContentType)
                .Returns("application/json");
            httpRequestMock.SetupGet(r => r.Body)
                .Returns(new MemoryStream());

            requestDetailsServiceMock.Setup(service => service.GetRequestDetails(httpRequestMock.Object))
                .ReturnsAsync(new RequestDetails());

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.SetupGet(c => c.Request)
                .Returns(httpRequestMock.Object);

            var controllerContext = new ControllerContext()
            {
                HttpContext = httpContextMock.Object
            };
            controller.ControllerContext = controllerContext;

            // Act
            var result = await controller.GetRequest();

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task PostRequest_WhenCalled_ReturnsOkResult()
        {
            // Arrange
            var httpRequestMock = new Mock<HttpRequest>();
            httpRequestMock.SetupGet(r => r.Headers)
                .Returns(new HeaderDictionary(new Dictionary<string, StringValues>()));
            httpRequestMock.SetupGet(r => r.ContentType)
                .Returns("application/json");
            httpRequestMock.SetupGet(r => r.Body)
                .Returns(new MemoryStream());

            requestDetailsServiceMock.Setup(service => service.GetRequestDetails(httpRequestMock.Object))
                .ReturnsAsync(new RequestDetails());

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.SetupGet(c => c.Request)
                .Returns(httpRequestMock.Object);

            var controllerContext = new ControllerContext()
            {
                HttpContext = httpContextMock.Object
            };
            controller.ControllerContext = controllerContext;

            // Act
            var result = await controller.PostRequest();

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }

}
