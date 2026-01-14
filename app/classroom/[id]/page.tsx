'use client';
import React, { useEffect } from 'react'
import {useSearchParams, useParams} from "next/navigation";
import Learn from '../sections/Learn';
import Chat from '../sections/Chat';
import Practice from '../sections/Practice';
import Exam from '../sections/Exam';
import Progress from '../sections/Progress';
import Documents from '../sections/Documents';
import Settings from '../sections/Settings';
import PracticeSessions from '../sections/CreatePractice';
import ExamSessions from '../sections/CreateExam';

const Page = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [classroomDetails, setClassroomDetails] = React.useState<any>(null);

 const set = searchParams.get("set"); 
 const practiceid = searchParams.get("practiceid"); 
 const examid = searchParams.get("examid"); 

  useEffect(() => {
    const fetchClassroomDetails = async () => {
      if (!id) return;
      
      const token = localStorage.getItem("access_token");

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/classrooms/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Classroom Details:", data);
          setClassroomDetails(data);
        } else {
          console.error("Failed to fetch classroom details");
        }
      } catch (error) {
        console.error("Error fetching classroom details:", error);
      }
    };

    fetchClassroomDetails();
  }, [id]);

  useEffect(() => {
    console.log( set);
  }, [set]);

  const props = { classroomDetails };

  return <div className="w-full">
    {set === 'learn' && <Learn {...props as any} />}
    {set === 'chat' && <Chat {...props as any} />}
    {set === 'practice' && practiceid && <Practice {...props as any} />}
    {set === 'practice' && !practiceid && <PracticeSessions {...props as any} />}
    {set === 'exam' && examid && <Exam {...props as any} />}
    {set === 'exam' && !examid && <ExamSessions {...props as any} />}
    {set === 'progress' && <Progress {...props as any} />}
    {set === 'documents' && <Documents {...props as any} />}
    {set === 'settings' && <Settings {...props as any} />}
  </div>;
};

export default Page