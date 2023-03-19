import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import Layout from "../../../components/layout";
import Image from "next/image";
import Link from "next/link";
import Button from "../../../components/button";
import FormInput from "../../../components/form-input";
import { useAuth } from "../../../components/hooks/useAuth";
import { User } from "next-auth";

const SightingDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { isAuthed, session } = useAuth();
  const user = session?.user as User;
  const { likeSighting, unlikeSighting } = useLikeSighting(id, user);
  const { likeId } = useIsLikedByUser(id, user);

  function handleLike() {
    if (!isAuthed) return router.push("/api/auth/signin");
    try {
      likeSighting({
        sightingId: id,
        author: user?.id,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleUnlike() {
    if (!isAuthed) return router.push("/api/auth/signin");
    try {
      unlikeSighting({
        id: likeId as string,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout>
      <div className="absolute top-[80px] h-full w-full bg-gradient-to-r from-teal-50 to-teal-100 bg-cover bg-center" />

      <div className="mx-[16px] flex h-full flex-col md:mx-[20px] xl:mx-[120px] ">
        <div className="relative top-[140px] flex  w-full flex-col gap-y-4 rounded-sm bg-teal-50 shadow-2xl">
          <div className="flex items-start lg:items-center lg:p-6 ">
            <SightingImage sightingId={id} />

            <SightingInfoDesktop
              sightingId={id}
              user={user}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
            />
          </div>
          <div className="p-4 pb-10 lg:mx-20">
            <div className="flex h-auto w-auto flex-col gap-y-4  rounded-sm border border-teal-400 border-opacity-30 bg-white p-4 shadow-2xl lg:w-full lg:self-center">
              <SightingInfoMobile
                sightingId={id}
                user={user}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
              />

              <SightingDescription sightingId={id} />
            </div>
          </div>
        </div>
      </div>
      <CommentSection sightingId={id} />
    </Layout>
  );
};

export default SightingDetails;

SightingDetails.getInitialProps = async (context: NextPageContext) => {
  const { id } = context.query;
  return { id };
};

function SightingImage({ sightingId }: { sightingId: string }) {
  const { sighting } = useSightingDetails(sightingId);
  return (
    <div className="relative h-[350px] grow rounded-sm border border-opacity-30 bg-white sm:h-[400px] sm:shadow-none lg:h-[500px] lg:w-auto lg:border-teal-200">
      {sighting && sighting.image && sighting.name ? (
        <Image
          src={sighting.image}
          alt={sighting.name}
          priority
          fill
          className="object-cover object-center shadow-2xl lg:rounded-md lg:p-1"
        />
      ) : (
        <div className="h-full w-full animate-pulse rounded-md bg-teal-200" />
      )}
    </div>
  );
}

function SightingInfoDesktop({
  sightingId,
  handleUnlike,
  handleLike,
  user,
}: {
  sightingId: string;
  handleUnlike: () => void;
  handleLike: () => void;
  user: User;
}) {
  const { sighting, bird, author } = useSightingDetails(sightingId);
  const { sightingLikes } = useSightingLikeCount(sightingId);
  const { isLikedByUser } = useIsLikedByUser(sightingId, user as User);
  return (
    <div className="mx-10 hidden h-[350px] w-1/2 flex-col justify-between bg-white  p-10 shadow-2xl lg:flex">
      <div className="flex flex-col items-center justify-center gap-y-1">
        {author && author.image && author.name ? (
          <Image
            src={author.image}
            alt={author.name}
            width={64}
            height={64}
            className="rounded-full border border-teal-500 shadow-xl"
          />
        ) : (
          <div className="h-14 w-14 animate-pulse rounded-full border border-teal-500 bg-teal-100 bg-opacity-70 shadow-xl" />
        )}

        {author && author.name ? (
          <p className=" text-sm text-gray-600 text-opacity-80">
            by {author.name}
          </p>
        ) : (
          <div className="h-3 w-24 animate-pulse rounded bg-teal-200 bg-opacity-70" />
        )}
        {sighting && sighting.name ? (
          <h2 className="text-2xl font-bold text-gray-700 xl:text-center">
            {sighting.name}
          </h2>
        ) : (
          <div className="h-3 w-24 animate-pulse rounded bg-teal-200 bg-opacity-70" />
        )}
      </div>

      <div className="flex items-center justify-center gap-x-2">
        {isLikedByUser ? (
          <span
            className="cursor-pointer rounded-full bg-teal-200 bg-opacity-60 hover:bg-teal-300 hover:bg-opacity-60"
            onClick={handleUnlike}
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </span>
        ) : (
          <span
            className="cursor-pointer rounded-full bg-teal-200 bg-opacity-60 hover:bg-teal-300 hover:bg-opacity-60"
            onClick={handleLike}
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </span>
        )}
        <button className="mt-1 h-[35px] w-[110px] rounded-[20px] bg-teal-200 bg-opacity-60 text-[13px] leading-[12px]  text-gray-800 hover:bg-teal-300 hover:bg-opacity-60">
          {sightingLikes?.length === 0
            ? "no likes yet!"
            : sightingLikes?.length === 1
            ? "1 like"
            : `${sightingLikes?.length} likes`}
        </button>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="text-sm text-gray-600 text-opacity-80  xl:text-center">
            Bird name
          </div>
          {bird && bird.id && bird.name ? (
            <Link href={`/bird-details/${bird.id}`}>
              <div className="text-[20px] font-bold text-gray-700 xl:text-center">
                {bird.name}
              </div>
            </Link>
          ) : (
            <div className="h-3 w-24 animate-pulse rounded bg-teal-200 bg-opacity-70" />
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-sm text-gray-600 text-opacity-80 xl:text-center">
            Sighting location
          </div>
          {sighting && sighting.location ? (
            <div className="text-[20px] font-bold text-gray-700 xl:text-center">
              {sighting.location}
            </div>
          ) : (
            <div className="h-3 w-24 animate-pulse rounded bg-teal-200 bg-opacity-70" />
          )}
        </div>
      </div>
    </div>
  );
}

function SightingInfoMobile({
  sightingId,
  handleUnlike,
  handleLike,
  user,
}: {
  sightingId: string;
  handleUnlike: () => void;
  handleLike: () => void;
  user: User;
}) {
  const { sighting, bird, author } = useSightingDetails(sightingId);
  const { sightingLikes } = useSightingLikeCount(sightingId);
  const { isLikedByUser } = useIsLikedByUser(sightingId, user);
  return (
    <div className="flex flex-col gap-y-3 lg:hidden">
      <div className="flex flex-col items-center justify-center gap-y-1 xl:hidden">
        {author && author.image && author.name ? (
          <Image
            src={author.image}
            alt={author.name}
            width={56}
            height={56}
            className="rounded-full border border-teal-500 shadow-xl"
          />
        ) : (
          <div className="h-14 w-14 animate-pulse rounded-full border border-teal-500 bg-teal-100 bg-opacity-70 shadow-xl" />
        )}
        {author && author.name ? (
          <p className=" text-sm text-gray-600 text-opacity-80">
            by {author.name}
          </p>
        ) : (
          <div className="h-3 w-24 animate-pulse rounded bg-teal-200 bg-opacity-70" />
        )}
        {sighting && sighting.name ? (
          <h2 className="text-xl font-bold text-gray-700 xl:text-center">
            {sighting.name}
          </h2>
        ) : (
          <div className="h-3 w-24 animate-pulse rounded bg-teal-200 bg-opacity-70" />
        )}
      </div>

      <div className="flex items-center justify-center gap-x-2">
        {isLikedByUser ? (
          <span
            className="cursor-pointer rounded-full bg-teal-200 bg-opacity-60 hover:bg-teal-300 hover:bg-opacity-60"
            onClick={handleUnlike}
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </span>
        ) : (
          <span
            className="cursor-pointer rounded-full bg-teal-200 bg-opacity-60 hover:bg-teal-300 hover:bg-opacity-60"
            onClick={handleLike}
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </span>
        )}
        <button className="mt-1 h-[35px] w-[110px] rounded-[20px] bg-teal-200 bg-opacity-60 text-[13px] leading-[12px]  text-gray-800 hover:bg-teal-300 hover:bg-opacity-60">
          {sightingLikes?.length === 0
            ? "no likes yet!"
            : sightingLikes?.length === 1
            ? "1 like"
            : `${sightingLikes?.length} likes`}
        </button>
      </div>

      <div className="flex flex-col">
        <div className="text-sm text-gray-600 text-opacity-80  xl:text-center">
          Bird name
        </div>
        {bird && bird.id && bird.name ? (
          <Link href={`/bird-details/${bird.id}`}>
            <div className="text-[20px] font-bold text-gray-700 xl:text-center">
              {bird.name}
            </div>
          </Link>
        ) : (
          <div className="h-3 w-24 animate-pulse rounded bg-teal-200 bg-opacity-70" />
        )}
      </div>

      <div className="hidden flex-col items-center justify-center gap-y-1 xl:flex xl:grow">
        {author && author.image && author.name ? (
          <Image
            src={author.image}
            alt={author.name}
            width={56}
            height={56}
            className="rounded-full border border-teal-500 shadow-xl"
          />
        ) : (
          <div className="h-14 w-14 animate-pulse rounded-full border border-teal-500 bg-teal-100 bg-opacity-70 shadow-xl" />
        )}
        {author && author.name ? (
          <p className=" text-sm text-gray-600 text-opacity-80">
            by {author.name}
          </p>
        ) : (
          <div className="h-3 w-24 animate-pulse rounded bg-teal-200 bg-opacity-70" />
        )}
        {sighting && sighting.name ? (
          <h2 className="text-xl font-bold text-gray-700 xl:text-center">
            {sighting.name}
          </h2>
        ) : (
          <div className="h-3 w-24 animate-pulse rounded bg-teal-200 bg-opacity-70" />
        )}
      </div>

      <div className="flex flex-col">
        <div className="text-sm text-gray-600 text-opacity-80 xl:text-center">
          Sighting location
        </div>
        {sighting && sighting.location ? (
          <div className="text-[20px] font-bold text-gray-700 xl:text-center">
            {sighting.location}
          </div>
        ) : (
          <div className="h-3 w-24 animate-pulse rounded bg-teal-200 bg-opacity-70" />
        )}
      </div>
    </div>
  );
}

function SightingDescription({ sightingId }: { sightingId: string }) {
  const { sighting } = useSightingDetails(sightingId);
  return (
    <div className="flex flex-col px-2">
      {sighting && sighting.description ? (
        <div className="font-sans text-[16px] font-normal text-gray-700 lg:p-4 lg:px-6">
          {sighting.description}
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-3 w-full animate-pulse rounded bg-teal-200 bg-opacity-70"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentSection({ sightingId }: { sightingId: string }) {
  const { session, isAuthed } = useAuth();
  const user = session?.user;
  const { sightingComments, createNewSighting } =
    useSightingComments(sightingId);

  function handleNewComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthed) {
      alert("You need to be logged in to comment");
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const comment = formData.get("comment") as string;
    try {
      createNewSighting({
        comment,
        sightingId: sightingId,
        author: user?.id as string,
      });
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="relative top-[240px] flex h-[350px] w-full flex-col gap-y-8 p-8 md:items-center">
      <div className="flex items-center justify-between gap-y-10 border-b-[1px] pb-6 md:w-2/3">
        <h1 className="text-2xl font-light lg:text-[30px]">
          {sightingComments?.length === 0
            ? "No comments yet!"
            : sightingComments?.length === 1
            ? "1 Comment"
            : `${sightingComments?.length} Comments`}
        </h1>
        <Button className="mb-2 w-[150px]">Add Comment</Button>
      </div>

      <div className="px-8 md:w-2/3">
        {sightingComments && sightingComments.length > 0 ? (
          sightingComments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="flex flex-col gap-y-3 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-3 w-full animate-pulse rounded bg-teal-200 bg-opacity-70"
              />
            ))}
          </div>
        )}
      </div>
      <div className="px-4 pb-12 md:w-2/3">
        <form className="flex flex-col gap-y-4" onSubmit={handleNewComment}>
          <FormInput
            name="comment"
            label="Write a comment..."
            type="textarea"
          />
          <Button className="mb-2 w-[150px] self-end">Add Comment</Button>
        </form>
      </div>
    </div>
  );
}

const Comment = ({ comment }: { comment: CommentProps }) => {
  const { commentAuthor } = useCommentAuthor(comment.author);

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
      const remainingMonths = Math.round(
        (diff - years * 365 * 24 * 60 * 60 * 1000) / 1000 / 60 / 60 / 24 / 30
      );
      return `${years} year${
        years > 1 ? "s" : ""
      } and ${remainingMonths} month${remainingMonths > 1 ? "s" : ""} ago`;
    }
  }
  return (
    <div className="flex flex-col gap-y-5 py-3">
      <div className="flex items-center gap-x-4">
        {commentAuthor && commentAuthor.image && commentAuthor.name ? (
          <Link href={`/user-sightings/${commentAuthor.id}`}>
            <Image
              src={commentAuthor.image}
              alt={commentAuthor.name}
              width={56}
              height={56}
              className="rounded-full border border-teal-500 object-cover object-center shadow-xl"
            />
          </Link>
        ) : (
          <div className="h-14 w-14 animate-pulse rounded-full border border-teal-500 bg-teal-100 bg-opacity-70 shadow-xl" />
        )}
        <div>
          <div className="text-md font-medium text-gray-800 text-opacity-80  xl:text-center">
            {commentAuthor?.name}
          </div>
          <div className="text-sm text-gray-600 text-opacity-80">
            {formatDate(comment.createdAt)}
          </div>
        </div>
      </div>
      <p className="tablet:min-h-[45px] grow border-b-[1px] pb-[25px] text-justify font-sans text-[16px] font-normal text-gray-700">
        {comment.comment}
      </p>
    </div>
  );
};

function useSightingDetails(sightingId?: string) {
  const { data: sighting, isError: isErrorFetchingSighting } =
    trpc.sighting.getOne.useQuery({ id: sightingId as string });

  const { data: bird, isError: isErrorFetchingBird } =
    trpc.bird.getOne.useQuery(
      {
        id: sighting?.birdId as string,
      },
      {
        enabled: sighting?.birdId !== undefined,
      }
    );

  const { data: author, isError: isErrorFetchingAuthor } =
    trpc.user.getSightingAuthor.useQuery(
      {
        id: sighting?.author as string,
      },
      {
        enabled: sighting?.author !== undefined,
      }
    );

  return {
    sighting,
    isErrorFetchingSighting,
    bird,
    isErrorFetchingBird,
    author,
    isErrorFetchingAuthor,
  };
}

function useSightingComments(sightingId?: string) {
  const newCommentCtx = trpc.useContext();

  const { data: sightingComments } = trpc.sighting.getSightingComments.useQuery(
    { sightingId: sightingId as string },
    {
      enabled: sightingId !== undefined,
    }
  );

  const { mutate: createNewSighting } =
    trpc.sighting.createSightingComment.useMutation({
      onSuccess: () => {
        newCommentCtx.sighting.getSightingComments.invalidate({
          sightingId: sightingId as string,
        });
      },
    });

  return {
    sightingComments,
    createNewSighting,
  };
}

function useLikeSighting(sightingId: string, user: User) {
  const likeSightingCtx = trpc.useContext();

  const { mutate: likeSighting } = trpc.sighting.likeSighting.useMutation({
    onSuccess: () => {
      likeSightingCtx.sighting.getUserLikes.invalidate({
        author: user?.id as string,
      });
      likeSightingCtx.sighting.getSightingLikes.invalidate({
        sightingId: sightingId as string,
      });
    },
  });

  const { mutate: unlikeSighting } = trpc.sighting.unlikeSighting.useMutation({
    onSuccess: () => {
      likeSightingCtx.sighting.getUserLikes.invalidate({
        author: user?.id as string,
      });
      likeSightingCtx.sighting.getSightingLikes.invalidate({
        sightingId: sightingId as string,
      });
    },
  });

  return {
    likeSighting,
    unlikeSighting,
  };
}

function useSightingLikeCount(sightingId: string) {
  const { data: sightingLikes } = trpc.sighting.getSightingLikes.useQuery({
    sightingId: sightingId,
  });

  return {
    sightingLikes,
  };
}

function useIsLikedByUser(sightingId: string, user: User) {
  const { data: userLikes } = trpc.sighting.getUserLikes.useQuery(
    {
      author: user?.id as string,
    },
    {
      enabled: user?.id !== undefined,
    }
  );
  const isLikedByUser = userLikes?.find(
    (like) => like.sightingId === sightingId
  )
    ? true
    : false;
  const likeId = userLikes?.find((like) => like.sightingId === sightingId)?.id;

  return {
    isLikedByUser,
    likeId,
  };
}

function useCommentAuthor(author: string) {
  const { data: commentAuthor } = trpc.user.getUser.useQuery({ id: author });

  return {
    commentAuthor,
  };
}

interface CommentProps {
  author: string;
  id: string;
  createdAt: Date;
  sightingId: string;
  comment: string;
  updatedAt: Date;
}
