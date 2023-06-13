using HttpLearningApp.Utils.RequestDetailsHelper;

namespace HttpLearningApp.Utils.Wrappers.Response
{
    public class ResponseWrapper<T>
    {
        public ResponseWrapper()
        {
        }

        public ResponseWrapper(T data, RequestDetails requestDetails)
        {
            this.RequestDetails = requestDetails;
            this.Data = data;
        }     
        
        public ResponseWrapper(RequestDetails requestDetails)
        {
            this.RequestDetails = requestDetails;
        }

        //public ResponseWrapper(ApiError apiError)
        //{
        //    this.Succeeded = false;
        //    this.ApiError = apiError;
        //}

        public T? Data { get; set; }

        public RequestDetails RequestDetails { get; set; }

        //public bool Succeeded { get; set; }

        //public ApiError ApiError { get; set; }
    }
}
