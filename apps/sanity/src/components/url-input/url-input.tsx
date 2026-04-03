import { Card, TextInput, Flex, Box, Text, Label, Switch } from '@sanity/ui';
import { set, unset, ObjectInputProps } from 'sanity';

type TProps = ObjectInputProps<{
  url?: string;
  isExternal?: boolean;
}>;

const defaultValue = {
  url: '',
  isExternal: false,
};

const UrlInput = (props: TProps) => {
  const { value = defaultValue, onChange } = props;

  const handleTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const currentValue = event.target.value;
    onChange(currentValue ? set({ ...value, url: currentValue }) : unset());
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(set({ ...value, isExternal: event.target.checked }));
  };

  return (
    <div>
      <Card paddingTop={3} paddingBottom={3}>
        <Card paddingBottom={3}>
          <Label>URL</Label>
        </Card>
        <TextInput
          value={value.url ?? ''}
          onChange={handleTextInputChange}
          placeholder="/subscribe-now"
        />
      </Card>

      <Card>
        <Flex align="center">
          <Switch
            id="checkbox"
            style={{ display: 'block' }}
            checked={value.isExternal ?? false}
            onChange={handleCheckboxChange}
          />
          <Box flex={1} paddingLeft={3}>
            <Text>
              <label htmlFor="checkbox" style={{ fontSize: '13px' }}>
                Open link in a new browser tab.
              </label>
            </Text>
          </Box>
        </Flex>
      </Card>
    </div>
  );
};

export default UrlInput;
