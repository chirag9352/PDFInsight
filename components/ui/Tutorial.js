import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { id: 1, title: "Step 1", description: "This is the description for step 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", image:"/celebration.png" },
  { id: 2, title: "Step 2", description: "This is the description for step 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", image:"/celebration.png" },
  { id: 3, title: "Step 3", description: "This is the description for step 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", image:"/celebration.png" },
  { id: 4, title: "Step 4", description: "This is the description for step 4. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", image:"/celebration.png" },
];

function Tutorial() {
  const [expanded, setExpanded] = useState(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          stagger:0.5,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <div className="bg-white w-full  flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">HOW TO USE!</h1>
      <div className="grid gap-6 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center transition-transform hover:scale-105"
          >
            <div className="mb-2">
              <h2 className="text-lg font-semibold">{step.title}</h2>
            </div>
            <Image width={200} height={150}
              src={step.image}
              alt={step.title}
              className="w-full h-40 object-contain rounded-md"
            />
            <div className="mt-2">
              <p className={`text-sm ${expanded === step.id ? "block" : "line-clamp-3"}`}>
                {expanded === step.id ? step.description : `${step.description.substring(0, 100)}...`}
              </p>
              <button
                className="text-blue-500 text-xs mt-1"
                onClick={() => setExpanded(expanded === step.id ? null : step.id)}
              >
                {expanded === step.id ? "Read Less" : "Read More"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tutorial;
