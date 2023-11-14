const workspaceMemberMetadata = {
  nameSingular: 'workspaceMemberV2',
  namePlural: 'workspaceMembersV2',
  labelSingular: 'Workspace Member',
  labelPlural: 'Workspace Members',
  targetTableName: 'workspaceMember',
  description: 'A workspace member',
  icon: 'IconUserCircle',
  isActive: true,
  isSystem: true,
  fields: [
    {
      isCustom: false,
      isActive: true,
      type: 'TEXT',
      name: 'firstName',
      label: 'First name',
      targetColumnMap: {
        value: 'firstName',
      },
      description: 'Workspace member first name',
      icon: 'IconCircleUser',
      isNullable: false,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'TEXT',
      name: 'lastName',
      label: 'Last name',
      targetColumnMap: {
        value: 'lastName',
      },
      description: 'Workspace member last name',
      icon: 'IconCircleUser',
      isNullable: false,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'UUID',
      name: 'userId',
      label: 'User Id',
      targetColumnMap: {
        value: 'userId',
      },
      description: 'Associated User Id',
      icon: 'IconCircleUsers',
      isNullable: false,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'BOOLEAN',
      name: 'allowImpersonation',
      label: 'Admin Access',
      targetColumnMap: {
        value: 'allowImpersonation',
      },
      description: 'Allow Admin Access',
      icon: 'IconEye',
      isNullable: false,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'TEXT',
      name: 'colorScheme',
      label: 'Color Scheme',
      targetColumnMap: {
        value: 'colorScheme',
      },
      description: 'Preferred color scheme',
      icon: 'IconColorSwatch',
      isNullable: false,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'TEXT',
      name: 'locale',
      label: 'Language',
      targetColumnMap: {
        value: 'locale',
      },
      description: 'Preferred language',
      icon: 'IconLanguage',
      isNullable: false,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'RELATION',
      name: 'authoredActivities',
      label: 'Authored activities',
      targetColumnMap: {},
      description: 'Activities created by the workspace member',
      icon: 'IconCheckbox',
      isNullable: true,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'RELATION',
      name: 'assignedActivities',
      label: 'Assigned activities',
      targetColumnMap: {},
      description: 'Activities assigned to the workspace member',
      icon: 'IconCheckbox',
      isNullable: true,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'RELATION',
      name: 'favorites',
      label: 'Favorites',
      targetColumnMap: {},
      description: 'Favorites linked to the workspace member',
      icon: 'IconHeart',
      isNullable: true,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'RELATION',
      name: 'accountOwnerForCompanies',
      label: 'Account Owner For Companies',
      targetColumnMap: {},
      description: 'Account owner for companies',
      icon: 'IconBriefcase',
      isNullable: true,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'RELATION',
      name: 'authoredAttachments',
      label: 'Authored attachments',
      targetColumnMap: {},
      description: 'Attachments created by the workspace member',
      icon: 'IconFileImport',
      isNullable: true,
    },
    {
      isCustom: false,
      isActive: true,
      type: 'RELATION',
      name: 'authoredComments',
      label: 'Authored comments',
      targetColumnMap: {},
      description: 'Authored comments',
      icon: 'IconComment',
      isNullable: true,
    },
  ],
};

export default workspaceMemberMetadata;
