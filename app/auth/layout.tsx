import Image from "next/image";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col-reverse md:flex-row p-6 gap-6">
        {/* Right Side - Form */}
        <div className="w-full h-[93vh] flex flex-col md:w-2/5 py-2 px-2 sm:px-4 pl-0 overflow-x-auto">
          {children}
        </div>
        {/* Left Side - Slider */}
        <div className="hidden md:block relative md:w-3/5 bg-[#f7ebeb] rounded-2xl p-4">
          <div className="relative w-full h-full overflow-hidden rounded-xl">
            <div className="absolute pt-5 pr-7 bottom-0 left-0 h-20 w-24 rounded-ss-3xl bg-[#f7ebeb] z-50">
              <Image
                alt="warqa store logo"
                src="/svgs/badge-check.svg"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <Image src={"/images/auth-cover.avif"} alt="warqah auth" fill />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
