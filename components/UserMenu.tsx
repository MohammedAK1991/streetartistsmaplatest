'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';

export default function UserMenu() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex justify-end w-full p-2 space-x-4">
      {isSignedIn ? (
        <>
          <span>Welcome, {user.firstName}!</span>
          <UserButton />
        </>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
