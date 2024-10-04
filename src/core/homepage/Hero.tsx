import { FC } from "react";

import Icon from "@/components/Icons";

const Hero: FC = () => {
    
  return (
    <div className="relative overflow-hidden rounded-lg mb-6 md:w-1/2 flex justify-center">
      <div aria-hidden="true" className="flex absolute -top-96 start-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-violet-950/30 to-neutral-900/30 blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]"></div>
        <div className="bg-gradient-to-tl from-neutral-900/30 via-violet-900/10 to-neutral-900/30 blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem]"></div>
      </div>

      <div className="relative">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-2xl text-center mx-auto">
            <p className={`inline-block text-md font-medium text-violet-400 tracking-wider`}>
              <code>Unity Labs Presents</code>
            </p>

            <div className="mt-2 max-w-2xl flex justify-center gap-2 items-center">
              <Icon icon="logo"/>

              <h1 className="block font-semibold text-4xl md:text-5xl lg:text-6xl text-neutral-200">
                Unity.
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;