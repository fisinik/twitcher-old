import Image from 'next/image';
import { trpc } from '../../utils/trpc';
import styles from './index.module.css';
import { Info } from './infoIcon';
import { useState } from 'react';
import Link from 'next/link';

interface SightingCardProps {
  sighting: {
    id: string;
    name: string;
    description: string;
    image: string;
    author: string;
  }
}

export const SightingCard = ({ sighting }: SightingCardProps) => {
  const [isInfoCardOpen, setIsInfoCardOpen] = useState(false);
  const { data: author } = trpc.user.getSightingAuthor.useQuery({ id: sighting.author });
  return (
    <div className="relative bg-white shadow-2xl overflow-hidden w-72 h-96 rounded-md m-2 transform duration-100 hover:-translate-y-2">
      <Link href={`/sighting-details/${sighting.id}`} className={styles.image}>
        <Image src={sighting.image} alt={sighting.name} fill
          sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
          priority
          className='hover:opacity-80 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:rounded-b-[45px] hover:object-cover hover:object-center'
        />
      </Link>
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className="absolute left-0 right-0 top-64 z-10 flex px-3 gap-x-4 items-center">
        {author && author.image && author.name ? (
          <Link href={`/user-sightings/${author.id}`}>
            <Image src={author.image} alt={author.name} width={56} height={56} className='rounded-full border border-teal-500 shadow-xl object-cover object-center' />
          </Link>
        ) : (
          <div className='w-14 h-14 rounded-full border border-teal-500 shadow-xl bg-teal-100 bg-opacity-70 animate-pulse' />
        )}
        <div className='flex flex-col'>
          <Link href={`/sighting-details/${sighting.id}`}>
            <h2 className='font-medium text-xl text-opacity-90 text-gray-800' >{sighting.name}</h2>
          </Link>
          {author && author.name ? (
            <Link href={`/user-sightings/${author.id}`}>
              <p className=' text-sm text-opacity-80 text-gray-600'>by {author.name} </p>
            </Link>
          ) : (
            <div className='w-24 h-4 bg-gray-300 rounded animate-pulse' />
          )}
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-4 px-3 flex justify-between">
        <Link href={`/sighting-details/${sighting.id}`} className="text-gray-700 inline-flex items-center md:mb-2 lg:mb-0">Read More
          <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="#2DD4BF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </Link>
        <div>
          <span className="text-gray-700 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-[1px] border-teal-400">
            <svg className="w-4 h-4 mr-1" stroke="#2DD4BF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>1.2K
          </span>
          <span className="text-gray-700 inline-flex items-center leading-none text-sm">
            <svg className="w-4 h-4 mr-1" stroke="#2DD4BF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
            </svg>6
          </span>
        </div>
      </div>
      <div className={`${styles.inside} z-20 ${isInfoCardOpen ? styles.openInfoMobile : ''}`} onClick={() => setIsInfoCardOpen(!isInfoCardOpen)} >
        <div className={`${styles.icon} absolute right-[75px] top-[85px] opacity-100 w-10`}> <Info /></div>
        <div className={`${styles.contents} flex flex-col`}>
          <h1 className="text-gray-800 text-xl font-medium text-center border-b-[1px] border-teal-700 pb-1">{sighting.name}</h1>
          <p className={`${styles.lineClamp} text-gray-800 font-serif leading-7 my-4 text-center`}>{sighting.description}</p>
          <Link
            href={`/sighting-details/${sighting.id}`}
            className=' text-center font-medium  rounded-md py-2 px-4 hover:px-5 self-center bg-teal-700 text-white hover:bg-teal-800 cursor-pointer shadow-xl'
          >
            Read more
          </Link>
        </div>
      </div>
    </div >
  )
}
