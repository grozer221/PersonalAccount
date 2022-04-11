using GraphQL.Types;

namespace PersonalAccount.Server.Modules.Users.DTO
{
    public class UpdateSettingsInputType : InputObjectGraphType<UserSettings>
    {
        public UpdateSettingsInputType()
        {
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
        }
    }
}
