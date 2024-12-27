import React from "react";

interface AppHeaderProps {
  title: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  return <header className="title">{title}</header>;
};

export default AppHeader;
