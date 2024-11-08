import { Injectable } from '@nestjs/common';

import graphqlFields from 'graphql-fields';
import { SelectQueryBuilder } from 'typeorm';

import { ResolverService } from 'src/engine/api/graphql/graphql-query-runner/interfaces/resolver-service.interface';
import {
  Record as IRecord,
  OrderByDirection,
  RecordFilter,
  RecordOrderBy,
} from 'src/engine/api/graphql/workspace-query-builder/interfaces/record.interface';
import { IConnection } from 'src/engine/api/graphql/workspace-query-runner/interfaces/connection.interface';
import { WorkspaceQueryRunnerOptions } from 'src/engine/api/graphql/workspace-query-runner/interfaces/query-runner-option.interface';
import { FindManyResolverArgs } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';
import { FieldMetadataInterface } from 'src/engine/metadata-modules/field-metadata/interfaces/field-metadata.interface';

import { QUERY_MAX_RECORDS } from 'src/engine/api/graphql/graphql-query-runner/constants/query-max-records.constant';
import {
  GraphqlQueryRunnerException,
  GraphqlQueryRunnerExceptionCode,
} from 'src/engine/api/graphql/graphql-query-runner/errors/graphql-query-runner.exception';
import { GraphqlQueryParser } from 'src/engine/api/graphql/graphql-query-runner/graphql-query-parsers/graphql-query.parser';
import { ObjectRecordsToGraphqlConnectionHelper } from 'src/engine/api/graphql/graphql-query-runner/helpers/object-records-to-graphql-connection.helper';
import { ProcessNestedRelationsHelper } from 'src/engine/api/graphql/graphql-query-runner/helpers/process-nested-relations.helper';
import { computeCursorArgFilter } from 'src/engine/api/graphql/graphql-query-runner/utils/compute-cursor-arg-filter';
import {
  getCursor,
  getPaginationInfo,
} from 'src/engine/api/graphql/graphql-query-runner/utils/cursors.util';
import {
  AggregationField,
  getAvailableAggregationsFromObjectFields,
} from 'src/engine/api/graphql/workspace-schema-builder/utils/get-available-aggregations-from-object-fields.util';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { formatResult } from 'src/engine/twenty-orm/utils/format-result.util';
import { isDefined } from 'src/utils/is-defined';

@Injectable()
export class GraphqlQueryFindManyResolverService
  implements ResolverService<FindManyResolverArgs, IConnection<IRecord>>
{
  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
  ) {}

  async resolve<
    ObjectRecord extends IRecord = IRecord,
    Filter extends RecordFilter = RecordFilter,
    OrderBy extends RecordOrderBy = RecordOrderBy,
  >(
    args: FindManyResolverArgs<Filter, OrderBy>,
    options: WorkspaceQueryRunnerOptions,
  ): Promise<IConnection<ObjectRecord>> {
    const { authContext, objectMetadataMapItem, info, objectMetadataMap } =
      options;

    const dataSource =
      await this.twentyORMGlobalManager.getDataSourceForWorkspace(
        authContext.workspace.id,
      );

    const repository = dataSource.getRepository(
      objectMetadataMapItem.nameSingular,
    );

    const queryBuilder = repository.createQueryBuilder(
      objectMetadataMapItem.nameSingular,
    );

    const countQueryBuilder = repository.createQueryBuilder(
      objectMetadataMapItem.nameSingular,
    );

    const graphqlQueryParser = new GraphqlQueryParser(
      objectMetadataMapItem.fields,
      objectMetadataMap,
    );

    const withFilterCountQueryBuilder = graphqlQueryParser.applyFilterToBuilder(
      countQueryBuilder,
      objectMetadataMapItem.nameSingular,
      args.filter ?? ({} as Filter),
    );

    const selectedFields = graphqlFields(info);

    const { relations } = graphqlQueryParser.parseSelectedFields(
      objectMetadataMapItem,
      selectedFields,
    );
    const isForwardPagination = !isDefined(args.before);

    const withDeletedCountQueryBuilder =
      graphqlQueryParser.applyDeletedAtToBuilder(
        withFilterCountQueryBuilder,
        args.filter ?? ({} as Filter),
      );

    const totalCount = isDefined(selectedFields.totalCount)
      ? await withDeletedCountQueryBuilder.getCount()
      : 0;

    const cursor = getCursor(args);

    let appliedFilters = args.filter ?? ({} as Filter);

    const orderByWithIdCondition = [
      ...(args.orderBy ?? []),
      { id: OrderByDirection.AscNullsFirst },
    ] as OrderBy;

    if (cursor) {
      const cursorArgFilter = computeCursorArgFilter(
        cursor,
        orderByWithIdCondition,
        objectMetadataMapItem.fields,
        isForwardPagination,
      );

      appliedFilters = (args.filter
        ? {
            and: [args.filter, { or: cursorArgFilter }],
          }
        : { or: cursorArgFilter }) as unknown as Filter;
    }

    const withFilterQueryBuilder = graphqlQueryParser.applyFilterToBuilder(
      queryBuilder,
      objectMetadataMapItem.nameSingular,
      appliedFilters,
    );

    const withOrderByQueryBuilder = graphqlQueryParser.applyOrderToBuilder(
      withFilterQueryBuilder,
      orderByWithIdCondition,
      objectMetadataMapItem.nameSingular,
      isForwardPagination,
    );

    const withDeletedQueryBuilder = graphqlQueryParser.applyDeletedAtToBuilder(
      withOrderByQueryBuilder,
      args.filter ?? ({} as Filter),
    );

    const selectedAggregatedFields = this.getSelectedAggregatedFields({
      objectFields: Object.values(objectMetadataMapItem.fields),
      selectedFields,
    });

    this.addSelectedAggregatedFieldsQueriesToQueryBuilder({
      selectedAggregatedFields,
      queryBuilder: withDeletedQueryBuilder,
    });

    const limit = args.first ?? args.last ?? QUERY_MAX_RECORDS;

    const nonFormattedObjectRecords = await withDeletedQueryBuilder
      .take(limit + 1)
      .getRawAndEntities();

    const objectRecords = formatResult(
      nonFormattedObjectRecords.entities,
      objectMetadataMapItem,
      objectMetadataMap,
    );

    const { hasNextPage, hasPreviousPage } = getPaginationInfo(
      objectRecords,
      limit,
      isForwardPagination,
    );

    if (objectRecords.length > limit) {
      objectRecords.pop();
    }

    const processNestedRelationsHelper = new ProcessNestedRelationsHelper();

    if (relations) {
      await processNestedRelationsHelper.processNestedRelations(
        objectMetadataMap,
        objectMetadataMapItem,
        objectRecords,
        relations,
        limit,
        authContext,
        dataSource,
      );
    }

    const typeORMObjectRecordsParser =
      new ObjectRecordsToGraphqlConnectionHelper(objectMetadataMap);

    const result = typeORMObjectRecordsParser.createConnection({
      objectRecords,
      objectName: objectMetadataMapItem.nameSingular,
      take: limit,
      totalCount,
      order: orderByWithIdCondition,
      hasNextPage,
      hasPreviousPage,
    });

    const aggregatedFieldsResults = this.extractAggregatedFieldsResults({
      selectedAggregatedFields,
      rawObjectRecords: nonFormattedObjectRecords.raw,
    });

    return { ...result, ...aggregatedFieldsResults };
  }

  async validate<Filter extends RecordFilter>(
    args: FindManyResolverArgs<Filter>,
    _options: WorkspaceQueryRunnerOptions,
  ): Promise<void> {
    if (args.first && args.last) {
      throw new GraphqlQueryRunnerException(
        'Cannot provide both first and last',
        GraphqlQueryRunnerExceptionCode.ARGS_CONFLICT,
      );
    }
    if (args.before && args.after) {
      throw new GraphqlQueryRunnerException(
        'Cannot provide both before and after',
        GraphqlQueryRunnerExceptionCode.ARGS_CONFLICT,
      );
    }
    if (args.before && args.first) {
      throw new GraphqlQueryRunnerException(
        'Cannot provide both before and first',
        GraphqlQueryRunnerExceptionCode.ARGS_CONFLICT,
      );
    }
    if (args.after && args.last) {
      throw new GraphqlQueryRunnerException(
        'Cannot provide both after and last',
        GraphqlQueryRunnerExceptionCode.ARGS_CONFLICT,
      );
    }
    if (args.first !== undefined && args.first < 0) {
      throw new GraphqlQueryRunnerException(
        'First argument must be non-negative',
        GraphqlQueryRunnerExceptionCode.INVALID_ARGS_FIRST,
      );
    }
    if (args.last !== undefined && args.last < 0) {
      throw new GraphqlQueryRunnerException(
        'Last argument must be non-negative',
        GraphqlQueryRunnerExceptionCode.INVALID_ARGS_LAST,
      );
    }
  }

  private addSelectedAggregatedFieldsQueriesToQueryBuilder = ({
    selectedAggregatedFields,
    queryBuilder,
  }: {
    selectedAggregatedFields: AggregationField[];
    queryBuilder: SelectQueryBuilder<any>;
  }) => {
    selectedAggregatedFields.forEach((aggregatedField) => {
      const [[aggregatedFieldName, aggregatedFieldDetails]] =
        Object.entries(aggregatedField);
      const operation = aggregatedFieldDetails.aggregationOperation;
      const fieldName = aggregatedFieldDetails.fromField;

      queryBuilder.addSelect(
        `${operation}("${fieldName}") OVER()`,
        `${aggregatedFieldName}`,
      );
    });
  };

  private getSelectedAggregatedFields = ({
    objectFields,
    selectedFields,
  }: {
    objectFields: FieldMetadataInterface[];
    selectedFields: any[];
  }) => {
    const allAggregatedFields =
      getAvailableAggregationsFromObjectFields(objectFields);

    return allAggregatedFields.reduce(
      (acc, aggregatedField) => {
        const aggregatedFieldName = Object.keys(aggregatedField)[0];

        if (!Object.keys(selectedFields).includes(aggregatedFieldName))
          return acc;

        const isDuplicate = acc.some(
          (existingField) =>
            Object.keys(existingField)[0] === aggregatedFieldName,
        );

        if (isDuplicate) {
          return acc;
        }

        return [...acc, aggregatedField];
      },
      [] as typeof allAggregatedFields,
    );
  };

  private extractAggregatedFieldsResults = ({
    selectedAggregatedFields,
    rawObjectRecords,
  }: {
    selectedAggregatedFields: AggregationField[];
    rawObjectRecords: any[];
  }) => {
    return selectedAggregatedFields.reduce((acc, aggregatedField) => {
      const aggregatedFieldName = Object.keys(aggregatedField)[0];

      return {
        ...acc,
        [aggregatedFieldName]: rawObjectRecords[0][aggregatedFieldName],
      };
    }, {});
  };
}
