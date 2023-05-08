import {
  FaRegBuilding,
  FaCalendar,
  FaEnvelope,
  FaRegUser,
  FaMapPin,
  FaPhone,
  FaUser,
  FaBuilding,
} from 'react-icons/fa';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import ColumnHead from '../../components/table/ColumnHead';
import Checkbox from '../../components/form/Checkbox';
import CompanyChip, {
  CompanyChipPropsType,
} from '../../components/chips/CompanyChip';
import { GraphqlQueryPerson, Person } from '../../interfaces/person.interface';
import EditableText from '../../components/table/editable-cell/EditableText';
import {
  FilterType,
  SortType,
} from '../../components/table/table-header/interface';
import {
  Order_By,
  People_Bool_Exp,
  People_Order_By,
} from '../../generated/graphql';
import {
  SEARCH_COMPANY_QUERY,
  SEARCH_PEOPLE_QUERY,
} from '../../services/search/search';
import {
  GraphqlQueryCompany,
  PartialCompany,
} from '../../interfaces/company.interface';
import EditablePhone from '../../components/table/editable-cell/EditablePhone';
import EditableFullName from '../../components/table/editable-cell/EditableFullName';
import EditableDate from '../../components/table/editable-cell/EditableDate';
import EditableRelation from '../../components/table/editable-cell/EditableRelation';
import { updatePerson } from '../../services/people';
import { useMemo } from 'react';
import { SelectAllCheckbox } from '../../components/table/SelectAllCheckbox';

export const availableSorts = [
  {
    key: 'fullname',
    label: 'People',
    icon: <FaRegUser />,
    _type: 'custom_sort',
    orderByTemplate: (order: Order_By) => ({
      firstname: order,
      lastname: order,
    }),
  },
  {
    key: 'company_name',
    label: 'Company',
    icon: <FaRegBuilding />,
    _type: 'custom_sort',
    orderByTemplate: (order: Order_By) => ({ company: { name: order } }),
  },
  {
    key: 'email',
    label: 'Email',
    icon: <FaEnvelope />,
    _type: 'default_sort',
  },
  {
    key: 'phone',
    label: 'Phone',
    icon: <FaPhone />,
    _type: 'default_sort',
  },
  {
    key: 'created_at',
    label: 'Created at',
    icon: <FaCalendar />,
    _type: 'default_sort',
  },
  {
    key: 'city',
    label: 'City',
    icon: <FaMapPin />,
    _type: 'default_sort',
  },
] satisfies Array<SortType<People_Order_By>>;

const fullnameFilter = {
  key: 'fullname',
  label: 'People',
  icon: <FaUser />,
  whereTemplate: (operand, { firstname, lastname }) => {
    if (operand.keyWord === 'equal') {
      return {
        _and: [
          { firstname: { _eq: `${firstname}` } },
          { lastname: { _eq: `${lastname}` } },
        ],
      };
    }

    if (operand.keyWord === 'not_equal') {
      return {
        _not: {
          _and: [
            { firstname: { _eq: `${firstname}` } },
            { lastname: { _eq: `${lastname}` } },
          ],
        },
      };
    }
  },
  searchQuery: SEARCH_PEOPLE_QUERY,
  searchTemplate: (searchInput: string) => ({
    _or: [
      { firstname: { _ilike: `%${searchInput}%` } },
      { lastname: { _ilike: `%${searchInput}%` } },
    ],
  }),
  searchResultMapper: (person: GraphqlQueryPerson) => ({
    displayValue: `${person.firstname} ${person.lastname}`,
    value: { firstname: person.firstname, lastname: person.lastname },
  }),
  operands: [
    { label: 'Equal', id: 'equal', keyWord: 'equal' },
    { label: 'Not equal', id: 'not-equal', keyWord: 'not_equal' },
  ],
} satisfies FilterType<People_Bool_Exp>;

const companyFilter = {
  key: 'company_name',
  label: 'Company',
  icon: <FaBuilding />,
  whereTemplate: (operand, { companyName }) => {
    if (operand.keyWord === 'equal') {
      return {
        company: { name: { _eq: companyName } },
      };
    }

    if (operand.keyWord === 'not_equal') {
      return {
        _not: { company: { name: { _eq: companyName } } },
      };
    }
  },
  searchQuery: SEARCH_COMPANY_QUERY,
  searchTemplate: (searchInput: string) => ({
    name: { _ilike: `%${searchInput}%` },
  }),
  searchResultMapper: (company: GraphqlQueryCompany) => ({
    displayValue: company.name,
    value: { companyName: company.name },
  }),
  operands: [
    { label: 'Equal', id: 'equal', keyWord: 'equal' },
    { label: 'Not equal', id: 'not-equal', keyWord: 'not_equal' },
  ],
} satisfies FilterType<People_Bool_Exp>;

const emailFilter = {
  key: 'email',
  label: 'Email',
  icon: <FaEnvelope />,
  whereTemplate: (operand, { email }) => {
    if (operand.keyWord === 'equal') {
      return {
        email: { _eq: email },
      };
    }

    if (operand.keyWord === 'not_equal') {
      return {
        _not: { email: { _eq: email } },
      };
    }
  },
  searchQuery: SEARCH_PEOPLE_QUERY,
  searchTemplate: (searchInput: string) => ({
    email: { _ilike: `%${searchInput}%` },
  }),
  searchResultMapper: (person: GraphqlQueryPerson) => ({
    displayValue: person.email,
    value: { email: person.email },
  }),
  operands: [
    { label: 'Equal', id: 'equal', keyWord: 'equal' },
    { label: 'Not equal', id: 'not-equal', keyWord: 'not_equal' },
  ],
} satisfies FilterType<People_Bool_Exp>;

const cityFilter = {
  key: 'city',
  label: 'City',
  icon: <FaMapPin />,
  whereTemplate: (operand, { city }) => {
    if (operand.keyWord === 'equal') {
      return {
        city: { _eq: city },
      };
    }

    if (operand.keyWord === 'not_equal') {
      return {
        _not: { city: { _eq: city } },
      };
    }
  },
  searchQuery: SEARCH_PEOPLE_QUERY,
  searchTemplate: (searchInput: string) => ({
    city: { _ilike: `%${searchInput}%` },
  }),
  searchResultMapper: (person: GraphqlQueryPerson) => ({
    displayValue: person.city,
    value: { city: person.city },
  }),
  operands: [
    { label: 'Equal', id: 'equal', keyWord: 'equal' },
    { label: 'Not equal', id: 'not-equal', keyWord: 'not_equal' },
  ],
} satisfies FilterType<People_Bool_Exp>;

export const availableFilters = [
  fullnameFilter,
  companyFilter,
  emailFilter,
  cityFilter,
  // {
  //   key: 'phone',
  //   label: 'Phone',
  //   icon: faPhone,
  //   whereTemplate: () => ({ phone: { _ilike: '%value%' } }),
  //   searchQuery: GET_PEOPLE,
  //   searchTemplate: { phone: { _ilike: '%value%' } },
  // },
  // {
  //   key: 'created_at',
  //   label: 'Created at',
  //   icon: faCalendar,
  //   whereTemplate: () => ({ created_at: { _eq: '%value%' } }),
  //   searchQuery: GET_PEOPLE,
  //   searchTemplate: { created_at: { _eq: '%value%' } },
  // },
] satisfies FilterType<People_Bool_Exp>[];

const columnHelper = createColumnHelper<Person>();

export const usePeopleColumns = () => {
  return useMemo(() => {
    return [
      {
        id: 'select',
        header: ({ table }: any) => (
          <SelectAllCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: (props: CellContext<Person, string>) => (
          <Checkbox
            id={`person-selected-${props.row.original.id}`}
            name={`person-selected-${props.row.original.id}`}
            checked={props.row.getIsSelected()}
            onChange={props.row.getToggleSelectedHandler()}
          />
        ),
      },
      columnHelper.accessor('firstname', {
        header: () => <ColumnHead viewName="People" viewIcon={<FaRegUser />} />,
        cell: (props) => (
          <EditableFullName
            firstname={props.row.original.firstname}
            lastname={props.row.original.lastname}
            changeHandler={(firstName: string, lastName: string) => {
              const person = props.row.original;
              person.firstname = firstName;
              person.lastname = lastName;
              updatePerson(person);
            }}
          />
        ),
      }),
      columnHelper.accessor('email', {
        header: () => <ColumnHead viewName="Email" viewIcon={<FaEnvelope />} />,
        cell: (props) => (
          <EditableText
            placeholder="Email"
            content={props.row.original.email}
            changeHandler={(value: string) => {
              const person = props.row.original;
              person.email = value;
              updatePerson(person);
            }}
          />
        ),
      }),
      columnHelper.accessor('company', {
        header: () => (
          <ColumnHead viewName="Company" viewIcon={<FaRegBuilding />} />
        ),
        cell: (props) => (
          <EditableRelation<PartialCompany, CompanyChipPropsType>
            relation={props.row.original.company}
            searchPlaceholder="Company"
            ChipComponent={CompanyChip}
            chipComponentPropsMapper={(
              company: PartialCompany,
            ): CompanyChipPropsType => {
              return {
                name: company.name,
                picture: `https://www.google.com/s2/favicons?domain=${company.domain_name}&sz=256`,
              };
            }}
            changeHandler={(relation: PartialCompany) => {
              const person = props.row.original;
              if (person.company) {
                person.company.id = relation.id;
              } else {
                person.company = {
                  id: relation.id,
                  name: relation.name,
                  domain_name: relation.domain_name,
                };
              }
              updatePerson(person);
            }}
            searchFilter={
              {
                key: 'company_name',
                label: 'Company',
                icon: <FaBuilding />,
                whereTemplate: () => {
                  return {};
                },
                searchQuery: SEARCH_COMPANY_QUERY,
                searchTemplate: (searchInput: string) => ({
                  name: { _ilike: `%${searchInput}%` },
                }),
                searchResultMapper: (company: GraphqlQueryCompany) => ({
                  displayValue: company.name,
                  value: {
                    id: company.id,
                    name: company.name,
                    domain_name: company.domain_name,
                  },
                }),
                operands: [],
              } satisfies FilterType<People_Bool_Exp>
            }
          />
        ),
      }),
      columnHelper.accessor('phone', {
        header: () => <ColumnHead viewName="Phone" viewIcon={<FaPhone />} />,
        cell: (props) => (
          <EditablePhone
            placeholder="Phone"
            value={props.row.original.phone}
            changeHandler={(value: string) => {
              const person = props.row.original;
              person.phone = value;
              updatePerson(person);
            }}
          />
        ),
      }),
      columnHelper.accessor('creationDate', {
        header: () => (
          <ColumnHead viewName="Creation" viewIcon={<FaCalendar />} />
        ),
        cell: (props) => (
          <EditableDate
            value={props.row.original.creationDate}
            changeHandler={(value: Date) => {
              const person = props.row.original;
              person.creationDate = value;
              updatePerson(person);
            }}
          />
        ),
      }),
      columnHelper.accessor('city', {
        header: () => <ColumnHead viewName="City" viewIcon={<FaMapPin />} />,
        cell: (props) => (
          <EditableText
            editModeHorizontalAlign="right"
            placeholder="City"
            content={props.row.original.city}
            changeHandler={(value: string) => {
              const person = props.row.original;
              person.city = value;
              updatePerson(person);
            }}
          />
        ),
      }),
    ];
  }, []);
};
