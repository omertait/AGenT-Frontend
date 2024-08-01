import React, { useState, useEffect } from 'react';
import './App.css';

const codeText = `
const task = {
    name: "Send Email",
    trigger: "Button Click",
    action: () => {
        console.log("Email sent!");
    }
};

function createWorkflow(task) {
    console.log(\`Workflow created for task: \${task.name}\`);
    task.action();
}

createWorkflow(task);
`;

const NoCodeAnimation = () => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < codeText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(displayedText + codeText[index]);
                setIndex(index + 1);
            }, 100);
            return () => clearTimeout(timeout);
        } else {
            const resetTimeout = setTimeout(() => {
                setDisplayedText('');
                setIndex(0);
            }, 2000);
            return () => clearTimeout(resetTimeout);
        }
    }, [index, displayedText]);

    return (
        <div className="code-container">
            <pre>{displayedText}</pre>
        </div>
    );
};

export default NoCodeAnimation;
