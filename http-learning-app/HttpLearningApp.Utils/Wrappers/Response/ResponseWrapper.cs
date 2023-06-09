namespace HttpLearningApp.Utils.Wrappers.Response
{
    public class ResponseWrapper<T>
    {
        public ResponseWrapper()
        {
        }

        public ResponseWrapper(T data)
        {
            this.Succeeded = true;
            this.Data = data;
        }

        public ResponseWrapper(ApiError apiError)
        {
            this.Succeeded = false;
            this.ApiError = apiError;
        }

        public T Data { get; set; }

        public bool Succeeded { get; set; }

        public ApiError ApiError { get; set; }
    }
}
