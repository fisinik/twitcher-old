import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { trpc } from "../../../utils/trpc";
import Button from "../../../components/button";
import Link from "next/link";
import { SightingCard } from "../../../components/sighting-card";
import Image from "next/image";
import { useAuth } from "../../../components/hooks/useAuth";

const BirdDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: bird } = trpc.bird.getOne.useQuery({ id: id as string });
  const { data: sightings } = trpc.sighting.getBirdSightings.useQuery({
    id: id as string,
  });
  const { data: birdFavorites } = trpc.bird.getFavorites.useQuery({
    id: id as string,
  });
  const ctx = trpc.useContext();
  const { mutate: mutateFavoriteBird } = trpc.bird.makeFavorite.useMutation({
    onSuccess: () => {
      ctx.bird.getUserFavorites.invalidate({ id: user?.id as string });
      ctx.bird.getFavorites.invalidate({ id: id as string });
    },
  });
  const { mutate: mutateUnfavoriteBird } = trpc.bird.removeFavorite.useMutation(
    {
      onSuccess: () => {
        ctx.bird.getUserFavorites.invalidate({ id: user?.id as string });
        ctx.bird.getFavorites.invalidate({ id: id as string });
      },
    }
  );
  const { isAuthed, session } = useAuth();
  const user = session?.user;
  const { data: userFavorites } = trpc.bird.getUserFavorites.useQuery({
    id: user?.id as string,
  });
  const isFavorite = userFavorites?.find((favorite) => favorite.birdId === id)
    ? true
    : false;

  function handleFavorite() {
    if (!isAuthed) return router.push("/api/auth/signin");
    try {
      mutateFavoriteBird({ birdId: id as string, author: user?.id as string });
    } catch (error) {
      console.log(error);
    }
  }

  function handleRemoveFavorite() {
    if (!isAuthed) return;
    const favoriteId = userFavorites?.find(
      (favorite) => favorite.birdId === id
    )?.id;
    try {
      mutateUnfavoriteBird({ id: favoriteId as string });
    } catch (error) {
      console.log(error);
    }
  }

  if (!bird || !sightings) {
    return (
      <Layout>
        <div className="flex h-full w-full items-center justify-center">
          <h1>Loading...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex w-full flex-col py-[80px]">
        <div
          className="absolute hidden h-[350px] w-full md:block"
          style={{ backgroundImage: `url('/bird-details-bg.png')` }}
        >
          <div className="relative h-full w-full bg-gradient-to-t from-black" />
        </div>

        <div className="relative flex h-[350px] w-full flex-col md:top-[50px] md:flex-row md:items-center">
          <div className="absolute h-full w-full md:hidden ">
            <Image src={bird.image} fill alt="image of the bird" />
            <div className="relative h-full w-full bg-gradient-to-t from-black" />
          </div>
          <div className="hidden h-full w-full rounded-[3px] md:absolute md:top-0 md:left-[20px] md:block md:w-[300px]">
            <Image
              src={bird.image}
              fill
              alt="image of the bird"
              className="rounded-[5px] border border-white shadow-2xl"
            />
          </div>
          <div className="left-[350px] bottom-[100px] z-10 flex h-full w-full flex-col items-start justify-end gap-y-2 px-10 pb-12 md:absolute md:px-0 md:pb-0">
            <div>
              <h1 className="border-b-2 border-teal-400 border-opacity-75 text-[30px] font-light leading-[30px] text-white md:text-[35px] md:leading-[35px]">
                {bird?.name}
              </h1>
              <h2 className="opacity-85 pt-[10px] text-[14px] font-light leading-[14px] text-white">
                {bird?.binomialName}
              </h2>
            </div>
            <button className="mt-2 h-[35px] w-[103px] rounded-[20px] bg-gray-500 bg-opacity-60 text-[12px] leading-[12px] text-white hover:bg-white hover:bg-opacity-60 hover:text-black">
              {bird?.sighting?.length} sightings
            </button>
            <div className="flex items-center gap-x-2">
              {isFavorite ? (
                <span
                  className="cursor-pointer rounded-full bg-white bg-opacity-60 hover:bg-gray-500 hover:bg-opacity-60"
                  onClick={handleRemoveFavorite}
                >
                  <svg
                    className="p-1"
                    width="40"
                    height="40"
                    viewBox="-0.7 -1 25 25"
                    fill="#e11d48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Interface / Heart_01">
                      <path
                        id="Vector"
                        d="M12 7.19431C10 2.49988 3 2.99988 3 8.99991C3 14.9999 12 20.0001 12 20.0001C12 20.0001 21 14.9999 21 8.99991C21 2.99988 14 2.49988 12 7.19431Z"
                        stroke="#be123c"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                </span>
              ) : (
                <span
                  className="cursor-pointer rounded-full bg-gray-500 bg-opacity-60 hover:bg-white hover:bg-opacity-60"
                  onClick={handleFavorite}
                >
                  <svg
                    className="p-1"
                    width="40"
                    height="40"
                    viewBox="-0.7 -1 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Interface / Heart_01">
                      <path
                        id="Vector"
                        d="M12 7.19431C10 2.49988 3 2.99988 3 8.99991C3 14.9999 12 20.0001 12 20.0001C12 20.0001 21 14.9999 21 8.99991C21 2.99988 14 2.49988 12 7.19431Z"
                        stroke="#be123c"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                </span>
              )}
              <button className="mt-1 h-[35px] w-[110px] rounded-[20px] bg-gray-500 bg-opacity-60 text-[12px] leading-[12px] text-white hover:bg-white hover:bg-opacity-60 hover:text-black">
                {birdFavorites?.length === 0
                  ? "no favorites yet!"
                  : birdFavorites?.length === 1
                  ? "1 favorite"
                  : `${birdFavorites?.length} favorites`}
              </button>
            </div>
          </div>
          <Link href="/new-sighting/">
            <Button className="absolute -bottom-6 z-10 ml-[40px] w-[190px] md:right-[10px] md:bottom-[100px] md:ml-0 md:w-[155px] md:px-2 lg:w-[190px] xl:right-[120px]  ">
              + Add New Sighting
            </Button>
          </Link>
        </div>
        <div className="md:border-line mx-[40px] flex flex-col pb-[40px] md:mx-[20px] md:mt-[50px] md:flex md:flex-row md:gap-x-[140px] md:border-b-[1px] md:pb-[20px] xl:mr-[120px]">
          <div className="mt-[84px] mb-[34px] text-justify text-[13px] font-bold leading-[25px] text-gray-600 md:mt-[50px] md:mb-0 md:ml-10 md:basis-1/4 md:self-center lg:text-base lg:font-medium">
            <h1> Kingdom: Plantae </h1>
            <h1> Order: Asterales </h1>
            <h1> Family: Campanulaceae </h1>
            <h1> Species: P. grandiflorus</h1>
          </div>
          <div className="text-justify text-[14px] font-normal leading-6 text-gray-600 md:mr-10 md:basis-3/4 lg:text-base lg:leading-7 xl:mr-28">
            {bird?.description}
          </div>
        </div>
        <div className="flex items-center justify-center py-6">
          <h1 className="text-2xl font-light text-gray-600 lg:text-4xl">
            {bird?.name} sightings
          </h1>
        </div>
        <div className="flex flex-wrap justify-center">
          {sightings?.map((sighting) => (
            <SightingCard key={sighting.id} sighting={sighting} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BirdDetails;

BirdDetails.getInitialProps = async (context: NextPageContext) => {
  const { id } = context.query;
  return { id };
};
