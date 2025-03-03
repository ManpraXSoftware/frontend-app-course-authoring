import MockAdapter from 'axios-mock-adapter';
import { initializeMockApp, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getLibraryExportStatus, postExportLibraryApiUrl, startLibraryExporting } from './api';

let axiosMock;
const courseId = 'course-123';

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

  it('should fetch status on start exporting', async () => {
    const data = { exportStatus: 1 };
    axiosMock.onPost(postExportLibraryApiUrl(courseId)).reply(200, data);

    const result = await startLibraryExporting(courseId);

    expect(axiosMock.history.post[0].url).toEqual(postExportLibraryApiUrl(courseId));
    expect(result).toEqual(data);
  });

  it('should fetch on get export status', async () => {
    const data = { exportStatus: 2 };
    const queryUrl = new URL(`export_status/${courseId}`, getConfig().STUDIO_BASE_URL).href;
    axiosMock.onGet(queryUrl).reply(200, data);

    const result = await getLibraryExportStatus(courseId);

    expect(axiosMock.history.get[0].url).toEqual(queryUrl);
    expect(result).toEqual(data);
  });
});
