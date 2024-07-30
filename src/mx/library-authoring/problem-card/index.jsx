// @ts-check
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, ActionRow, Breadcrumb, Stack, Chip } from '@openedx/paragon';
import { useNavigate } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { Delete, Edit } from '@openedx/paragon/icons';
import TagsSidebar from '../tags-modal';
import OLXParser from '../olx-parser';
import { getContentTaxonomyTagsData } from '../../../content-tags-drawer/data/api';

const ProblemCard = ({
  libraryId,
  taxonomies,
  blockId,
  client,
  onDelete,
}) => {
  const [blockData, setBlockData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      const res = await client.get(`${getConfig().STUDIO_BASE_URL}/xblock/container/${blockId}`);
      setBlockData(res.data);
    };

    const fetchTags = async () => {
      const res = await getContentTaxonomyTagsData(blockId);
      setTags(res.taxonomies);
      console.log("tags:", tags)
      // const res = await client.get(`${getConfig().STUDIO_BASE_URL}/api/content_tagging/v1/object_tags/${blockId}`);
      // setTags(res.data);
    };

    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchBlocks(), fetchTags()]);
      setIsLoading(false);
    };

    fetchData();
  }, [blockId]);

  return (
    <Card isLoading={isLoading} style={{ margin: '15px', padding: '15px' }}>
      <Card.Header
        title={blockData?.display_name}
        subtitle={
          <Stack direction="horizontal" gap={2}>
            {tags.map(element => {
              if (element.taxonomyId === taxonomies.competencies.id) {
                return element.tags[0].lineage.map(el => <Chip>
                  {el}
                </Chip>)
              }
              else if (element.taxonomyId === taxonomies.complexities.id) {
                return <Chip>
                  {element.tags[0].value}
                </Chip>
              }
            }
            )
            }
          </Stack>
        }
        actions={
          <ActionRow>
            <TagsSidebar objectId={blockId} client={client} org={libraryId.split(':')[1].split('+', 1)[0]} />
            <Button size="sm" onClick={() => navigate(`/library/${libraryId}/editor/problem/${blockId}`)}>
              <Edit />
            </Button>
          </ActionRow>
        }
      />
      <OLXParser olxContent={blockData?.data} />
      <Card.Footer>
        <Button size="sm" onClick={onDelete}>
          <Delete />
        </Button>
      </Card.Footer>
    </Card>
  );
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
