import { FC } from "react";

const Loader: FC = () => {

  return (
    <div className="flex-col gap-4 w-screen h-screen flex items-center justify-center bg-neutral-950">
      <div className="w-20 h-20 border-4 border-transparent text-pink-400 text-4xl animate-spin flex items-center justify-center border-t-pink-400 rounded-full dark:text-pink-200 dark:border-t-pink-200">
        <div className="w-16 h-16 border-4 border-transparent text-violet-600 text-2xl animate-spin flex items-center justify-center border-t-violet-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;