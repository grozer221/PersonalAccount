using GraphQL.Types;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.GraphQL.Modules.Schedule
{
    public class WeekType : ObjectGraphType<Week>
    {
        public WeekType()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Name")
               .Resolve(context => context.Source.Name);

            Field<NonNullGraphType<ListGraphType<DayType>>, List<Day>>()
               .Name("Days")
               .Resolve(context => context.Source.Days);
        }
    }
}
