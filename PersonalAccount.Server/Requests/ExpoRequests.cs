using Newtonsoft.Json;

namespace PersonalAccount.Server.Requests
{
    public class ExpoRequests
    {
        public static readonly string BaseUrl = "https://api.expo.dev/v2/";
        public static readonly string SendPushUrl = BaseUrl + "push/send";

        private static HttpClient httpClient = new HttpClient();

        public static async Task SendPush(string toToken, string title, string body, object? data = null)
        {
            HttpResponseMessage sendPushResponse = await httpClient.PostAsJsonAsync(SendPushUrl, new
            {
                To = toToken,
                Title = title,
                Body = body,
                Data = data,
                Sound = "default",
            });
            string sendPushResponseText = await sendPushResponse.Content.ReadAsStringAsync();
        }
    }
}
