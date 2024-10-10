import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteSsoOutput {
  @Field(() => String)
  idpId: string;
}
