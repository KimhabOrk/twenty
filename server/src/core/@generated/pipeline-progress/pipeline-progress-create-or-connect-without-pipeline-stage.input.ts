import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { PipelineProgressWhereUniqueInput } from './pipeline-progress-where-unique.input';
import { Type } from 'class-transformer';
import { PipelineProgressCreateWithoutPipelineStageInput } from './pipeline-progress-create-without-pipeline-stage.input';
import { HideField } from '@nestjs/graphql';

@InputType()
export class PipelineProgressCreateOrConnectWithoutPipelineStageInput {

    @Field(() => PipelineProgressWhereUniqueInput, {nullable:false})
    @Type(() => PipelineProgressWhereUniqueInput)
    where!: PipelineProgressWhereUniqueInput;

    @HideField()
    create!: PipelineProgressCreateWithoutPipelineStageInput;
}
