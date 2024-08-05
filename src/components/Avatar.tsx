import Image from 'next/image';

interface AvatarProps {
  avatarURL: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatarURL }) => {
  return (
    <div className="h-16 w-16 rounded-full border-2 border-blue-900">
      <Image
        src={avatarURL}
        alt=""
        width={16}
        height={16}
      />
    </div>
  );
};

export default Avatar;
