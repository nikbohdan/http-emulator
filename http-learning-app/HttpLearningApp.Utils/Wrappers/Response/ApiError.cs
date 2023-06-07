namespace HttpLearningApp.Utils.Wrappers.Response
{
    public class ApiError
    {
        public string Message { get; set; }

        public string Key { get; set; }

        public string Detail { get; set; }

        public ApiError(string key, string message)
        {
            this.Message = message;
            this.Key = key;
        }

        public ApiError(string message)
        {
            this.Message = message;
        }
    }
}