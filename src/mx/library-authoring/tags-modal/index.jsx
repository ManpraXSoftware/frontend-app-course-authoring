import { Button, Container, FullscreenModal } from "@openedx/paragon";
import { Expand, ExpandLess, ExpandMore, Tag } from "@openedx/paragon/icons";
import React, { useEffect, useState } from "react";
import { getConfig } from '@edx/frontend-platform';
import { ContentTagsDrawer, ContentTagsDrawerSheet } from "../../../content-tags-drawer";
import Sidebar from '../../../course-unit/sidebar';

const TagsSidebar = ({ objectId, client, org }) => {
    const [show, setShow] = useState(false)

    return (
        <>
            <Button size="sm" onClick={() => { setShow(true) }}>
                <Tag />
            </Button>
            {/* <FullscreenModal
                title="Problem Tags"
                variant="default"
                isOpen={show}
                onClose={() => setShow(false)}
            > */}
            <Sidebar className="tags-sidebar">
                <ContentTagsDrawerSheet
                    id={objectId}
                    onClose={/* istanbul ignore next */ () => setShow(false)}
                    showSheet={show}
                />
            </Sidebar>
            {/* </FullscreenModal> */}
        </>
    )
}

export default TagsSidebar