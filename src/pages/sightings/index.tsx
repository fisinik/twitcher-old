import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/layout";
import { SightingCard } from "../../components/sighting-card";
import Button from "../../components/button";
import Link from "next/link";
import { LoadingSkeleton } from "../../components/sighting-card/loading-skeleton";

const Sightings: NextPage = () => {
  const { data: sightings, isLoading: areSightingsLoading, isError: isSightingFetchingError } = trpc.sighting.getAll.useQuery();
  if (isSightingFetchingError) return <div>Something went wrong</div>;
  return (
    <Layout>
      <main className="z-auto container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-[80px]">
        <section className="pt-6 lg:pt-0">
          <Link href="/new-sighting">
            <Button className="px-6">+ Add New Sighting</Button>
          </Link>
        </section>

        <section className="text-gray-600">
          <div className="container px-5 py-12 mx-auto">
            <div className="flex flex-wrap -m-4 justify-center">
              {areSightingsLoading ? (
                [1, 2, 3, 4].map((_, i) => <LoadingSkeleton key={i} />)
              ) : (
                sightings.map(sighting => (
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

export default Sightings;
