"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;
  const pubLink = window.location.pathname.split("/");

  // console.log(session);
  // console.log(user);

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-50 text-gray-900">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Anonymoulsy
        </a>
        {session ? (
          <>
            <span className="mr-4 font-semibold">
              Welcome, {user.username || user.email}
            </span>
            {pubLink[1] !== "u" ? (
              <div>
                <Link href="/dashboard">
                  <Button
                    className="w-full md:w-auto bg-slate-100 text-black mx-3"
                    variant={"outline"}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={() => signOut()}
                  className="w-full md:w-auto bg-slate-100 text-black"
                  variant="outline"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div>
            <Link href="/sign-in">
              <Button
                className="mx-4 w-full md:w-auto bg-slate-100 text-black"
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant={"outline"}
              >
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
