import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import AnimatedGraph from './animatedGraph';
import NoCodeAnimation from './noCode';


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
          <div className='feature-container'>
              <div className="feature">
                <h3>Graph Visualization</h3>
                <p>Define agents, tools, tasks, and their relationships visually</p>
                <p>Understand complex relationships instantly and streamline operations with ease. Turn abstract concepts into clear, actionable insights and boost your productivity.</p>
              </div>
              <div class="graph-container">
                <AnimatedGraph />
            </div>
          </div>
          <div className='feature-container'>
          <div class="graph-container">
                <NoCodeAnimation />
            </div>
            <div className="feature">
              <h3>No-Code/Low-Code Platform</h3>
              <p>Create and adjust workflows with minimal coding required</p>
              <p>This platform empowers both experienced developers and non-technical users to innovate rapidly and flexibly. Save time, reduce costs, and unleash your creativity without the steep learning curve of traditional coding</p>
            </div>
          </div>
          <div className="feature left">
            <h3>Customizable Workflows</h3>
            <p>Easily adapt workflows to meet your specific needs</p>
            <p>Our platform is highly adjustable and versatile to fit every need, giving you the true ability to harness the power of agents. Modify and personalize workflows effortlessly, ensuring your operations align perfectly with your goals. With this level of customization, the sky is the limit</p>
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
