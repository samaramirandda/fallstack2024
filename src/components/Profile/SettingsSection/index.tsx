"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Student, User } from "@prisma/client";
import { Area } from "react-easy-crop";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import swal from "sweetalert";

import { ProfileData } from "@/types/ProfileData";
import { getSignedUrl, setTarget, uploadToBucket } from "@/lib/upload";
import { BASE_URL } from "@/services/api";
import PrimaryButton from "@/components/PrimaryButton";
import AvatarCropper from "@/components/Profile/AvatarCropper";
import UserImage from "@/components/Profile/UserImage";
import { getCroppedImg } from "@/utils/canvas";

import Modal from "../../Modal";
import ImportCvSection from "../ImportCvSection";
import Input from "../Input";
import InterestSelector from "../InterestSelector";
import UserBioTextArea from "../UserBioTextArea";

interface SettingsSectionProps {
  student: Student & { user: User };
  profile: ProfileData;
  setProfile: Dispatch<SetStateAction<ProfileData>>;
  setActiveTab: Dispatch<SetStateAction<"Sumário" | "Perfil" | "Definições">>;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  student,
  profile,
  setProfile,
  setActiveTab,
}) => {
  const LIMIT = 255;

  const router = useRouter();

  const githubRef = useRef<HTMLInputElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userImage, setUserImage] = useState<string | null>(student.avatar);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false);

  function handleUserBioChange(bio: string) {
    if (bio.length > LIMIT) return;
    // setUserBio(bio);
    setProfile({ ...profile, bio });
  }

  function setUserInterests(interests: string[]) {
    setProfile({ ...profile, interests });
  }

  const handleSave = async () => {
    if (profile.bio && profile.bio?.length > LIMIT) {
      swal(`A tua bio não pode ter mais de ${LIMIT} caracteres!`);
      return;
    }

    // check if linkedin follows the format https://www.linkedin.com/in/example/
    if (
      linkedinRef.current?.value &&
      !linkedinRef.current?.value?.match(
        /^(https:\/\/www\.linkedin\.com\/in\/)([A-zÀ-ú0-9ç_-]+\/?)+$/
      )
    ) {
      swal("O teu Linkedin não segue o formato correto!");
      return;
    }

    // check if github follows the format https://github/example
    if (
      githubRef.current?.value &&
      !githubRef.current?.value?.match(
        /^(https:\/\/github\.com\/)([A-zÀ-ú0-9ç_-]+\/?)+$/
      )
    ) {
      swal("O teu Github não segue o formato correto!");
      return;
    }

    setIsLoading(true);

    setProfile({
      ...profile,
      linkedin: linkedinRef.current?.value || null,
      github: githubRef.current?.value || null,
    });

    if (cvRef.current?.files?.length) {
      const uploadRes = await getSignedUrl("cv", "application/pdf");
      await uploadToBucket(uploadRes, cvRef.current?.files[0]);
      await setTarget(student.code, uploadRes);
    }

    const res = await fetch(`${BASE_URL}/students/${student.code}`, {
      method: "PATCH",
      body: JSON.stringify({
        bio: profile.bio ? profile.bio : undefined,
        github: githubRef.current?.value,
        linkedin: linkedinRef.current?.value,
        interests: profile.interests,
      }),
    });

    if (res.status === 200) {
      if (profile.avatar)
        await fetch(`${BASE_URL}/students/${student.code}/avatar`, {
          method: "POST",
          body: JSON.stringify({ uploadId: profile.avatar }),
        });

      setIsLoading(false);
      swal("Perfil atualizado com sucesso!");
      setActiveTab("Perfil");
      router.refresh();
    } else {
      setIsLoading(false);
      // swal("Ocorreu um erro ao atualizar o teu perfil...");
      swal("Perfil atualizado com sucesso!");
      setActiveTab("Perfil");
      router.refresh();
    }
  };

  const handleConfirmAvatar = async () => {
    setIsAvatarLoading(true);

    if (!imageSrc || !croppedAreaPixels) return;

    const image = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (!image) return setIsAvatarLoading(false);

    const signed = await getSignedUrl("avatar", image.type);
    if (!signed) {
      toast.error("Ocorreu um erro.");
      return setIsAvatarLoading(false);
    }

    if (image.size > signed.maxSize) {
      const maxMb = Math.round(signed.maxSize / Math.pow(1024, 2));
      toast.error(`A imagem excede o tamanho máximo de ${maxMb} MB.`);
      return setIsAvatarLoading(false);
    }

    const upload = await uploadToBucket(signed, image);
    if (upload.status !== 200) {
      toast.error("Não foi possível dar upload à imagem.");
      return setIsAvatarLoading(false);
    }

    setIsAvatarLoading(false);
    setIsModalVisible(false);

    const croppedUrl = URL.createObjectURL(image);
    setUserImage(croppedUrl);

    setProfile({ ...profile, avatar: signed.id });
  };

  return (
    <section className="flex w-full flex-col rounded-t-3xl bg-white py-4 md:rounded-md">
      <div className="mx-4 flex flex-col items-center md:mx-12 md:flex-row">
        <div className="my-8 flex-1 justify-center p-3">
          <UserImage
            imageSrc={userImage}
            editable={true}
            setProfile={setProfile}
            onChange={(imgSrc) => {
              setImageSrc(imgSrc);
              setIsModalVisible(true);
            }}
          />
        </div>

        <div className="flex w-full flex-col gap-y-4 md:ml-12">
          {student ? (
            <>
              <Input name="Nome" defaultValue={student.name} disabled={true} />
              <Input name="Ano" defaultValue={student.year} disabled={true} />
              <Input
                name="Email"
                defaultValue={student.user.email}
                disabled={true}
              />
            </>
          ) : (
            <Skeleton height={40} />
          )}
        </div>
      </div>

      <div className="mx-4 mb-12 mt-4 flex flex-col gap-y-4 md:mx-12">
        <Input
          name="Linkedin"
          defaultValue={profile.linkedin}
          placeholder="https://www.linkedin.com/in/example/"
          inputRef={linkedinRef}
        />
        <Input
          name="Github"
          defaultValue={profile.github}
          placeholder="https://github.com/example"
          inputRef={githubRef}
        />

        <ImportCvSection
          inputRef={cvRef}
          text={student.cv ? "Alterar CV" : "Importar CV"}
        />

        <UserBioTextArea
          name="Bio"
          defaultValue={profile.bio}
          rows={5}
          placeholder="Escreve algo sobre ti..."
          setValue={handleUserBioChange}
          value={profile.bio ? profile.bio : ""}
          limit={LIMIT}
          warningLimit={LIMIT - 30}
        />

        <label className="text-lg text-slate-700">Interesses</label>

        <InterestSelector
          userInterests={profile.interests}
          setUserInterests={setUserInterests}
        />

        <PrimaryButton
          onClick={handleSave}
          loading={isLoading}
          className="mt-4 py-2 text-lg"
        >
          Guardar
        </PrimaryButton>
      </div>

      <Modal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        className="flex flex-col items-center justify-center gap-8"
      >
        <h1 className="text-3xl font-bold">Altera o teu Avatar</h1>
        <AvatarCropper {...{ imageSrc, setImageSrc, setCroppedAreaPixels }} />
        <PrimaryButton
          className="w-full py-2 text-xl"
          onClick={handleConfirmAvatar}
          loading={isAvatarLoading}
        >
          Confirmar
        </PrimaryButton>
      </Modal>
    </section>
  );
};

export default SettingsSection;
