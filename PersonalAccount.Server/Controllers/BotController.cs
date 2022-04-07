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
        private readonly TelegramAccountsService _telegramAccountsService;
        public BotController(TelegramAccountsService telegramAccountsService)
        {
            _telegramAccountsService = telegramAccountsService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] object update)
        {
            Update deserializedUpdate = JsonConvert.DeserializeObject<Update>(JsonConvert.SerializeObject(update));
            if (deserializedUpdate.Type == UpdateType.Message)
            {
                _telegramAccountsService.SendMessage(deserializedUpdate.Message.From.Id, deserializedUpdate.Message.Text);
            }
            return Ok();
        }
    }
}
