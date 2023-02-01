import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/layout";
import FormInput from "../../components/form-input";
import Button from "../../components/button";
import React, { useState } from "react";
import { useAuth } from "../../components/hooks/useAuth";
import axios from "axios";
import { env } from "../../env/client.mjs";
import { useFormValidation } from "../../components/hooks/useFormValidation";
import Link from "next/link";

const initialFormValues = {
  name: '',
  location: '',
  description: '',
  image: '',
}

const fields = {
  name: (value: string) => {
    if (!value) {
      return 'Sighting title is required';
    }
  },
  location: (value: string) => {
    if (!value) {
      return 'Sighting location is required';
    }
  },
  description: (value: string) => {
    if (!value) {
      return 'Sighting description is required';
    }
  },
  image: (value: string) => {
    if (!value) {
      return 'Sighting image is required';
    }
  },
} as { [field: string]: (value: string) => string | undefined };

const NewSighting: NextPage = () => {
  const { data: birds } = trpc.bird.getAll.useQuery();
  const { mutate } = trpc.sighting.addNew.useMutation();
  const { isAuthed, session } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleAddSighting = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthed || !session || !session.user) { return; } // to do: redirect to login page
    const form = event.currentTarget;
    const formData = new FormData(form);
    const image = formData.get("bird_name")?.toString();
    if (!image) { return; } // to do: add error handling
    const imageData = new FormData();
    imageData.append("file", image);
    imageData.append("upload_preset", env.NEXT_PUBLIC_UPLOAD_PRESET);
    imageData.append("cloud_name", env.NEXT_PUBLIC_CLOUD_NAME);
    imageData.append("folder", "sightings");
    let url = '' as string;
    try {
      const resp = await axios.post(env.NEXT_PUBLIC_UPLOAD_URL, imageData);
      url = resp.data.url;
    } catch (error) {
      console.log(error);
    }

    const birdName = formData.get("bird_name") as string;
    const bird = birds?.filter(bird => bird.name === birdName);
    if (!bird || bird.length === 0 || bird[0] === undefined) { return; } // to do: add error handling
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
    }
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
  const {
    handleChange,
    handleSubmit,
    values,
    errors,
  } = useFormValidation(initialFormValues, fields, handleAddSighting);
  return (
    <Layout>
      <div className="w-full h-full absolute bg-cover bg-center top-[80px] bg-gradient-to-r from-teal-50 to-teal-100" />
      <div className="flex flex-col mx-[16px] md:mx-[20px] xl:mx-[120px]">
        <div className="z-10 w-full flex flex-col md:flex-row md:gap-x-[50px] relative top-[160px] shadow-2xl bg-white p-[20px] rounded-sm">
          <form onSubmit={handleSubmit}
            className="flex flex-col gap-y-[10px] md:w-full md:mb-[70px]">
            <div className="flex flex-col gap-y-[10px] items-center p-[30px]">
              <h1 className="text-[24px] md:text-[40px] leading-[40px] font-light text-granny-smith"> Add New Sighting </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-y-[10px] md:gap-x-[20px] items-center">
              <FormInput label="Sighting title" type="text" name="name" onChange={handleChange} value={values.name} error={errors.name} />
              <AutocompleteBirdName items={birds ? birds?.map((bird) => bird.name) : []} />
              <FormInput label="Sighting location" type="text" name="location" onChange={handleChange} value={values.location} error={errors.location} />
              <div className="md:flex-shrink-0 shadow-lg bg-gradient-to-l from-teal-50 hover:to-teal-100 md:shadow-xl cursor-pointer w-full md:w-[200px] md:ml-[30px] h-[50px] rounded-md text-teal-400 flex justify-center items-center">
                <label className="cursor-pointer flex">
                  <input type="file" className="hidden" name="image" />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_0_457" style={{ maskType: `alpha` }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M24 24H0V0H24V24Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_0_457)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M3 1V4H0V6H3V9H5V6H8V4H5V1H3ZM6 7V10H3V20C3 21.1 3.9 22 5 22H21C22.1 22 23 21.1 23 20V8C23 6.9 22.1 6 21 6H17.83L16 4H9V7H6ZM13 19C15.76 19 18 16.76 18 14C18 11.24 15.76 9 13 9C10.24 9 8 11.24 8 14C8 16.76 10.24 19 13 19ZM13 17.2C11.23 17.2 9.8 15.77 9.8 14C9.8 12.23 11.23 10.8 13 10.8C14.77 10.8 16.2 12.23 16.2 14C16.2 15.77 14.77 17.2 13 17.2Z" fill="#5eead4" />
                    </g>
                  </svg>
                  <span className="ml-2">Add a Photo </span>
                </label>
              </div>
            </div>
            <FormInput label="Write a description..." type="textarea" name="description" />
            <Button className="md:w-[200px] md:self-end md:shadow-xl"> Create New Sighting </Button>
          </form>
        </div>
      </div>
      <NewSightingNotification isVisible={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </Layout>
  )
}

export default NewSighting;

function AutocompleteBirdName({
  items
}: {
  items: string[],
}) {
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [showOptions, setShowOptions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputValue(input);
    const filtered = items?.filter((item) => item.toLowerCase().includes(input.toLowerCase()));
    setFilteredItems(filtered);
    setShowOptions(true);
  };

  const handleOptionClick = (item: string) => {
    setInputValue(item);
    setShowOptions(false);
  };

  return (
    <div className='relative w-full'>
      <FormInput name='bird_name' label='Bird name' type="text" value={inputValue} onChange={handleInputChange} onBlur={() => setTimeout(() => setShowOptions(false), 100)} onFocus={handleInputChange} />
      {showOptions && (
        <ul className='bg-teal-50 shadow-2xl absolute rounded-[3px] z-20 w-full border border-teal-400'>
          {filteredItems?.map((item, index) => (
            <li key={index} onClick={() => handleOptionClick(item)} className='hover:bg-gradient-to-r from-teal-100 hover:shadow-md hover:text-lg cursor-pointer py-3 px-4 rounded-[3px]'>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const NewSightingNotification = ({
  isVisible, onClose
}: {
  isVisible: boolean,
  onClose: () => void
}) => {
  if (!isVisible) return null;
  const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement)?.id === 'wrapper') { onClose(); }
  }

  return (
    <div className="md:z-30 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50" id="wrapper" onClick={handleClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3 shadow-2xl">
        <div className="flex flex-col p-4 items-center" >
          <h1 className="text-lg"> Congratulations! </h1>
          <h2 className="text-sm py-2 text-outer-space"> You have successfully added a new sighting! </h2>
          <div className="flex gap-x-3 w-full">
            <Button className="w-1/3"
              onClick={() => window.location.reload()}> OK </Button>
            <Button className="w-2/3 px-2"><Link href="/sightings"> Latest Sightings </Link> </Button>
          </div>
        </div>
      </div>
    </div>
  );
}