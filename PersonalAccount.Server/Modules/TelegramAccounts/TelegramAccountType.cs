using GraphQL.Types;

namespace PersonalAccount.Server.Modules.TelegramAccounts;

public class TelegramAccountType : BaseType<TelegramAccountModel>
{
    public TelegramAccountType() : base()
    {
        Field<NonNullGraphType<LongGraphType>, long>()
           .Name("TelegramId")
           .Resolve(context => context.Source.TelegramId);
        
        Field<StringGraphType, string?>()
           .Name("Username")
           .Resolve(context => context.Source.Username);
        
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Firstname")
           .Resolve(context => context.Source.Firstname);
        
        Field<StringGraphType, string?>()
           .Name("Lastname")
           .Resolve(context => context.Source.Lastname);
        
        Field<StringGraphType, string?>()
           .Name("PhotoUrl")
           .Resolve(context => context.Source.PhotoUrl);
        
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Hash")
           .Resolve(context => context.Source.Hash);
        
        Field<NonNullGraphType<DateTimeGraphType>, DateTime>()
           .Name("AuthDate")
           .Resolve(context => context.Source.AuthDate);
        
        Field<IdGraphType, Guid?>()
           .Name("UserId")
           .Resolve(context => context.Source.UserId);
    }
}
