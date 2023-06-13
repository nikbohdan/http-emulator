using Microsoft.AspNetCore.Http;

namespace HttpLearningApp.Utils.RequestDetailsHelper
{
    public interface IRequestDetailsService
    {
        Task<RequestDetails> GetRequestDetails(HttpRequest request);
    }
}
