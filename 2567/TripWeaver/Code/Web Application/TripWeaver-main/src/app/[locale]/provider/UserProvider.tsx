"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PersonaForm from "../components/PersonaForm";

interface IUserContext {
  userData: any;
}

const UserContext = createContext<IUserContext>({ userData: null });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session , status} = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch(`/api/user/getUser/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);

          const scores = Object.values(
            data?.attractionTagScore?.attractionTagFields || {}
          ) as number[];
          const sum = scores.reduce((acc, val) => acc + val, 0);

          if (sum === 0) {
            setIsModalOpen(true);
          }
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ userData }}>
      {children}
      {isModalOpen && <PersonaForm onClose={() => setIsModalOpen(false)} />}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
