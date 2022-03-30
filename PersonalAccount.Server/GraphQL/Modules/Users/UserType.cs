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
            
            Field<NonNullGraphType<IntGraphType>, int>()
               .Name("EnglishSubGroup")
               .Resolve(context => context.Source.EnglishSubGroup);
            
            Field<NonNullGraphType<IntGraphType>, int>()
               .Name("MinutesBeforeLessonNotification")
               .Resolve(context => context.Source.MinutesBeforeLessonNotification);
            
            Field<NonNullGraphType<IntGraphType>, int>()
               .Name("MinutesBeforeLessonsNotification")
               .Resolve(context => context.Source.MinutesBeforeLessonsNotification);
            
            Field<PersonalAccountType, PersonalAccountModel?>()
               .Name("PersonalAccount")
               .Resolve(context =>
               {
                   Guid userId = context.Source.Id;
                   List<PersonalAccountModel> accounts = personalAccountRespository.Where(a => a.UserId == userId);
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
