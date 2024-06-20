import { useCallback, useState } from 'react';
import styled from '@emotion/styled';

import { Heading } from '@/spreadsheet-import/components/Heading';
import { StepNavigationButton } from '@/spreadsheet-import/components/StepNavigationButton';
import { RawData } from '@/spreadsheet-import/types';
import { Modal } from '@/ui/layout/modal/components/Modal';

import { SelectHeaderTable } from './components/SelectHeaderTable';

const StyledHeading = styled(Heading)`
  margin-bottom: ${({ theme }) => theme.spacing(8)};
`;

const StyledTableContainer = styled.div`
  display: flex;
  flex-grow: 1;
  height: 0px;
`;

type SelectHeaderStepProps = {
  data: RawData[];
  onContinue: (headerValues: RawData, data: RawData[]) => Promise<void>;
  onBack: () => void;
};

export const SelectHeaderStep = ({
  data,
  onContinue,
  onBack,
}: SelectHeaderStepProps) => {
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(
    new Set([0]),
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = useCallback(async () => {
    const [selectedRowIndex] = Array.from(new Set(selectedRows));
    // We consider data above header to be redundant
    const trimmedData = data.slice(selectedRowIndex + 1);
    setIsLoading(true);
    await onContinue(data[selectedRowIndex], trimmedData);
    setIsLoading(false);
  }, [onContinue, data, selectedRows]);

  return (
    <>
      <Modal.Content>
        <StyledHeading title="Select header row" />
        <StyledTableContainer>
          <SelectHeaderTable
            data={data}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </StyledTableContainer>
      </Modal.Content>
      <StepNavigationButton
        onClick={handleContinue}
        onBack={onBack}
        title="Continue"
        isLoading={isLoading}
      />
    </>
  );
};
