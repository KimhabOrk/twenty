import {
  FieldBooleanMetadata,
  FieldChipMetadata,
  FieldDateMetadata,
  FieldMetadata,
  FieldMoneyMetadata,
  FieldNumberMetadata,
  FieldRelationMetadata,
  FieldTextMetadata,
  FieldURLMetadata,
} from '@/ui/field/types/FieldMetadata';
import {
  IconBrandLinkedin,
  IconBrandX,
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconLink,
  IconMap,
  IconMoneybag,
  IconTarget,
  IconUserCircle,
  IconUsers,
} from '@/ui/icon/index';
import { Entity } from '@/ui/input/relation-picker/types/EntityTypeForSelect';
import { ColumnDefinition } from '@/ui/table/types/ColumnDefinition';

export const companiesAvailableColumnDefinitions: ColumnDefinition<FieldMetadata>[] =
  [
    {
      key: 'name',
      name: 'Name',
      Icon: IconBuildingSkyscraper,
      size: 180,
      index: 0,
      type: 'chip',
      metadata: {
        urlFieldName: 'domainName',
        contentFieldName: 'name',
        relationType: Entity.Company,
      },
      isVisible: true,
    } as ColumnDefinition<FieldChipMetadata>,
    {
      key: 'domainName',
      name: 'URL',
      Icon: IconLink,
      size: 100,
      index: 1,
      type: 'url',
      metadata: {
        fieldName: 'domainName',
        placeHolder: 'example.com',
      },
      isVisible: true,
    } as ColumnDefinition<FieldURLMetadata>,
    {
      key: 'accountOwner',
      name: 'Account Owner',
      Icon: IconUserCircle,
      size: 150,
      index: 2,
      type: 'relation',
      metadata: {
        fieldName: 'accountOwner',
        relationType: Entity.User,
      },
      isVisible: true,
    } as ColumnDefinition<FieldRelationMetadata>,
    {
      key: 'createdAt',
      name: 'Creation',
      Icon: IconCalendarEvent,
      size: 150,
      index: 3,
      type: 'date',
      metadata: {
        fieldName: 'createdAt',
      },
      isVisible: true,
    } as ColumnDefinition<FieldDateMetadata>,
    {
      key: 'employees',
      name: 'Employees',
      Icon: IconUsers,
      size: 150,
      index: 4,
      type: 'number',
      metadata: {
        fieldName: 'employees',
        isPositive: true,
      },
      isVisible: true,
    } as ColumnDefinition<FieldNumberMetadata>,
    {
      key: 'linkedin',
      name: 'LinkedIn',
      Icon: IconBrandLinkedin,
      size: 170,
      index: 5,
      type: 'url',
      metadata: {
        fieldName: 'linkedinUrl',
        placeHolder: 'LinkedIn URL',
      },
      isVisible: true,
    } as ColumnDefinition<FieldURLMetadata>,
    {
      key: 'address',
      name: 'Address',
      Icon: IconMap,
      size: 170,
      index: 6,
      type: 'text',
      metadata: {
        fieldName: 'address',
        placeHolder: 'Addre​ss', // Hack: Fake character to prevent password-manager from filling the field
      },
      isVisible: true,
    } as ColumnDefinition<FieldTextMetadata>,
    {
      key: 'idealCustomerProfile',
      name: 'ICP',
      Icon: IconTarget,
      size: 150,
      index: 7,
      type: 'boolean',
      metadata: {
        fieldName: 'idealCustomerProfile',
      },
      isVisible: false,
    } as ColumnDefinition<FieldBooleanMetadata>,
    {
      key: 'annualRecurringRevenue',
      name: 'ARR',
      Icon: IconMoneybag,
      size: 150,
      index: 8,
      type: 'moneyAmount',
      metadata: {
        fieldName: 'annualRecurringRevenue',
      },
    } as ColumnDefinition<FieldMoneyMetadata>,
    {
      key: 'xUrl',
      name: 'Twitter',
      Icon: IconBrandX,
      size: 150,
      index: 9,
      type: 'url',
      metadata: {
        fieldName: 'xUrl',
        placeHolder: 'X',
      },
      isVisible: false,
    } as ColumnDefinition<FieldURLMetadata>,
  ];
