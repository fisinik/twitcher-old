import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/layout";
import { SightingCard } from "../../components/sighting-card";
import Button from "../../components/button";
import Link from "next/link";
import { LoadingSkeleton } from "../../components/sighting-card/loading-skeleton";
import FormInput from "../../components/form-input";

const Sightings: NextPage = () => {
  const { data: sightings, isLoading: areSightingsLoading, isError: isSightingFetchingError } = trpc.sighting.getAll.useQuery();
  if (isSightingFetchingError) return <div>Something went wrong</div>;
  return (
    <Layout>
      <main className="z-auto container mx-auto flex min-h-screen flex-col items-center justify-center pt-[80px]">

        <section className="h-[500px] w-full relative" style={{ backgroundImage: `url('/bird-details-bg.png')` }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-4 bg-gradient-to-t from-black">
            <p className="text-2xl font-light text-white opacity-90 text-center">Search through 142 sightings</p>
            <div className="w-3/4 md:w-1/2">
              <FormInput label="Search a sighting..." type="text" name="search" />
            </div>
          </div>
        </section>

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
