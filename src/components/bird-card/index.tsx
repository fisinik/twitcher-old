import Link from 'next/link';
import styles from './index.module.css';
import { Info } from './infoIcon';
import { useState } from 'react';
import Image from 'next/image';

interface BirdCardProps {
  bird: {
    id: string;
    name: string;
    binomialName: string;
    description: string;
    image: string;
  }
}

export const BirdCard = ({ bird }: BirdCardProps) => {
  const [isInfoCardOpen, setIsInfoCardOpen] = useState(false);

  return (
    <div className="relative bg-white shadow-2xl overflow-hidden w-72 h-96 rounded-md m-2">
      <Link href={`/bird-details/${bird.id}`} >
        <div className={styles.image}>
          <Image src={bird.image} alt={bird.name} fill className='rounded-b-[45px] object-cover object-center'
            sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
            priority
          />
        </div>
      </Link>
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className="absolute left-0 right-0 bottom-5 text-center z-10">
        <Link href={`/bird-details/${bird.id}`}>
          <h2 className='font-medium text-2xl text-opacity-80 text-gray-800'>
            {bird.name}
          </h2>
        </Link>
        <p className='text-opacity-80 italic text-gray-800'>{bird.binomialName}</p>
      </div>
      <div className={`${styles.inside} z-20 ${isInfoCardOpen ? styles.openInfoMobile : ''}`} onClick={() => setIsInfoCardOpen(!isInfoCardOpen)} >
        <div className={`${styles.icon} absolute right-[75px] top-[85px] opacity-100 w-10`}> <Info /></div>
        <div className={`${styles.contents} flex flex-col`}>
          <h1 className="text-gray-800 text-2xl font-light text-center border-b-[1px] border-teal-700 pb-1">{bird.name}</h1>
          <p className={`${styles.lineClamp} text-gray-800 font-serif leading-7 my-4 text-center`}>{bird.description}</p>
          <Link
            href={`/bird-details/${bird.id}`}
            className=' text-center font-light  rounded-md py-2 px-4 hover:px-5 self-center bg-teal-600 text-white hover:bg-teal-700 cursor-pointer shadow-xl'
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  )
}
