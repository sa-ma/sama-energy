'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { SxProps, Theme } from '@mui/material/styles';

type FilterRailProps = Readonly<{
  children: React.ReactNode;
  variant?: 'default' | 'flat';
  sx?: SxProps<Theme>;
}>;

type FilterSelectFieldProps = Readonly<{
  children: React.ReactNode;
  onChange: (value: string | number) => void;
  startAdornment?: React.ReactNode;
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
  onClick: React.MouseEventHandler<HTMLElement>;
  sx?: SxProps<Theme>;
}>;

export function FilterRail({
  children,
  variant = 'default',
  sx,
}: FilterRailProps) {
  const baseSx = (theme: Theme) =>
    variant === 'flat'
      ? {
          borderRadius: 0,
          border: 'none',
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }
      : {
          borderRadius: `${theme.sama.radius.lg}px`,
          border: `1px solid ${theme.sama.border.strong}`,
          backgroundColor: theme.sama.surface.subtle,
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.75)',
        };
  const composedSx = sx
    ? [baseSx, ...(Array.isArray(sx) ? [...sx] : [sx])]
    : baseSx;

  return (
    <Card
      sx={composedSx}
    >
      <CardContent
        sx={
          variant === 'flat'
            ? {
                p: 0,
                '&:last-child': { pb: 0 },
              }
            : {
                p: { xs: 1.25, sm: 1.5 },
                '&:last-child': { pb: { xs: 1.25, sm: 1.5 } },
              }
        }
      >
        {children}
      </CardContent>
    </Card>
  );
}

export function FilterSelectField({
  children,
  onChange,
  startAdornment,
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
          '& .MuiInputAdornment-root': {
            color: 'text.secondary',
            ml: 0.25,
            mr: 0.5,
          },
          '& .MuiSelect-icon': {
            color: 'text.secondary',
            fontSize: '1.1rem',
            right: 10,
          },
        }}
        startAdornment={
          startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : undefined
        }
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
    display: 'flex',
    alignItems: 'center',
    minHeight: 42,
    justifyContent: 'space-between',
    px: 1,
    py: 0.5,
    borderRadius: `${theme.sama.radius.md}px`,
    color: theme.sama.text.primary,
    border: `1px solid ${theme.sama.border.strong}`,
    backgroundColor: theme.sama.surface.raised,
    boxShadow: theme.sama.elevation.subtle,
    fontSize: '0.86rem',
    fontWeight: 600,
    lineHeight: 1.2,
    cursor: 'pointer',
    '& .filter-trigger-icon': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
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
    <ButtonBase
      component="div"
      disableRipple
      onClick={onClick}
      sx={composedSx}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>{children}</Box>
      {endIcon ? <Box className="filter-trigger-icon">{endIcon}</Box> : null}
    </ButtonBase>
  );
}
