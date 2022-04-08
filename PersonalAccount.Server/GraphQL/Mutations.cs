using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL;

public class Mutations : ObjectGraphType
{
    public Mutations(IEnumerable<IMutationMarker> clientMutationMarkers)
    {
        Name = "Mutations";

        foreach (var clientMutationMarker in clientMutationMarkers)
        {
            var marker = clientMutationMarker as ObjectGraphType<object>;
            foreach (var field in marker.Fields)
                AddField(field);
        }
    }
}
