"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen grid grid-rows-[60%_40%] grid-cols-1 md:grid-rows-1 md:grid-cols-[60%_40%] divide-y-2 md:divide-y-0 md:divide-x-2 container mx-auto px-4 py-8"
      dir="ltr"
    >
      <div className="flex flex-col items-center justify-center pb-12 md:pb-0 md:pr-12">
        <div className="h-full w-full relative md:-mt-12">
          <Image
            src={"/svgs/something-went-wrong.svg"}
            alt="something went wrong"
            fill
          />
        </div>
        <h1 className="text-32 font-bold md:-mt-24">Something went wrong!</h1>
      </div>
      <div className="flex flex-col justify-center md:pl-12">
        <h2 className="text-24 font-bold">Problem Details</h2>
        <p className="mb-4">{error.message}</p>
        <Button
          onClick={() => reset()}
          className="text-white font-bold py-2 px-4 rounded"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
