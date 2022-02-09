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

            Console.WriteLine(JsonConvert.SerializeObject(await PersonalAccountRequests.Login("ipz204_vvyu", "665989")));
            //IEnumerable<string> cookie = JsonConvert.DeserializeObject<IEnumerable<string>>("[\"_identity-frontend=e419eaf1b472feb2a93a9cace5a3c919d64ed8d5d19bf4d9a874522e7253e523a%3A2%3A%7Bi%3A0%3Bs%3A18%3A%22_identity-frontend%22%3Bi%3A1%3Bs%3A17%3A%22%5B6031%2C%22%22%2C2592000%5D%22%3B%7D; expires=Fri, 11-Mar-2022 16:55:31 GMT; Max-Age=2592000; path=/; HttpOnly\"]");
            //Console.WriteLine(JsonConvert.SerializeObject(await PersonalAccountRequests.GetScheduleWithLinksForToday(cookie, "ІПЗ-20-4", 1))); ;
        }
    }
}
