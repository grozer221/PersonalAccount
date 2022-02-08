using GraphQL.Types;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.GraphQL.Modules.Schedule
{
    public class DayType : ObjectGraphType<Day>
    {
        public DayType()
        {
            Field<StringGraphType>()
               .Name("Name")
               .Resolve(context => context.Source.Name);

            Field<ListGraphType<SubjectType>>()
               .Name("Subjects")
               .Resolve(context => context.Source.Subjects);
        }
    }
}
