
import icon from '../../assets/star.png';
import trajectory from '../../assets/trajectory.gif';
import floats from '../../assets/floats.png';
import signal from '../../assets/signal.png';
import { useNavigate } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react';
import Page0 from './Components/Page0';
import { useOnboarding } from '../../context/OnboardingContext';

const Page5 = () => {
  return (
    <div className="overflow-hidden">
      <h1 className="text-2xl text-center font-bold mb-20">What direction are you headed? Would you like to travel together?</h1>
    </div>
  );
};

const Page6 = () => {
  return (
    <div className="overflow-hidden">
      <h1 className="text-2xl text-center font-bold mb-20">What's your name? What's your story? What's your dream? Who are you? You consider that to a stranger you can be someone new. You can use the upgrades on yourself or for Voy. In fact the game walks you through giving Voy a new part. A sensor. what is that signal? Let's follow it. So who are you? Skip.</h1>
    </div>
  );
};

const ChapterOne = () => {
  return (
    <div className="bg-black p-10">
      <div className="blue-radial-signal"></div>
    <div className="flex flex-col justify-between h-full">
    <Page0 /> 
</div>
</div>
  );
};

export default ChapterOne;