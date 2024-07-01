import { Button, Container, FullscreenModal } from "@openedx/paragon";
import { Expand, ExpandLess, ExpandMore, Tag } from "@openedx/paragon/icons";
import React, { useEffect, useState } from "react";
import { getConfig } from '@edx/frontend-platform';
import { ContentTagsDrawer } from "../../../content-tags-drawer";

const TagsModal = ({ objectId, client, org }) => {
    const [show, setShow] = useState(false)

    return (
        <>
            <Button size="sm" onClick={() => { setShow(true) }}>
                <Tag />
            </Button>
            <FullscreenModal
                title="Problem Tags"
                variant="default"
                isOpen={show}
                onClose={() => setShow(false)}
            >
                <ContentTagsDrawer
                    id={objectId}
                    onClose={/* istanbul ignore next */ () => setShow(false)}
                    // showSheet={show}
                />
            </FullscreenModal>
        </>
    )
}

export default TagsModal