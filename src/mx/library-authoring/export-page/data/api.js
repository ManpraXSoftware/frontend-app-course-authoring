/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
export const postExportLibraryApiUrl = (libraryId) => new URL(`api/export_library/${libraryId}`, getApiBaseUrl()).href;
export const getExportStatusApiUrl = (libraryId) => new URL(`api/export_status/${libraryId}`, getApiBaseUrl()).href;

export async function startLibraryExporting(libraryId) {
  const { data } = await getAuthenticatedHttpClient()
    .post(postExportLibraryApiUrl(libraryId));
  return camelCaseObject(data);
}

export async function getLibraryExportStatus(libraryeId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getExportStatusApiUrl(libraryeId));
  return camelCaseObject(data);
}
