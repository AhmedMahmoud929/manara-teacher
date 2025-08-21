import { Loader } from "lucide-react";
import React from "react";

function Loading() {
  return (
    <main className="h-screen w-screen flex-center">
      <Loader size={48} className="text-primary animate-spin" />
    </main>
  );
}

export default Loading;
