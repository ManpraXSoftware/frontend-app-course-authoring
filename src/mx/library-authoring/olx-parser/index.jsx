import React, { useEffect, useState } from 'react';
import { Xslt, XmlParser } from 'xslt-processor';
import { Container, Form, List, ListItem } from '@openedx/paragon';

const OLXParser = ({ olxContent = "" }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const xslt = new Xslt();
    const xmlParser = new XmlParser();

    const xsltString = `
      <?xml version="1.0" encoding="UTF-8"?>
        <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
            <xsl:output method="html" indent="yes"/>
            <xsl:template match="/">
                <div class="question">
                    <p><xsl:value-of select="//div"/></p>
                    <ul>
                        <xsl:for-each select="//checkboxgroup/choice">
                            <li>
                                <xsl:choose>
                                    <xsl:when test="@correct = 'true'">✔️</xsl:when>
                                    <xsl:otherwise>❌</xsl:otherwise>
                                </xsl:choose>
                                <xsl:text> </xsl:text>
                                <xsl:value-of select="."/>
                            </li>
                        </xsl:for-each>
                        <xsl:for-each select="//choicegroup/choice">
                            <li>
                                <xsl:choose>
                                    <xsl:when test="@correct = 'true'">✔️</xsl:when>
                                    <xsl:otherwise>❌</xsl:otherwise>
                                </xsl:choose>
                                <xsl:text> </xsl:text>
                                <xsl:value-of select="."/>
                            </li>
                        </xsl:for-each>
                    </ul>
                </div>
            </xsl:template>
        </xsl:stylesheet>
    `;

    useEffect(() => {
        const parseAndTransform = async () => {
            try {
                const xmlDoc = xmlParser.xmlParse(olxContent);
                const xsltDoc = xmlParser.xmlParse(xsltString);

                const output = await xslt.xsltProcess(xmlDoc, xsltDoc);
                setHtmlContent(output);
            } catch (e) {
                console.error('Error:', e);
            }
        };

        parseAndTransform();
    }, [olxContent]);

    // Convert HTML to React components
    const renderHtmlContent = () => {
        // Simple parsing of HTML content, ideally should be more robust
        if (! htmlContent) {
            return ""
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const choices = doc.querySelectorAll('.question ul li');
        const question = doc.querySelector('.question p');
        return (
            <Form.Group>
                <Form.Label>{question.innerHTML}</Form.Label>
                <Form.CheckboxSet>

                    {Array.from(choices).map((choice, index) => (
                        <Form.Label value={choice.innerHTML} key={index}>{choice.innerHTML}</Form.Label>
                    ))}
                </Form.CheckboxSet>
            </Form.Group>
        );
    };

    return <Container>{renderHtmlContent()}</Container>;
};

export default OLXParser;
