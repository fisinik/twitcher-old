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
  const { data: sightings } = trpc.sighting.getBirdSightings.useQuery({ id: id as string });
  const { data: birdFavorites } = trpc.bird.getFavorites.useQuery({ id: id as string });
  const ctx = trpc.useContext();
  const { mutate: mutateFavoriteBird } = trpc.bird.makeFavorite.useMutation({
    onSuccess: () => {
      ctx.bird.getUserFavorites.invalidate({ id: user?.id as string });
      ctx.bird.getFavorites.invalidate({ id: id as string });
    }
  });
  const { mutate: mutateUnfavoriteBird } = trpc.bird.removeFavorite.useMutation({
    onSuccess: () => {
      ctx.bird.getUserFavorites.invalidate({ id: user?.id as string });
      ctx.bird.getFavorites.invalidate({ id: id as string });
    }
  });
  const { isAuthed, session } = useAuth();
  const user = session?.user;
  const { data: userFavorites } = trpc.bird.getUserFavorites.useQuery({ id: user?.id as string });
  const isFavorite = userFavorites?.find(favorite => favorite.birdId === id) ? true : false;

  function handleFavorite() {
    if (!isAuthed) return router.push('/login');
    try {
      mutateFavoriteBird({ birdId: id as string, author: user?.id as string });
    } catch (error) {
      console.log(error);
    }
  }

  function handleRemoveFavorite() {
    if (!isAuthed) return router.push('/login');
    const favoriteId = userFavorites?.find(favorite => favorite.birdId === id)?.id;
    try {
      mutateUnfavoriteBird({ id: favoriteId as string });
    } catch (error) {
      console.log(error);
    }
  }

  if (!bird || !sightings) {
    return (
      <Layout>
        <div className='h-full w-full flex items-center justify-center'><h1 >Loading...</h1></div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col w-full py-[80px]">
        <div className="hidden md:block absolute w-full h-[350px]" style={{ backgroundImage: `url('/bird-details-bg.png')` }}>
          <div className="relative w-full h-full bg-gradient-to-t from-black" />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-center h-[350px] w-full md:top-[50px]">
          <div className="absolute h-full w-full md:hidden ">
            <Image src={bird.image} fill alt="image of the bird" />
            <div className="relative bg-gradient-to-t from-black h-full w-full" />
          </div>
          <div className="hidden md:block h-full w-full md:absolute md:top-0 md:left-[20px] md:w-[300px] rounded-[3px]" >
            <Image src={bird.image} fill alt="image of the bird" className="rounded-[5px] shadow-2xl border border-white" />
          </div>
          <div className="z-10 h-full pb-12 px-10 w-full flex flex-col items-start gap-y-2 justify-end md:absolute md:pb-0 md:px-0 left-[350px] bottom-[100px]">
            <div>
              <h1 className="text-white text-[30px] leading-[30px] font-light md:text-[35px] md:leading-[35px] border-b-2 border-teal-400 border-opacity-75"> {bird?.name} </h1>
              <h2 className="text-white text-[14px] leading-[14px] font-light opacity-85 pt-[10px]"> {bird?.binomialName} </h2>
            </div>
            <button className="mt-2 text-[12px] leading-[12px] bg-gray-500 bg-opacity-60 h-[35px] w-[103px] rounded-[20px] text-white hover:bg-white hover:text-black hover:bg-opacity-60"> {bird?.sighting?.length} sightings</button>
            <div className="flex items-center gap-x-2">
              {isFavorite ? (<span className="bg-gray-500 bg-opacity-60 hover:bg-white hover:bg-opacity-60 rounded-full cursor-pointer"
                onClick={handleRemoveFavorite}>
                <svg className="p-1" width="40" height="40" viewBox="-0.7 -1 25 25" fill="#e11d48" xmlns="http://www.w3.org/2000/svg">
                  <g id="Interface / Heart_01">
                    <path id="Vector"
                      d="M12 7.19431C10 2.49988 3 2.99988 3 8.99991C3 14.9999 12 20.0001 12 20.0001C12 20.0001 21 14.9999 21 8.99991C21 2.99988 14 2.49988 12 7.19431Z"
                      stroke="#be123c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                </svg>
              </span>) : (
                <span className="bg-gray-500 bg-opacity-60 hover:bg-white hover:bg-opacity-60 rounded-full cursor-pointer"
                  onClick={handleFavorite}>
                  <svg className="p-1" width="40" height="40" viewBox="-0.7 -1 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Interface / Heart_01">
                      <path id="Vector"
                        d="M12 7.19431C10 2.49988 3 2.99988 3 8.99991C3 14.9999 12 20.0001 12 20.0001C12 20.0001 21 14.9999 21 8.99991C21 2.99988 14 2.49988 12 7.19431Z"
                        stroke="#be123c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg>
                </span>
              )}
              <button className="mt-1 text-[12px] leading-[12px] bg-gray-500 bg-opacity-60 h-[35px] w-[110px] rounded-[20px] text-white hover:bg-white hover:text-black hover:bg-opacity-60"> {birdFavorites?.length === 0 ? 'no favorites yet!' : birdFavorites?.length === 1 ? '1 favorite' : `${birdFavorites?.length} favorites`}</button>
            </div>
          </div>
          <Link href="/new-sighting/">
            <Button className="z-10 ml-[40px] absolute -bottom-6 md:ml-0 md:right-[10px] w-[190px] md:w-[155px] lg:w-[190px] md:px-2 md:bottom-[100px] xl:right-[120px]  ">+ Add New Sighting</Button></Link>
        </div>
        <div className="mx-[40px] pb-[40px] md:mx-[20px] flex flex-col md:flex-row md:pb-[20px] md:border-b-[1px] md:border-line md:flex md:mt-[50px] md:gap-x-[140px] xl:mr-[120px]">
          <div className="mt-[84px] mb-[34px] text-[13px] leading-[25px] font-bold text-gray-600 text-justify md:basis-1/4 md:self-center md:mt-[50px] md:mb-0 md:ml-10 lg:text-base lg:font-medium">
            <h1> Kingdom: Plantae </h1>
            <h1> Order: Asterales </h1>
            <h1> Family: Campanulaceae </h1>
            <h1> Species: P. grandiflorus</h1>
          </div>
          <div className="text-[14px] leading-6 font-normal text-gray-600 text-justify md:basis-3/4 md:mr-10 xl:mr-28 lg:text-base lg:leading-7">
            {bird?.description}
          </div>
        </div>
        <div className="flex items-center justify-center py-6"><h1 className="text-2xl lg:text-4xl text-gray-600 font-light"> {bird?.name} sightings </h1> </div>
        <div className="flex flex-wrap justify-center">
          {
            sightings?.map((sighting) => (
              <SightingCard key={sighting.id} sighting={sighting} />
            ))
          }
        </div>
      </div>
    </Layout>
  )
}

export default BirdDetails;

BirdDetails.getInitialProps = async (context: NextPageContext) => {
  const { id } = context.query;
  return { id };
}
