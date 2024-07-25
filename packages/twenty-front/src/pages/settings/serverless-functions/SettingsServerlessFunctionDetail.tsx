import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IconCode, IconSettings, IconTestPipe } from 'twenty-ui';
import { SubMenuTopBarContainer } from '@/ui/layout/page/SubMenuTopBarContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';
import { SettingsHeaderContainer } from '@/settings/components/SettingsHeaderContainer';
import { useGetOneServerlessFunction } from '@/settings/serverless-functions/hooks/useGetOneServerlessFunction';
import { Section } from '@/ui/layout/section/components/Section';
import { TabList } from '@/ui/layout/tab/components/TabList';
import { isDefined } from '~/utils/isDefined';
import { getFileAbsoluteURI } from '~/utils/file/getFileAbsoluteURI';
import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { SettingsServerlessFunctionCodeEditorTab } from '@/settings/serverless-functions/components/tabs/SettingsServerlessFunctionCodeEditorTab';
import { SettingsServerlessFunctionSettingsTab } from '@/settings/serverless-functions/components/tabs/SettingsServerlessFunctionSettingsTab';
import { useServerlessFunctionFormValues } from '@/settings/serverless-functions/forms/useServerlessFunctionFormValues';
import { SettingsServerlessFunctionTestTab } from '@/settings/serverless-functions/components/tabs/SettingsServerlessFunctionTestTab';
import { useExecuteOneServerlessFunction } from '@/settings/serverless-functions/hooks/useExecuteOneServerlessFunction';
import { SnackBarVariant } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useUpdateOneServerlessFunction } from '@/settings/serverless-functions/hooks/useUpdateOneServerlessFunction';
import { useDebouncedCallback } from 'use-debounce';
import { SettingsServerlessFunctionTestTabEffect } from '@/settings/serverless-functions/components/tabs/SettingsServerlessFunctionTestTabEffect';
import { settingsServerlessFunctionOutputState } from '@/settings/serverless-functions/states/settingsServerlessFunctionOutputState';
import { settingsServerlessFunctionInputState } from '@/settings/serverless-functions/states/settingsServerlessFunctionInputState';

const TAB_LIST_COMPONENT_ID = 'serverless-function-detail';

export const SettingsServerlessFunctionDetail = () => {
  const { serverlessFunctionId = '' } = useParams();
  const { enqueueSnackBar } = useSnackBar();
  const { activeTabIdState, setActiveTabId } = useTabList(
    TAB_LIST_COMPONENT_ID,
  );
  const activeTabId = useRecoilValue(activeTabIdState);
  const { serverlessFunction } =
    useGetOneServerlessFunction(serverlessFunctionId);
  const { executeOneServerlessFunction } = useExecuteOneServerlessFunction();
  const { updateOneServerlessFunction } = useUpdateOneServerlessFunction();
  const [savedCode, setSavedCode] = useState<string>('');
  const [formValues, setFormValues] = useServerlessFunctionFormValues();
  const setSettingsServerlessFunctionOutput = useSetRecoilState(
    settingsServerlessFunctionOutputState,
  );
  const settingsServerlessFunctionInput = useRecoilValue(
    settingsServerlessFunctionInputState,
  );

  const canSave =
    savedCode !== formValues.code ||
    serverlessFunction?.name !== formValues.name ||
    serverlessFunction?.description !== formValues.description;

  const save = async () => {
    try {
      const { data } = await updateOneServerlessFunction({
        id: serverlessFunction?.id,
        name: formValues.name,
        description: formValues.description,
        code: formValues.code,
      });
      const newState = {
        ...(isDefined(data?.updateOneServerlessFunction?.name) && {
          name: data?.updateOneServerlessFunction?.name,
        }),
        ...(isDefined(data?.updateOneServerlessFunction?.description) && {
          description: data?.updateOneServerlessFunction?.description,
        }),
      };
      setFormValues((prevState) => ({
        ...prevState,
        ...newState,
      }));
    } catch (err) {
      enqueueSnackBar(
        (err as Error)?.message || 'An error occurred while updating function',
        {
          variant: SnackBarVariant.Error,
        },
      );
    }
  };

  const handleSave = useDebouncedCallback(save, 500);

  const onChange = (key: string) => {
    return async (value: string | undefined) => {
      setFormValues((prevState) => ({
        ...prevState,
        [key]: value,
      }));
      await handleSave();
    };
  };

  const handleExecute = async () => {
    if (canSave) {
      await handleSave();
    }
    try {
      const result = await executeOneServerlessFunction(
        serverlessFunction?.id,
        JSON.parse(settingsServerlessFunctionInput),
      );
      setSettingsServerlessFunctionOutput(
        JSON.stringify(
          result?.data?.executeOneServerlessFunction?.result,
          null,
          4,
        ),
      );
    } catch (err) {
      enqueueSnackBar(
        (err as Error)?.message || 'An error occurred while executing function',
        {
          variant: SnackBarVariant.Error,
        },
      );
      setSettingsServerlessFunctionOutput(JSON.stringify(err, null, 4));
    }
    setActiveTabId('test');
  };

  useEffect(() => {
    const getFileContent = async () => {
      const resp = await fetch(
        getFileAbsoluteURI(serverlessFunction?.sourceCodeFullPath),
      );
      if (resp.status !== 200) {
        throw new Error('Network response was not ok');
      } else {
        const result = await resp.text();
        setSavedCode(result);
        const newState = {
          code: result,
          ...(isDefined(serverlessFunction?.name) && {
            name: serverlessFunction?.name,
          }),
          ...(isDefined(serverlessFunction?.description) && {
            description: serverlessFunction?.description,
          }),
        };
        setFormValues((prevState) => ({
          ...prevState,
          ...newState,
        }));
      }
    };
    if (isDefined(serverlessFunction?.sourceCodeFullPath)) {
      getFileContent();
    }
  }, [serverlessFunction, setFormValues]);

  const tabs = [
    { id: 'editor', title: 'Editor', Icon: IconCode },
    { id: 'test', title: 'Test', Icon: IconTestPipe },
    { id: 'settings', title: 'Settings', Icon: IconSettings },
  ];

  const renderActiveTabContent = () => {
    switch (activeTabId) {
      case 'editor':
        return (
          <SettingsServerlessFunctionCodeEditorTab
            formValues={formValues}
            handleExecute={handleExecute}
            onChange={onChange}
          />
        );
      case 'test':
        return (
          <>
            <SettingsServerlessFunctionTestTabEffect />
            <SettingsServerlessFunctionTestTab handleExecute={handleExecute} />
          </>
        );
      case 'settings':
        return (
          <SettingsServerlessFunctionSettingsTab
            formValues={formValues}
            serverlessFunctionId={serverlessFunctionId}
            onChange={onChange}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    serverlessFunction?.name && (
      <SubMenuTopBarContainer Icon={IconSettings} title="Settings">
        <SettingsPageContainer>
          <SettingsHeaderContainer>
            <Breadcrumb
              links={[
                { children: 'Functions', href: '/settings/functions' },
                { children: `${serverlessFunction?.name}` },
              ]}
            />
          </SettingsHeaderContainer>
          <Section>
            <TabList tabListId={TAB_LIST_COMPONENT_ID} tabs={tabs} />
          </Section>
          {renderActiveTabContent()}
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
    )
  );
};
