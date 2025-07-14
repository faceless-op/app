import React, { createContext, useContext, useState } from 'react';

type AvatarContextType = {
  avatarUri: string | null;
  setAvatarUri: (uri: string | null) => void;
};

const AvatarContext = createContext<AvatarContextType>({
  avatarUri: null,
  setAvatarUri: () => {},
});

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  return (
    <AvatarContext.Provider value={{ avatarUri, setAvatarUri }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);
