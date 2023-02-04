import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import Layout from '../../../components/layout';
import Image from 'next/image';
import Link from 'next/link';

const SightingDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: sighting, isLoading: isSightingLoading, isError: isErrorFetchingSighting } = trpc.sighting.getOne.useQuery({ id: id as string });
  if (isErrorFetchingSighting) return <div>Error fetching sighting</div>;
  const { data: bird, isLoading: isBirdLoading, isError: isErrorFetchingBird } = trpc.bird.getOne.useQuery({ id: sighting?.birdId as string });
  if (isErrorFetchingBird) return <div>Error fetching bird</div>;
  const { data: author, isLoading: isAuthorLoading, isError: isErrorFetchingAuthor } = trpc.user.getSightingAuthor.useQuery({ id: sighting?.author as string });
  if (isErrorFetchingAuthor) return <div>Error fetching author</div>;
  return (
    <Layout>
      <div className="w-full h-full absolute bg-cover bg-center top-[80px] bg-gradient-to-r from-teal-50 to-teal-100" />

      <div className="flex flex-col mx-[16px] md:mx-[20px] xl:mx-[120px] h-full ">

        <div className="w-full flex flex-col  gap-y-4 relative top-[140px] shadow-2xl bg-white rounded-sm lg:bg-teal-50">
          <div className='flex items-start lg:items-center lg:p-4'>

            <div className='relative border grow h-[350px] sm:h-[400px] sm:shadow-none lg:h-[500px] lg:w-auto lg:border-teal-200 border-opacity-30 rounded-sm bg-white'>
              {isSightingLoading ? (
                <div>Loading...</div>
              ) : (<>
                <Image src={sighting.image} alt={sighting.name} priority fill className='lg:rounded-md lg:p-1 object-cover object-center shadow-2xl' />
              </>
              )}
            </div>

            <div className='hidden lg:flex flex-col justify-between mx-10 p-10 shadow-2xl  h-[350px] w-1/2 bg-white'>

              <div className='flex flex-col gap-y-1 items-center justify-center'>
                {author && author.image && author.name ? (
                  <Image src={author.image} alt={author.name} width={64} height={64} className='rounded-full border border-teal-500 shadow-xl' />
                ) : (
                  <div className='w-14 h-14 rounded-full border border-teal-500 shadow-xl' />
                )}

                {author && author.name ? (
                  <p className=' text-sm text-opacity-80 text-gray-600'>by {author.name} </p>
                ) : (
                  <div className='w-24 h-4 bg-gray-300 rounded animate-pulse' />
                )}
                <h2 className='text-2xl text-gray-700 font-bold xl:text-center' >{sighting?.name}</h2>
              </div>

              <div className='flex justify-between'>
                <div className="flex flex-col">
                  <div className="text-gray-600 text-opacity-80 text-sm  xl:text-center">Bird name</div>
                  <Link href={`/bird-details/${bird?.id}`}>
                    <div className="text-gray-700 text-[20px] font-bold xl:text-center">{bird?.name}</div>
                  </Link>
                </div>

                <div className="flex flex-col">
                  <div className="text-gray-600 text-opacity-80 text-sm xl:text-center">Sighting location</div>
                  <div className="text-gray-700 text-[20px] font-bold xl:text-center">{sighting?.location}</div>
                </div>
              </div>
            </div>

          </div>
          <div className='lg:mx-20 p-4'>
            <div className='flex flex-col gap-y-4 p-4 lg:w-full  border h-auto w-auto border-teal-400 border-opacity-30 rounded-sm shadow-2xl bg-white lg:self-center'>
              <div className='flex flex-col gap-y-3 lg:hidden'>

                <div className='flex flex-col gap-y-1 items-center justify-center xl:hidden'>
                  {author && author.image && author.name ? (
                    <Image src={author.image} alt={author.name} width={56} height={56} className='rounded-full border border-teal-500 shadow-xl' />
                  ) : (
                    <div className='w-14 h-14 rounded-full border border-teal-500 shadow-xl' />
                  )}
                  {author && author.name ? (
                    <p className=' text-sm text-opacity-80 text-gray-600'>by {author.name} </p>
                  ) : (
                    <div className='w-24 h-4 bg-gray-300 rounded animate-pulse' />
                  )}
                  <h2 className='text-xl text-gray-700 font-bold xl:text-center' >{sighting?.name}</h2>
                </div>

                <div className="flex flex-col">
                  <div className="text-gray-600 text-opacity-80 text-sm  xl:text-center">Bird name</div>
                  <Link href={`/bird-details/${bird?.id}`}>
                    <div className="text-gray-700 text-[20px] font-bold xl:text-center">{bird?.name}</div>
                  </Link>
                </div>

                <div className='hidden xl:flex flex-col gap-y-1 items-center justify-center xl:grow'>
                  {author && author.image && author.name ? (
                    <Image src={author.image} alt={author.name} width={56} height={56} className='rounded-full border border-teal-500 shadow-xl' />
                  ) : (
                    <div className='w-14 h-14 rounded-full border border-teal-500 shadow-xl' />
                  )}
                  {author && author.name ? (
                    <p className=' text-sm text-opacity-80 text-gray-600'>by {author.name} </p>
                  ) : (
                    <div className='w-24 h-4 bg-gray-300 rounded animate-pulse' />
                  )}
                  <h2 className='text-xl text-gray-700 font-bold xl:text-center' >{sighting?.name}</h2>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-600 text-opacity-80 text-sm xl:text-center">Sighting location</div>
                  <div className="text-gray-700 text-[20px] font-bold xl:text-center">{sighting?.location}</div>
                </div>
              </div>

              <div className="flex flex-col px-2">
                <div className="text-gray-600 text-[16px] font-normal font-sans lg:p-2">{sighting?.description}</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Layout >
  )
}

export default SightingDetails;

SightingDetails.getInitialProps = async (context: NextPageContext) => {
  const { id } = context.query;
  return { id };
}
