import React from "react";
import * as Icons from "../../lib/Icons";

interface Props {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

const NavIcon: React.FC<Props> = ({ name, size, color, className }) => {
  const Component = Icons[name as keyof typeof Icons];
  return Component ? (
    <Component size={size || 30} color={color} className={className} />
  ) : null;
};

export default NavIcon;
