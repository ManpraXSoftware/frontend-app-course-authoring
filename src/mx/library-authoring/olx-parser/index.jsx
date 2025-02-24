import React, { useEffect, useState } from "react";

const OLXRenderer = ({ olxXml }) => {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        if (!olxXml) return;

        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(olxXml, "text/xml");

            // Look for multiplechoiceresponse or choiceresponse
            const responseNode = xmlDoc.querySelector("multiplechoiceresponse, choiceresponse");
            if (!responseNode) {
                setHtmlContent("<p>No valid OLX content found</p>");
                return;
            }

            // Determine choice group tag (choicegroup or checkboxgroup)
            const choiceGroupTag = responseNode.querySelector("choicegroup, checkboxgroup");
            if (!choiceGroupTag) {
                setHtmlContent("<p>No choices found</p>");
                return;
            }

            // Extract the question text (everything before choicegroup/checkboxgroup)
            let questionHtml = "";
            responseNode.childNodes.forEach((node) => {
                if (node !== choiceGroupTag && (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE)) {
                    questionHtml += node.outerHTML || node.textContent;
                }
            });

            // Extract choices
            const choices = Array.from(choiceGroupTag.querySelectorAll("choice")).map((choice) => {
                const isCorrect = choice.getAttribute("correct") === "true";
                return `
                    <li style="display: flex; align-items: center; font-size: 18px;">
                        <span style="margin-right: 8px; color: ${isCorrect ? '#6c757d' : 'red'};">
                            ${isCorrect ? '✔️' : '❌'}
                        </span>
                        ${choice.innerHTML.trim()}
                    </li>
                `;
            }).join("");

            // Combine question and choices into formatted HTML
            const formattedHtml = `
                <div>
                    <div style="padding: 0 1.25rem;">${questionHtml}</div>
                    <ul style="list-style-type: none;">${choices}</ul>
                </div>
            `;

            setHtmlContent(formattedHtml);
        } catch (error) {
            console.error("Error parsing OLX XML:", error);
            setHtmlContent("<p>Failed to load content</p>");
        }
    }, [olxXml]);

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default OLXRenderer;
