"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./ContactInfo.css";
import { API_URL } from "@/config";

const TiltCard = ({ item, cardVariants }) => {
  const ref = React.useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      variants={cardVariants} 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className="infoCard"
      whileHover={{ scale: 1.02, zIndex: 10 }}
    >
      <div className="iconWrapper" style={{ transform: "translateZ(30px)" }}>
        {item.icon}
      </div>
      <div className="textContent" style={{ transform: "translateZ(20px)" }}>
        <h3 className="title">{item.title}</h3>
        <p className="detail" style={{ whiteSpace: "pre-line" }}>
          {item.detail}
        </p>
      </div>
    </motion.div>
  );
};

export default function ContactInfo() {
  const [monFri, setMonFri] = React.useState('8.30am-6.30pm');
  const [sat, setSat] = React.useState('9am - 2.00pm');
  const [sun, setSun] = React.useState('9am-12pm');

  React.useEffect(() => {
    const fetchHours = async () => {
      try {
        const res = await fetch(`${API_URL}/api/contents/clinic-hours`);
        const data = await res.json();
        if (data.success && data.data && data.data.metadata) {
          setMonFri(data.data.metadata.mon_fri || '8.30am-6.30pm');
          setSat(data.data.metadata.sat || '9am - 2.00pm');
          setSun(data.data.metadata.sun || '9am-12pm');
        }
      } catch (err) {
        console.error("Error fetching opening hours:", err);
      }
    };
    fetchHours();
  }, []);

  const dynamicContactDetails = [
    {
      title: "Northampton Clinic",
      detail: "West Chemist, 4 Kingsley Park Terrace\nNorthampton, NN2 7HG",
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      )
    },
    {
      title: "Clinic Hours",
      detail: `Mon - Fri: ${monFri}\nSaturday: ${sat}\nSunday: ${sun}`,
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      )
    },
    {
      title: "General Enquiries",
      detail: "(01604) 713297\ninfo@westchemist.co.uk",
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      )
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="infoContainer"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      style={{ perspective: 1200 }}
    >
      {dynamicContactDetails.map((item, i) => (
        <TiltCard key={i} item={item} cardVariants={cardVariants} />
      ))}
    </motion.div>
  );
}
