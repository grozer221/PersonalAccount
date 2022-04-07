using Microsoft.AspNetCore.Mvc;
using Telegram.Bot;

namespace PersonalAccount.Server.GraphQL.Modules.TelegramAccounts
{
    public class TelegramAccountsService
    {
        private readonly TelegramBotClient _client;

        public TelegramAccountsService()
        {
            _client = new TelegramBotClient(Environment.GetEnvironmentVariable("TELEGRAM_BOT_TOKEN"));
        }

        public async Task SendMessage(long telegramId, string text)
        {
            await _client.SendTextMessageAsync(telegramId, text);
        }
    }
}
