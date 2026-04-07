'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { SxProps, Theme } from '@mui/material/styles';

type FilterRailProps = Readonly<{
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}>;

type FilterSelectFieldProps = Readonly<{
  children: React.ReactNode;
  onChange: (value: string | number) => void;
  value: string | number;
  sx?: SxProps<Theme>;
}>;

type FilterOption = {
  value: string | number;
  label: React.ReactNode;
};

type FilterSegmentedControlProps = Readonly<{
  onChange: (value: string | number) => void;
  options: readonly FilterOption[];
  value: string | number;
  sx?: SxProps<Theme>;
}>;

type FilterMultiSelectTriggerProps = Readonly<{
  children: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  sx?: SxProps<Theme>;
}>;

export function FilterRail({ children, sx }: FilterRailProps) {
  const baseSx = (theme: Theme) => ({
    borderRadius: `${theme.sama.radius.lg}px`,
    border: `1px solid ${theme.sama.border.strong}`,
    backgroundColor: theme.sama.surface.subtle,
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.75)',
  });
  const composedSx = sx
    ? [baseSx, ...(Array.isArray(sx) ? [...sx] : [sx])]
    : baseSx;

  return (
    <Card
      sx={composedSx}
    >
      <CardContent
        sx={{
          p: { xs: 1.25, sm: 1.5 },
          '&:last-child': { pb: { xs: 1.25, sm: 1.5 } },
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}

export function FilterSelectField({
  children,
  onChange,
  value,
  sx,
}: FilterSelectFieldProps) {
  return (
    <FormControl size="small" sx={sx}>
      <Select
        displayEmpty
        value={value}
        onChange={(event) => onChange(event.target.value as string | number)}
        sx={{
          '& .MuiSelect-icon': {
            color: 'text.secondary',
            fontSize: '1.1rem',
            right: 10,
          },
        }}
      >
        {children}
      </Select>
    </FormControl>
  );
}

export function FilterSegmentedControl({
  onChange,
  options,
  value,
  sx,
}: FilterSegmentedControlProps) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={(_, nextValue) => {
        if (nextValue !== null) {
          onChange(nextValue);
        }
      }}
      sx={sx}
    >
      {options.map((option) => (
        <ToggleButton key={String(option.value)} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export function FilterMultiSelectTrigger({
  children,
  endIcon,
  onClick,
  sx,
}: FilterMultiSelectTriggerProps) {
  const baseSx = (theme: Theme) => ({
    minHeight: 42,
    justifyContent: 'space-between',
    px: 1,
    py: 0.5,
    color: theme.sama.text.primary,
    border: `1px solid ${theme.sama.border.strong}`,
    backgroundColor: theme.sama.surface.raised,
    boxShadow: theme.sama.elevation.subtle,
    fontSize: '0.86rem',
    fontWeight: 600,
    lineHeight: 1.2,
    '& .MuiButton-endIcon': {
      ml: 0.75,
      color: theme.sama.text.muted,
      '& svg': {
        fontSize: '1.1rem',
      },
    },
  });
  const composedSx = sx
    ? [baseSx, ...(Array.isArray(sx) ? [...sx] : [sx])]
    : baseSx;

  return (
    <Button
      color="inherit"
      endIcon={endIcon}
      onClick={onClick}
      sx={composedSx}
    >
      {children}
    </Button>
  );
}
