import { NextPage, NextPageContext } from 'next';
import Layout from '../../../components/layout';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import { LoadingSkeleton } from '../../../components/sighting-card/loading-skeleton';
import { SightingCard } from '../../../components/sighting-card';
import Image from 'next/image';

const UserSightings: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: userSightings,
    isLoading: areUserSightingsLoading,
    isError: isUserSightingsFetchingError
  } = trpc.sighting.getUserSightings.useQuery({ id: id as string });
  if (isUserSightingsFetchingError) return <div>Something went wrong</div>;
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserFetchingError
  } = trpc.user.getUser.useQuery({ id: id as string });
  if (isUserFetchingError) return <div>Something went wrong</div>;
  return (
    <Layout>
      <main className="z-auto container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-[80px]">
        <section className="text-gray-600 ">
          <div className="container pt-12 mx-auto flex flex-col items-center justify-center ">
            {user && user.image && user.name ? (
              <Image src={user.image} alt={user.name} width={80} height={80} className='rounded-full border border-teal-500 shadow-xl' />
            ) : (
              <div className='w-14 h-14 rounded-full border border-teal-500 shadow-xl' />
            )}
            <div className="flex flex-col">
              <div className="text-gray-600 text-opacity-80 text-sm text-center">User</div>
              {user && user.name ? (
                <div className="text-gray-700 text-[20px] font-bold text-center">{user.name}</div>
              ) : (
                <div className='w-24 h-3 bg-teal-200 bg-opacity-70 rounded animate-pulse' />
              )}
            </div>
          </div>
        </section>

        <section className="text-gray-600 ">
          <div className="container px-5 py-12 mx-auto">
            <div className="flex flex-wrap -m-4 justify-center">
              {areUserSightingsLoading ? (
                [1, 2, 3, 4].map((_, i) => <LoadingSkeleton key={i} />)
              ) : (
                userSightings.map(sighting => (
                  <SightingCard key={sighting.id} sighting={sighting} />
                ))
              )}
            </div>
          </div>
        </section>

      </main>
    </Layout>
  )
}

export default UserSightings;

UserSightings.getInitialProps = async (context: NextPageContext) => {
  const { id } = context.query;
  return { id };
}
