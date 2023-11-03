import console from 'console';

import { connectionSource, performQuery } from './utils';

const getWorkspacesFromMetadata = async () => {
  return await performQuery(
    `
        SELECT workspace_id AS id FROM metadata.data_source_metadata;
      `,
    'List workspaces',
  );
};

const getWorkspacesFromPublicSchema = async () => {
  return await performQuery(
    `
    SELECT id FROM workspaces;
    `,
    'List public workspaces',
  );
};

const getTables = async (workspace?) => {
  return await performQuery(
    `
            select * from pg_tables where schemaname='${
              workspace ? workspace.id : 'public'
            }';
        `,
    'List tables',
  );
};
const getMaxUpdatedAt = async (table) => {
  return await performQuery(
    `
          select MAX("updatedAt") from ${table.schemaname}."${table.tablename}";
      `,
    `Get max updatedAt from table ${table}`,
    false,
  );
};

const getMaxUpdatedAtFromPublic = async (table, workspace) => {
  const workspaceId = table.tablename === 'workspaces' ? 'id' : 'workspaceId';
  return await performQuery(
    `
        SELECT MAX("updatedAt") FROM ${table.tablename}
        WHERE "${workspaceId}"='${workspace.id}'
      `,
    'Get List of tables',
    false,
  );
};

const updateWorkspaceMaxUpdatedAt = (result, workspace, newUpdatedAt) => {
  if (!result[workspace.id]) result[workspace.id] = null;
  if (
    newUpdatedAt &&
    newUpdatedAt[0].max &&
    new Date(result[workspace.id]) < new Date(newUpdatedAt[0].max)
  ) {
    result[workspace.id] = newUpdatedAt[0].max;
  }
};

const logMaxUpdatedAtFromWorkspaceSchema = async (result) => {
  const workspaces = await getWorkspacesFromMetadata();
  for (const workspace of workspaces) {
    const tables = await getTables(workspace);
    for (const table of tables) {
      const maxUpdatedAt = await getMaxUpdatedAt(table);
      updateWorkspaceMaxUpdatedAt(result, workspace, maxUpdatedAt);
    }
  }
};

const logMaxUpdatedAtFromPublicSchema = async (result) => {
  const workspaces = await getWorkspacesFromPublicSchema();
  const tables = await getTables();
  for (const workspace of workspaces) {
    for (const table of tables) {
      const maxUpdatedAt = await getMaxUpdatedAtFromPublic(table, workspace);
      updateWorkspaceMaxUpdatedAt(result, workspace, maxUpdatedAt);
    }
  }
};

const enrichResults = (result) => {
  Object.keys(result).forEach((key) => {
    const timeDifferenceInSeconds = Math.abs(
      new Date().getTime() - new Date(result[key]).getTime(),
    );
    const timeDifferenceInDays = Math.ceil(
      timeDifferenceInSeconds / (1000 * 3600 * 24),
    );
    result[key] = `${result[
      key
    ].toISOString()} -> Inactive since ${timeDifferenceInDays} days`;
  });
};
connectionSource
  .initialize()
  .then(async () => {
    const result = {};
    await logMaxUpdatedAtFromWorkspaceSchema(result);
    await logMaxUpdatedAtFromPublicSchema(result);
    enrichResults(result);
    console.log(result);
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
