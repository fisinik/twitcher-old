import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import Layout from '../../../components/layout';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../../../components/button';
import FormInput from '../../../components/form-input';

const SightingDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: sighting, isError: isErrorFetchingSighting } = trpc.sighting.getOne.useQuery({ id: id as string });
  if (isErrorFetchingSighting) return <div>Error fetching sighting</div>;
  const {
    data: bird,
    isError: isErrorFetchingBird
  } = trpc.bird.getOne.useQuery({
    id: sighting?.birdId as string
  },
    {
      enabled: sighting?.birdId !== undefined
    }
  );
  if (isErrorFetchingBird) return <div>Error fetching bird</div>;
  const {
    data: author,
    isError: isErrorFetchingAuthor
  } = trpc.user.getSightingAuthor.useQuery({
    id: sighting?.author as string
  },
    {
      enabled: sighting?.author !== undefined
    });
  if (isErrorFetchingAuthor) return <div>Error fetching author</div>;
  return (
    <Layout>
      <div className="w-full h-full absolute bg-cover bg-center top-[80px] bg-gradient-to-r from-teal-50 to-teal-100" />

      <div className="flex flex-col mx-[16px] md:mx-[20px] xl:mx-[120px] h-full ">

        <div className="w-full flex flex-col  gap-y-4 relative top-[140px] shadow-2xl rounded-sm bg-teal-50">
          <div className='flex items-start lg:items-center lg:p-6 '>

            <div className='relative border grow h-[350px] sm:h-[400px] sm:shadow-none lg:h-[500px] lg:w-auto lg:border-teal-200 border-opacity-30 rounded-sm bg-white'>
              {sighting && sighting.image && sighting.name ? (
                <Image src={sighting.image} alt={sighting.name} priority fill className='lg:rounded-md lg:p-1 object-cover object-center shadow-2xl' />
              ) : (
                <div className='w-full h-full bg-teal-200 rounded-md animate-pulse' />
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
                  <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
                )}
                {sighting && sighting.name ? (
                  <h2 className='text-2xl text-gray-700 font-bold xl:text-center' >{sighting.name}</h2>
                ) : (
                  <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
                )}
              </div>

              <div className='flex justify-between'>
                <div className="flex flex-col">
                  <div className="text-gray-600 text-opacity-80 text-sm  xl:text-center">Bird name</div>
                  {bird && bird.id && bird.name ? (
                    <Link href={`/bird-details/${bird.id}`}>
                      <div className="text-gray-700 text-[20px] font-bold xl:text-center">{bird.name}</div>
                    </Link>
                  ) : (
                    <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="text-gray-600 text-opacity-80 text-sm xl:text-center">Sighting location</div>
                  {sighting && sighting.location ? (
                    <div className="text-gray-700 text-[20px] font-bold xl:text-center">{sighting.location}</div>
                  ) : (
                    <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
                  )}
                </div>
              </div>
            </div>

          </div>
          <div className='lg:mx-20 p-4 pb-10'>
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
                    <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
                  )}
                  {sighting && sighting.name ? (
                    <h2 className='text-xl text-gray-700 font-bold xl:text-center' >{sighting.name}</h2>
                  ) : (
                    <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="text-gray-600 text-opacity-80 text-sm  xl:text-center">Bird name</div>
                  {bird && bird.id && bird.name ? (
                    <Link href={`/bird-details/${bird.id}`}>
                      <div className="text-gray-700 text-[20px] font-bold xl:text-center">{bird.name}</div>
                    </Link>
                  ) : (
                    <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
                  )}
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
                    <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
                  )}
                  {sighting && sighting.name ? (
                    <h2 className='text-xl text-gray-700 font-bold xl:text-center' >{sighting.name}</h2>
                  ) : (
                    <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-600 text-opacity-80 text-sm xl:text-center">Sighting location</div>
                  {sighting && sighting.location ? (
                    <div className="text-gray-700 text-[20px] font-bold xl:text-center">{sighting.location}</div>
                  ) : (
                    <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
                  )}
                </div>
              </div>

              <div className="flex flex-col px-2">
                {sighting && sighting.description ? (
                  <div className="text-gray-700 text-[16px] font-normal font-sans lg:p-4 lg:px-6">{sighting.description}</div>
                ) : (<div className='flex flex-col gap-y-2 p-6'>
                  {[1, 2, 3, 4, 5].map((i,) => (<div key={i} className='w-full h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />))}
                </div>)}
              </div>

            </div>
          </div>

        </div>
      </div>
      <div className='relative top-[240px] h-[350px] flex flex-col md:items-center w-full p-8 gap-y-8'>
        <div className='flex justify-between items-center gap-y-10 md:w-2/3 border-b-[1px] pb-6'>
          <h1 className='text-2xl lg:text-[30px] font-light'>
            14 Comments
          </h1>
          <Button className='w-[150px] mb-2'>Add Comment</Button>
        </div>

        <div className='md:w-2/3 px-8'>
          {
            [1, 2, 3, 4, 5].map((i) => (
              <Comment key={i} />
            ))
          }
        </div>
        <div className='px-4 md:w-2/3 pb-12'>
          <form className='flex flex-col gap-y-4'>
            <FormInput
              name='comment'
              label='Write a comment...'
              type='textarea'
            />
            <Button className='w-[150px] mb-2 self-end'>Add Comment</Button>
          </form>
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

const Comment = () => {
  return (
    <div className="flex flex-col gap-y-5 py-3">
      <div className="flex gap-x-4 items-center">
        <div className="w-12 h-12 rounded-full border border-teal-500 shadow-xl" />
        <div>
          <div className="text-gray-800 text-opacity-80 text-md font-medium  xl:text-center"> John Doe</div  >
          <div className="text-gray-600 text-opacity-80 text-sm xl:text-center"> 4 days ago </div>
        </div>
      </div>
      <p className="grow font-normal text-[16px] text-justify text-gray-700 font-sans tablet:min-h-[45px] border-b-[1px] pb-[25px]">
        Very nice bird. I saw it in my garden.
      </p>
    </div>
  )
}
