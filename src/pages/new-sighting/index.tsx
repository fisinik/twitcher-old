import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/layout";
import FormInput from "../../components/form-input";
import Button from "../../components/button";
import React, { useState } from "react";
import { useAuth } from "../../components/hooks/useAuth";
import axios from "axios";
import { env } from "../../env/client.mjs";
import Link from "next/link";

const NewSighting: NextPage = () => {
  const { data: birds } = trpc.bird.getAll.useQuery();
  const { mutate } = trpc.sighting.addNew.useMutation();
  const { isAuthed, session } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleAddSighting = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthed || !session || !session.user) {
      return;
    } // to do: redirect to login page
    const form = event.currentTarget;
    const formData = new FormData(form);
    const image = formData.get("image") as File;
    if (!image) {
      return;
    } // to do: add error handling
    const imageData = new FormData();
    imageData.append("file", image);
    imageData.append("upload_preset", env.NEXT_PUBLIC_UPLOAD_PRESET);
    imageData.append("cloud_name", env.NEXT_PUBLIC_CLOUD_NAME);
    imageData.append("folder", "sightings");
    let url = "" as string;
    try {
      const resp = await axios.post(env.NEXT_PUBLIC_UPLOAD_URL, imageData);
      url = resp.data.secure_url;
    } catch (error) {
      console.log(error);
    }

    const birdName = formData.get("bird_name") as string;
    const bird = birds?.filter((bird) => bird.name === birdName);
    if (!bird || bird.length === 0 || bird[0] === undefined) {
      return;
    } // to do: add error handling
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const newSighting = {
      birdId: bird[0].id,
      name: name,
      author: session.user.id,
      description: description,
      image: url,
      location: location,
    };
    try {
      mutate({ ...newSighting });
      setIsNotificationOpen(true);
    } catch (error) {
      console.log(error);
    }
    // to do: add error handling
    // to do: add loading state
    // to do: add validation
  };
  return (
    <Layout>
      <div className="absolute top-[80px] h-full w-full bg-gradient-to-r from-teal-50 to-teal-100" />
      <div className="mx-[16px] flex flex-col md:mx-[20px] xl:mx-[120px]">
        <div className="relative top-[160px] z-10 flex w-full flex-col rounded-sm bg-white p-[20px] shadow-2xl md:flex-row md:gap-x-[50px]">
          <form
            onSubmit={handleAddSighting}
            className="flex flex-col gap-y-[10px] md:mb-[70px] md:w-full"
          >
            <div className="flex flex-col items-center gap-y-[10px] p-[30px]">
              <h1 className="text-[24px] font-light text-gray-900 md:text-[40px]">
                Add New Sighting
              </h1>
            </div>
            <div className="flex flex-col items-center gap-y-[10px] md:flex-row md:gap-x-[20px]">
              <FormInput label="Sighting title" type="text" name="name" />
              <AutocompleteBirdName
                items={birds ? birds?.map((bird) => bird.name) : []}
              />
              <FormInput
                label="Sighting location"
                type="text"
                name="location"
              />
              <div className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded-md bg-gradient-to-l from-teal-50 text-teal-400 shadow-lg hover:to-teal-100 md:ml-[30px] md:w-[200px] md:flex-shrink-0 md:shadow-xl">
                <label className="flex cursor-pointer">
                  <input type="file" className="hidden" name="image" />
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_0_457"
                      style={{ maskType: `alpha` }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M24 24H0V0H24V24Z"
                        fill="white"
                      />
                    </mask>
                    <g mask="url(#mask0_0_457)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 1V4H0V6H3V9H5V6H8V4H5V1H3ZM6 7V10H3V20C3 21.1 3.9 22 5 22H21C22.1 22 23 21.1 23 20V8C23 6.9 22.1 6 21 6H17.83L16 4H9V7H6ZM13 19C15.76 19 18 16.76 18 14C18 11.24 15.76 9 13 9C10.24 9 8 11.24 8 14C8 16.76 10.24 19 13 19ZM13 17.2C11.23 17.2 9.8 15.77 9.8 14C9.8 12.23 11.23 10.8 13 10.8C14.77 10.8 16.2 12.23 16.2 14C16.2 15.77 14.77 17.2 13 17.2Z"
                        fill="#5eead4"
                      />
                    </g>
                  </svg>
                  <span className="ml-2">Add a Photo </span>
                </label>
              </div>
            </div>
            <FormInput
              label="Write a description..."
              type="textarea"
              name="description"
            />
            <Button className="md:w-[200px] md:self-end md:shadow-xl">
              Create New Sighting
            </Button>
          </form>
        </div>
      </div>
      <NewSightingNotification
        isVisible={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </Layout>
  );
};

export default NewSighting;

function AutocompleteBirdName({ items }: { items: string[] }) {
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [showOptions, setShowOptions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputValue(input);
    const filtered = items?.filter((item) =>
      item.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredItems(filtered);
    setShowOptions(true);
  };

  const handleOptionClick = (item: string) => {
    setInputValue(item);
    setShowOptions(false);
  };

  return (
    <div className="relative w-full">
      <FormInput
        name="bird_name"
        label="Bird name"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
        onFocus={handleInputChange}
      />
      {showOptions && (
        <ul className="absolute z-20 w-full rounded-[3px] border border-teal-400 bg-teal-50 shadow-2xl">
          {filteredItems?.map((item, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(item)}
              className="cursor-pointer rounded-[3px] from-teal-100 py-3 px-4 hover:bg-gradient-to-r hover:text-lg hover:shadow-md"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const NewSightingNotification = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  if (!isVisible) return null;
  const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement)?.id === "wrapper") {
      onClose();
    }
  };

  return (
    <div
      className="fixed top-0 left-0 z-50 h-full w-full bg-black bg-opacity-50 md:z-30"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="rounded-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white shadow-2xl">
        <div className="flex flex-col items-center p-4">
          <h1 className="text-lg"> Congratulations! </h1>
          <h2 className="text-outer-space py-2 text-sm">
            You have successfully added a new sighting!
          </h2>
          <div className="flex w-full gap-x-3">
            <Button className="w-1/3" onClick={() => window.location.reload()}>
              OK
            </Button>
            <Button className="w-2/3 px-2">
              <Link href="/sightings"> Latest Sightings </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
