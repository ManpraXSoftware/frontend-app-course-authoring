import React, { useState, useEffect, useRef } from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { getStudioHomeData } from '../../studio-home/data/selectors';
import classNames from 'classnames';
import { STATEFUL_BUTTON_STATES } from '../../constants';
import {
  getOrganizations,
} from '../../generic/data/selectors';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { fetchStudioHomeData } from '../../studio-home/data/thunks';
import { fetchOrganizationsQuery } from '../../generic/data/thunks';

import Header from '../../header';
import { StudioFooter } from '@edx/frontend-component-footer';

import { TypeaheadDropdown } from '@edx/frontend-lib-content-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Dropdown,
  ActionRow,
  StatefulButton,
  TransitionReplace,
  Container,
} from '@openedx/paragon';
import messages from './messages';
import { getApiBaseUrl } from '../../studio-home/data/api';







const NewLibrary = (props) => {
  const { intl } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const title = "Create new library"
  const specialCharsRule = /^[a-zA-Z0-9_\-.'*~\s]+$/;
  const noSpaceRule = /^\S*$/;
  const hasErrorField = (fieldName) => !!errors[fieldName] && !!touched[fieldName];
  const [isFormFilled, setFormFilled] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const createButtonState = {
    labels: {
      default: intl.formatMessage(messages.createButton),
      pending: intl.formatMessage(messages.creatingButton),
    },
    disabledStates: [STATEFUL_BUTTON_STATES.pending],
  };
  const RequestStatus = {
    IN_PROGRESS: 'in-progress',
    SUCCESSFUL: 'successful',
    FAILED: 'failed',
    DENIED: 'denied',
    PENDING: 'pending',
    CLEAR: 'clear',
    PARTIAL: 'partial',
    PARTIAL_FAILURE: 'partial failure',
    NOT_FOUND: 'not-found',
  };
  const [postErrors, setPostErrors] = useState({ errMsg: "" })
  const [libraryCreationError, setLibraryCreationError] = useState('');
  const { allowToCreateNewOrg, allowedOrganizations } = useSelector(getStudioHomeData);
  const allOrganizations = useSelector(getOrganizations)
  const organizations = allowToCreateNewOrg ? allOrganizations : allowedOrganizations;
  const initialValues = { "display_name": "", "org": "", "number": "" }
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const displayNameFieldReference = useRef(null);
  const validationSchema = Yup.object().shape({
    display_name: Yup.string().required(
      intl.formatMessage(messages.requiredFieldError),
    ),
    org: Yup.string()
      .required(intl.formatMessage(messages.requiredFieldError))
      .matches(
        specialCharsRule,
        intl.formatMessage(messages.disallowedCharsError),
      )
      .matches(noSpaceRule, intl.formatMessage(messages.noSpaceError)),
    number: Yup.string()
      .required(intl.formatMessage(messages.requiredFieldError))
      .matches(
        specialCharsRule,
        intl.formatMessage(messages.disallowedCharsError),
      )
      .matches(noSpaceRule, intl.formatMessage(messages.noSpaceError)),
  });
  const {
    values, errors, touched, handleChange, handleBlur, setFieldValue,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validationSchema,
  });
  const isFormInvalid = Object.keys(errors).length;
  const newLibraryFields = [
    {
      label: intl.formatMessage(messages.libraryDisplayNameLabel),
      helpText: intl.formatMessage(messages.libraryDisplayNameCreateHelpText),
      name: 'display_name',
      value: values.display_name,
      placeholder: intl.formatMessage(messages.libraryDisplayNamePlaceholder),
      disabled: false,
      ref: displayNameFieldReference,
    },
    {
      label: intl.formatMessage(messages.libraryOrgLabel),
      helpText: intl.formatMessage(messages.libraryOrgCreateHelpText, {
        strong: <strong>{intl.formatMessage(messages.libraryNoteOrgNameIsPartStrong)}</strong>,
      }),
      name: 'org',
      value: values.org,
      options: organizations,
      placeholder: intl.formatMessage(messages.libraryOrgPlaceholder),
      disabled: false,
    },
    {
      label: intl.formatMessage(messages.libraryCodeLabel),
      helpText: intl.formatMessage(messages.libraryCodeCreateHelpText, {
        strong: (
          <strong>
            {intl.formatMessage(messages.libraryNotePartLibraryURLRequireStrong)}
          </strong>
        ),
      }),
      name: 'number',
      value: values.number,
      placeholder: intl.formatMessage(messages.libraryCodePlaceholder),
      disabled: false,
    },
  ];

  useEffect(() => {
    dispatch(fetchStudioHomeData());
    dispatch(fetchOrganizationsQuery());
  }, []);
  useEffect(() => {
    setFormFilled(Object.values(values).every((i) => i));
    setPostErrors({});
  }, [values]);
  useEffect(() => {
    setFormFilled(Object.values(values).every((i) => i));
    setPostErrors({});
  }, [values]);
  useEffect(() => {
    setShowErrorBanner(!!postErrors.errMsg);
  }, [postErrors]);
  const handleCustomBlurForDropdown = (e) => {
    // it needs to correct handleOnChange Form.Autosuggest
    const { value, name } = e.target;
    setFieldValue(name, value);
    handleBlur(e);
  };
  const renderOrgField = (field = {}) => (allowToCreateNewOrg ? (
    <TypeaheadDropdown
      readOnly={false}
      name={field.name}
      value={field.value}
      controlClassName={classNames({ 'is-invalid': hasErrorField(field.name) })}
      options={field.options}
      placeholder={field.placeholder}
      handleBlur={handleCustomBlurForDropdown}
      handleChange={(value) => setFieldValue(field.name, value)}
      noOptionsMessage={intl.formatMessage(messages.libraryOrgNoOptions)}
      helpMessage=""
      errorMessage=""
      floatingLabel=""
    />
  ) : (
    <Dropdown className="mr-2">
      <Dropdown.Toggle id={`${field.name}-dropdown`} variant="outline-primary">
        {field.value || intl.formatMessage(messages.libraryOrgNoOptions)}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {field.options?.map((value) => (
          <Dropdown.Item
            key={value}
            onClick={() => setFieldValue(field.name, value)}
          >
            {value}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  ));

  const handleOnClickCreate = (e) => {
    e.preventDefault();
    async function createLibrary(libraryData) {
      const { data } = await getAuthenticatedHttpClient().post(
        getApiBaseUrl() + "/library/",
        libraryData,
      );
      return data;
    }
    const baseurl = getApiBaseUrl();
    getAuthenticatedHttpClient().post(
      getApiBaseUrl() + "/library/",
      values,
    ).then(res => res.data).then(data => navigate(data.url))
  };

  const handleOnClickCancel = () => {
    navigate('/home');
  };

  return (
    <>
      <Header isHiddenMainMenu />
      <Container size="xl" className="p-4 mt-3">
        <div className="create-or-rerun-course-form">
          <TransitionReplace>
            {showErrorBanner ? (
              <AlertMessage
                variant="danger"
                icon={InfoIcon}
                title={postErrors.errMsg}
                aria-hidden="true"
                aria-labelledby={intl.formatMessage(
                  messages.alertErrorExistsAriaLabelledBy,
                )}
                aria-describedby={intl.formatMessage(
                  messages.alertErrorExistsAriaDescribedBy,
                )}
              />
            ) : null}
          </TransitionReplace>
          <h3 className="mb-3">{title}</h3>
          <Form>
            {newLibraryFields.map((field) => (
              <Form.Group
                className={classNames('form-group-custom', {
                  'form-group-custom_isInvalid': hasErrorField(field.name),
                })}
                key={field.label}
              >
                <Form.Label>{field.label}</Form.Label>
                {field.name !== 'org' ? (
                  <Form.Control
                    value={field.value}
                    placeholder={field.placeholder}
                    name={field.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={hasErrorField(field.name)}
                    disabled={field.disabled}
                    ref={field?.ref}
                  />
                ) : renderOrgField(field)}
                <Form.Text>{field.helpText}</Form.Text>
                {hasErrorField(field.name) && (
                  <Form.Control.Feedback
                    className="feedback-error"
                    type="invalid"
                    hasIcon={false}
                  >
                    {errors[field.name]}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            ))}
            <ActionRow className="justify-content-start">
              <Button
                variant="outline-primary"
                onClick={handleOnClickCancel}
              >
                {intl.formatMessage(messages.cancelButton)}
              </Button>
              <StatefulButton
                key="save-button"
                className="ml-3"
                onClick={handleOnClickCreate}
                disabled={!isFormFilled || isFormInvalid}
                state={
                  savingStatus === RequestStatus.PENDING
                    ? STATEFUL_BUTTON_STATES.pending
                    : STATEFUL_BUTTON_STATES.default
                }
                {...createButtonState}
              />
            </ActionRow>
          </Form>
        </div>
      </Container>
      <StudioFooter />
    </>
  )
};

NewLibrary.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NewLibrary);
