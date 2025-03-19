import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, Image, useToggle } from '@openedx/paragon';
import { FormattedMessage, injectIntl, useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';
import { COURSE_BLOCK_NAMES } from '../../constants';
import SelectImageModal from '@edx/frontend-lib-content-components/dist/editors/sharedComponents/ImageUploadModal/SelectImageModal';
import { useDispatch, connect } from 'react-redux';
import { prepareEditorRef } from '@edx/frontend-lib-content-components'
import * as helpers from './customTabHelpers'
import { getConfig } from '@edx/frontend-platform';
import { renderToStaticMarkup } from "react-dom/server";
import { RequestKeys } from '@edx/frontend-lib-content-components/dist/editors/data/constants/requests';



const CustomTab = (
  {
    values,
    setFieldValue,
    category,
    // from redux
    assets,
  }
) => {
  const intl = useIntl();
  const lmsEndpointUrl = getConfig().LMS_BASE_URL;
  const studioEndpointUrl = getConfig().STUDIO_BASE_URL;
  const dispatch = useDispatch();
  // const { imageSelectorRef, refReady, setImageSelectorRef } = helpers.prepareImageSelectorRef();
  const [courseId, setCourseId] = useState("");
  const { editorRef, editorRefReady, setEditorRef } = prepareEditorRef();

  useEffect(() => {
    const match = window.location.pathname.match(/course-v1:([^+\/]+)\+([^+\/]+)\+([^+\/]+)/);

    if (match) {
      setCourseId(match[0]);
    }
  }, []);
  useEffect(() => {
    if (courseId) dispatch(helpers.initialize({ lmsEndpointUrl, studioEndpointUrl, learningContextId: courseId }));
  }, [dispatch, category, courseId]);

  const visibilityTitle = COURSE_BLOCK_NAMES[category]?.name;
  const [isDisplayImageModalOpen, openSelectImageModal, closeDisplayImageModal] = useToggle(false);

  const setDisplayImageModalSelection = (val) => {
    setFieldValue('displayImage', val.url);
    setEditorContentHtml(getEditorContentHtml(val.url));
    closeDisplayImageModal();
  }
  const clearDisplayImageModalSelection = () => setDisplayImageModalSelection({ url: "" });
  const getCompleteUrl = (source, url) => {
    const baseUrls = { lms: lmsEndpointUrl, cms: studioEndpointUrl };
    return baseUrls[source.toLowerCase()] && !url.startsWith(baseUrls[source.toLowerCase()])
      ? `${baseUrls[source.toLowerCase()]}${url.startsWith('/') ? '' : '/'}${url}`
      : url;
  };
  const { displayImage } = values;
  const getEditorContentHtml = (val) => renderToStaticMarkup(
    <Container id="selected-image">
      <Image
        thumbnail
        src={getCompleteUrl("lms", val)}
        style={{ maxHeight: "40vh", maxWidth: "40vw" }}
        fluid
        alt="Image not found"
      />
    </Container>
  );
  const initialEditorContentHtml = getEditorContentHtml(displayImage);
  const [editorContentHtml, setEditorContentHtml] = useState(initialEditorContentHtml);
  const { imagesRef, refReady } = helpers.useImages({ assets: assets.images ? assets.images : {}, editorContentHtml });


  const handleChange = (e) => setFieldValue('displayImage', e.target.value);
  if (!refReady) {
    return null;
  }
  return (
    <Container fluid>
      <h5 className="mt-4 text-gray-700">
        {intl.formatMessage(messages.customSectionTitle, { visibilityTitle })}
      </h5>
      <hr />
      <Form.Group name="customConfigs" onChange={handleChange} value={displayImage}>
        <Form.Label>
          <FormattedMessage {...messages.displayImageLabel} />
        </Form.Label>
        <br />
        <div dangerouslySetInnerHTML={{ __html: editorContentHtml }} />
        <br /><br />
        <Form.Row>
          <Form.Control value={displayImage} readOnly={true} />
          <Button onClick={openSelectImageModal}>Pick Image</Button>
        </Form.Row>
        <Form.Text>
          <FormattedMessage {...messages.displayImageDescription} />
        </Form.Text>
      </Form.Group>

      <SelectImageModal
        isOpen={isDisplayImageModalOpen}
        close={closeDisplayImageModal}
        setSelection={setDisplayImageModalSelection}
        clearSelection={clearDisplayImageModalSelection}
        images={imagesRef}
      />
    </Container>
  );
};


CustomTab.defaultProps = {
  values: {
    displayImage: "",
  },
  setFieldValue: () => { },
  category: "",
  assets: null,
};


CustomTab.propTypes = {
  values: PropTypes.shape({
    displayImage: PropTypes.string.isRequired,
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  assets: PropTypes.shape({}),
};


export const mapStateToProps = (state) => ({
  assets: selectors.app.assets(state),
});

export default (connect(mapStateToProps)(injectIntl(CustomTab)));
// export default injectIntl(CustomTab);