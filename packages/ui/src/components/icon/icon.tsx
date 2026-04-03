import { FC, JSX } from 'react';

import { IconName, library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
// import { fal } from '@fortawesome/pro-light-svg-icons';
// import { far } from "@fortawesome/pro-regular-svg-icons";
// import { fas } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fasl } from '@fortawesome/sharp-light-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';

import { toClassName } from '../../helpers/format';

type TProps = {
  accessor: string;
  type?:
    | 'brands'
    | 'light'
    | 'regular'
    | 'solid'
    | 'sharp-light'
    | 'sharp'
    | string;
  className?: string;
  size?: string;
};

const Icon: FC<TProps> = (props: TProps): JSX.Element => {
  const {
    accessor = 'coffee',
    type = 'sharp-light',
    className = 'text-lg',
    size = '16px',
  } = props;

  let component = <div></div>;

  switch (type) {
    // case "solid":
    //   if (!(library as unknown as { definitions: Record<string, unknown> })?.definitions.fas) {
    //     library.add(fas);
    //   }
    //   component = (
    //     <FontAwesomeIcon icon={["fas", accessor as IconName]} className={className} />
    //   );
    //   break;
    // case "regular":
    //   if (!(library as unknown as { definitions: Record<string, unknown> })?.definitions.far) {
    //     library.add(far);
    //   }
    //   component = (
    //     <FontAwesomeIcon icon={["far", accessor as IconName]} className={className} />
    //   );
    //   break;
    // case 'light':
    //   if (!(library as unknown as { definitions: Record<string, unknown> })?.definitions.fal) {
    //     library.add(fal);
    //   }

    //   component = (
    //     <FontAwesomeIcon icon={['fal', accessor]} className={className} />
    //   );
    //   break;
    case 'brands':
      if (
        !(library as unknown as { definitions: Record<string, unknown> })
          ?.definitions.fab
      ) {
        library.add(fab);
      }
      component = (
        <FontAwesomeIcon
          icon={['fab', accessor as IconName]}
          className={className}
        />
      );
      break;
    case 'sharp-light':
      if (
        !(library as unknown as { definitions: Record<string, unknown> })
          ?.definitions.fasl
      ) {
        library.add(fasl);
      }

      component = (
        <FontAwesomeIcon
          icon={['fasl', accessor as IconName]}
          className={className}
        />
      );
      break;
    case 'sharp':
      if (
        !(library as unknown as { definitions: Record<string, unknown> })
          ?.definitions.fass
      ) {
        library.add(fass);
      }

      component = (
        <FontAwesomeIcon
          icon={['fass', accessor as IconName]}
          className={className}
        />
      );
      break;
  }

  return (
    <div
      aria-hidden="true"
      className={toClassName(
        'w-[14px] sm:w-[16px] flex items-center justify-center',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {component}
    </div>
  );
};

export default Icon;
