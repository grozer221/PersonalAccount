using GraphQL.Types;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.GraphQL.Modules.Schedule
{
    public class WeekType : ObjectGraphType<Week>
    {
        public WeekType()
        {
            Field<StringGraphType>()
               .Name("Name")
               .Resolve(context => context.Source.Name);

            Field<ListGraphType<DayType>>()
               .Name("Days")
               .Resolve(context => context.Source.Days);
        }
    }
}
