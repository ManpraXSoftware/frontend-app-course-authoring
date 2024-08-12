/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../../data/constants';

const slice = createSlice({
  name: 'studioHome',
  initialState: {
    loadingStatuses: {
      studioHomeLoadingStatus: RequestStatus.IN_PROGRESS,
      courseNotificationLoadingStatus: RequestStatus.IN_PROGRESS,
      courseLoadingStatus: RequestStatus.IN_PROGRESS,
      libraryLoadingStatus: RequestStatus.IN_PROGRESS,
    },
    savingStatuses: {
      courseCreatorSavingStatus: '',
      deleteNotificationSavingStatus: '',
    },
    studioHomeData: {},
    taxonomies: [],
    contentTypes: [],
    studioHomeCoursesRequestParams: {
      currentPage: 1,
      search: undefined,
      order: 'display_name',
      archivedOnly: undefined,
      activeOnly: undefined,
      isFiltered: false,
      cleanFilters: false,
    },
  },
  reducers: {
    updateLoadingStatuses: (state, { payload }) => {
      state.loadingStatuses = { ...state.loadingStatuses, ...payload };
    },
    updateSavingStatuses: (state, { payload }) => {
      state.savingStatuses = { ...state.savingStatuses, ...payload };
    },
    fetchStudioHomeDataSuccess: (state, { payload }) => {
      Object.assign(state.studioHomeData, payload);
    },
    fetchTaxonomiesDataSuccess: (state, { payload }) => {
      // state.studioHomeData.taxonomies = payload.results; 
      // payload.forEach(entry => {
      //   console.log(entry)
      //   state.studioHomeData[entry.value.toLowerCase()] = entry;
      // });

      console.log('fetchTaxonomiesDataSuccess payload:', payload);
      state.taxonomies = payload;
      // Object.assign(state.taxonomies, payload);
    },
    fetchContentTypesDataSuccess: (state, { payload }) => {
      d = {}
      // state.studioHomeData.taxonomies = payload.results; 
      payload.forEach((entry, index) => {
        console.log(entry)
        d[index] = entry;
      });
      Object.assign(state.contentTypes, payload);
    },
    fetchCourseDataSuccess: (state, { payload }) => {
      const { courses, archivedCourses, inProcessCourseActions } = payload;
      state.studioHomeData.courses = courses;
      state.studioHomeData.archivedCourses = archivedCourses;
      state.studioHomeData.inProcessCourseActions = inProcessCourseActions;
    },
    fetchCourseDataSuccessV2: (state, { payload }) => {
      const { courses, archivedCourses = [], inProcessCourseActions } = payload.results;
      const { numPages, count } = payload;
      state.studioHomeData.courses = courses;
      state.studioHomeData.archivedCourses = archivedCourses;
      state.studioHomeData.inProcessCourseActions = inProcessCourseActions;
      state.studioHomeData.numPages = numPages;
      state.studioHomeData.coursesCount = count;
    },
    fetchLibraryDataSuccess: (state, { payload }) => {
      const { libraries } = payload;
      state.studioHomeData.libraries = libraries;
    },
    updateStudioHomeCoursesCustomParams: (state, { payload }) => {
      Object.assign(state.studioHomeCoursesRequestParams, payload);
    },
  },
});

export const {
  updateSavingStatuses,
  updateLoadingStatuses,
  fetchStudioHomeDataSuccess,
  fetchCourseDataSuccess,
  fetchCourseDataSuccessV2,
  fetchLibraryDataSuccess,
  fetchTaxonomiesDataSuccess,
  fetchContentTypesDataSuccess,
  updateStudioHomeCoursesCustomParams,
} = slice.actions;

export const {
  reducer,
} = slice;
