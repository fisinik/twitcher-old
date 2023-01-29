import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Logo } from "./logo";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // lock scrolling when menu is open
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isMenuOpen);
  }, [isMenuOpen]);

  return (
    <header className={`${isMenuOpen ? 'bg-gradient-to-l from-teal-500 to-neutral-50 shadow' : 'bg-neutral-50'} fixed w-full z-50 h-[80px] shadow-2xl flex items-center justify-between px-8 xl:from-neutral-50`}>
      <div className="flex items-center">
        <Logo />
        <h1 className="text-4xl font-bold text-gray-800 font-ubuntu"> Tw <span className={`-mx-2 ${isMenuOpen ? 'text-gray-800 opacity-100' : 'text-teal-400 opacity-80'} xl:text-teal-400 xl:opacity-80`}> itch </span> er </h1>
      </div>
      <nav className="">
        <label className={`${styles.hamburger} mt-1`}>
          <input className="xl:hidden" type="checkbox" checked={!isMenuOpen} onChange={() => setIsMenuOpen(!isMenuOpen)} />
          <div>
            <span></span>
            <span></span>
          </div>
        </label>
        <ul
          className={`${isMenuOpen ? styles.menuOpen : styles.menuClose} z-50 font-ubuntu w-screen fixed overflow-hidden top-[80px] right-0 bottom-0 flex flex-col items-center
            justify-center
            xl:opacity-100 xl:flex-row xl:bg-neutral-50 xl:static xl:w-auto xl:space-x-16 xl:font-normal xl:text-xl xl:pr-10
            `}>
          <li className={`${styles.menuItem} hover:bg-gradient-to-l from-neutral-50 hover:text-gray-800 xl:bg-neutral-50 xl:hover:text-2xl xl:hover:text-gray-900`}>
            <Link href="/">Home</Link>
          </li>
          <li className={`${styles.menuItem} hover:bg-gradient-to-l from-neutral-50 hover:text-gray-800 xl:bg-neutral-50 xl:hover:text-2xl xl:hover:text-gray-900`}>
            <Link href="/sightings">Sightings</Link>
          </li>
          <li className={`${styles.menuItem} hover:bg-gradient-to-l from-neutral-50 hover:text-gray-800 xl:bg-neutral-50 xl:hover:text-2xl xl:hover:text-gray-900`}>
            <AuthButton />
          </li>
        </ul>
      </nav>
    </header >
  )
}

const AuthButton: React.FC = () => {
  const { data: sessionData } = useSession();

  return (<>
    <span
      className="cursor-pointer"
      onClick={sessionData ? () => signOut() : () => signIn()}
    >
      {sessionData ? "Log out" : "Log in"}
    </span>
  </>
  );
};