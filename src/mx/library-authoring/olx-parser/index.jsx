import React, { useEffect, useState } from 'react';
import { Xslt, XmlParser } from 'xslt-processor';
import { Container, Form } from '@openedx/paragon';

const OLXParser = ({ olxContent = "" }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const xslt = new Xslt();
    const xmlParser = new XmlParser();

    const xsltString = `
    <?xml version="1.0" encoding="UTF-8"?>
    <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
        <xsl:output method="html" indent="yes"/>
        
        <!-- Root template -->
        <xsl:template match="/problem">
            <div class="question">
                <xsl:apply-templates select="multiplechoiceresponse | choiceresponse" />
            </div>
        </xsl:template>

        <!-- Multiple choice -->
        <xsl:template match="multiplechoiceresponse">
            <xsl:apply-templates select="p" />
            <xsl:apply-templates select="choicegroup" />
        </xsl:template>

        <!-- Checkbox group -->
        <xsl:template match="choiceresponse">
            <xsl:apply-templates select="p" />
            <xsl:apply-templates select="checkboxgroup" />
        </xsl:template>

        <!-- Recursive p -->
        <xsl:template match="p">
            <p>
                <xsl:apply-templates select="*|text()" />
            </p>
        </xsl:template>
        <!-- Recursive span -->
        <xsl:template match="span">
            <span>
                <xsl:apply-templates select="*|text()" />
            </span>
        </xsl:template>

        <!-- Image processing -->
        <xsl:template match="img">
            <img src="{@src}" alt="{@alt}" style="{@style}" />
        </xsl:template>
        <!-- bold processing -->
        <xsl:template match="strong">
            <strong>
                <xsl:apply-templates select="*|text()" />
            </strong>
        </xsl:template>

        <!-- strong processing -->
        <xsl:template match="strong">
            <strong>
                <xsl:apply-templates select="*|text()" />
            </strong>
        </xsl:template>

        <!-- Italic processing -->
        <xsl:template match="i">
            <i>
                <xsl:apply-templates select="*|text()" />
            </i>
        </xsl:template>

        <!-- Emphasized processing -->
        <xsl:template match="em">
            <em>
                <xsl:apply-templates select="*|text()" />
            </em>
        </xsl:template>

        <!-- Marked processing -->
        <xsl:template match="mark">
            <mark>
                <xsl:apply-templates select="*|text()" />
            </mark>
        </xsl:template>

        <!-- Smaller processing -->
        <xsl:template match="small">
            <small>
                <xsl:apply-templates select="*|text()" />
            </small>
        </xsl:template>

        <!-- Deleted processing -->
        <xsl:template match="del">
            <del>
                <xsl:apply-templates select="*|text()" />
            </del>
        </xsl:template>

        <!-- Inserted processing -->
        <xsl:template match="ins">
            <ins>
                <xsl:apply-templates select="*|text()" />
            </ins>
        </xsl:template>

        <!-- Subscript processing -->
        <xsl:template match="sub">
            <sub>
                <xsl:apply-templates select="*|text()" />
            </sub>
        </xsl:template>

        <!-- Superscript processing -->
        <xsl:template match="sup">
            <sup>
                <xsl:apply-templates select="*|text()" />
            </sup>
        </xsl:template>

        <!-- Process choices (both types) -->
        <xsl:template match="choicegroup | checkboxgroup">
            <ul>
                <xsl:apply-templates select="choice" />
            </ul>
        </xsl:template>

        <!-- Handle choice rendering -->
        <xsl:template match="choice">
            <li>
                <xsl:choose>
                    <xsl:when test="@correct = 'true'">✔️</xsl:when>
                    <xsl:otherwise>❌</xsl:otherwise>
                </xsl:choose>
                <xsl:value-of select="normalize-space(.)"/>
            </li>
        </xsl:template>

        <!-- Text handling -->
        <xsl:template match="text()">
            <xsl:value-of select="normalize-space(.)"/>
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
        if (!htmlContent) {
            return "";
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        const question = doc.querySelector('.question p');
        const choices = doc.querySelectorAll('.question ul li');
        return htmlContent
        if (question && choices.length) {
            return (
                <Form.Group>
                    <Form.Label>{question.innerHTML}</Form.Label>
                    <Form.CheckboxSet>
                        {Array.from(choices).map((choice, index) => (
                            <Form.Checkbox
                                value={choice.innerHTML}
                                key={index}
                            >
                                {choice.innerHTML}
                            </Form.Checkbox>
                        ))}
                    </Form.CheckboxSet>
                </Form.Group>
            );
        }

        return null;
    };

    return <Container>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </Container>;
};

export default OLXParser;
