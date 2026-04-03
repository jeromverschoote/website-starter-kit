import React from 'react';

import { IconName, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { fas } from '@fortawesome/pro-solid-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { fat } from '@fortawesome/pro-thin-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';
import { fasr } from '@fortawesome/sharp-regular-svg-icons';
import { fasl } from '@fortawesome/sharp-light-svg-icons';
import { fast } from '@fortawesome/sharp-thin-svg-icons';
import { fadr } from '@fortawesome/duotone-regular-svg-icons';
import { fadl } from '@fortawesome/duotone-light-svg-icons';
import { fadt } from '@fortawesome/duotone-thin-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

type TProps = {
  accessor: IconName;
  type?:
    | 'solid'
    | 'regular'
    | 'light'
    | 'thin'
    | 'sharp-solid'
    | 'sharp-regular'
    | 'sharp-light'
    | 'sharp-thin'
    | 'duotone-solid'
    | 'duotone-regular'
    | 'duotone-light'
    | 'duotone-thin'
    // | 'duotone-sharp-solid'
    // | 'duotone-sharp-regular'
    // | 'duotone-sharp-light'
    // | 'duotone-sharp-thin'
    | 'brands';
};

const Icon = (props: TProps) => {
  const { accessor, type = 'regular' } = props;

  let component = <div></div>;

  switch (type) {
    case 'solid':
      !(library as any)?.definitions.fas && library.add(fas);
      component = <FontAwesomeIcon icon={['fas', accessor]} />;
      break;

    case 'regular':
      !(library as any)?.definitions.far && library.add(far);
      component = <FontAwesomeIcon icon={['far', accessor]} />;
      break;

    case 'light':
      !(library as any)?.definitions.fal && library.add(fal);
      component = <FontAwesomeIcon icon={['fal', accessor]} />;
      break;

    case 'thin':
      !(library as any)?.definitions.fat && library.add(fat);
      component = <FontAwesomeIcon icon={['fat', accessor]} />;
      break;

    case 'sharp-solid':
      !(library as any)?.definitions.fass && library.add(fass);
      component = <FontAwesomeIcon icon={['fass', accessor]} />;
      break;

    case 'sharp-regular':
      !(library as any)?.definitions.fasr && library.add(fasr);
      component = <FontAwesomeIcon icon={['fasr', accessor]} />;
      break;

    case 'sharp-light':
      !(library as any)?.definitions.fasl && library.add(fasl);
      component = <FontAwesomeIcon icon={['fasl', accessor]} />;
      break;

    case 'sharp-thin':
      !(library as any)?.definitions.fast && library.add(fast);
      component = <FontAwesomeIcon icon={['fast', accessor]} />;
      break;

    // case 'duotone-solid':
    //   !(library as any)?.definitions.fads && library.add(fads)
    //   component = <FontAwesomeIcon icon={['fads', accessor]} />
    //   break

    case 'duotone-regular':
      !(library as any)?.definitions.fadr && library.add(fadr);
      component = <FontAwesomeIcon icon={['fadr', accessor]} />;
      break;

    case 'duotone-light':
      !(library as any)?.definitions.fadl && library.add(fadl);
      component = <FontAwesomeIcon icon={['fadl', accessor]} />;
      break;

    case 'duotone-thin':
      !(library as any)?.definitions.fadt && library.add(fadt);
      component = <FontAwesomeIcon icon={['fadt', accessor]} />;
      break;

    case 'brands':
      !(library as any)?.definitions.fab && library.add(fab);
      component = <FontAwesomeIcon icon={['fab', accessor]} />;
      break;
  }

  return <div style={{ width: '18px' }}>{component}</div>;
};

export default Icon;
