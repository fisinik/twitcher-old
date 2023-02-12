import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import Layout from '../../../components/layout';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../../../components/button';
import FormInput from '../../../components/form-input';
import { useAuth } from '../../../components/hooks/useAuth';

const SightingDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthed, session } = useAuth();
  const user = session?.user;
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
  const newCommentCtx = trpc.useContext();
  const { data: sightingComments } = trpc.sighting.getSightingComments.useQuery({ sightingId: id as string });
  const { mutate } = trpc.sighting.createSightingComment.useMutation({
    onSuccess: () => {
      newCommentCtx.sighting.getSightingComments.invalidate({ sightingId: id as string });
    }
  });

  function handleNewComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthed) {
      alert('You need to be logged in to comment');
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const comment = formData.get('comment') as string;
    try {
      mutate({
        comment,
        sightingId: id as string,
        author: user?.id as string
      })
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }
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
                  <div className='w-14 h-14 rounded-full border border-teal-500 shadow-xl bg-teal-100 bg-opacity-70 animate-pulse' />
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
                    <div className='w-14 h-14 rounded-full border border-teal-500 shadow-xl bg-teal-100 bg-opacity-70 animate-pulse' />
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
                    <div className='w-14 h-14 rounded-full border border-teal-500 shadow-xl bg-teal-100 bg-opacity-70 animate-pulse' />
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
            {sightingComments?.length === 0 ? 'No comments yet!' : sightingComments?.length === 1 ? '1 Comment' : `${sightingComments?.length} Comments`}
          </h1>
          <Button className='w-[150px] mb-2'>Add Comment</Button>
        </div>

        <div className='md:w-2/3 px-8'>
          {sightingComments && sightingComments.length > 0 ? (
            sightingComments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
          ) : (
            <div className='flex flex-col gap-y-3 p-6'>
              {[1, 2, 3, 4, 5].map((i,) => (<div key={i} className='w-full h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />))}
            </div>
          )}
        </div>
        <div className='px-4 md:w-2/3 pb-12'>
          <form className='flex flex-col gap-y-4' onSubmit={handleNewComment}>
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

type CommentProps = {
  author: string;
  id: string;
  createdAt: Date;
  sightingId: string;
  comment: string;
  updatedAt: Date;
}

const Comment = ({
  comment
}: {
  comment: CommentProps
}) => {
  const { data: author } = trpc.user.getUser.useQuery({ id: comment.author });

  function formatDate(date: Date): string {
    const now = new Date();
    const d = new Date(date);
    const diff = now.getTime() - d.getTime();
    const ti = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
    }).format(d);

    if (diff < 60 * 1000) {
      // Less than a minute
      const seconds = Math.round(diff / 1000);
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    } else if (diff < 60 * 60 * 1000) {
      // Less than an hour
      const minutes = Math.round(diff / 1000 / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      // Less than a day
      const hours = Math.round(diff / 1000 / 60 / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (d.toDateString() === now.toDateString()) {
      // Today
      return `${ti}`;
    } else if (diff < 30 * 24 * 60 * 60 * 1000) {
      // Less than a month
      const days = Math.round(diff / 1000 / 60 / 60 / 24);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (diff < 12 * 30 * 24 * 60 * 60 * 1000) {
      // Less than a year
      const months = Math.round(diff / 1000 / 60 / 60 / 24 / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      // More than a year
      const years = Math.floor(diff / 1000 / 60 / 60 / 24 / 365);
      const remainingMonths = Math.round((diff - (years * 365 * 24 * 60 * 60 * 1000)) / 1000 / 60 / 60 / 24 / 30);
      return `${years} year${years > 1 ? "s" : ""} and ${remainingMonths} month${remainingMonths > 1 ? "s" : ""} ago`;
    }
  }

  return (
    <div className="flex flex-col gap-y-5 py-3">
      <div className="flex gap-x-4 items-center">
        {author && author.image && author.name ? (
          <Link href={`/user-sightings/${author.id}`}>
            <Image src={author.image} alt={author.name} width={56} height={56} className='rounded-full border border-teal-500 shadow-xl object-cover object-center' />
          </Link>
        ) : (
          <div className='w-14 h-14 rounded-full border border-teal-500 shadow-xl bg-teal-100 bg-opacity-70 animate-pulse' />
        )}
        <div>
          <div className="text-gray-800 text-opacity-80 text-md font-medium  xl:text-center"> {author?.name} </div>
          <div className="text-gray-600 text-opacity-80 text-sm"> {formatDate(comment.createdAt)} </div>
        </div>
      </div>
      <p className="grow font-normal text-[16px] text-justify text-gray-700 font-sans tablet:min-h-[45px] border-b-[1px] pb-[25px]">
        {comment.comment}
      </p>
    </div>
  )
}
