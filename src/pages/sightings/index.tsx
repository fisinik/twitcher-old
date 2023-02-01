import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/layout";
import { SightingCard } from "../../components/sighting-card";
import Button from "../../components/button";

const Sightings: NextPage = () => {
  const { data: sightings } = trpc.sighting.getAll.useQuery();
  console.log(sightings, ' sightings');

  return (
    <Layout>
      <main className="z-auto container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-[80px]">
        <section>
          <Button className="px-6">+ Add New Sighting</Button>
        </section>

        <section className="text-gray-600 ">
          <div className="container px-5 py-12 mx-auto">
            <div className="flex flex-wrap -m-4 justify-center">
              {sightings ? (
                sightings.map(sighting => (
                  <SightingCard key={sighting.id} sighting={sighting} />
                ))
              ) : (
                <p>Loading..</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default Sightings;
