import {
  ActorFilter,
  AddressFilter,
  CurrencyFilter,
  DateFilter,
  EmailsFilter,
  FloatFilter,
  RecordGqlOperationFilter,
  RelationFilter,
  StringFilter,
  URLFilter,
  UUIDFilter,
} from '@/object-record/graphql/types/RecordGqlOperationFilter';
import { FilterDefinition } from '@/object-record/object-filter-dropdown/types/FilterDefinition';
import { ViewFilterOperand } from '@/views/types/ViewFilterOperand';
import { Field } from '~/generated/graphql';
import { generateILikeFiltersForCompositeFields } from '~/utils/array/generateILikeFiltersForCompositeFields';

// TODO: fix this
export const applyEmptyFilters = (
  operand: ViewFilterOperand,
  correspondingField: Pick<Field, 'id' | 'name'>,
  objectRecordFilters: RecordGqlOperationFilter[],
  definition: FilterDefinition,
) => {
  let emptyRecordFilter: RecordGqlOperationFilter = {};

  const newObjectRecordFilters: RecordGqlOperationFilter[] = [
    ...objectRecordFilters,
  ];

  switch (definition.type) {
    case 'TEXT':
    case 'EMAIL':
    case 'PHONE':
      emptyRecordFilter = {
        or: [
          { [correspondingField.name]: { ilike: '' } as StringFilter },
          { [correspondingField.name]: { is: 'NULL' } as StringFilter },
        ],
      };
      break;
    case 'CURRENCY':
      emptyRecordFilter = {
        or: [
          {
            [correspondingField.name]: {
              amountMicros: { is: 'NULL' },
            } as CurrencyFilter,
          },
        ],
      };
      break;
    case 'FULL_NAME': {
      if (definition.isSubField === false) {
        const fullNameFilters = generateILikeFiltersForCompositeFields(
          '',
          correspondingField.name,
          ['firstName', 'lastName'],
          true,
        );

        emptyRecordFilter = {
          and: fullNameFilters,
        };
      } else {
        emptyRecordFilter = {
          or: [
            {
              [correspondingField.name]: {
                [definition.fieldName]: { ilike: '' },
              },
            },
            {
              [correspondingField.name]: {
                [definition.fieldName]: { is: 'NULL' },
              },
            },
          ],
        };
      }
      break;
    }
    case 'LINK':
      emptyRecordFilter = {
        or: [
          { [correspondingField.name]: { url: { ilike: '' } } as URLFilter },
          {
            [correspondingField.name]: { url: { is: 'NULL' } } as URLFilter,
          },
        ],
      };
      break;
    case 'LINKS': {
      if (definition.isSubField === false) {
        const linksFilters = generateILikeFiltersForCompositeFields(
          '',
          correspondingField.name,
          ['primaryLinkLabel', 'primaryLinkUrl'],
          true,
        );

        emptyRecordFilter = {
          and: linksFilters,
        };
      } else {
        emptyRecordFilter = {
          or: [
            {
              [correspondingField.name]: {
                [definition.fieldName]: { ilike: '' },
              } as URLFilter,
            },
            {
              [correspondingField.name]: {
                [definition.fieldName]: { is: 'NULL' },
              } as URLFilter,
            },
          ],
        };
      }
      break;
    }
    case 'ADDRESS':
      if (definition.isSubField === false) {
        emptyRecordFilter = {
          and: [
            {
              or: [
                {
                  [correspondingField.name]: {
                    addressStreet1: { ilike: '' },
                  } as AddressFilter,
                },
                {
                  [correspondingField.name]: {
                    addressStreet1: { is: 'NULL' },
                  } as AddressFilter,
                },
              ],
            },
            {
              or: [
                {
                  [correspondingField.name]: {
                    addressStreet2: { ilike: '' },
                  } as AddressFilter,
                },
                {
                  [correspondingField.name]: {
                    addressStreet2: { is: 'NULL' },
                  } as AddressFilter,
                },
              ],
            },
            {
              or: [
                {
                  [correspondingField.name]: {
                    addressCity: { ilike: '' },
                  } as AddressFilter,
                },
                {
                  [correspondingField.name]: {
                    addressCity: { is: 'NULL' },
                  } as AddressFilter,
                },
              ],
            },
            {
              or: [
                {
                  [correspondingField.name]: {
                    addressState: { ilike: '' },
                  } as AddressFilter,
                },
                {
                  [correspondingField.name]: {
                    addressState: { is: 'NULL' },
                  } as AddressFilter,
                },
              ],
            },
            {
              or: [
                {
                  [correspondingField.name]: {
                    addressCountry: { ilike: '' },
                  } as AddressFilter,
                },
                {
                  [correspondingField.name]: {
                    addressCountry: { is: 'NULL' },
                  } as AddressFilter,
                },
              ],
            },
            {
              or: [
                {
                  [correspondingField.name]: {
                    addressPostcode: { ilike: '' },
                  } as AddressFilter,
                },
                {
                  [correspondingField.name]: {
                    addressPostcode: { is: 'NULL' },
                  } as AddressFilter,
                },
              ],
            },
          ],
        };
      } else {
        emptyRecordFilter = {
          or: [
            {
              [correspondingField.name]: {
                [definition.fieldName]: { ilike: '' },
              } as AddressFilter,
            },
            {
              [correspondingField.name]: {
                [definition.fieldName]: { is: 'NULL' },
              } as AddressFilter,
            },
          ],
        };
      }
      break;
    case 'NUMBER':
      emptyRecordFilter = {
        [correspondingField.name]: { is: 'NULL' } as FloatFilter,
      };
      break;
    case 'RATING':
      emptyRecordFilter = {
        [correspondingField.name]: { is: 'NULL' } as StringFilter,
      };
      break;
    case 'DATE_TIME':
      emptyRecordFilter = {
        [correspondingField.name]: { is: 'NULL' } as DateFilter,
      };
      break;
    case 'SELECT':
      emptyRecordFilter = {
        [correspondingField.name]: { is: 'NULL' } as UUIDFilter,
      };
      break;
    case 'RELATION':
      emptyRecordFilter = {
        [correspondingField.name + 'Id']: { is: 'NULL' } as RelationFilter,
      };
      break;
    case 'ACTOR':
      emptyRecordFilter = {
        or: [
          {
            [correspondingField.name]: {
              name: { ilike: '' },
            } as ActorFilter,
          },
          {
            [correspondingField.name]: {
              name: { is: 'NULL' },
            } as ActorFilter,
          },
        ],
      };
      break;
    case 'EMAILS':
      emptyRecordFilter = {
        or: [
          {
            [correspondingField.name]: {
              primaryEmail: { ilike: '' },
            } as EmailsFilter,
          },
          {
            [correspondingField.name]: {
              primaryEmail: { is: 'NULL' },
            } as EmailsFilter,
          },
        ],
      };
      break;
    default:
      throw new Error(`Unsupported empty filter type ${definition.type}`);
  }

  switch (operand) {
    case ViewFilterOperand.IsEmpty:
      newObjectRecordFilters.push(emptyRecordFilter);
      break;
    case ViewFilterOperand.IsNotEmpty:
      newObjectRecordFilters.push({
        not: emptyRecordFilter,
      });
      break;
    default:
      throw new Error(
        `Unknown operand ${operand} for ${definition.type} filter`,
      );
  }
};
