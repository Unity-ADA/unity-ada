
import { FC } from 'react';
import Hero from './Hero';
import Icon from '@/components/Icons';
import LimitedParagraph from '@/components/LimitedParagraph';
import Button from '@/components/Button';
import About from './About';
import Stats from './Stats';
import Featured from './Featured';
import TopPosts from './TopPosts';

const HomepageIndex: FC = ({

}) => {

  return (
    <div>
      <div className='flex justify-center'>
        <Hero/>
      </div>

      <About/>

      <Stats/>

      <Featured/>

      <TopPosts/>
    </div>
  );
};

export default HomepageIndex;