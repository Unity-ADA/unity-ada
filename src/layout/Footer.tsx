
import Button from '@/components/Button';
import { FC } from 'react';

const Footer: FC = () => {

  return (
    <footer className="mt-10 w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="text-center">
        <div>
          <a className="flex-none text-xl font-semibold tracking-wider text-neutral-300" aria-label="Brand"><code>Unity</code></a>
        </div>

        <div className="py-2">
          <p className="text-neutral-500 tracking-wide font-medium"><code>We're building on the <a className="text-blue-500 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500" href="https://cardano.org/">Cardano</a> blockchain.</code></p>
          <p className="text-violet-400 tracking-wider font-medium"><code>© Unity on Cardano 2024</code></p>
        </div>

        <div className="mt-1 space-x-2 flex justify-center gap-2 py-2">
          <Button social_icon='discord' size='xs' class_extra='fill-neutral-300' url='https://discord.gg/Vx6U85nbQt' target='_blank'/>
          <Button social_icon='github'  size='xs' class_extra='fill-neutral-300' url='https://github.com/unity-cardano' target='_blank'/>
          <Button social_icon='twitter' size='xs' class_extra='fill-neutral-300' url='https://x.com/UnityCardano' target='_blank'/>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
