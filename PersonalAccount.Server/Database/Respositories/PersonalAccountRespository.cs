namespace PersonalAccount.Server.Database.Respositories
{
    public class PersonalAccountRespository : BaseRepository<PersonalAccountModel>
    {
        public PersonalAccountRespository(AppDbContext context) : base(context)
        {

        }

        public PersonalAccountModel? GetByUsernameOrDefault(string username)
        {
            List<PersonalAccountModel> personalAccounts = base.Where(a => a.Username == username);
            if (personalAccounts.Count == 0)
                return null;
            return personalAccounts[0];
        }
    }
}
