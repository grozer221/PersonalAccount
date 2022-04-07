using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL.Modules.TelegramAccounts.DTO
{
    public class TelegramAccountLoginInputType : InputObjectGraphType<TelegramAccountModel>
    {
        public TelegramAccountLoginInputType()
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
        }
    }
}
