import { GraphQLID, GraphQLInt, GraphQLString } from 'graphql';

import { WorkspaceResolverBuilderMethodNames } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';

import { InputTypeDefinitionKind } from 'src/engine/api/graphql/workspace-schema-builder/factories/input-type-definition.factory';
import { getResolverArgs } from 'src/engine/api/graphql/workspace-schema-builder/utils/get-resolver-args.util';

describe('getResolverArgs', () => {
  const expectedOutputs = {
    findMany: {
      first: { type: GraphQLInt, isNullable: true },
      last: { type: GraphQLInt, isNullable: true },
      before: { type: GraphQLString, isNullable: true },
      after: { type: GraphQLString, isNullable: true },
      filter: { kind: InputTypeDefinitionKind.Filter, isNullable: true },
      orderBy: { kind: InputTypeDefinitionKind.OrderBy, isNullable: true },
      limit: { type: GraphQLInt, isNullable: true },
    },
    findOne: {
      filter: { kind: InputTypeDefinitionKind.Filter, isNullable: false },
    },
    createMany: {
      data: {
        kind: InputTypeDefinitionKind.Create,
        isNullable: false,
        isArray: true,
      },
    },
    createOne: {
      data: { kind: InputTypeDefinitionKind.Create, isNullable: false },
    },
    updateOne: {
      id: { type: GraphQLID, isNullable: false },
      data: { kind: InputTypeDefinitionKind.Update, isNullable: false },
    },
    deleteOne: {
      id: { type: GraphQLID, isNullable: false },
    },
    executeQuickActionOnOne: {
      id: { type: GraphQLID, isNullable: false },
    },
  };

  // Test each resolver type
  Object.entries(expectedOutputs).forEach(([resolverType, expectedOutput]) => {
    it(`should return correct args for ${resolverType} resolver`, () => {
      expect(
        getResolverArgs(resolverType as WorkspaceResolverBuilderMethodNames),
      ).toEqual(expectedOutput);
    });
  });

  // Test for an unknown resolver type
  it('should throw an error for an unknown resolver type', () => {
    const unknownType = 'unknownType';

    expect(() =>
      getResolverArgs(unknownType as WorkspaceResolverBuilderMethodNames),
    ).toThrow(`Unknown resolver type: ${unknownType}`);
  });
});
