import {
    Button, Dropdown, Stack
} from '@openedx/paragon';
import { useEffect, useState } from 'react';
import { StatusBarItem } from './StatusBarItem';
import { getConfig } from '@edx/frontend-platform';

const FiltersBar = ({ client, taxonomies, onApply, libraryId }) => {
    const [allTags, setAllTags] = useState({ subjects: [], strands: [], competencies: [], complexities: [] });
    const [filteredTags, setFilteredTags] = useState({ subjects: [], strands: [], competencies: [], complexities: [] });
    const [selectedFilters, setSelectedFilters] = useState({
        subjects: '',
        strands: '',
        competencies: '',
        complexities: ''
    });

    const fetchTags = (taxonomyId, depthThreshold) => {
        return client.get(`${getConfig().STUDIO_BASE_URL}/api/content_tagging/v1/taxonomies/${taxonomyId}/tags/?full_depth_threshold=${depthThreshold}`)
            .then((res) => {
                const tagsByDepth = res.data.results.reduce((acc, tag) => {
                    if (!acc[tag.depth]) {
                        acc[tag.depth] = [];
                    }
                    acc[tag.depth].push(tag);
                    return acc;
                }, {});

                return tagsByDepth;
            })
            .catch(e => {
                console.log(e);
                return {};
            });
    };

    const filterTags = () => {
        const filtered = {
            subjects: allTags.subjects,
            strands: allTags.strands.filter(tag => tag.parent_value === selectedFilters.subjects),
            competencies: allTags.competencies.filter(tag => tag.parent_value === selectedFilters.strands),
            complexities: allTags.complexities
        };
        setFilteredTags(filtered);
    };

    const handleSelect = (type) => (eventKey) => {
        setSelectedFilters((prevFilters) => {
            const newFilters = { ...prevFilters, [type]: eventKey };

            if (type === 'subjects') {
                newFilters.strands = '';
                newFilters.competencies = '';
            } else if (type === 'strands') {
                newFilters.competencies = '';
            }

            return newFilters;
        });
    };

    const handleClearFilters = () => {
        setSelectedFilters({
            subjects: '',
            strands: '',
            competencies: '',
            complexities: ''
        });
    };

    const formatSelectedFilter = (filter) => {
        if (filter.length <= 12) return filter;
        return `${filter.slice(0, 12)}...`;
    };

    useEffect(() => {
        if (taxonomies) {
            Promise.all([
                fetchTags(taxonomies.competencies.id, taxonomies.competencies.depthThreshold),
                fetchTags(taxonomies.complexities.id, taxonomies.complexities.depthThreshold)
            ])
                .then(([competenciesTags, complexitiesTags]) => {
                    setAllTags({
                        subjects: competenciesTags[0] || [],
                        strands: competenciesTags[1] || [],
                        competencies: competenciesTags[2] || [],
                        complexities: complexitiesTags[0] || []
                    });
                    filterTags();
                })
                .catch(e => console.log(e));
        }
    }, [taxonomies]);

    useEffect(() => {
        filterTags();
    }, [selectedFilters, allTags]);

    const handleApplyFilters = () => {
        const filters = {
            subject: selectedFilters.subjects,
            strand: selectedFilters.strands,
            competency: selectedFilters.competencies,
            complexity: selectedFilters.complexities
        };
        onApply(filters);
    };

    return (
        <Stack direction="horizontal" gap={3.5} className="d-flex align-items-stretch outline-status-bar row" data-testid="outline-status-bar">
            <StatusBarItem title="Subjects">
                <Dropdown className="mb-3" onSelect={handleSelect('subjects')}>
                    <Dropdown.Toggle id="dropdown-basic-1">
                        {selectedFilters.subjects ? formatSelectedFilter(selectedFilters.subjects) : "---select---"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Header>Select Subjects</Dropdown.Header>
                        {filteredTags.subjects.map((v, i) => (
                            <Dropdown.Item key={i} eventKey={v.value}>{v.value}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </StatusBarItem>
            <StatusBarItem title="Strands">
                <Dropdown className="mb-3" onSelect={handleSelect('strands')}>
                    <Dropdown.Toggle id="dropdown-basic-2">
                        {selectedFilters.strands ? formatSelectedFilter(selectedFilters.strands) : "---select---"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Header>Select Strands</Dropdown.Header>
                        {filteredTags.strands.map((v, i) => (
                            <Dropdown.Item key={i} eventKey={v.value}>{v.value}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </StatusBarItem>
            <StatusBarItem title="Competencies">
                <Dropdown className="mb-3" onSelect={handleSelect('competencies')}>
                    <Dropdown.Toggle id="dropdown-basic-3">
                        {selectedFilters.competencies ? formatSelectedFilter(selectedFilters.competencies) : "---select---"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Header>Select Competencies</Dropdown.Header>
                        {filteredTags.competencies.map((v, i) => (
                            <Dropdown.Item key={i} eventKey={v.value}>{v.value}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </StatusBarItem>
            <StatusBarItem title="Complexity">
                <Dropdown className="mb-3" onSelect={handleSelect('complexities')}>
                    <Dropdown.Toggle id="dropdown-basic-4">
                        {selectedFilters.complexities ? formatSelectedFilter(selectedFilters.complexities) : "---select---"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Header>Select Complexity</Dropdown.Header>
                        {filteredTags.complexities.map((v, i) => (
                            <Dropdown.Item key={i} eventKey={v.value}>{v.value}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </StatusBarItem>
            <StatusBarItem>
                <Button className="mb-3" onClick={handleApplyFilters}>Apply</Button>
            </StatusBarItem>
            <StatusBarItem>
                <Button className="mb-3" onClick={handleClearFilters} disabled={!selectedFilters.subjects && !selectedFilters.strands && !selectedFilters.competencies && !selectedFilters.complexities}>
                    Clear
                </Button>
            </StatusBarItem>
        </Stack>
    );
};

export default FiltersBar;