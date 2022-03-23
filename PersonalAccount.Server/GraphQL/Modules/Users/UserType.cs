using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL.Modules.Users
{
    public class UserType : BaseType<UserModel>
    {
        public UserType(PersonalAccountRespository personalAccountRespository) : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Email")
               .Resolve(context => context.Source.Email);

            Field<NonNullGraphType<RoleEnumType>, RoleEnum>()
               .Name("Role")
               .Resolve(context => context.Source.Role);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Group")
               .Resolve(context => context.Source.Group);
            
            Field<NonNullGraphType<IntGraphType>, int>()
               .Name("SubGroup")
               .Resolve(context => context.Source.SubGroup);
            
            Field<StringGraphType, string?>()
               .Name("ExpoPushToken")
               .Resolve(context => context.Source.ExpoPushToken);
            
            Field<PersonalAccountType, PersonalAccountModel?>()
               .Name("PersonalAccount")
               .Resolve(context =>
               {
                   Guid userId = context.Source.Id;
                   var accounts = personalAccountRespository.Get(a => a.UserId == userId);
                   if (accounts.Count() == 0)
                       return null;
                   else
                       return accounts[0];
               });
        }
    }

    public class RoleEnumType : EnumerationGraphType<RoleEnum>
    {
    }
}
