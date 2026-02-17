/* eslint-disable import/named */
import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ModalDialog,
  Button,
  ActionRow,
  Form,
  Tab,
  Tabs,
} from '@openedx/paragon';
import { Formik } from 'formik';

import { VisibilityTypes } from '../../data/constants';
import { COURSE_BLOCK_NAMES } from '../../constants';
import messages from './messages';
import BasicTab from './BasicTab';
import VisibilityTab from './VisibilityTab';
import AdvancedTab from './AdvancedTab';
import UnitTab from './UnitTab';
import CustomTab from './CustomTab'
import {initialize} from './customTabHelpers'
import { useDispatch } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';

const ConfigureModal = ({
  isOpen,
  onClose,
  onConfigureSubmit,
  currentItemData,
  enableProctoredExams,
  isXBlockComponent,
}) => {
  const intl = useIntl();
  const {
    displayName,
    // Manprax 
    progressThreshold,
    useProgramThreshold, 
    programUuid,
    start: sectionStartDate,
    visibilityState,
    due,
    isTimeLimited,
    defaultTimeLimitMinutes,
    hideAfterDue,
    showCorrectness,
    courseGraders,
    category,
    format,
    userPartitionInfo,
    ancestorHasStaffLock,
    isPrereq,
    prereqs,
    prereq,
    prereqMinScore,
    prereqMinCompletion,
    releasedToStudents,
    wasExamEverLinkedWithExternal,
    isProctoredExam,
    isOnboardingExam,
    isPracticeExam,
    examReviewRules,
    supportsOnboarding,
    showReviewRules,
    onlineProctoringRules,
  } = currentItemData;

  const getSelectedGroups = () => {
    if (userPartitionInfo?.selectedPartitionIndex >= 0) {
      return userPartitionInfo?.selectablePartitions[userPartitionInfo?.selectedPartitionIndex]
        ?.groups
        .filter(({ selected }) => selected)
        .map(({ id }) => `${id}`)
        || [];
    }
    return [];
  };

  const defaultPrereqScore = (val) => {
    if (val === null || val === undefined) {
      return 100;
    }
    return parseFloat(val);
  };

  const initialValues = {
    releaseDate: sectionStartDate,
    isVisibleToStaffOnly: visibilityState === VisibilityTypes.STAFF_ONLY,
    graderType: format == null ? 'notgraded' : format,
    dueDate: due == null ? '' : due,
    isTimeLimited,
    isProctoredExam,
    isOnboardingExam,
    isPracticeExam,
    examReviewRules,
    defaultTimeLimitMinutes,
    hideAfterDue: hideAfterDue === undefined ? false : hideAfterDue,
    showCorrectness,
    isPrereq,
    prereqUsageKey: prereq,
    prereqMinScore: defaultPrereqScore(prereqMinScore),
    prereqMinCompletion: defaultPrereqScore(prereqMinCompletion),
    // by default it is -1 i.e. accessible to all learners & staff
    selectedPartitionIndex: userPartitionInfo?.selectedPartitionIndex,
    selectedGroups: getSelectedGroups(),
    // Manprax 
    progressThreshold: progressThreshold,
    useProgramThreshold: useProgramThreshold,
    programUuid: programUuid,
  };

  const validationSchema = Yup.object().shape({
    isTimeLimited: Yup.boolean(),
    isProctoredExam: Yup.boolean(),
    isPracticeExam: Yup.boolean(),
    isOnboardingExam: Yup.boolean(),
    examReviewRules: Yup.string(),
    defaultTimeLimitMinutes: Yup.number().nullable(true),
    hideAfterDueState: Yup.boolean(),
    showCorrectness: Yup.string().required(),
    isPrereq: Yup.boolean(),
    prereqUsageKey: Yup.string().nullable(true),
    prereqMinScore: Yup.number().min(
      0,
      intl.formatMessage(messages.minScoreError),
    ).max(
      100,
      intl.formatMessage(messages.minScoreError),
    ).nullable(true),
    prereqMinCompletion: Yup.number().min(
      0,
      intl.formatMessage(messages.minScoreError),
    ).max(
      100,
      intl.formatMessage(messages.minScoreError),
    ).nullable(true),
    selectedPartitionIndex: Yup.number().integer(),
    selectedGroups: Yup.array().of(Yup.string()),

    // Manprax 
    useProgramThreshold: Yup.boolean(),
    programUuid: Yup.string().when('useProgramThreshold', {
    is: true,
    then: (schema) =>
      schema
        .required(intl.formatMessage({
          id: 'course-authoring.configure-modal.program-uuid.required',
          defaultMessage: 'Program UUID is required when using program-wide threshold.',
        }))
        .trim()
        // .matches(
        //   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        //   intl.formatMessage({
        //     id: 'course-authoring.configure-modal.program-uuid.invalid',
        //     defaultMessage: 'Please enter a valid UUID (e.g. 123e4567-e89b-12d3-a456-426614174000)',
        //   })
        // ),
    // otherwise: (schema) => schema.nullable().default(''),
  }),
  progressThreshold: Yup.number()
    .min(0, intl.formatMessage(messages.minScoreError))
    .max(100, intl.formatMessage(messages.minScoreError))
    .when('useProgramThreshold', {
      is: true,
      then: (schema) =>
        schema.required(
          intl.formatMessage({
            id: 'course-authoring.configure-modal.progress-threshold.required',
            defaultMessage: 'Progress threshold is required when using program-wide threshold.',
          })
        ),
      otherwise: (schema) => schema.nullable().default(0),
    })
    .integer(intl.formatMessage(messages.thresholdMustBeInteger || { defaultMessage: 'Must be a whole number' })),
    
  });

  const isSubsection = category === COURSE_BLOCK_NAMES.sequential.id;

  const dialogTitle = isXBlockComponent
    ? intl.formatMessage(messages.componentTitle, { title: displayName })
    : intl.formatMessage(messages.title, { title: displayName });
  const dispatch = useDispatch();
  const lmsEndpointUrl = getConfig().LMS_BASE_URL;
  const studioEndpointUrl = getConfig().STUDIO_BASE_URL;
  const [courseId, setCourseId] = useState("");
  useEffect(() => {
    const match = window.location.pathname.match(/course-v1:([^+\/]+)\+([^+\/]+)\+([^+\/]+)/);
    if (match) {
      setCourseId(match[0]);
    }
  }, []);
  useEffect(() => {
    if (courseId) dispatch(initialize({ lmsEndpointUrl, studioEndpointUrl, learningContextId: courseId }));
  }, [courseId]);

  const handleSave = (data) => {
    const groupAccess = {};
    switch (category) {
    case COURSE_BLOCK_NAMES.chapter.id:
      onConfigureSubmit(data.isVisibleToStaffOnly, data.releaseDate, data.progressThreshold, data.useProgramThreshold,data.programUuid);
      break;
    case COURSE_BLOCK_NAMES.sequential.id:
      onConfigureSubmit(
        data.isVisibleToStaffOnly,
        data.releaseDate,
        data.graderType,
        data.dueDate,
        data.isTimeLimited,
        data.isProctoredExam,
        data.isOnboardingExam,
        data.isPracticeExam,
        data.examReviewRules,
        data.isTimeLimited ? data.defaultTimeLimitMinutes : 0,
        data.hideAfterDue,
        data.showCorrectness,
        data.isPrereq,
        data.prereqUsageKey,
        data.prereqMinScore,
        data.prereqMinCompletion,
        // Manprax 
        data.progressThreshold,
        data.useProgramThreshold,
        data.programUuid,
      );
      break;
    case COURSE_BLOCK_NAMES.vertical.id:
      // onConfigureSubmit(data.isVisibleToStaffOnly, groupAccess, data.progressThreshold);
      // break;
    case COURSE_BLOCK_NAMES.component.id:
      // groupAccess should be {partitionId: [group1, group2]} or {} if selectedPartitionIndex === -1
      if (data.selectedPartitionIndex >= 0) {
        const partitionId = userPartitionInfo.selectablePartitions[data.selectedPartitionIndex].id;
        groupAccess[partitionId] = data.selectedGroups.map(g => parseInt(g, 10));
      }
      onConfigureSubmit(data.isVisibleToStaffOnly, groupAccess);
      break;
    default:
      break;
    }
  };

  const renderModalBody = (values, setFieldValue) => {
    switch (category) {
    case COURSE_BLOCK_NAMES.chapter.id:
      return (
        <Tabs>
          <Tab eventKey="basic" title={intl.formatMessage(messages.basicTabTitle)}>
            <BasicTab
              values={values}
              setFieldValue={setFieldValue}
              isSubsection={isSubsection}
              courseGraders={courseGraders === 'undefined' ? [] : courseGraders}
            />
          </Tab>
          <Tab eventKey="visibility" title={intl.formatMessage(messages.visibilityTabTitle)}>
            <VisibilityTab
              values={values}
              setFieldValue={setFieldValue}
              category={category}
              isSubsection={isSubsection}
              showWarning={visibilityState === VisibilityTypes.STAFF_ONLY}
            />
          </Tab>
          {/* <Tab eventKey="custom" title={intl.formatMessage(messages.customTabTitle)}>
            <CustomTab
              values={values}
              setFieldValue={setFieldValue}
              category={category}
            />
          </Tab> */}
        </Tabs>
      );
    case COURSE_BLOCK_NAMES.sequential.id:
      return (
        <Tabs>
          <Tab eventKey="basic" title={intl.formatMessage(messages.basicTabTitle)}>
            <BasicTab
              values={values}
              setFieldValue={setFieldValue}
              isSubsection={isSubsection}
              courseGraders={courseGraders === 'undefined' ? [] : courseGraders}
            />
          </Tab>
          <Tab eventKey="visibility" title={intl.formatMessage(messages.visibilityTabTitle)}>
            <VisibilityTab
              values={values}
              setFieldValue={setFieldValue}
              category={category}
              isSubsection={isSubsection}
              showWarning={visibilityState === VisibilityTypes.STAFF_ONLY}
            />
          </Tab>
          <Tab eventKey="advanced" title={intl.formatMessage(messages.advancedTabTitle)}>
            <AdvancedTab
              values={values}
              setFieldValue={setFieldValue}
              prereqs={prereqs}
              releasedToStudents={releasedToStudents}
              wasExamEverLinkedWithExternal={wasExamEverLinkedWithExternal}
              enableProctoredExams={enableProctoredExams}
              supportsOnboarding={supportsOnboarding}
              showReviewRules={showReviewRules}
              wasProctoredExam={isProctoredExam}
              onlineProctoringRules={onlineProctoringRules}
            />
          </Tab>
            <Tab eventKey="custom" title={intl.formatMessage(messages.customTabTitle)}>
              <CustomTab
                values={values}
                setFieldValue={setFieldValue}
              />
            </Tab>
          </Tabs>
        );
      case COURSE_BLOCK_NAMES.vertical.id:
        // <Tabs>
        //   <Tab eventKey="custom" title={intl.formatMessage(messages.customTabTitle)}>
        //     <CustomTab
        //       values={values}
        //       setFieldValue={setFieldValue}
        //       category={category}
        //     />
        //   </Tab>
        // </Tabs>
    case COURSE_BLOCK_NAMES.component.id:
        return (
          <Tabs>
            <Tab eventKey="unit" title={intl.formatMessage(messages.unitTabTitle)}>
              <UnitTab
                isXBlockComponent={COURSE_BLOCK_NAMES.component.id === category}
                values={values}
                setFieldValue={setFieldValue}
                showWarning={visibilityState === VisibilityTypes.STAFF_ONLY && !ancestorHasStaffLock}
                userPartitionInfo={userPartitionInfo}
              />
            </Tab>
            {/* <Tab eventKey="custom" title={intl.formatMessage(messages.customTabTitle)}>
              <CustomTab
                values={values}
                setFieldValue={setFieldValue}
                category={category}
              />
            </Tab> */}
          </Tabs>
      );
    default:
      return null;
    }
  };

  return (
    <ModalDialog
      className="configure-modal"
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      isFullscreenOnMobile
    >
      <div data-testid="configure-modal">
        <ModalDialog.Header className="configure-modal__header">
          <ModalDialog.Title>
            {dialogTitle}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSave}
          validationSchema={validationSchema}
          validateOnBlur
          validateOnChange
        >
          {({
            values, handleSubmit, setFieldValue,
          }) => (
            <>
              <ModalDialog.Body className="configure-modal__body">
                <Form.Group size="sm" className="form-field">
                  {renderModalBody(values, setFieldValue)}
                </Form.Group>
              </ModalDialog.Body>
              <ModalDialog.Footer className="pt-1">
                <ActionRow>
                  <ModalDialog.CloseButton variant="tertiary">
                    {intl.formatMessage(messages.cancelButton)}
                  </ModalDialog.CloseButton>
                  <Button
                    data-testid="configure-save-button"
                    onClick={handleSubmit}
                  >
                    {intl.formatMessage(messages.saveButton)}
                  </Button>
                </ActionRow>
              </ModalDialog.Footer>
            </>
          )}
        </Formik>
      </div>
    </ModalDialog>
  );
};

ConfigureModal.defaultProps = {
  isXBlockComponent: false,
  enableProctoredExams: false,
};

ConfigureModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfigureSubmit: PropTypes.func.isRequired,
  enableProctoredExams: PropTypes.bool,
  currentItemData: PropTypes.shape({
    displayName: PropTypes.string,
    start: PropTypes.string,
    visibilityState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    due: PropTypes.string,
    isTimeLimited: PropTypes.bool,
    defaultTimeLimitMinutes: PropTypes.number,
    hideAfterDue: PropTypes.bool,
    showCorrectness: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    courseGraders: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    format: PropTypes.string,
    userPartitionInfo: PropTypes.shape({
      selectablePartitions: PropTypes.arrayOf(PropTypes.shape({
        groups: PropTypes.arrayOf(PropTypes.shape({
          deleted: PropTypes.bool,
          id: PropTypes.number,
          name: PropTypes.string,
          selected: PropTypes.bool,
        })),
        id: PropTypes.number,
        name: PropTypes.string,
        scheme: PropTypes.string,
      })),
      selectedPartitionIndex: PropTypes.number,
      selectedGroupsLabel: PropTypes.string,
    }),
    ancestorHasStaffLock: PropTypes.bool,
    isPrereq: PropTypes.bool,
    prereqs: PropTypes.arrayOf(
    //   {
    //   blockDisplayName: PropTypes.string,
    //   blockUsageKey: PropTypes.string,
    // }
    PropTypes.shape({
    blockDisplayName: PropTypes.string,
    blockUsageKey: PropTypes.string,
  })
  ),
    prereq: PropTypes.number,
    prereqMinScore: PropTypes.number,
    prereqMinCompletion: PropTypes.number,
    releasedToStudents: PropTypes.bool,
    wasExamEverLinkedWithExternal: PropTypes.bool,
    isProctoredExam: PropTypes.bool,
    isOnboardingExam: PropTypes.bool,
    isPracticeExam: PropTypes.bool,
    examReviewRules: PropTypes.string,
    supportsOnboarding: PropTypes.bool,
    showReviewRules: PropTypes.bool,
    onlineProctoringRules: PropTypes.string

  }).isRequired,
  isXBlockComponent: PropTypes.bool,
};

export default ConfigureModal;
