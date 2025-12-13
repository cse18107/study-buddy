'use client';
import React, { useEffect } from 'react'
import {useSearchParams} from "next/navigation";
import Learn from '../sections/Learn';
import Chat from '../sections/Chat';
import Practice from '../sections/Practice';
import Exam from '../sections/Exam';
import Progress from '../sections/Progress';
import Documents from '../sections/Documents';
import Settings from '../sections/Settings';

const page = () => {
  const searchParams = useSearchParams();

 const set = searchParams.get("set"); 

  useEffect(() => {
    console.log( set);
  }, [set]);

  return <div className="w-full">
    {set === 'learn' && <Learn />}
    {set === 'chat' && <Chat />}
    {set === 'practice' && <Practice />}
    {set === 'exam' && <Exam />}
    {set === 'progress' && <Progress />}
    {set === 'documents' && <Documents />}
    {set === 'settings' && <Settings />}
  </div>;
};

export default page