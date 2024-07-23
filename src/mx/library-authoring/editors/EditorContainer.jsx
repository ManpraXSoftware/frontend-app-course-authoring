import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { EditorPage } from '@edx/frontend-lib-content-components';
import { getConfig } from '@edx/frontend-platform';
import { useNavigate } from 'react-router';


const EditorContainer = ({
  libraryId,
}) => {
  const { blockType, blockId } = useParams();
  const navigate = useNavigate();
  const returnFunction = () => {
    navigate(`/library/${libraryId}`);
  };
  return (
    <div className="editor-page">
      <EditorPage
        courseId={libraryId}
        blockType={blockType}
        blockId={blockId}
        studioEndpointUrl={getConfig().STUDIO_BASE_URL}
        lmsEndpointUrl={getConfig().LMS_BASE_URL}
        returnFunction={() => returnFunction}
      />
    </div>
  );
};
EditorContainer.propTypes = {
  libraryId: PropTypes.string.isRequired,
};

export default EditorContainer;
