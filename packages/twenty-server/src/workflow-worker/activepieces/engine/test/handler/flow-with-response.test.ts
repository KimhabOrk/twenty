import { FlowRunStatus } from 'src/workflow-worker/activepieces/shared/src';

import {
  ExecutionVerdict,
  FlowExecutorContext,
} from '../../src/lib/handler/context/flow-execution-context';
import { flowExecutor } from '../../src/lib/handler/flow-executor';

import { buildPieceAction, generateMockEngineConstants } from './test-helper';

describe('flow with response', () => {
  it('should execute return response successfully', async () => {
    const input = {
      status: 200,
      headers: {
        random: 'header',
      },
      body: {
        data: {
          hello: 'world',
        },
        body_type: 'json',
      },
    };
    const response = {
      status: 200,
      headers: {
        random: 'header',
      },
      body: {
        hello: 'world',
      },
    };
    const result = await flowExecutor.execute({
      action: buildPieceAction({
        name: 'http',
        pieceName: '@activepieces/piece-http',
        actionName: 'return_response',
        input,
      }),
      executionState: FlowExecutorContext.empty(),
      constants: generateMockEngineConstants(),
    });

    expect(result.verdict).toBe(ExecutionVerdict.SUCCEEDED);
    expect(result.verdictResponse).toEqual({
      reason: FlowRunStatus.STOPPED,
      stopResponse: response,
    });
    expect(result.steps.http.output).toEqual(response);
  });
});
