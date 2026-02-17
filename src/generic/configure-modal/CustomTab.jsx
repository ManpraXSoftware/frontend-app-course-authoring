import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form } from '@openedx/paragon';
import { FormattedMessage, injectIntl, useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';  // Ensure this path is correct
import { ErrorMessage, Field } from 'formik';
const CustomTab = ({
  values,
  setFieldValue,
  category,
}) => {
  const intl = useIntl();

  const {
    progressThreshold = 0,
    useProgramThreshold = false,
    programUuid = '',
  } = values;


  const handleThresholdChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (value >= 0 && value <= 100) {
      setFieldValue('progressThreshold', value);
    }
  };

  const handleProgramToggle = (e) => {
    const checked = e.target.checked;
    setFieldValue('useProgramThreshold', checked);
    if (checked) {
      setFieldValue('progressThreshold', 0);  // Reset if switching to program mode
    } else {
      setFieldValue('programUuid', '');
      setFieldValue('progressThreshold', 0);
    }
  };

  const handleProgramUuidChange = (e) => {
    setFieldValue('programUuid', e.target.value.trim());
  };

  return (
    <Container fluid>
      <h5 className="mt-4 text-gray-700">
        {intl.formatMessage(messages.customSectionTitle)}
      </h5>
      <hr />
      <Form.Group>
        {/* Updated to Form.Checkbox with direct props */}
        <Form.Checkbox
          id="useProgramThreshold"
          label={intl.formatMessage(messages.useProgramThresholdLabel)}
          description={intl.formatMessage(messages.useProgramThresholdDescription)}
          checked={useProgramThreshold}
          onChange={handleProgramToggle}
        />
      </Form.Group>

      {useProgramThreshold ? (
      <>
        <Form.Group>
          <Form.Label htmlFor="programUuid">
            <FormattedMessage {...messages.programUuidLabel} />
            <span className="text-danger ml-1">*</span>
          </Form.Label>
          
          {/* Use Field instead of plain Form.Control for better integration */}
          <Field
            id="programUuid"
            name="programUuid"          // ← important: matches validation key
            as={Form.Control}           // renders as Paragon's Form.Control
            type="text"
            placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
          />
          
          <ErrorMessage name="programUuid">
            {msg => <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {msg}
            </Form.Control.Feedback>}
          </ErrorMessage>

          <Form.Text>
            <FormattedMessage {...messages.programUuidDescription} />
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="progressThreshold">
            <FormattedMessage {...messages.progressThresholdLabel} />
            <span className="text-danger ml-1">*</span>
          </Form.Label>
          
          <Field
            id="progressThreshold"
            name="progressThreshold"
            as={Form.Control}
            type="number"
            min={0}
            max={100}
            step={1}
            placeholder="e.g., 60"
          />
          
          <ErrorMessage name="progressThreshold">
            {msg => <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {msg}
            </Form.Control.Feedback>}
          </ErrorMessage>

          <Form.Text>
            <FormattedMessage {...messages.programThresholdDescription} />
          </Form.Text>
        </Form.Group>
      </>
    ) : (
      <Form.Group>
        <Form.Label htmlFor="progressThreshold">
          <FormattedMessage {...messages.progressThresholdLabel} />
        </Form.Label>
        
        <Field
          id="progressThreshold"
          name="progressThreshold"
          as={Form.Control}
          type="number"
          min={0}
          max={100}
          step={1}
          placeholder="e.g., 50"
        />
        
        <ErrorMessage name="progressThreshold">
          {msg => <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
            {msg}
          </Form.Control.Feedback>}
        </ErrorMessage>
        
        <Form.Text>
          <FormattedMessage {...messages.progressThresholdDescription} />
        </Form.Text>
      </Form.Group>
    )}
      
    </Container>
  );
};

CustomTab.defaultProps = {
  values: {
    progressThreshold: 0,
    useProgramThreshold: false,
    programUuid: '',
  },
  setFieldValue: () => {},
  category: '',
};

CustomTab.propTypes = {
  values: PropTypes.shape({
    progressThreshold: PropTypes.number,
    useProgramThreshold: PropTypes.bool,
    programUuid: PropTypes.string,
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
};

export default injectIntl(CustomTab);