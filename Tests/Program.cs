using Newtonsoft.Json;
using PersonalAccount.Server.Requests;
using System;
using System.Text;
using System.Threading.Tasks;

namespace Tests
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.InputEncoding = Encoding.Unicode;
            Console.OutputEncoding = Encoding.Unicode;

            Console.WriteLine(JsonConvert.SerializeObject(await RozkladRequests.GetScheduleForTwoWeekAsync("ІПЗ-20-4", 1)));
        }
    }
}
