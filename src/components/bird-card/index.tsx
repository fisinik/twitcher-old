import Link from "next/link";
import styles from "./index.module.css";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { InfoIcon } from "../svg";

export const BirdCard = ({ bird }: BirdCardProps) => {
  const birdCardVariants = {
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

  return (
    <motion.div
      variants={birdCardVariants}
      className="relative m-2 h-96 w-72 transform overflow-hidden rounded-md bg-white shadow-2xl"
    >
      <Link href={`/bird-details/${bird.id}`}>
        <motion.div className={styles.image} whileHover={{ scale: 1.05 }}>
          <Image
            src={bird.image}
            alt={bird.name}
            fill
            sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
            priority
            className="rounded-b-[45px] hover:shadow-2xl"
          />
        </motion.div>
      </Link>
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className={styles.wave} />
      <div className="absolute left-0 right-0 bottom-5 z-10 text-center">
        <Link href={`/bird-details/${bird.id}`}>
          <h2 className="text-2xl font-medium text-gray-800 text-opacity-80">
            {bird.name}
          </h2>
        </Link>
        <p className="italic text-gray-800 text-opacity-80">
          {bird.binomialName}
        </p>
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
          <h1 className="border-b-[1px] border-teal-700 pb-1 text-center text-2xl font-light text-gray-800">
            {bird.name}
          </h1>
          <p
            className={`${styles.lineClamp} my-4 text-center font-serif leading-7 text-gray-800`}
          >
            {bird.description}
          </p>
          <Link
            href={`/bird-details/${bird.id}`}
            className=" cursor-pointer self-center  rounded-md bg-teal-600 py-2 px-4 text-center font-light text-white shadow-xl hover:bg-teal-700 hover:px-5"
          >
            Read more
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

interface BirdCardProps {
  bird: {
    id: string;
    name: string;
    binomialName: string;
    description: string;
    image: string;
  };
}
