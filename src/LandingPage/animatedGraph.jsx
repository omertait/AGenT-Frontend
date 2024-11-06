import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './animatedGraph.css';

const AnimatedGraph = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isResetting, setIsResetting] = useState(false);

  const nodePositions = [
    { x: 50, y: 150 },
    { x: 250, y: 75 },
    { x: 300, y: 180 },
  ];

  const circleRadius = 20;



  const calculateEdgePoints = useCallback((source, target) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    return {
      x1: source.x + unitX * circleRadius,
      y1: source.y + unitY * circleRadius,
      x2: target.x - unitX * circleRadius,
      y2: target.y - unitY * circleRadius,
    };
  }, []);

  const resetAnimation = useCallback(async () => {
    setIsResetting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for exit animations
    setNodes([]);
    setEdges([]);
    setIsResetting(false);
    runAnimation();
  }, []);

  const runAnimation = useCallback(async () => {
    for (let i = 0; i < nodePositions.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNodes(prevNodes => [...prevNodes, nodePositions[i]]);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setEdges([{ source: 0, target: 1 }]);

    await new Promise(resolve => setTimeout(resolve, 500));
    setEdges(prevEdges => [...prevEdges, { source: 1, target: 2 }]);

    await new Promise(resolve => setTimeout(resolve, 2000));
    resetAnimation();
  }, [resetAnimation]);

  useEffect(() => {
    runAnimation();
  }, [runAnimation]);

  return (
    <div className='graph-back'>
      <svg width="400" height="300" viewBox="0 0 400 300">
        <AnimatePresence>
          {!isResetting && edges.map(({ source, target }, index) => {
            const { x1, y1, x2, y2 } = calculateEdgePoints(nodePositions[source], nodePositions[target]);
            return (
              <motion.line
                className="edge"
                key={`edge-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
          {nodes.map((node, index) => (
            <motion.circle
              className="node"
              key={`node-${index}`}
              cx={node.x}
              cy={node.y}
              r={circleRadius}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
};

export default AnimatedGraph;