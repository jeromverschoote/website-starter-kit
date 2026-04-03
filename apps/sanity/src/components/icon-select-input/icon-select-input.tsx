// import { SearchIcon } from '@sanity/icons';
// import { Card, Autocomplete, Select, Label, Flex, Box, Text } from '@sanity/ui';
// import { useEffect, useMemo, useState } from 'react';
// import Icon from '../icon';
// import { set, unset, ObjectInputProps } from 'sanity';

// const FONTAWESOME_METADATA_URL =
//   'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/refs/heads/master/metadata/icons.json';

// type TProps = ObjectInputProps<{
//   type?: string;
//   accessor?: string;
// }>;

// const defaultValue = {
//   type: 'regular',
//   accessor: undefined,
// };

// const IconSelectInput = (props: TProps) => {
//   const { value = defaultValue, onChange } = props;

//   const [data, setData] = useState<any>([]);
//   const [isFetching, setIsFetching] = useState(false);

//   const types: {
//     [key: string]: { title: string; items: { label: string; value: string }[] };
//   } = useMemo(
//     () => ({
//       base: {
//         title: 'Default',
//         items: [
//           { label: 'Solid', value: 'solid' },
//           { label: 'Regular', value: 'regular' },
//           { label: 'Light', value: 'light' },
//           { label: 'Thin', value: 'thin' },
//         ],
//       },
//       sharp: {
//         title: 'Sharp',
//         items: [
//           { label: 'Solid', value: 'sharp-solid' },
//           { label: 'Regular', value: 'sharp-regular' },
//           { label: 'Light', value: 'sharp-light' },
//           { label: 'Thin', value: 'sharp-thin' },
//         ],
//       },
//       duotone: {
//         title: 'Duotone',
//         items: [
//           // {label: 'Solid', value: 'duotone-solid'},
//           { label: 'Regular', value: 'duotone-regular' },
//           { label: 'Light', value: 'duotone-light' },
//           { label: 'Thin', value: 'duotone-thin' },
//         ],
//       },
//       // 'duotone-sharp': {
//       //   title: 'Sharp Duotone',
//       //   items: [
//       //     {label: 'Solid', value: 'duotone-sharp-solid'},
//       //     {label: 'Regular', value: 'duotone-sharp-regular'},
//       //     {label: 'Light', value: 'duotone-sharp-light'},
//       //     {label: 'Thin', value: 'duotone-sharp-thin'},
//       //   ],
//       // },
//       brands: {
//         title: 'Brands',
//         items: [{ label: 'Brands', value: 'brands' }],
//       },
//     }),
//     [],
//   );

//   const handleFetchData = async () => {
//     setIsFetching(true);

//     const response = await fetch(FONTAWESOME_METADATA_URL);
//     const results = await response.json();

//     setData(
//       Object.keys(results).map((key) => {
//         const icon = results[key];

//         return { key, styles: icon.styles };
//       }),
//     );
//     setIsFetching(false);
//   };

//   const handleFilterOptions = (type: string | undefined) => {
//     let results = [];

//     if (type === 'brands') {
//       results = data.filter((item: any) => item.styles.includes('brands'));
//     } else {
//       results = data.filter((item: any) => item.styles.includes('solid'));
//     }

//     return results.map((result: any) => ({ value: result.key }));
//   };

//   const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const currentValue = event.target.value;
//     onChange(
//       currentValue
//         ? set({ ...value, type: currentValue, accessor: undefined })
//         : unset(),
//     );
//   };

//   const handleAutocompleteChange = (currentValue: string) => {
//     onChange(
//       currentValue ? set({ ...value, accessor: currentValue }) : unset(),
//     );
//   };

//   // Load initial data.
//   useEffect(() => {
//     handleFetchData();
//   }, []);

//   return (
//     <div>
//       <Card paddingTop={3} paddingBottom={4}>
//         <Card paddingBottom={3}>
//           <Label>Style</Label>
//         </Card>
//         <Select value={value.type || ''} onChange={handleSelectChange}>
//           {Object.keys(types).map((key) => {
//             const group = types[key];

//             return (
//               <optgroup key={group.title} label={group.title}>
//                 {group.items.map((item) => (
//                   <option key={item.value} value={item.value}>
//                     {item.label}
//                   </option>
//                 ))}
//               </optgroup>
//             );
//           })}
//         </Select>
//       </Card>
//       <Card>
//         <Card paddingBottom={3}>
//           <Label>Accessor</Label>
//         </Card>
//         <Autocomplete
//           id="icon-select-input"
//           icon={SearchIcon}
//           placeholder="Search icons"
//           options={handleFilterOptions(value.type)}
//           value={value.accessor || ''}
//           onChange={handleAutocompleteChange}
//           openButton
//           loading={isFetching}
//           renderValue={(_, option: any) => option?.value ?? ''}
//           renderOption={(option) => (
//             <Card as="button">
//               <Flex align="center">
//                 <Box padding={1} width={20}>
//                   <Icon type={value.type as any} accessor={option.value} />
//                 </Box>
//                 <Box flex={1} padding={2} paddingLeft={1}>
//                   <Text>{option.value}</Text>
//                 </Box>
//               </Flex>
//             </Card>
//           )}
//         />
//       </Card>
//     </div>
//   );
// };

// export default IconSelectInput;

import { SearchIcon } from '@sanity/icons';
import { Card, Autocomplete, Select, Label, Flex, Box, Text } from '@sanity/ui';
import { useEffect, useMemo, useState } from 'react';
import Icon from '../icon';
import { set, unset, ObjectInputProps } from 'sanity';

const FONTAWESOME_METADATA_URL =
  'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/refs/heads/master/metadata/icons.json';

type TProps = ObjectInputProps<{
  type?: string;
  accessor?: string;
}>;

const defaultValue = {
  type: 'regular',
  accessor: undefined,
};

const IconSelectInput = (props: TProps) => {
  const { value = defaultValue, onChange } = props;

  const [data, setData] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [inputValue, setInputValue] = useState(value.accessor ?? '');

  // ✅ preserve typed value if props.value changes
  useEffect(() => {
    setInputValue(value.accessor ?? '');
  }, [value.accessor]);

  // ✅ group/type definitions
  const types: {
    [key: string]: { title: string; items: { label: string; value: string }[] };
  } = useMemo(
    () => ({
      base: {
        title: 'Default',
        items: [
          { label: 'Solid', value: 'solid' },
          { label: 'Regular', value: 'regular' },
          { label: 'Light', value: 'light' },
          { label: 'Thin', value: 'thin' },
        ],
      },
      sharp: {
        title: 'Sharp',
        items: [
          { label: 'Solid', value: 'sharp-solid' },
          { label: 'Regular', value: 'sharp-regular' },
          { label: 'Light', value: 'sharp-light' },
          { label: 'Thin', value: 'sharp-thin' },
        ],
      },
      duotone: {
        title: 'Duotone',
        items: [
          { label: 'Regular', value: 'duotone-regular' },
          { label: 'Light', value: 'duotone-light' },
          { label: 'Thin', value: 'duotone-thin' },
        ],
      },
      brands: {
        title: 'Brands',
        items: [{ label: 'Brands', value: 'brands' }],
      },
    }),
    [],
  );

  const handleFetchData = async () => {
    setIsFetching(true);
    const response = await fetch(FONTAWESOME_METADATA_URL);
    const results = await response.json();

    setData(
      Object.keys(results).map((key) => {
        const icon = results[key];
        return { key, styles: icon.styles };
      }),
    );
    setIsFetching(false);
  };

  const handleFilterOptions = (type: string | undefined) => {
    // Only show icons for selected type.

    let results: any[] = [];
    if (type === 'brands') {
      results = data.filter((item: any) => item.styles.includes('brands'));
    } else {
      results = data.filter((item: any) => item.styles.includes('solid'));
    }
    return results.map((result: any) => ({ value: result.key }));
  };

  const handleAutocompleteCommit = (currentValue: string) => {
    onChange(
      currentValue ? set({ ...value, accessor: currentValue }) : unset(),
    );
    setInputValue(currentValue);
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <div>
      {/* ---- Style Selector ---- */}
      <Card paddingTop={3} paddingBottom={4}>
        <Card paddingBottom={3}>
          <Label>Style</Label>
        </Card>
        <Select
          value={value.type || ''}
          onChange={(event: any) => {
            const currentValue = event.target.value;
            onChange(
              currentValue
                ? set({ ...value, type: currentValue, accessor: undefined })
                : unset(),
            );
          }}
        >
          {Object.keys(types).map((key) => {
            const group = types[key];
            return (
              <optgroup key={group.title} label={group.title}>
                {group.items.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </Select>
      </Card>

      {/* ---- Icon Selector ---- */}
      <Card>
        <Card paddingBottom={3}>
          <Label>Accessor</Label>
        </Card>
        <Autocomplete
          id="icon-select-input"
          icon={SearchIcon}
          placeholder="Search icons"
          options={handleFilterOptions(value.type)} // ✅ full list, let Autocomplete filter
          value={value.accessor ?? ''}
          onChange={(currentValue) => {
            // Handles both option selection and free input
            handleAutocompleteCommit(currentValue);
          }}
          onInput={(event) => {
            setInputValue((event.target as HTMLInputElement).value); // ✅ track typing
          }}
          onBlur={() => handleAutocompleteCommit(inputValue)} // ✅ commit on blur
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAutocompleteCommit(inputValue); // ✅ commit on Enter
            }
          }}
          openButton
          loading={isFetching}
          renderValue={(_, option: any) => option?.value ?? inputValue ?? ''} // ✅ show free text
          renderOption={(option) => (
            <Card as="button">
              <Flex align="center">
                <Box padding={1} width={20}>
                  <Icon type={value.type as any} accessor={option.value} />
                </Box>
                <Box flex={1} padding={2} paddingLeft={1}>
                  <Text>{option.value}</Text>
                </Box>
              </Flex>
            </Card>
          )}
        />
      </Card>
    </div>
  );
};

export default IconSelectInput;
