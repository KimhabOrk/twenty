import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import * as Validator from 'class-validator';
import { HideField } from '@nestjs/graphql';
import { PipelineProgressCreateNestedManyWithoutPipelineStageInput } from '../pipeline-progress/pipeline-progress-create-nested-many-without-pipeline-stage.input';
import { PipelineCreateNestedOneWithoutPipelineStagesInput } from '../pipeline/pipeline-create-nested-one-without-pipeline-stages.input';
import { WorkspaceCreateNestedOneWithoutPipelineStagesInput } from '../workspace/workspace-create-nested-one-without-pipeline-stages.input';

@InputType()
export class PipelineStageCreateInput {

    @Field(() => String, {nullable:true})
    @Validator.IsString()
    @Validator.IsOptional()
    id?: string;

    @Field(() => String, {nullable:false})
    @Validator.IsString()
    name!: string;

    @Field(() => String, {nullable:false})
    @Validator.IsString()
    type!: string;

    @Field(() => String, {nullable:false})
    @Validator.IsString()
    color!: string;

    @HideField()
    deletedAt?: Date | string;

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => PipelineProgressCreateNestedManyWithoutPipelineStageInput, {nullable:true})
    pipelineProgresses?: PipelineProgressCreateNestedManyWithoutPipelineStageInput;

    @Field(() => PipelineCreateNestedOneWithoutPipelineStagesInput, {nullable:false})
    pipeline!: PipelineCreateNestedOneWithoutPipelineStagesInput;

    @HideField()
    workspace!: WorkspaceCreateNestedOneWithoutPipelineStagesInput;
}
