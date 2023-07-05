import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { StringFieldUpdateOperationsInput } from '../prisma/string-field-update-operations.input';
import { NullableDateTimeFieldUpdateOperationsInput } from '../prisma/nullable-date-time-field-update-operations.input';
import { HideField } from '@nestjs/graphql';
import { DateTimeFieldUpdateOperationsInput } from '../prisma/date-time-field-update-operations.input';
import { CommentThreadUpdateOneRequiredWithoutCommentsNestedInput } from '../comment-thread/comment-thread-update-one-required-without-comments-nested.input';
import { WorkspaceUpdateOneRequiredWithoutCommentsNestedInput } from '../workspace/workspace-update-one-required-without-comments-nested.input';

@InputType()
export class CommentUpdateWithoutAuthorInput {

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    id?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    body?: StringFieldUpdateOperationsInput;

    @HideField()
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    createdAt?: DateTimeFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    updatedAt?: DateTimeFieldUpdateOperationsInput;

    @Field(() => CommentThreadUpdateOneRequiredWithoutCommentsNestedInput, {nullable:true})
    commentThread?: CommentThreadUpdateOneRequiredWithoutCommentsNestedInput;

    @HideField()
    workspace?: WorkspaceUpdateOneRequiredWithoutCommentsNestedInput;
}
