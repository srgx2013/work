import { useState, useEffect, useCallback } from "react";
import type { User } from "../types/user";

const USERS_KEY = "bus-users";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("bus-current-user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("bus-current-user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("bus-current-user");
    }
  }, [currentUser]);

  const login = useCallback((name: string, phone: string, destination: string): User | null => {
    const users = getUsers();
    const existingUser = users.find(
      (u) => u.name.toLowerCase() === name.toLowerCase() && u.phone === phone
    );

    if (existingUser) {
      // Update destination if it changed
      const newDestination = destination.trim();
      if ((existingUser as User).destination !== newDestination) {
        existingUser.destination = newDestination;
        saveUsers(users);
      }
      setCurrentUser(existingUser as User);
      return existingUser as User;
    }

    // Register new user
    const newUser: User = {
      name: name.trim(),
      phone: phone.trim(),
      destination: destination.trim(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const isAuthenticated = currentUser !== null;

  return {
    currentUser,
    login,
    logout,
    isAuthenticated,
  };
};

// Helper functions
const getUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};
