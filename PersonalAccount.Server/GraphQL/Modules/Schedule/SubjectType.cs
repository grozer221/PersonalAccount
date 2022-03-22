using GraphQL.Types;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.GraphQL.Modules.Schedule
{
    public class SubjectType : ObjectGraphType<Subject>
    {
        public SubjectType()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Time")
               .Resolve(context => context.Source.Time);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Cabinet")
               .Resolve(context => context.Source.Cabinet);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Type")
               .Resolve(context => context.Source.Type);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Name")
               .Resolve(context => context.Source.Name);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Teacher")
               .Resolve(context => context.Source.Teacher);

            Field<StringGraphType, string?>()
               .Name("Link")
               .Resolve(context => context.Source.Link);
        }
    }
}
