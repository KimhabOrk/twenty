import { Field, ObjectType } from '@nestjs/graphql';

import { IsOptional } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

export type RecordMetadataById = Record<
  string,
  {
    objectNameSingular: string;
    name: string;
    nameFirstName?: string;
    nameLastName?: string;
    domainName?: string;
  }
>;

@ObjectType('AskAIQueryResult')
export class AskAIQueryResult {
  @Field(() => String)
  sqlQuery: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sqlQueryResult?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  recordMetadataById?: RecordMetadataById;
}
