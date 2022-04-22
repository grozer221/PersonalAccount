using System.Security.Cryptography;
using System.Text;

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

        public static string GetHash(this string str)
        {
            if (string.IsNullOrEmpty(str))
                return "";
            MD5 md5 = MD5.Create();
            byte[] hash = md5.ComputeHash(Encoding.UTF8.GetBytes(str));
            return Convert.ToBase64String(hash);
        }

        public static string Encrypt(this string text, string key)
        {
            byte[] keyBytes = Encoding.Unicode.GetBytes(key);
            using (AesManaged aes = new AesManaged() { Key = keyBytes })
            using (MemoryStream ms = new MemoryStream())
            {
                ms.Write(aes.IV);
                using (CryptoStream cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write, true))
                {
                    cs.Write(Encoding.Unicode.GetBytes(text));
                }
                return Convert.ToBase64String(ms.ToArray());
            }
        }

        public static string Decrypt(this string base64, string key)
        {
            byte[] keyBytes = Encoding.Unicode.GetBytes(key);
            using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(base64)))
            {
                byte[] iv = new byte[16];
                ms.Read(iv);
                using (AesManaged aes = new AesManaged() { Key = keyBytes, IV = iv })
                using (CryptoStream cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read, true))
                using (MemoryStream output = new MemoryStream())
                {
                    cs.CopyTo(output);
                    return Encoding.Unicode.GetString(output.ToArray());
                }
            }
        }
    }
}
