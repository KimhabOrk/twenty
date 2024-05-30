import { ApolloClient, useMutation } from '@apollo/client';

import { CREATE_ONE_DATABASE_CONNECTION } from '@/databases/graphql/mutations/createOneDatabaseConnection';
import { GET_MANY_DATABASE_CONNECTIONS } from '@/databases/graphql/queries/findManyDatabaseConnections';
import { useApolloMetadataClient } from '@/object-metadata/hooks/useApolloMetadataClient';
import {
  CreateRemoteServerInput,
  CreateServerMutation,
  CreateServerMutationVariables,
} from '~/generated-metadata/graphql';
import { isDefined } from '~/utils/isDefined';

export const useCreateOneDatabaseConnection = () => {
  const apolloMetadataClient = useApolloMetadataClient();

  const [mutate] = useMutation<
    CreateServerMutation,
    CreateServerMutationVariables
  >(CREATE_ONE_DATABASE_CONNECTION, {
    client: apolloMetadataClient ?? ({} as ApolloClient<any>),
  });

  const createOneDatabaseConnection = async (
    input: CreateRemoteServerInput,
  ) => {
    return await mutate({
      variables: {
        input,
      },
      update: (cache, { data }) => {
        if (!data?.createOneRemoteServer) return;

        const getManyDatabaseConnectionsQuery = {
          query: GET_MANY_DATABASE_CONNECTIONS,
          variables: {
            input: { foreignDataWrapperType: input.foreignDataWrapperType },
          },
        };

        if (isDefined(cache.readQuery(getManyDatabaseConnectionsQuery))) {
          cache.updateQuery(getManyDatabaseConnectionsQuery, (cachedQuery) => ({
            findManyRemoteServersByType: [
              ...cachedQuery.findManyRemoteServersByType,
              data.createOneRemoteServer,
            ],
          }));

          return;
        }
      },
    });
  };

  return {
    createOneDatabaseConnection,
  };
};
