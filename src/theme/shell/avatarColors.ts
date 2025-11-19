type AvatarColor = {
  bg: string;
  text: string;
};

const AVATAR_COLORS: AvatarColor[] = [
  { bg: "bg-[#2545B5]", text: "text-white" },
  { bg: "bg-[#8EAAFF]", text: "text-[#1E3A8A]" },
  { bg: "bg-orange-500", text: "text-white" },
  { bg: "bg-green-500", text: "text-white" },
  { bg: "bg-yellow-500", text: "text-[#713F12]" },
];

export const getAvatarColor = (seed: string) => {
  if (!seed) return AVATAR_COLORS[0];
  const normalized = seed.trim().toLowerCase();
  const charCode = normalized
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = charCode % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

