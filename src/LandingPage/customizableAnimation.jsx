import React, { useState, useEffect } from 'react';
import './customizableAnimation.css';

const CustomizableAnimation = () => {
    const initialModuleStates = [
        { index: 0, left: 0, top: 0, isActive: false, isSwapping: false, offset: { x: 0, y: 0 }, color: null },
        { index: 1, left: 100, top: 0, isActive: false, isSwapping: false, offset: { x: 0, y: 0 }, color: null },
        { index: 2, left: 0, top: 100, isActive: false, isSwapping: false, offset: { x: 0, y: 0 }, color: null },
        { index: 3, left: 100, top: 100, isActive: false, isSwapping: false, offset: { x: 0, y: 0 }, color: null },
    ];

    const [moduleStates, setModuleStates] = useState(initialModuleStates);

    useEffect(() => {
        // Start the iterative process
        startColoringIteration();
    }, []);

    const startColoringIteration = () => {
        // Randomly select modules to color (1 to 4)
        const numModules = Math.floor(Math.random() * 4) + 1;
        const availableModules = [0, 1, 2, 3];
        const chosenModules = [];
        while (chosenModules.length < numModules) {
            const randomIndex = Math.floor(Math.random() * availableModules.length);
            chosenModules.push(availableModules.splice(randomIndex, 1)[0]);
        }

        // Start coloring modules one by one
        colorModulesSequentially(chosenModules, () => {
            // After coloring, start swapping iteration
            startSwappingIteration();
        });
    };

    const colorModulesSequentially = (modules, callback) => {
        let index = 0;

        const colorNextModule = () => {
            if (index >= modules.length) {
                // All modules processed
                if (callback) callback();
                return;
            }

            const moduleIndex = modules[index];

            // Activate the module
            setModuleStates(prevStates =>
                prevStates.map(module =>
                    module.index === moduleIndex ? { ...module, isActive: true } : module
                )
            );

            // Change color
            const randomColor = getRandomColor();
            setModuleStates(prevStates =>
                prevStates.map(module =>
                    module.index === moduleIndex ? { ...module, color: randomColor } : module
                )
            );

            // After 1 second, reset color and deactivate module
            setTimeout(() => {
                setModuleStates(prevStates =>
                    prevStates.map(module =>
                        module.index === moduleIndex ? { ...module, color: null, isActive: false } : module
                    )
                );

                index++;
                colorNextModule();
            }, 1000);
        };

        colorNextModule();
    };

    const startSwappingIteration = () => {
        // Create two couples of modules to swap
        const modulesToSwap = [0, 1, 2, 3];
        const shuffledModules = modulesToSwap.sort(() => 0.5 - Math.random());
        const firstCouple = shuffledModules.slice(0, 2);
        const secondCouple = shuffledModules.slice(2, 4);

        // Swap the first couple
        swapModulesSequentially([firstCouple, secondCouple], () => {
            // After swapping, return to coloring iteration
            setTimeout(() => {
                startColoringIteration();
            }, 1000); // Delay before starting coloring iteration again
        });
    };

    const swapModulesSequentially = (couples, callback) => {
        let index = 0;

        const swapNextCouple = () => {
            if (index >= couples.length) {
                // All couples processed
                if (callback) callback();
                return;
            }

            const [firstIndex, secondIndex] = couples[index];

            // Swap the couple
            swapModules(firstIndex, secondIndex, () => {
                index++;
                swapNextCouple();
            });
        };

        swapNextCouple();
    };

    const swapModules = (firstIndex, secondIndex, callback) => {
        const movementDuration = 500; // Duration of movement in ms
        const delayBeforeFirstMovement = 500; // Delay after moving back slightly

        // Get the current positions of the modules
        const firstModule = moduleStates.find(module => module.index === firstIndex);
        const secondModule = moduleStates.find(module => module.index === secondIndex);
        const firstModuleOriginalPosition = { left: firstModule.left, top: firstModule.top };
        const secondModulePosition = { left: secondModule.left, top: secondModule.top };

        // Activate the modules
        setModuleStates(prevStates =>
            prevStates.map(module =>
                module.index === firstIndex || module.index === secondIndex
                    ? { ...module, isActive: true, isSwapping: true }
                    : module
            )
        );

        // First module moves back slightly based on its position
        setModuleStates(prevStates =>
            prevStates.map(module =>
                module.index === firstIndex
                    ? { ...module, offset: getOffset({ left: module.left, top: module.top }) }
                    : module
            )
        );

        // After delay, first module moves to second module's position (with offset)
        setTimeout(() => {
            setModuleStates(prevStates =>
                prevStates.map(module =>
                    module.index === firstIndex
                        ? { ...module, left: secondModulePosition.left, top: secondModulePosition.top }
                        : module
                )
            );

            // After movement duration, remove offset from first module
            setTimeout(() => {
                setModuleStates(prevStates =>
                    prevStates.map(module =>
                        module.index === firstIndex ? { ...module, offset: { x: 0, y: 0 } } : module
                    )
                );

                // Then, second module moves to first module's original position
                setTimeout(() => {
                    setModuleStates(prevStates =>
                        prevStates.map(module =>
                            module.index === secondIndex
                                ? { ...module, left: firstModuleOriginalPosition.left, top: firstModuleOriginalPosition.top }
                                : module
                        )
                    );

                    // After movement duration, reset swapping flags and deactivate modules
                    setTimeout(() => {
                        setModuleStates(prevStates =>
                            prevStates.map(module =>
                                module.index === firstIndex || module.index === secondIndex
                                    ? { ...module, isSwapping: false, isActive: false }
                                    : module
                            )
                        );
                        // Proceed to next couple
                        if (callback) callback();
                    }, movementDuration);
                }, 0); // Start moving second module immediately after first module offset is removed
            }, movementDuration);
        }, delayBeforeFirstMovement);
    };

    const getOffset = (position) => {
        const center = { x: 50, y: 50 };
        let dx = position.left - center.x;
        let dy = position.top - center.y;

        // If both dx and dy are zero (module at center), set default offset
        if (dx === 0 && dy === 0) {
            dx = 1;
            dy = 1;
        }

        // Normalize the vector
        const length = Math.sqrt(dx * dx + dy * dy);
        const unitX = dx / length;
        const unitY = dy / length;

        // Multiply by desired offset distance
        const distance = 10; // Adjust as needed
        const offsetX = unitX * distance;
        const offsetY = unitY * distance;

        return { x: offsetX, y: offsetY };
    };

    const getRandomColor = () => {
        // Generate random RGB color with high opacity
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.2)`; 
    };

    return (
        <div className="animation-container">
            <div className="modules-container">
                {moduleStates.map(module => (
                    <div
                        key={module.index}
                        className={`module ${module.isSwapping ? 'swapping' : ''} ${module.isActive ? 'active' : ''}`}
                        style={{
                            left: `${module.left + module.offset.x}px`,
                            top: `${module.top + module.offset.y}px`,
                        }}
                    >
                        <div
                            className="module-inner"
                            style={module.color ? { background: module.color } : {}}
                        >
                            <div className="connector-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomizableAnimation;
