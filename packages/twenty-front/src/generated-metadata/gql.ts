/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment RemoteServerFields on RemoteServer {\n    id\n    createdAt\n    foreignDataWrapperId\n    foreignDataWrapperOptions\n    foreignDataWrapperType\n    updatedAt\n  }\n": types.RemoteServerFieldsFragmentDoc,
    "\n  fragment RemoteTableFields on RemoteTable {\n    id\n    name\n    schema\n    status\n  }\n": types.RemoteTableFieldsFragmentDoc,
    "\n  \n  mutation createServer($input: CreateRemoteServerInput!) {\n    createOneRemoteServer(input: $input) {\n      ...RemoteServerFields\n    }\n  }\n": types.CreateServerDocument,
    "\n  mutation deleteServer($input: RemoteServerIdInput!) {\n    deleteOneRemoteServer(input: $input) {\n      id\n    }\n  }\n": types.DeleteServerDocument,
    "\n  \n  mutation syncRemoteTable($input: RemoteTableInput!) {\n    syncRemoteTable(input: $input) {\n      ...RemoteTableFields\n    }\n  }\n": types.SyncRemoteTableDocument,
    "\n  \n  mutation unsyncRemoteTable($input: RemoteTableInput!) {\n    unsyncRemoteTable(input: $input) {\n      ...RemoteTableFields\n    }\n  }\n": types.UnsyncRemoteTableDocument,
    "\n  \n  query GetManyDatabaseConnections($input: RemoteServerTypeInput!) {\n    findManyRemoteServersByType(input: $input) {\n      ...RemoteServerFields\n    }\n  }\n": types.GetManyDatabaseConnectionsDocument,
    "\n  \n  query GetManyRemoteTables($input: RemoteServerIdInput!) {\n    findAvailableRemoteTablesByServerId(input: $input) {\n      ...RemoteTableFields\n    }\n  }\n": types.GetManyRemoteTablesDocument,
    "\n  \n  query GetOneDatabaseConnection($input: RemoteServerIdInput!) {\n    findOneRemoteServerById(input: $input) {\n      ...RemoteServerFields\n    }\n  }\n": types.GetOneDatabaseConnectionDocument,
    "\n  mutation CreateOneObjectMetadataItem($input: CreateOneObjectInput!) {\n    createOneObject(input: $input) {\n      id\n      dataSourceId\n      nameSingular\n      namePlural\n      labelSingular\n      labelPlural\n      description\n      icon\n      isCustom\n      isActive\n      createdAt\n      updatedAt\n      labelIdentifierFieldMetadataId\n      imageIdentifierFieldMetadataId\n    }\n  }\n": types.CreateOneObjectMetadataItemDocument,
    "\n  mutation CreateOneFieldMetadataItem($input: CreateOneFieldMetadataInput!) {\n    createOneField(input: $input) {\n      id\n      type\n      name\n      label\n      description\n      icon\n      isCustom\n      isActive\n      isNullable\n      createdAt\n      updatedAt\n      defaultValue\n      options\n    }\n  }\n": types.CreateOneFieldMetadataItemDocument,
    "\n  mutation CreateOneRelationMetadata($input: CreateOneRelationInput!) {\n    createOneRelation(input: $input) {\n      id\n      relationType\n      fromObjectMetadataId\n      toObjectMetadataId\n      fromFieldMetadataId\n      toFieldMetadataId\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateOneRelationMetadataDocument,
    "\n  mutation UpdateOneFieldMetadataItem(\n    $idToUpdate: UUID!\n    $updatePayload: UpdateFieldInput!\n  ) {\n    updateOneField(input: { id: $idToUpdate, update: $updatePayload }) {\n      id\n      type\n      name\n      label\n      description\n      icon\n      isCustom\n      isActive\n      isNullable\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateOneFieldMetadataItemDocument,
    "\n  mutation UpdateOneObjectMetadataItem(\n    $idToUpdate: UUID!\n    $updatePayload: UpdateObjectInput!\n  ) {\n    updateOneObject(input: { id: $idToUpdate, update: $updatePayload }) {\n      id\n      dataSourceId\n      nameSingular\n      namePlural\n      labelSingular\n      labelPlural\n      description\n      icon\n      isCustom\n      isActive\n      createdAt\n      updatedAt\n      labelIdentifierFieldMetadataId\n      imageIdentifierFieldMetadataId\n    }\n  }\n": types.UpdateOneObjectMetadataItemDocument,
    "\n  mutation DeleteOneObjectMetadataItem($idToDelete: UUID!) {\n    deleteOneObject(input: { id: $idToDelete }) {\n      id\n      dataSourceId\n      nameSingular\n      namePlural\n      labelSingular\n      labelPlural\n      description\n      icon\n      isCustom\n      isActive\n      createdAt\n      updatedAt\n      labelIdentifierFieldMetadataId\n      imageIdentifierFieldMetadataId\n    }\n  }\n": types.DeleteOneObjectMetadataItemDocument,
    "\n  mutation DeleteOneFieldMetadataItem($idToDelete: UUID!) {\n    deleteOneField(input: { id: $idToDelete }) {\n      id\n      type\n      name\n      label\n      description\n      icon\n      isCustom\n      isActive\n      isNullable\n      createdAt\n      updatedAt\n    }\n  }\n": types.DeleteOneFieldMetadataItemDocument,
    "\n  query ObjectMetadataItems(\n    $objectFilter: objectFilter\n    $fieldFilter: fieldFilter\n  ) {\n    objects(paging: { first: 1000 }, filter: $objectFilter) {\n      edges {\n        node {\n          id\n          dataSourceId\n          nameSingular\n          namePlural\n          labelSingular\n          labelPlural\n          description\n          icon\n          isCustom\n          isRemote\n          isActive\n          isSystem\n          createdAt\n          updatedAt\n          labelIdentifierFieldMetadataId\n          imageIdentifierFieldMetadataId\n          fields(paging: { first: 1000 }, filter: $fieldFilter) {\n            edges {\n              node {\n                id\n                type\n                name\n                label\n                description\n                icon\n                isCustom\n                isActive\n                isSystem\n                isNullable\n                createdAt\n                updatedAt\n                fromRelationMetadata {\n                  id\n                  relationType\n                  toObjectMetadata {\n                    id\n                    dataSourceId\n                    nameSingular\n                    namePlural\n                    isSystem\n                  }\n                  toFieldMetadataId\n                }\n                toRelationMetadata {\n                  id\n                  relationType\n                  fromObjectMetadata {\n                    id\n                    dataSourceId\n                    nameSingular\n                    namePlural\n                    isSystem\n                  }\n                  fromFieldMetadataId\n                }\n                defaultValue\n                options\n                relationDefinition {\n                  direction\n                  sourceObjectMetadata {\n                    id\n                    nameSingular\n                    namePlural\n                  }\n                  sourceFieldMetadata {\n                    id\n                    name\n                  }\n                  targetObjectMetadata {\n                    id\n                    nameSingular\n                    namePlural\n                  }\n                  targetFieldMetadata {\n                    id\n                    name\n                  }\n                }\n              }\n            }\n            pageInfo {\n              hasNextPage\n              hasPreviousPage\n              startCursor\n              endCursor\n            }\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n": types.ObjectMetadataItemsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RemoteServerFields on RemoteServer {\n    id\n    createdAt\n    foreignDataWrapperId\n    foreignDataWrapperOptions\n    foreignDataWrapperType\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment RemoteServerFields on RemoteServer {\n    id\n    createdAt\n    foreignDataWrapperId\n    foreignDataWrapperOptions\n    foreignDataWrapperType\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RemoteTableFields on RemoteTable {\n    id\n    name\n    schema\n    status\n  }\n"): (typeof documents)["\n  fragment RemoteTableFields on RemoteTable {\n    id\n    name\n    schema\n    status\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation createServer($input: CreateRemoteServerInput!) {\n    createOneRemoteServer(input: $input) {\n      ...RemoteServerFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation createServer($input: CreateRemoteServerInput!) {\n    createOneRemoteServer(input: $input) {\n      ...RemoteServerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteServer($input: RemoteServerIdInput!) {\n    deleteOneRemoteServer(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteServer($input: RemoteServerIdInput!) {\n    deleteOneRemoteServer(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation syncRemoteTable($input: RemoteTableInput!) {\n    syncRemoteTable(input: $input) {\n      ...RemoteTableFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation syncRemoteTable($input: RemoteTableInput!) {\n    syncRemoteTable(input: $input) {\n      ...RemoteTableFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation unsyncRemoteTable($input: RemoteTableInput!) {\n    unsyncRemoteTable(input: $input) {\n      ...RemoteTableFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation unsyncRemoteTable($input: RemoteTableInput!) {\n    unsyncRemoteTable(input: $input) {\n      ...RemoteTableFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetManyDatabaseConnections($input: RemoteServerTypeInput!) {\n    findManyRemoteServersByType(input: $input) {\n      ...RemoteServerFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetManyDatabaseConnections($input: RemoteServerTypeInput!) {\n    findManyRemoteServersByType(input: $input) {\n      ...RemoteServerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetManyRemoteTables($input: RemoteServerIdInput!) {\n    findAvailableRemoteTablesByServerId(input: $input) {\n      ...RemoteTableFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetManyRemoteTables($input: RemoteServerIdInput!) {\n    findAvailableRemoteTablesByServerId(input: $input) {\n      ...RemoteTableFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  query GetOneDatabaseConnection($input: RemoteServerIdInput!) {\n    findOneRemoteServerById(input: $input) {\n      ...RemoteServerFields\n    }\n  }\n"): (typeof documents)["\n  \n  query GetOneDatabaseConnection($input: RemoteServerIdInput!) {\n    findOneRemoteServerById(input: $input) {\n      ...RemoteServerFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateOneObjectMetadataItem($input: CreateOneObjectInput!) {\n    createOneObject(input: $input) {\n      id\n      dataSourceId\n      nameSingular\n      namePlural\n      labelSingular\n      labelPlural\n      description\n      icon\n      isCustom\n      isActive\n      createdAt\n      updatedAt\n      labelIdentifierFieldMetadataId\n      imageIdentifierFieldMetadataId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOneObjectMetadataItem($input: CreateOneObjectInput!) {\n    createOneObject(input: $input) {\n      id\n      dataSourceId\n      nameSingular\n      namePlural\n      labelSingular\n      labelPlural\n      description\n      icon\n      isCustom\n      isActive\n      createdAt\n      updatedAt\n      labelIdentifierFieldMetadataId\n      imageIdentifierFieldMetadataId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateOneFieldMetadataItem($input: CreateOneFieldMetadataInput!) {\n    createOneField(input: $input) {\n      id\n      type\n      name\n      label\n      description\n      icon\n      isCustom\n      isActive\n      isNullable\n      createdAt\n      updatedAt\n      defaultValue\n      options\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOneFieldMetadataItem($input: CreateOneFieldMetadataInput!) {\n    createOneField(input: $input) {\n      id\n      type\n      name\n      label\n      description\n      icon\n      isCustom\n      isActive\n      isNullable\n      createdAt\n      updatedAt\n      defaultValue\n      options\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateOneRelationMetadata($input: CreateOneRelationInput!) {\n    createOneRelation(input: $input) {\n      id\n      relationType\n      fromObjectMetadataId\n      toObjectMetadataId\n      fromFieldMetadataId\n      toFieldMetadataId\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOneRelationMetadata($input: CreateOneRelationInput!) {\n    createOneRelation(input: $input) {\n      id\n      relationType\n      fromObjectMetadataId\n      toObjectMetadataId\n      fromFieldMetadataId\n      toFieldMetadataId\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateOneFieldMetadataItem(\n    $idToUpdate: UUID!\n    $updatePayload: UpdateFieldInput!\n  ) {\n    updateOneField(input: { id: $idToUpdate, update: $updatePayload }) {\n      id\n      type\n      name\n      label\n      description\n      icon\n      isCustom\n      isActive\n      isNullable\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateOneFieldMetadataItem(\n    $idToUpdate: UUID!\n    $updatePayload: UpdateFieldInput!\n  ) {\n    updateOneField(input: { id: $idToUpdate, update: $updatePayload }) {\n      id\n      type\n      name\n      label\n      description\n      icon\n      isCustom\n      isActive\n      isNullable\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateOneObjectMetadataItem(\n    $idToUpdate: UUID!\n    $updatePayload: UpdateObjectInput!\n  ) {\n    updateOneObject(input: { id: $idToUpdate, update: $updatePayload }) {\n      id\n      dataSourceId\n      nameSingular\n      namePlural\n      labelSingular\n      labelPlural\n      description\n      icon\n      isCustom\n      isActive\n      createdAt\n      updatedAt\n      labelIdentifierFieldMetadataId\n      imageIdentifierFieldMetadataId\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateOneObjectMetadataItem(\n    $idToUpdate: UUID!\n    $updatePayload: UpdateObjectInput!\n  ) {\n    updateOneObject(input: { id: $idToUpdate, update: $updatePayload }) {\n      id\n      dataSourceId\n      nameSingular\n      namePlural\n      labelSingular\n      labelPlural\n      description\n      icon\n      isCustom\n      isActive\n      createdAt\n      updatedAt\n      labelIdentifierFieldMetadataId\n      imageIdentifierFieldMetadataId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteOneObjectMetadataItem($idToDelete: UUID!) {\n    deleteOneObject(input: { id: $idToDelete }) {\n      id\n      dataSourceId\n      nameSingular\n      namePlural\n      labelSingular\n      labelPlural\n      description\n      icon\n      isCustom\n      isActive\n      createdAt\n      updatedAt\n      labelIdentifierFieldMetadataId\n      imageIdentifierFieldMetadataId\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteOneObjectMetadataItem($idToDelete: UUID!) {\n    deleteOneObject(input: { id: $idToDelete }) {\n      id\n      dataSourceId\n      nameSingular\n      namePlural\n      labelSingular\n      labelPlural\n      description\n      icon\n      isCustom\n      isActive\n      createdAt\n      updatedAt\n      labelIdentifierFieldMetadataId\n      imageIdentifierFieldMetadataId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteOneFieldMetadataItem($idToDelete: UUID!) {\n    deleteOneField(input: { id: $idToDelete }) {\n      id\n      type\n      name\n      label\n      description\n      icon\n      isCustom\n      isActive\n      isNullable\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteOneFieldMetadataItem($idToDelete: UUID!) {\n    deleteOneField(input: { id: $idToDelete }) {\n      id\n      type\n      name\n      label\n      description\n      icon\n      isCustom\n      isActive\n      isNullable\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ObjectMetadataItems(\n    $objectFilter: objectFilter\n    $fieldFilter: fieldFilter\n  ) {\n    objects(paging: { first: 1000 }, filter: $objectFilter) {\n      edges {\n        node {\n          id\n          dataSourceId\n          nameSingular\n          namePlural\n          labelSingular\n          labelPlural\n          description\n          icon\n          isCustom\n          isRemote\n          isActive\n          isSystem\n          createdAt\n          updatedAt\n          labelIdentifierFieldMetadataId\n          imageIdentifierFieldMetadataId\n          fields(paging: { first: 1000 }, filter: $fieldFilter) {\n            edges {\n              node {\n                id\n                type\n                name\n                label\n                description\n                icon\n                isCustom\n                isActive\n                isSystem\n                isNullable\n                createdAt\n                updatedAt\n                fromRelationMetadata {\n                  id\n                  relationType\n                  toObjectMetadata {\n                    id\n                    dataSourceId\n                    nameSingular\n                    namePlural\n                    isSystem\n                  }\n                  toFieldMetadataId\n                }\n                toRelationMetadata {\n                  id\n                  relationType\n                  fromObjectMetadata {\n                    id\n                    dataSourceId\n                    nameSingular\n                    namePlural\n                    isSystem\n                  }\n                  fromFieldMetadataId\n                }\n                defaultValue\n                options\n                relationDefinition {\n                  direction\n                  sourceObjectMetadata {\n                    id\n                    nameSingular\n                    namePlural\n                  }\n                  sourceFieldMetadata {\n                    id\n                    name\n                  }\n                  targetObjectMetadata {\n                    id\n                    nameSingular\n                    namePlural\n                  }\n                  targetFieldMetadata {\n                    id\n                    name\n                  }\n                }\n              }\n            }\n            pageInfo {\n              hasNextPage\n              hasPreviousPage\n              startCursor\n              endCursor\n            }\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n"): (typeof documents)["\n  query ObjectMetadataItems(\n    $objectFilter: objectFilter\n    $fieldFilter: fieldFilter\n  ) {\n    objects(paging: { first: 1000 }, filter: $objectFilter) {\n      edges {\n        node {\n          id\n          dataSourceId\n          nameSingular\n          namePlural\n          labelSingular\n          labelPlural\n          description\n          icon\n          isCustom\n          isRemote\n          isActive\n          isSystem\n          createdAt\n          updatedAt\n          labelIdentifierFieldMetadataId\n          imageIdentifierFieldMetadataId\n          fields(paging: { first: 1000 }, filter: $fieldFilter) {\n            edges {\n              node {\n                id\n                type\n                name\n                label\n                description\n                icon\n                isCustom\n                isActive\n                isSystem\n                isNullable\n                createdAt\n                updatedAt\n                fromRelationMetadata {\n                  id\n                  relationType\n                  toObjectMetadata {\n                    id\n                    dataSourceId\n                    nameSingular\n                    namePlural\n                    isSystem\n                  }\n                  toFieldMetadataId\n                }\n                toRelationMetadata {\n                  id\n                  relationType\n                  fromObjectMetadata {\n                    id\n                    dataSourceId\n                    nameSingular\n                    namePlural\n                    isSystem\n                  }\n                  fromFieldMetadataId\n                }\n                defaultValue\n                options\n                relationDefinition {\n                  direction\n                  sourceObjectMetadata {\n                    id\n                    nameSingular\n                    namePlural\n                  }\n                  sourceFieldMetadata {\n                    id\n                    name\n                  }\n                  targetObjectMetadata {\n                    id\n                    nameSingular\n                    namePlural\n                  }\n                  targetFieldMetadata {\n                    id\n                    name\n                  }\n                }\n              }\n            }\n            pageInfo {\n              hasNextPage\n              hasPreviousPage\n              startCursor\n              endCursor\n            }\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;