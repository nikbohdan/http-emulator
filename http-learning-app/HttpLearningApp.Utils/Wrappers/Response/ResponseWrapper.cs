using HttpLearningApp.Utils.RequestDetailsHelper;

namespace HttpLearningApp.Utils.Wrappers.Response
{
    public class ResponseWrapper<T>
    {
        public ResponseWrapper(T data, RequestDetails requestDetails, bool succeeded = true)
        {
            this.RequestDetails = requestDetails;
            this.Data = data;
            this.Succeeded = succeeded;
        }     
        
        public ResponseWrapper(RequestDetails requestDetails, bool succeeded = true)
        {
            this.RequestDetails = requestDetails;
            this.Succeeded = succeeded;
        }

        public T? Data { get; set; }

        public RequestDetails RequestDetails { get; set; }

        public bool Succeeded { get; set; }

    }
}
