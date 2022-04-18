namespace PersonalAccount.Server.Extensions
{
    public static class StringExtensions
    {
        public static string Capitalize(this string str)
        {
            if (string.IsNullOrEmpty(str))
                return "";
            else if (str.Length == 1)
                return char.ToUpper(str[0]).ToString();
            else
                return char.ToUpper(str[0]) + str.Substring(1);
        }
    }
}
