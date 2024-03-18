import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';
import compact from 'lodash/compact';

import { Participant } from 'src/modules/messaging/types/gmail-message';
import { getDomainNameFromHandle } from 'src/modules/messaging/utils/get-domain-name-from-handle.util';
import { CreateCompanyService } from 'src/modules/connected-account/auto-companies-and-contacts-creation/create-company/create-company.service';
import { CreateContactService } from 'src/modules/connected-account/auto-companies-and-contacts-creation/create-contact/create-contact.service';
import { PersonRepository } from 'src/modules/person/repositories/person/person.repository';
import { WorkspaceMemberRepository } from 'src/modules/workspace-member/repositories/workspace-member/workspace-member.repository';
import { getUniqueParticipantsAndHandles } from 'src/modules/messaging/utils/get-unique-participants-and-handles.util';
import { filterOutParticipantsFromCompanyOrWorkspace } from 'src/modules/messaging/utils/filter-out-participants-from-company-or-workspace.util';
import { isWorkEmail } from 'src/utils/is-work-email';
import { InjectObjectMetadataRepository } from 'src/engine/object-metadata-repository.decorator';
import { PersonObjectMetadata } from 'src/modules/person/standard-objects/person.object-metadata';
import { WorkspaceMemberObjectMetadata } from 'src/modules/workspace-member/standard-objects/workspace-member.object-metadata';

@Injectable()
export class CreateCompanyAndContactService {
  constructor(
    private readonly createContactService: CreateContactService,
    private readonly createCompaniesService: CreateCompanyService,
    @InjectObjectMetadataRepository(PersonObjectMetadata)
    private readonly personRepository: PersonRepository,
    @InjectObjectMetadataRepository(WorkspaceMemberObjectMetadata)
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
  ) {}

  async createCompaniesAndContacts(
    selfHandle: string,
    participants: Participant[],
    workspaceId: string,
    transactionManager?: EntityManager,
  ) {
    if (!participants || participants.length === 0) {
      return;
    }

    // TODO: This is a feature that may be implemented in the future
    const isContactAutoCreationForNonWorkEmailsEnabled = false;

    const workspaceMembers =
      await this.workspaceMemberRepository.getAllByWorkspaceId(
        workspaceId,
        transactionManager,
      );

    const participantsFromOtherCompanies =
      filterOutParticipantsFromCompanyOrWorkspace(
        participants,
        selfHandle,
        workspaceMembers,
      );

    const { uniqueParticipants, uniqueHandles } =
      getUniqueParticipantsAndHandles(participantsFromOtherCompanies);

    if (uniqueHandles.length === 0) {
      return;
    }

    const alreadyCreatedContacts = await this.personRepository.getByEmails(
      uniqueHandles,
      workspaceId,
    );

    const alreadyCreatedContactEmails: string[] = alreadyCreatedContacts?.map(
      ({ email }) => email,
    );

    const filteredParticipants = uniqueParticipants.filter(
      (participant) =>
        !alreadyCreatedContactEmails.includes(participant.handle) &&
        participant.handle.includes('@') &&
        (isContactAutoCreationForNonWorkEmailsEnabled ||
          isWorkEmail(participant.handle)),
    );

    const filteredParticipantsWithCompanyDomainNames =
      filteredParticipants?.map((participant) => ({
        handle: participant.handle,
        displayName: participant.displayName,
        companyDomainName: isWorkEmail(participant.handle)
          ? getDomainNameFromHandle(participant.handle)
          : undefined,
      }));

    const domainNamesToCreate = compact(
      filteredParticipantsWithCompanyDomainNames.map(
        (participant) => participant.companyDomainName,
      ),
    );

    const companiesObject = await this.createCompaniesService.createCompanies(
      domainNamesToCreate,
      workspaceId,
      transactionManager,
    );

    const contactsToCreate = filteredParticipantsWithCompanyDomainNames.map(
      (participant) => ({
        handle: participant.handle,
        displayName: participant.displayName,
        companyId:
          participant.companyDomainName &&
          companiesObject[participant.companyDomainName],
      }),
    );

    await this.createContactService.createContacts(
      contactsToCreate,
      workspaceId,
      transactionManager,
    );
  }
}
