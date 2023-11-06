/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';

import { GraphQLSchema, printSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';

import { DataSourceMetadataService } from 'src/metadata/data-source-metadata/data-source-metadata.service';
import { ObjectMetadataService } from 'src/metadata/object-metadata/services/object-metadata.service';

import { GraphQLSchemaFactory } from './schema-builder/graphql-schema.factory';
import { resolverBuilderMethodNames } from './resolver-builder/factories/factories';
import { ResolverFactory } from './resolver-builder/resolver.factory';

@Injectable()
export class TenantService {
  constructor(
    private readonly dataSourceMetadataService: DataSourceMetadataService,
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly graphQLSchemaFactory: GraphQLSchemaFactory,
    private readonly resolverFactory: ResolverFactory,
  ) {}

  async createTenantSchema(workspaceId: string | undefined) {
    if (!workspaceId) {
      return new GraphQLSchema({});
    }

    const dataSourcesMetadata =
      await this.dataSourceMetadataService.getDataSourcesMetadataFromWorkspaceId(
        workspaceId,
      );

    // Can'f find any data sources for this workspace
    if (!dataSourcesMetadata || dataSourcesMetadata.length === 0) {
      return new GraphQLSchema({});
    }

    const objectMetadataCollection =
      await this.objectMetadataService.getObjectMetadataFromWorkspaceId(
        workspaceId,
      );

    const autoGeneratedSchema = await this.graphQLSchemaFactory.create(
      objectMetadataCollection,
      resolverBuilderMethodNames,
    );
    const autoGeneratedResolvers = await this.resolverFactory.create(
      workspaceId,
      objectMetadataCollection,
      resolverBuilderMethodNames,
    );

    // TODO: Cache the generate type definitions
    const typeDefs = printSchema(autoGeneratedSchema);
    const executableSchema = makeExecutableSchema({
      typeDefs: gql`
        ${typeDefs}
      `,
      resolvers: autoGeneratedResolvers,
    });

    return executableSchema;
  }
}
