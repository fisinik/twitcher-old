import Image from "next/image";
import { trpc } from "../../utils/trpc";
import styles from "./index.module.css";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { InfoIcon } from "../svg";

export const SightingCard = ({ sighting }: SightingCardProps) => {
  const sightingCardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };
  const [isInfoCardOpen, setIsInfoCardOpen] = useState(false);
  const author = useAuthorDetails(sighting?.author);
  const likeCount = useSightingLikeCount(sighting?.id);
  const commentCount = useSightingCommentCount(sighting?.id);
  return (
    <motion.div
      variants={sightingCardVariants}
      className="relative m-2 h-96 w-72 overflow-hidden rounded-md bg-white shadow-2xl"
    >
      <Link href={`/sighting-details/${sighting.id}`}>
        <motion.div className={styles.image} whileHover={{ scale: 1.04 }}>
          <Image
            src={sighting.image}
            alt={sighting.name}
            fill
            sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
            priority
            className="hover:shadow-2xl"
          />
        </motion.div>
      </Link>
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className="absolute left-0 right-0 top-64 z-10 flex items-center gap-x-4 px-3">
        {author && author.image && author.name ? (
          <Link href={`/user-sightings/${author.id}`}>
            <Image
              src={author.image}
              alt={author.name}
              width={56}
              height={56}
              className="rounded-full border border-teal-500 object-cover object-center shadow-xl"
            />
          </Link>
        ) : (
          <div className="h-14 w-14 animate-pulse rounded-full border border-teal-500 bg-teal-100 bg-opacity-70 shadow-xl" />
        )}
        <div className="flex flex-col">
          <Link href={`/sighting-details/${sighting.id}`}>
            <h2 className="text-xl font-medium text-gray-800 text-opacity-90">
              {sighting.name}
            </h2>
          </Link>
          {author && author.name ? (
            <Link href={`/user-sightings/${author.id}`}>
              <p className=" text-sm text-gray-600 text-opacity-80">
                by {author.name}
              </p>
            </Link>
          ) : (
            <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
          )}
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-4 flex justify-between px-3">
        <Link
          href={`/sighting-details/${sighting.id}`}
          className="inline-flex items-center text-gray-700 md:mb-2 lg:mb-0"
        >
          Read More
          <svg
            className="ml-2 h-4 w-4"
            viewBox="0 0 24 24"
            stroke="#2DD4BF"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </Link>
        <div>
          <span className="mr-3 ml-auto inline-flex items-center border-r-[1px] border-teal-400 py-1 pr-3 text-sm leading-none text-gray-700 md:ml-0 lg:ml-auto">
            <svg
              className="mr-1 h-4 w-4"
              stroke="#2DD4BF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            {likeCount}
          </span>
          <span className="inline-flex items-center text-sm leading-none text-gray-700">
            <svg
              className="mr-1 h-4 w-4"
              stroke="#2DD4BF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
            </svg>
            {commentCount}
          </span>
        </div>
      </div>
      <div
        className={`${styles.inside} z-20 ${
          isInfoCardOpen ? styles.openInfoMobile : ""
        }`}
        onClick={() => setIsInfoCardOpen(!isInfoCardOpen)}
      >
        <div
          className={`${styles.icon} absolute right-[75px] top-[85px] w-10 opacity-100`}
        >
          <InfoIcon />
        </div>
        <div className={`${styles.contents} flex flex-col`}>
          <h1 className="border-b-[1px] border-teal-700 pb-1 text-center text-xl font-medium text-gray-800">
            {sighting.name}
          </h1>
          <p
            className={`${styles.lineClamp} my-4 text-center font-serif leading-7 text-gray-800`}
          >
            {sighting.description}
          </p>
          <Link
            href={`/sighting-details/${sighting.id}`}
            className=" cursor-pointer self-center  rounded-md bg-teal-700 py-2 px-4 text-center font-medium text-white shadow-xl hover:bg-teal-800 hover:px-5"
          >
            Read more
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

interface SightingCardProps {
  sighting: {
    id: string;
    name: string;
    description: string;
    image: string;
    author: string;
  };
}

function useAuthorDetails(authorId: string) {
  const { data: author } = trpc.user.getSightingAuthor.useQuery({
    id: authorId,
  });
  return author;
}

function useSightingLikeCount(sightingId: string) {
  const { data: likeCount } = trpc.sighting.getSightingLikeCount.useQuery({
    sightingId: sightingId,
  });
  return likeCount;
}

function useSightingCommentCount(sightingId: string) {
  const { data: commentCount } = trpc.sighting.getSightingCommentCount.useQuery(
    {
      sightingId: sightingId,
    }
  );
  return commentCount;
}
