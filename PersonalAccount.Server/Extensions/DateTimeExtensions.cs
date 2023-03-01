namespace PersonalAccount.Server.Extensions
{
    public static class DateTimeExtensions
    {
        public static DateTime GetUtcFromUkraineTimeZone(this DateTime dateTime)
        {
            return TimeZoneInfo.ConvertTimeToUtc(dateTime, TimeZoneInfo.FindSystemTimeZoneById("FLE Standard Time"));
        }
    }
}
