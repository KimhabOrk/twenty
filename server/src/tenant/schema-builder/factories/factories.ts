import { ArgsFactory } from './args.factory';
import { InputTypeFactory } from './input-type.factory';
import { InputTypeDefinitionFactory } from './input-type-definition.factory';
import { ObjectTypeDefinitionFactory } from './object-type-definition.factory';
import { OutputTypeFactory } from './output-type.factory';
import { QueryTypeFactory } from './query-type.factory';
import { RootTypeFactory } from './root-type.factory';
import { FilterTypeFactory } from './filter-type.factory';
import { FilterTypeDefinitionFactory } from './filter-type-definition.factory';
import { ConnectionTypeFactory } from './connection-type.factory';
import { ConnectionTypeDefinitionFactory } from './connection-type-definition.factory';
import { EdgeTypeFactory } from './edge-type.factory';
import { EdgeTypeDefinitionFactory } from './edge-type-definition.factory';
import { MutationTypeFactory } from './mutation-type.factory';
import { OrderByTypeFactory } from './order-by-type.factory';
import { OrderByTypeDefinitionFactory } from './order-by-type-definition.factory';

export const schemaBuilderFactories = [
  ArgsFactory,
  InputTypeFactory,
  InputTypeDefinitionFactory,
  OutputTypeFactory,
  ObjectTypeDefinitionFactory,
  FilterTypeFactory,
  FilterTypeDefinitionFactory,
  OrderByTypeFactory,
  OrderByTypeDefinitionFactory,
  ConnectionTypeFactory,
  ConnectionTypeDefinitionFactory,
  EdgeTypeFactory,
  EdgeTypeDefinitionFactory,
  RootTypeFactory,
  QueryTypeFactory,
  MutationTypeFactory,
];
