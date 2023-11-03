"use client";

import { AnimationProps, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { ChangeEvent, EventHandler } from "react";

interface UserImageProps {
  image?: string;
}

const content = {
  key1: "value1",
  key2: "value2",
};

const UserImage: React.FC<UserImageProps> = ({ image }) => {
  const animation: AnimationProps = {
    variants: {
      initial: { opacity: 0 },
      hover: { opacity: 1 },
    },
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let formData = new FormData();
    formData.append("data", JSON.stringify(content));
    formData.append("profile_picture", e.target.files[0]);
    axios.put("/api/update", formData).then(console.log).catch(console.log);
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="flex flex-col items-center relative hover:cursor-pointer md:w-40 md:h-40 w-24 h-24 my-6 rounded-full"
    >
      <Image
        width={328}
        height={328}
        src={`/assets/images/${image || "default_user"}.png`}
        alt="profile image"
        className="w-full h-full rounded-full"
      />
      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-black bg-opacity-0 hover:bg-opacity-30 flex flex-col items-center justify-center">
        <motion.div
          {...animation}
          className="w-full h-full rounded-full absolute top-0 left-0 bg-primary bg-opacity-70"
        />
        <motion.input
          onChange={handleChange}
          accept="*"
          type="file"
          className="w-full h-full rounded-full absolute top-0 left-0 opacity-0 z-10"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        ></motion.input>
        <motion.div
          {...animation}
          className="w-full h-full rounded-full absolute top-0 left-0 flex flex-col items-center justify-center"
        >
          <p className="text-white text-2xl">+</p>
          <p className="text-white text-sm">Adicionar</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserImage;
