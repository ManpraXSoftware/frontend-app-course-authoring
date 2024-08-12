import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@openedx/paragon';
import { getConfig, camelCaseObject } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useNavigate } from 'react-router-dom';

import { getContentTypesData, getLoadingStatuses, getStudioHomeData } from '../data/selectors';
import messages from './messages';
import LibrariesTab from './libraries-tab';
import ArchivedTab from './archived-tab';
import CoursesTab from './courses-tab';
import { RequestStatus } from '../../../data/constants';
import { fetchLibraryData } from '../data/thunks';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const TabsSection = ({
  intl,
  showNewCourseContainer,
  onClickNewCourse,
  isShowProcessing,
  dispatch,
  isPaginationCoursesEnabled,
}) => {
  const navigate = useNavigate();
  const contentTypes = useSelector(getContentTypesData);
  const [TABS_LIST, setTabsList] = useState({
    courses: 'courses',
    quizzes: 'quizzes',
    libraries: 'libraries',
    archived: 'archived',
    taxonomies: 'taxonomies',
  });
  const preDefinedTabs = ['libraries', 'archived', 'taxonomies', 'courses', 'quizzes'];
  const [tabKey, setTabKey] = useState(TABS_LIST.courses);
  const [quizzes, setQuizzes] = useState([]);
  const {
    libraryAuthoringMfeUrl,
    redirectToLibraryAuthoringMfe,
    courses, librariesEnabled, libraries, archivedCourses,
    numPages, coursesCount,
  } = useSelector(getStudioHomeData);
  const {
    courseLoadingStatus,
    libraryLoadingStatus,
  } = useSelector(getLoadingStatuses);
  const client = getAuthenticatedHttpClient();
  const isLoadingCourses = courseLoadingStatus === RequestStatus.IN_PROGRESS;
  const isFailedCoursesPage = courseLoadingStatus === RequestStatus.FAILED;
  const isLoadingLibraries = libraryLoadingStatus === RequestStatus.IN_PROGRESS;
  const isFailedLibrariesPage = libraryLoadingStatus === RequestStatus.FAILED;

  const fetchQuizzesData = async () => {
    try {
      const { data } = await client.get(`${getConfig().STUDIO_BASE_URL}/api/courses`, { params: { content_type: 'quizzes' } });
      setQuizzes(camelCaseObject(data.results.courses));
    } catch (error) {
      console.error('Failed to fetch quizzes data:', error);
    }
  };

  useEffect(() => {
    fetchQuizzesData();
  }, []);

  // Controlling the visibility of tabs when using conditional rendering is necessary for
  // the correct operation of iterating over child elements inside the Paragon Tabs component.
  const visibleTabs = useMemo(() => {
    const tabs = [];

    tabs.push(
      <Tab
        key={TABS_LIST.courses}
        eventKey={TABS_LIST.courses}
        title={intl.formatMessage(messages.coursesTabTitle)}
      >
        <CoursesTab
          coursesDataItems={courses}
          showNewCourseContainer={showNewCourseContainer}
          onClickNewCourse={onClickNewCourse}
          isShowProcessing={isShowProcessing}
          isLoading={isLoadingCourses}
          isFailed={isFailedCoursesPage}
          dispatch={dispatch}
          numPages={numPages}
          coursesCount={coursesCount}
          isEnabledPagination={isPaginationCoursesEnabled}
        />
      </Tab>,
    );

    tabs.push(
      <Tab
        key={TABS_LIST.quizzes}
        eventKey={TABS_LIST.quizzes}
        title={intl.formatMessage({ id: 'course-authoring.studio-home.quizzes.tab.title', defaultMessage: TABS_LIST.quizzes })}
      >
        <CoursesTab
          coursesDataItems={quizzes}
          showNewCourseContainer={showNewCourseContainer}
          onClickNewCourse={onClickNewCourse}
          isShowProcessing={isShowProcessing}
          isLoading={isLoadingCourses}
          isFailed={isFailedCoursesPage}
          dispatch={dispatch}
          numPages={numPages}
          coursesCount={coursesCount}
          isEnabledPagination={isPaginationCoursesEnabled}
        />
      </Tab>,
    );

    for (let tab in TABS_LIST) {
      if (!preDefinedTabs.includes(tab)) {
        tabs.push(
          <Tab
            key={tab}
            eventKey={tab}
            title={intl.formatMessage({ id: `course-authoring.studio-home.${tab}.tab.title`, defaultMessage: TABS_LIST[tab] })}
          >
            <CoursesTab
              coursesDataItems={courses}
              showNewCourseContainer={showNewCourseContainer}
              onClickNewCourse={onClickNewCourse}
              isShowProcessing={isShowProcessing}
              isLoading={isLoadingCourses}
              isFailed={isFailedCoursesPage}
              dispatch={dispatch}
              numPages={numPages}
              coursesCount={coursesCount}
              isEnabledPagination={isPaginationCoursesEnabled}
            />
          </Tab>,
        );
      }
    }

    if (archivedCourses?.length) {
      tabs.push(
        <Tab
          key={TABS_LIST.archived}
          eventKey={TABS_LIST.archived}
          title={intl.formatMessage(messages.archivedTabTitle)}
        >
          <ArchivedTab
            archivedCoursesData={archivedCourses}
            isLoading={isLoadingCourses}
            isFailed={isFailedCoursesPage}
          />
        </Tab>,
      );
    }

    if (librariesEnabled) {
      tabs.push(
        <Tab
          key={TABS_LIST.libraries}
          eventKey={TABS_LIST.libraries}
          title={intl.formatMessage(messages.librariesTabTitle)}
        >
          {!redirectToLibraryAuthoringMfe && (
            <LibrariesTab
              libraries={libraries}
              isLoading={isLoadingLibraries}
              isFailed={isFailedLibrariesPage}
            />
          )}
        </Tab>,
      );
    }

    if (getConfig().ENABLE_TAGGING_TAXONOMY_PAGES === 'true') {
      tabs.push(
        <Tab
          key={TABS_LIST.taxonomies}
          eventKey={TABS_LIST.taxonomies}
          title={intl.formatMessage(messages.taxonomiesTabTitle)}
        />,
      );
    }

    return tabs;
  }, [archivedCourses, librariesEnabled, showNewCourseContainer, isLoadingCourses, isLoadingLibraries, quizzes]);

  const handleSelectTab = (tab) => {
    if (tab === TABS_LIST.libraries && redirectToLibraryAuthoringMfe) {
      window.location.assign(libraryAuthoringMfeUrl);
    } else if (tab === TABS_LIST.libraries && !redirectToLibraryAuthoringMfe) {
      dispatch(fetchLibraryData());
    } else if (tab === TABS_LIST.taxonomies) {
      navigate('/taxonomies');
    }
    setTabKey(tab);
  };

  useEffect(() => {
    let tags = {};
    if (contentTypes) {
      contentTypes.forEach((v) => {
        tags[v.value.toLowerCase()] = v.value;
      });
    }
    setTabsList({ ...TABS_LIST, ...tags });
  }, [contentTypes]);

  return (
    <Tabs
      className="studio-home-tabs"
      variant="tabs"
      activeKey={tabKey}
      onSelect={handleSelectTab}
    >
      {visibleTabs}
    </Tabs>
  );
};

TabsSection.defaultProps = {
  isPaginationCoursesEnabled: false,
};

TabsSection.propTypes = {
  intl: intlShape.isRequired,
  showNewCourseContainer: PropTypes.bool.isRequired,
  onClickNewCourse: PropTypes.func.isRequired,
  isShowProcessing: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  isPaginationCoursesEnabled: PropTypes.bool,
};

export default injectIntl(TabsSection);
