import React from "react";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <div className="flex justify-end items-center p-5 shadow-lg bg-gray-300">
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
          },
        }}
      />
    </div>
  );
};

export default Header;
