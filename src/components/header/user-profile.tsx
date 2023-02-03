import Image from "next/image";
import Button from "../button"
import { useAuth } from "../hooks/useAuth"
import { Session } from "next-auth";

export const UserProfile = ({
  isVisible, onClose, session
}: {
  isVisible: boolean,
  onClose: () => void,
  session: Session,
}) => {
  const { signOut } = useAuth();
  if (!isVisible) return null;
  if (!session || !session.user) return null;
  const { user } = session;
  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) onClose();
  }
  return (
    <div
      className="bg-white w-full z-30 fixed md:inset-0 md:bg-opacity-60 md:bg-teal-200 flex justify-center items-center pt-[80px]" id="wrapper" onClick={handleClose}>
      <div className="w-full md:w-[600px] md:h-[290px] flex flex-col justify-center md:shadow-2xl">
        <div className="rounded-[3px] flex flex-col justify-center h-screen pb-[120px] p-[20px] md:p-[30px] md:bg-white">
          <div className="hidden md:flex self-end cursor-pointer" onClick={onClose}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8.92041" y="8.05014" width="24" height="1.23077" transform="rotate(45 8.92041 8.05014)" fill="#949EA0" />
              <rect x="25.891" y="8.92043" width="24" height="1.23077" transform="rotate(135 25.891 8.92043)" fill="#949EA0" />
            </svg>
          </div>
          <div className="flex flex-col p-[17px] gap-y-[31px] md:px-14">
            <div className="flex items-center gap-x-[30px]  pb-[18px]">
              {user.image ? (
                <Image src={user.image} alt="user profile image" width={80} height={80} className='rounded-full border border-teal-400' />
              ) : (
                <div className="w-[80px] h-[80px] relative rounded-full border border-teal-400" />
              )}
              <div className='flex flex-col gap-y-[6px]'>
                <h1 className="text-gray-900 text-[25px] leading-[25px] font-light">
                  {user?.name}
                </h1>
                <h1 className="text-gray-600 font-normal text-[13px] leading-4"> 47 sightings </h1>
              </div>
            </div>
            <div className='flex flex-col gap-y-[16px]'>
              <h1 className="text-gray-600 text-[12px] leading-3 font-normal"> Name </h1>
              {user.name ? (
                <h1 className="text-gray-900 text-[18px] leading-4 font-normal"> {user.name} </h1>
              ) : (
                <div className='w-24 h-4 bg-gray-300 rounded animate-pulse' />
              )}
            </div>
            <div className='flex flex-col gap-y-[16px]'>
              <h1 className="text-gray-600 text-[12px] leading-3 font-normal"> Email Address </h1>
              {user.email ? (
                <h1 className="text-gray-900 text-[18px] leading-4 font-normal"> {user.email} </h1>
              ) : (
                <div className='w-24 h-4 bg-gray-300 rounded animate-pulse' />
              )}
            </div>
            <Button className='w-1/2 md:w-1/3 self-center' onClick={() => signOut({ callbackUrl: '/' })}> Logout </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
