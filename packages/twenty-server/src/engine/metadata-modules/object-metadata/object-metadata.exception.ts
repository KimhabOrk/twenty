import { CustomException } from 'src/utils/custom-exception';

export class ObjectMetadataException extends CustomException {
  code: ObjectMetadataExceptionCode;
  constructor(message: string, code: ObjectMetadataExceptionCode) {
    super(message, code);
  }
}

export enum ObjectMetadataExceptionCode {
  OBJECT_METADATA_NOT_FOUND = 'OBJECT_METADATA_NOT_FOUND',
  INVALID_OBJECT_INPUT = 'INVALID_OBJECT_INPUT',
  OBJECT_MUTATION_NOT_ALLOWED = 'OBJECT_MUTATION_NOT_ALLOWED',
  OBJECT_ALREADY_EXISTS = 'OBJECT_ALREADY_EXISTS',
  INVALID_LABEL_IDENTIFIER = 'INVALID_LABEL_IDENTIFIER',
}
