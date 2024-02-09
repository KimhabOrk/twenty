import { gql } from '@apollo/client';

export const GET_CURRENT_USER_AND_VIEWS = gql`
  query GetCurrentUserAndViews {
    currentUser {
      id
      firstName
      lastName
      email
      canImpersonate
      supportUserHash
      workspaceMember {
        id
        name {
          firstName
          lastName
        }
        colorScheme
        avatarUrl
        locale
      }
      defaultWorkspace {
        id
        displayName
        logo
        domainName
        inviteHash
        allowImpersonation
        subscriptionStatus
        featureFlags {
          id
          key
          value
          workspaceId
        }
      }
    }
    views {
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          createdAt
          updatedAt
          name
          objectMetadataId
          type
          deletedAt
          viewFilters {
            edges {
              cursor
              node {
                id
                createdAt
                updatedAt
                fieldMetadataId
                operand
                value
                displayValue
                deletedAt
              }
            }
          }
          viewSorts {
            edges {
              cursor
              node {
                id
                createdAt
                updatedAt
                fieldMetadataId
                direction
                deletedAt
              }
            }
          }
          viewFields {
            edges {
              cursor
              node {
                id
                createdAt
                updatedAt
                fieldMetadataId
                isVisible
                size
                position
                deletedAt
              }
            }
          }
        }
      }
    }
  }
`;
