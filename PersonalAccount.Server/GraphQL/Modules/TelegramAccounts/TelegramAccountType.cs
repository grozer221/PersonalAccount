using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL.Modules.TelegramAccounts
{
    public class TelegramAccountType : BaseType<TelegramAccountModel>
    {
        public TelegramAccountType() : base()
        {
            Field<NonNullGraphType<IntGraphType>, int>()
               .Name("TelegramId")
               .Resolve(context => context.Source.TelegramId);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Username")
               .Resolve(context => context.Source.Username);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Firstname")
               .Resolve(context => context.Source.Firstname);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Lastname")
               .Resolve(context => context.Source.Lastname);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("PhotoUrl")
               .Resolve(context => context.Source.PhotoUrl);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Hash")
               .Resolve(context => context.Source.Hash);
            
            Field<NonNullGraphType<DateTimeGraphType>, DateTime>()
               .Name("AuthDate")
               .Resolve(context => context.Source.AuthDate);
            
            Field<NonNullGraphType<IdGraphType>, Guid?>()
               .Name("UserId")
               .Resolve(context => context.Source.UserId);
        }
    }
}
