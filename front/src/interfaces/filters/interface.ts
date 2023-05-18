import { ReactNode } from 'react';
import { SearchConfigType, SearchableType } from '../search/interface';
import { Person } from '../entities/person.interface';
import { Company } from '../entities/company.interface';
import { User } from '../entities/user.interface';
import { AnyEntity, BoolExpType } from '../entities/generic.interface';

export type FilterableFieldsType = Person | Company;
export type FilterWhereRelationType = Person | Company | User | AnyEntity;
export type UnknownType = void;
export type FilterWhereType = FilterWhereRelationType | string | UnknownType;

export type FilterConfigType<
  FilteredType extends FilterableFieldsType,
  WhereType extends FilterWhereType = UnknownType,
> = {
  key: string;
  label: string;
  icon: ReactNode;
  operands: FilterOperandType<FilteredType, WhereType>[];
} & (WhereType extends UnknownType
  ? { searchConfig?: any }
  : WhereType extends SearchableType
  ? { searchConfig: SearchConfigType<WhereType> }
  : WhereType extends string
  ? object
  : never) &
  (WhereType extends UnknownType
    ? { selectedValueRender?: (selected: any) => string }
    : WhereType extends SearchableType
    ? { selectedValueRender: (selected: WhereType) => string }
    : WhereType extends string
    ? object
    : never);

export type FilterOperandType<
  FilteredType extends FilterableFieldsType,
  WhereType extends FilterWhereType = UnknownType,
> = WhereType extends UnknownType
  ? any
  : WhereType extends FilterWhereRelationType
  ? FilterOperandRelationType<FilteredType, WhereType>
  : WhereType extends string
  ? FilterOperandFieldType<FilteredType>
  : never;

type FilterOperandRelationType<
  FilteredType extends FilterableFieldsType,
  WhereType extends FilterWhereType,
> = {
  label: 'Is' | 'Is not';
  id: 'is' | 'is_not';
  whereTemplate: (value: WhereType) => BoolExpType<FilteredType>;
};

type FilterOperandFieldType<FilteredType extends FilterableFieldsType> = {
  label: 'Contains' | 'Does not contain';
  id: 'like' | 'not_like';
  whereTemplate: (value: string) => BoolExpType<FilteredType>;
};

export type SelectedFilterType<
  FilteredType extends FilterableFieldsType,
  WhereType extends FilterWhereType = UnknownType,
> = {
  key: string;
  value: WhereType extends UnknownType ? any : WhereType;
  displayValue: string;
  label: string;
  icon: ReactNode;
  operand: FilterOperandType<FilteredType, WhereType>;
};
