"use client";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function Home() {
  const { isSignedIn, user } = useUser();
  const createUser = useMutation(api.user.createUser);
  const { openSignIn, openSignUp } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn]);

  const CheckUser = async () => {
    if (user) {
      await createUser({
        email: user?.primaryEmailAddress?.emailAddress,
        imageUrl: user?.imageUrl,
        userName: user?.fullName || "user1234",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#e3f0ff] to-[#ffffff] flex flex-col items-center justify-between pb-1">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-10 py-6">
        <Image src={"/logo.png"} alt="Company Logo" height={100} width={150} priority />
        {/* <nav className="hidden md:flex gap-8 text-gray-600" aria-label="Main Navigation">
          <a href="#" className="hover:text-black" aria-label="Features">Features</a>
          <a href="#" className="hover:text-black" aria-label="Solution">Solution</a>
          <a href="#" className="hover:text-black" aria-label="Testimonials">Testimonials</a>
          <a href="#" className="hover:text-black" aria-label="Blog">Blog</a>
        </nav> */}

        {/* Sign In & Sign Up Buttons */}
          {
            !isSignedIn &&
        <div className="flex gap-4">
          <button
          onClick={() =>  openSignIn({ appearance: { elements: { footer: "hidden", developer: "hidden" } } })}
          className="border border-black text-black px-5 py-2 rounded-lg hover:bg-gray-200"
          aria-label="Sign In"
          >
            Sign In
          </button>
          <button
          onClick={() => openSignUp({ appearance: { elements: { footer: "hidden", developer: "hidden" } } })}
          className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-80"
          aria-label="Sign Up"
          >
            Sign Up
          </button>
        </div>
          }
      </header>

      {/* Hero Section */}
      <section className="text-center mt-16 px-6 md:px-0">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Simplify <span className="text-red-500">PDF</span> <span className="text-blue-500">Note-Taking</span> with AI-Powered
        </h1>
        <p className="text-gray-600 mt-5 text-lg max-w-2xl mx-auto">
          Elevate your note-taking experience with our AI-powered PDF app. Seamlessly extract
          key insights, summaries, and annotations from any PDF with just a few clicks.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => openSignUp({ appearance: { elements: { footer: "hidden", developer: "hidden" } }
            })}
            className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:opacity-80"
            aria-label="Get started with our app"
          >
            Get Started
          </button>
          <button className="bg-gray-200 px-6 py-3 rounded-lg text-lg hover:bg-gray-300" aria-label="Learn more about our app">
            Learn more
          </button>
        </div>
      </section>

      {/* Feature Section */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-center px-6">
        <div>
          <h3 className="text-lg font-bold">The lowest price</h3>
        </div>
        <div>
          <h3 className="text-lg font-bold">The fastest on the market</h3>
        </div>
        <div>
          <h3 className="text-lg font-bold">The most loved</h3>
          
        </div>
      </section>
      <footer className="w-full py-4   text-center mt-16">
        <p>&copy; 2025 PDFInsight. All rights reserved.</p>
      </footer>
    </main>
  );
}
