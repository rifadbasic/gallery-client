import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../firebase/Firebase.init";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const googleProvider = new GoogleAuthProvider();

  // 🔹 Google login
  const googleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Email/password login
  const logIn = async (email, password) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Register
  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update profile
  const updateUser = async (updateData) => {
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, updateData);
      setUser({ ...auth.currentUser });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete account
  const deleteAccount = async (password = null) => {
    if (!auth.currentUser) throw new Error("No user logged in");

    try {
      if (
        auth.currentUser.providerData[0].providerId === "password" &&
        password
      ) {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          password,
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
      } else if (auth.currentUser.providerData[0].providerId === "google.com") {
        await signInWithPopup(auth, googleProvider);
      }

      await deleteUser(auth.currentUser);
      setUser(null);
      return true;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // 🔹 Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
        googleSignIn,
        logIn,
        createUser,
        updateUser,
        logOut,
        deleteAccount,
        auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
