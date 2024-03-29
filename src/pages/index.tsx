import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { BirdCard } from "../components/bird-card";
import Layout from "../components/layout";
import { LoadingSkeleton } from "../components/bird-card/loading-skeleton";
import FormInput from "../components/form-input";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Twitcher</title>
        <meta
          name="description"
          content="Twitcher - the place for bird lovers to explore and learn about birds from all around the world"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="container z-auto mx-auto flex min-h-screen flex-col items-center justify-center pt-[60px] md:pt-[80px]">
          <HeroSection />
          <BirdList />
        </main>
      </Layout>
    </>
  );
};

export default Home;

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  return (
    <section ref={ref} className="text-gray-600">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 -z-20 bg-gradient-to-t from-teal-100"
      />
      <div className="container mx-auto px-5 pt-20 pb-12 sm:py-24">
        <div className="mb-12 flex w-full flex-col text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="title-font mb-4 items-center text-3xl font-medium text-teal-400 lg:text-4xl"
          >
            Discover and learn <br className="inline-block sm:hidden" />
            about Twitcher
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto font-sans text-base leading-relaxed text-teal-600 lg:w-2/3"
          >
            Twitcher is the perfect place for bird lovers to explore and learn
            about birds from all around the world.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto flex w-full flex-col items-end space-y-4 px-8 sm:flex-row sm:space-x-4 sm:space-y-0 sm:px-0 lg:w-2/3"
        >
          <FormInput label="Search for a bird..." type="text" name="search" />
        </motion.div>
      </div>
    </section>
  );
}

function BirdList() {
  const { birds, isBirdFetchingError } = useBirds();
  const cardListVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  if (birds) {
    return (
      <motion.section
        variants={cardListVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto flex flex-wrap justify-center px-5 py-12 text-gray-600"
      >
        {birds.map((bird) => (
          <BirdCard key={bird.id} bird={bird} />
        ))}
      </motion.section>
    );
  }
  if (isBirdFetchingError) {
    return (
      <section className="mx-auto flex flex-wrap justify-center px-5 py-12 text-gray-600">
        <div>Something went wrong</div>
      </section>
    );
  }
  return (
    <section className="mx-auto flex flex-wrap justify-center px-5 py-12 text-gray-600">
      {[1, 2, 3, 4].map((_, i) => (
        <LoadingSkeleton key={i} />
      ))}
    </section>
  );
}

function useBirds() {
  const { data: birds, isError: isBirdFetchingError } =
    trpc.bird.getAll.useQuery();

  return {
    birds,
    isBirdFetchingError,
  };
}
