import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { trpc } from "../../../utils/trpc";
import Button from "../../../components/button";
import Link from "next/link";
import { SightingCard } from "../../../components/sighting-card";
import Image from "next/image";

const BirdDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: bird } = trpc.bird.getOne.useQuery({ id: id as string });
  const { data: sightings } = trpc.sighting.getBirdSightings.useQuery({ id: id as string });

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
            <Image src={bird.image} fill alt="image of the bird" />
          </div>
          <div className="z-10 pl-[40px] pt-[175px] md:absolute md:pl-0 left-[350px] bottom-[100px]">
            <div className="flex gap-x-[10px] pb-[20px]">
              <button className="text-[12px] leading-[12px] bg-gray-500 bg-opacity-60 h-[30px] w-[103px] rounded-[20px] text-white"> {bird?.sighting?.length} sightings</button>
            </div>
            <h1 className="text-white text-[30px] leading-[30px] font-light md:text-[35px] md:leading-[35px] pb-[10px]"> {bird?.name} </h1>
            <h2 className="text-white text-[14px] leading-[14px] font-light opacity-85"> {bird?.binomialName} </h2>
          </div>
          <Link href="/new-sighting/">
            <Button className="z-10 ml-[40px] absolute -bottom-6 md:ml-0 md:right-[60px] md:bottom-[100px] xl:right-[120px] w-[188px] ">+ Add New Sighting</Button></Link>
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
