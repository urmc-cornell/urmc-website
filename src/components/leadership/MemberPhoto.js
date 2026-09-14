import { useState } from 'react';
import placeholder from '../../images/assets/member-placeholder.svg';

export default function MemberPhoto({ src, fallbackSrc, alt, className }) {
  const [failed, setFailed] = useState([]);
  const photo = [src, fallbackSrc].find((url) => url && !failed.includes(url));
  return (
    <img
      src={photo || placeholder}
      alt={photo ? alt : `Photo unavailable for ${alt}`}
      className={className}
      onError={photo ? () => setFailed((urls) => [...urls, photo]) : undefined}
    />
  );
}
