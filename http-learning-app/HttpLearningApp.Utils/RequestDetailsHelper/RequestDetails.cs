namespace HttpLearningApp.Utils.RequestDetailsHelper
{
    public class RequestDetails
    {
        public string Method { get; set; }

        public string Scheme { get; set; }

        public string Host { get; set; }

        public string PathBase { get; set; }

        public string Path { get; set; }

        public string QueryString { get; set; }

        public Dictionary<string, string> Headers { get; set; }

        public string ContentType { get; set; }

        public object Body { get; set; }

    }
}
