import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    
  return (
    <div className="landing-page">
      <main>
        <section className="hero">
        <div className="dot-grid"></div>
          <h2>Agent Workflow Made <span>Easy</span></h2>
          <p className="subtitle">Define and visualize your workflows effortlessly</p>
          <Link to={{pathname:'/Tasks'}}><button className="cta-button">Get Started</button></Link>
        </section>
        <section className='about'>
            <img src="/src/assets/agent.png" alt="Graph Visualization" />
            <div className="about-text">
                <h3>What is AGent?</h3>
                <p>AGent is a no-code/low-code platform that allows you to create and manage workflows with ease. Define agents, tools, tasks, and their relationships visually with our graph visualization feature. Work seamlessly with AI agents to enhance productivity and easily adapt workflows to meet your specific needs.</p>
            </div>
        </section>
        <section className="features">
        <div className="vertical-lines">
            <div className="vertical-line"></div>
          </div>
          <div className="feature left">
            <h3>Graph Visualization</h3>
            <p>Define agents, tools, tasks, and their relationships visually</p>
            <div className='icon-container'>
                <img width="100" height="100" src="https://img.icons8.com/ios/100/serial-tasks--v2.png" alt="serial-tasks--v2"/>            </div>
            </div>
          <div className="feature right">
            <h3>No-Code/Low-Code Platform</h3>
            <p>Create and adjust workflows with minimal coding required</p>
            <div className='icon-container'>
                <img width="100" height="100" src="/src/assets/code.png" alt="code"/>
            </div>
            
          </div>
          <div className="feature left">
            <h3>Customizable Workflows</h3>
            <p>Easily adapt workflows to meet your specific needs</p>
            <div className='icon-container'>
                <img width="100" height="100" src="/src/assets/build.png" alt="adjust"/>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 AGent. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
