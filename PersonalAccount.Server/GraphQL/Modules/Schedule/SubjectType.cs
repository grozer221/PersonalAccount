using GraphQL.Types;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.GraphQL.Modules.Schedule
{
    public class SubjectType : ObjectGraphType<Subject>
    {
        public SubjectType()
        {
            Field<IdGraphType>()
               .Name("Time")
               .Resolve(context => context.Source.Time);

            Field<StringGraphType>()
               .Name("Cabinet")
               .Resolve(context => context.Source.Cabinet);

            Field<StringGraphType>()
               .Name("Type")
               .Resolve(context => context.Source.Type);

            Field<StringGraphType>()
               .Name("Name")
               .Resolve(context => context.Source.Name);

            Field<StringGraphType>()
               .Name("Teacher")
               .Resolve(context => context.Source.Teacher);

            Field<StringGraphType>()
               .Name("Link")
               .Resolve(context => context.Source.Link);
        }
    }
}
