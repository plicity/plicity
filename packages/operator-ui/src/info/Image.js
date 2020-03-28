import React from 'react';

import openshift from './openshift.svg';
import plicity from './plicity.svg';
import gitlab from './gitlab.svg';

const IMAGES = {
  openshift,
  plicity,
  gitlab
};

export default function Image({type, className}) {
  const image = IMAGES[type];

  if (!image) {
    return null;
  }

  return (
    <img src={IMAGES[type]} className={className} width="64" alt="" />
  )
}