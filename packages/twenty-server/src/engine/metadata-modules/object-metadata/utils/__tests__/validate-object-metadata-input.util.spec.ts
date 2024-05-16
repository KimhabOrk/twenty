import { UpdateObjectPayload } from 'src/engine/metadata-modules/object-metadata/dtos/update-object.input';
import { validateObjectMetadataInput } from 'src/engine/metadata-modules/object-metadata/utils/validate-object-metadata-input.util';

const validObjectInput: UpdateObjectPayload = {
  labelPlural: 'Car',
  labelSingular: 'Cars',
  nameSingular: 'car',
  namePlural: 'cars',
};

const reservedKeyword = 'user';

describe('validateObjectName', () => {
  it('should not throw if names are valid', () => {
    expect(() => validateObjectMetadataInput(validObjectInput)).not.toThrow();
  });

  it('should throw is nameSingular has invalid characters', () => {
    const invalidObjectInput = {
      ...validObjectInput,
      nameSingular: 'μ',
    };

    expect(() => validateObjectMetadataInput(invalidObjectInput)).toThrow();
  });

  it('should throw is namePlural has invalid characters', () => {
    const invalidObjectInput = {
      ...validObjectInput,
      namePlural: 'μ',
    };

    expect(() => validateObjectMetadataInput(invalidObjectInput)).toThrow();
  });

  it('should throw if nameSingular is a reserved keyword', async () => {
    const invalidObjectInput = {
      ...validObjectInput,
      nameSingular: reservedKeyword,
    };

    expect(() => validateObjectMetadataInput(invalidObjectInput)).toThrow();
  });

  it('should throw if namePlural is a reserved keyword', async () => {
    const invalidObjectInput = {
      ...validObjectInput,
      namePlural: reservedKeyword,
    };

    expect(() => validateObjectMetadataInput(invalidObjectInput)).toThrow();
  });
});
