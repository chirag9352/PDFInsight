import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-xl rounded-lg", // Custom styling for the card
            headerTitle: "text-2xl font-bold text-center", // Customize title
            socialButtonsIconButton: "bg-blue-500 hover:bg-blue-600", // Style social buttons
            footer: "hidden", // Hides "Secure by Clerk"
            developer: "hidden", // Hides development section
          },
        }}
      />
    </div>
  );
}
