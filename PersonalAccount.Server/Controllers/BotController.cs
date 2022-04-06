using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

namespace PersonalAccount.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BotController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] object update)
        {
            Update update1 = JsonConvert.DeserializeObject<Update>(JsonConvert.SerializeObject(update));
            Console.WriteLine(JsonConvert.SerializeObject(update1));
            TelegramBotClient client = new TelegramBotClient("5066389819:AAGRy6RpC1QL84268Uxp4tK4d4DrQeKuiDs");

            if (update1.Type == UpdateType.Message)
                await client.SendTextMessageAsync(update1.Message.From.Id, update1.Message.Text);

            return Ok();
        }
    }
}
