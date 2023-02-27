import Image from "next/image";
import Button from "../button";
import { useAuth } from "../hooks/useAuth";
import { Session } from "next-auth";
import Link from "next/link";

export const UserProfile = ({
  isVisible,
  onClose,
  session,
  userSightings,
}: {
  isVisible: boolean;
  onClose: () => void;
  session: Session;
  userSightings: string;
}) => {
  const { signOut } = useAuth();
  if (!isVisible) return null;
  if (!session || !session.user) return null;
  if (!userSightings) return null;
  const { user } = session;
  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) onClose();
  };
  return (
    <div
      className="fixed z-30 flex w-full items-center justify-center bg-white pt-[80px] md:inset-0 md:bg-teal-200 md:bg-opacity-60"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="flex w-full flex-col justify-center md:h-[290px] md:w-[600px] md:shadow-2xl">
        <div className="flex h-screen flex-col justify-center rounded-[3px] p-[20px] pb-[120px] md:bg-white md:p-[30px]">
          <div
            className="hidden cursor-pointer self-end md:flex"
            onClick={onClose}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="8.92041"
                y="8.05014"
                width="24"
                height="1.23077"
                transform="rotate(45 8.92041 8.05014)"
                fill="#949EA0"
              />
              <rect
                x="25.891"
                y="8.92043"
                width="24"
                height="1.23077"
                transform="rotate(135 25.891 8.92043)"
                fill="#949EA0"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-y-[31px] p-[17px] md:px-14">
            <div className="flex items-center gap-x-[30px]  pb-[18px]">
              {user.image ? (
                <Link href={`/user-sightings/${user.id}`}>
                  <Image
                    src={user.image}
                    alt="user profile image"
                    width={80}
                    height={80}
                    className="rounded-full border border-teal-400"
                  />
                </Link>
              ) : (
                <div className="relative h-[80px] w-[80px] rounded-full border border-teal-400" />
              )}
              <div className="flex flex-col gap-y-[6px]">
                <Link href={`/user-sightings/${user.id}`}>
                  <h1 className="text-[25px] font-light leading-[25px] text-gray-900">
                    {user?.name}
                  </h1>
                </Link>
                <Link href={`/user-sightings/${user.id}`}>
                  <h1 className="text-[13px] font-normal leading-4 text-gray-600">
                    {userSightings} sightings
                  </h1>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-y-[16px]">
              <h1 className="text-[12px] font-normal leading-3 text-gray-600">
                Name
              </h1>
              {user.name ? (
                <h1 className="text-[18px] font-normal leading-4 text-gray-900">
                  {user.name}
                </h1>
              ) : (
                <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
              )}
            </div>
            <div className="flex flex-col gap-y-[16px]">
              <h1 className="text-[12px] font-normal leading-3 text-gray-600">
                Email Address
              </h1>
              {user.email ? (
                <h1 className="text-[18px] font-normal leading-4 text-gray-900">
                  {user.email}
                </h1>
              ) : (
                <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
              )}
            </div>
            <Button
              className="w-1/2 self-center md:w-1/3"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
