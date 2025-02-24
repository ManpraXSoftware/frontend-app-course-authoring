import MockAdapter from 'axios-mock-adapter';
import { initializeMockApp, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getImportStatus, postImportLibraryApiUrl, startLibraryImporting } from './api';

let axiosMock;
const libraryId = 'library-123';

describe('API Functions', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch status on start importing', async () => {
    const file = new File(['(⌐□_□)'], 'download.csv', { size: 20 });
    const data = { importStatus: 1 };
    axiosMock.onPost(postImportLibraryApiUrl(libraryId)).reply(200, data);

    const result = await startLibraryImporting(libraryId, file, {}, jest.fn());
    expect(axiosMock.history.post[0].url).toEqual(postImportLibraryApiUrl(libraryId));
    expect(result).toEqual(data);
  });

  it('should fetch on get import status', async () => {
    const data = { importStatus: 2 };
    const fileName = 'testFileName.test';
    const queryUrl = new URL(`import_status/${libraryId}/${fileName}`, getConfig().STUDIO_BASE_URL).href;
    axiosMock.onGet(queryUrl).reply(200, data);

    const result = await getImportStatus(libraryId, fileName);

    expect(axiosMock.history.get[0].url).toEqual(queryUrl);
    expect(result).toEqual(data);
  });
});
