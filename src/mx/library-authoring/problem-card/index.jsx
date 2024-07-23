// @ts-check
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { ActionRow, Button, Card, useToggle } from '@openedx/paragon';
import { isEmpty } from 'lodash';
import { Link, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { setCurrentItem, setCurrentSection, setCurrentSubsection } from '../../../course-outline/data/slice';
import { RequestStatus } from '../../../data/constants';
import SortableItem from '../../../generic/drag-helper/SortableItem';
import TitleLink from '../../../course-outline/card-header/TitleLink';
import XBlockStatus from '../../../course-outline/xblock-status/XBlockStatus';
import { getItemStatus, getItemStatusBorder, scrollToElement } from '../../../course-outline/utils';
import CardHeader from '../../../course-outline/card-header/CardHeader';
import TagsSidebar from '../tags-modal';
import { getConfig } from '@edx/frontend-platform';
import { Delete, Edit } from '@openedx/paragon/icons';
import OLXParser from '../olx-parser';

const ProblemCard = ({
  libraryId,
  blockId,
  client,
  onDelete,
}) => {
  const [blockData, setBlockData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlocks = async () => {
      const res = await client.get(`${getConfig().STUDIO_BASE_URL}/xblock/container/${blockId}`);
      // const problempreview = await client.get(`${getConfig().STUDIO_BASE_URL}/xblock/${blockId}`)
      await setBlockData(res.data);
    };
    fetchBlocks();
  }, []);
  return (
    <Card style={{ margin: "15px", padding: "15px" }}>
      <Card.Header actions={<ActionRow>
        <TagsSidebar objectId={blockId} client={client} org={libraryId.split(":")[1].split("+", 1)} />
        <Button size="sm" onClick={() => { navigate(`/library/${libraryId}/editor/problem/${blockId}`) }}>
          <Edit />
        </Button>
      </ActionRow>
      } />
      <h4> {blockData?.display_name}</h4>
      <OLXParser olxContent={blockData?.data} />
      <Card.Footer >
        <Button size="sm" onClick={onDelete}>
          <Delete />
        </Button>
      </Card.Footer>

    </Card>
  )
};

ProblemCard.defaultProps = {
  discussionsSettings: {},
};

ProblemCard.propTypes = {
  libraryId: PropTypes.string.isRequired,
  blockId: PropTypes.string.isRequired,
  client: PropTypes.any.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProblemCard;
