using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Users;

public class UserSettingsType : ObjectGraphType<UserSettings>
{
    public UserSettingsType()
    {
        Field<StringGraphType, string>()
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

        Field<PersonalAccountType, PersonalAccounts.PersonalAccount?>()
           .Name("PersonalAccount")
           .Resolve(context => context.Source.PersonalAccount);

        Field<TelegramAccountType, TelegramAccount?>()
           .Name("TelegramAccount")
           .Resolve(context => context.Source.TelegramAccount);
    }
}

